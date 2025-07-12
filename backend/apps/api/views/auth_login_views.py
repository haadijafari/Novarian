import logging

from django.db import transaction
from django.utils.timezone import now
from django.utils.translation import gettext as _
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet
from rest_framework_simplejwt.tokens import RefreshToken

from apps.api.serializers.auth_login_serializers import (
    LoginSerializer,
    LoginSuccessResponseSerializer,
    LoginErrorResponseSerializer,
    AlreadyAuthenticatedResponseSerializer,
)
from apps.api.throttles.auth_login_throttle import LoginRateThrottle

logger = logging.getLogger(__name__)


class LoginAPIViewSet(ViewSet):
    """
    ViewSet to handle user login and token generation.
    """

    serializer_class = LoginSerializer
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle]

    @extend_schema(
        request=LoginSerializer,
        responses={
            200: LoginSuccessResponseSerializer,
            400: LoginErrorResponseSerializer,
            403: AlreadyAuthenticatedResponseSerializer,
            429: LoginErrorResponseSerializer,
        },
        description="Authenticate user and return JWT tokens (access & refresh).",
        tags=["Authentication", "Login"],
    )
    @transaction.atomic
    def create(self, request):
        """
        Authenticate user credentials and return JWT tokens.
        """
        if request.user.is_authenticated:
            logger.info(f"User {request.user.id}: {request.user} attempted to login again while already authenticated.")
            return Response(
                AlreadyAuthenticatedResponseSerializer({'detail': _('You are already logged in.')}).data,
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.serializer_class(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data.get('user')

            # update last_login manually
            user.last_login = now()
            user.save(update_fields=["last_login"])

            refresh = RefreshToken.for_user(user)

            # Clear throttle after successful login
            for throttle in self.get_throttles():
                if hasattr(throttle, 'throttle_success'):
                    throttle.throttle_success()

            logger.info(f"User {user.id} ({user}) logged in successfully.")

            return Response(
                LoginSuccessResponseSerializer({
                    'message': _('Logged in successfully.'),
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user_id': user.id,
                    'email': user.email,
                    'phone_number': user.phone_number
                }).data,
                status=status.HTTP_200_OK
            )

        logger.warning(f"Failed login attempt with data: {request.data} | Errors: {serializer.errors}")
        return Response(
            LoginErrorResponseSerializer({'detail': _('Invalid credentials.')}).data,
            status=status.HTTP_400_BAD_REQUEST
        )
