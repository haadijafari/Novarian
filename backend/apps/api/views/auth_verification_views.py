import logging

from django.contrib.auth import get_user_model
from django.core.cache import cache
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from apps.api.serializers.auth_verification_serializers import (
    VerificationSerializer,
    ResendVerificationCodeSerializer,
    VerificationSuccessSerializer,
    VerificationErrorSerializer,
)
from apps.utils.verification import send_email_verification_code, send_phone_verification_code

logger = logging.getLogger(__name__)
User = get_user_model()


class VerificationViewSet(ViewSet):
    permission_classes = [AllowAny]

    def _get_user_and_cache_key(self, identifier):
        if "@" in identifier:
            user = User.objects.filter(email__iexact=identifier).first()
            key = f'verify_email:{identifier.lower().strip()}'
        else:
            user = User.objects.filter(phone_number=identifier).first()
            key = f'verify_phone:{identifier.strip()}'
        return user, key

    def _send_verification_code(self, identifier):
        if "@" in identifier:
            send_email_verification_code(identifier.lower().strip())
        else:
            send_phone_verification_code(identifier.strip())

    @extend_schema(
        request=VerificationSerializer,
        responses={
            202: VerificationSuccessSerializer,
            400: VerificationErrorSerializer,
            404: VerificationErrorSerializer,
        },
        description="Verify user email or phone number using a code.",
        tags=["Authentication", "Verification"],
    )
    @action(detail=False, methods=["post"], url_path="verify")
    def verify_identifier(self, request):
        serializer = VerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        identifier = serializer.validated_data.get("identifier")
        code = serializer.validated_data.get("code")

        user, cache_key = self._get_user_and_cache_key(identifier)
        cached_code = cache.get(cache_key)

        if not user:
            return Response({'identifier': ['User not found.']}, status=status.HTTP_404_NOT_FOUND)

        if cached_code != code:
            logger.warning(f"Invalid code attempt for {identifier}")
            return Response({'code': ['Invalid or expired code.']}, status=status.HTTP_400_BAD_REQUEST)

        if "@" in identifier:
            user.is_verified_email = True
        else:
            user.is_verified_phone_number = True

        user.save()
        cache.delete(cache_key)

        return Response({'message': 'Identifier verified successfully.'}, status=status.HTTP_202_ACCEPTED)

    @extend_schema(
        request=ResendVerificationCodeSerializer,
        responses={
            200: VerificationSuccessSerializer,
            400: VerificationErrorSerializer,
            404: VerificationErrorSerializer,
            429: VerificationErrorSerializer,
        },
        description="Resend email/phone verification code to user.",
        tags=["Authentication", "Verification"],
    )
    @action(detail=False, methods=["post"], url_path="resend")
    def resend_code(self, request):
        serializer = ResendVerificationCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        identifier = serializer.validated_data.get("identifier")

        user, cache_key = self._get_user_and_cache_key(identifier)
        if not user:
            return Response({'identifier': ['User not found.']}, status=status.HTTP_404_NOT_FOUND)

        if "@" in identifier:
            if user.is_verified_email:
                return Response({'detail': ['Email is already verified.']}, status=status.HTTP_400_BAD_REQUEST)
            rate_limit_key = f'resend_wait_email:{identifier.lower().strip()}'
        else:
            if user.is_verified_phone_number:
                return Response({'detail': ['Phone number is already verified.']}, status=status.HTTP_400_BAD_REQUEST)
            rate_limit_key = f'resend_wait_phone:{identifier.strip()}'

        if cache.get(rate_limit_key):
            return Response({'detail': ['Please wait before requesting a new code.']},
                            status=status.HTTP_429_TOO_MANY_REQUESTS)

        self._send_verification_code(identifier)
        cache.set(rate_limit_key, True, timeout=2 * 60)

        return Response({'message': 'Verification code resent.'}, status=status.HTTP_200_OK)
