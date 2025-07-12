import logging

from django.db import transaction
from django.utils.translation import gettext as _
from drf_spectacular.utils import extend_schema
from rest_framework import status
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

logger = logging.getLogger(__name__)


class LogoutAPIView(APIView):
    """
    API View to handle user logout by blacklisting refresh tokens.

    Users provide their refresh token to blacklist it, effectively logging out.
    """

    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=LogoutSerializer,
        responses={
            200: LogoutSuccessResponseSerializer,
            400: LogoutErrorResponseSerializer,
            401: LogoutErrorResponseSerializer,
            500: LogoutErrorResponseSerializer,
        },
        description="Log out by blacklisting the provided refresh token.",
        tags=["Logout"]
    )
    @transaction.atomic
    def post(self, request):
        """
        Blacklist the provided refresh token and log out the user.
        """
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        refresh_token = serializer.validated_data.get('refresh')

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            ip = request.META.get('REMOTE_ADDR', '')
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            logger.info(
                f"IP: {ip} using User-Agent: {user_agent} logged out from {request.user.id} {request.user} using token: {refresh_token[:10]}...")
            return Response(
                LogoutSuccessResponseSerializer({'message': _('Logged out successfully.')}).data,
                status=status.HTTP_200_OK
            )

        except InvalidToken:
            logger.info(f"User {request.user} attempted logout with invalid token.")
            return Response(
                LogoutErrorResponseSerializer({'detail': _('Invalid token.')}).data,
                status=status.HTTP_401_UNAUTHORIZED
            )

        except TokenError:
            logger.error(f"User {request.user} attempted logout with token error.")
            return Response(
                LogoutErrorResponseSerializer({'detail': _('Token error.')}).data,
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            logger.exception(f"Unexpected error during logout for user {request.user}: {e}")
            return Response(
                LogoutErrorResponseSerializer({'detail': _('Unexpected error occurred.')}).data,
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
