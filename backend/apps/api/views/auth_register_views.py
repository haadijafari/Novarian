import logging

from django.db import transaction
from django.utils.translation import gettext as _
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework_simplejwt.tokens import RefreshToken

from apps.api.serializers.auth_register_serializers import (
    RegisterSerializer,
    RegisterSuccessResponseSerializer,
    RegisterErrorResponseSerializer
)
from apps.api.throttles.auth_register_throttle import RegisterRateThrottle
from apps.utils.verification import send_email_verification_code, send_phone_verification_code

logger = logging.getLogger(__name__)


class RegisterViewSet(ViewSet):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    throttle_classes = [RegisterRateThrottle]

    @extend_schema(
        request=RegisterSerializer,
        responses={
            201: RegisterSuccessResponseSerializer,
            400: RegisterErrorResponseSerializer,
            403: RegisterErrorResponseSerializer,
            429: RegisterErrorResponseSerializer,
        },
        description="Register a new user and send verification codes to email/phone.",
        tags=["Authentication"]
    )
    @transaction.atomic
    def create(self, request):
        if request.user.is_authenticated:
            logger.info(f"User {request.user.id} attempted to register while already authenticated.")
            return Response(
                RegisterErrorResponseSerializer({'detail': _('You are already logged in.')}).data,
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Send Verification code
            if user.email:
                send_email_verification_code(user.email)
            if user.phone_number:
                send_phone_verification_code(user.phone_number)

            # JWT
            refresh = RefreshToken.for_user(user)

            logger.info(f"User {user.id} ({user}) registered successfully.")

            return Response(
                RegisterSuccessResponseSerializer({
                    'message': _('User registered successfully and verification codes have been sent.'),
                    'user_id': user.id,
                    'email': user.email,
                    'phone_number': user.phone_number,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }).data,
                status=status.HTTP_201_CREATED
            )

        logger.warning(f"Failed registration attempt: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
