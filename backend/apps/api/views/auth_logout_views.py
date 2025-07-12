import logging

from django.db import transaction
from django.utils.translation import gettext as _
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.exceptions import Throttled
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken

from apps.api.serializers.auth_logout_serializers import (
    LogoutSerializer,
    LogoutErrorResponseSerializer,
    LogoutSuccessResponseSerializer
)
from apps.api.throttles.auth_logout_throttle import FailedLogoutAttemptThrottle

logger = logging.getLogger(__name__)


class LogoutAPIView(APIView):
    """
    API View to handle user logout by blacklisting refresh tokens.

    Users provide their refresh token to blacklist it, effectively logging out.
    """

    permission_classes = [IsAuthenticated]
    throttle_classes = [FailedLogoutAttemptThrottle]

    @extend_schema(
        request=LogoutSerializer,
        responses={
            200: LogoutSuccessResponseSerializer,
            400: LogoutErrorResponseSerializer,
            401: LogoutErrorResponseSerializer,
            500: LogoutErrorResponseSerializer,
        },
        description="Log out by blacklisting the provided refresh token.",
        tags=["Authentication"]
    )
    @transaction.atomic
    def post(self, request):
        """
        Blacklist the provided refresh token and log out the user.
        """

        # Initialize throttle instance
        throttle = self.get_throttles()[0]

        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        refresh_token = serializer.validated_data.get('refresh')

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            ip = request.META.get('REMOTE_ADDR', '')
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            logger.info(
                f"User {request.user.id} ({request.user}) logged out. "
                f"IP: {ip}, User-Agent: {user_agent}, Token: {refresh_token[:10]}..."
            )
            return Response(
                LogoutSuccessResponseSerializer({'message': _('Logged out successfully.')}).data,
                status=status.HTTP_200_OK
            )

        except (InvalidToken, TokenError) as e:
            # Manually check throttle and raise if needed
            if throttle.allow_request(request, self):
                throttle.throttle_success()
            else:
                raise Throttled(detail=_("Too many failed logout attempts, please try again later."))

            user_info = (
                f"{request.user.id}: {request.user}" 
                if request.user and request.user.is_authenticated 
                else "Anonymous user"
            )
            logger.warning(f"User {user_info} failed logout attempt: {str(e)}")
            status_code = status.HTTP_401_UNAUTHORIZED if isinstance(e, InvalidToken) else status.HTTP_400_BAD_REQUEST
            return Response(
                LogoutErrorResponseSerializer({'detail': str(e)}).data,
                status=status_code
            )

        except Exception as e:
            logger.exception(f"Unexpected error during logout for user {request.user}: {e}")
            return Response(
                LogoutErrorResponseSerializer({'detail': _('Unexpected error occurred.')}).data,
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
