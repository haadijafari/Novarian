import logging

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.utils.translation import gettext as _
from drf_spectacular.utils import extend_schema
from rest_framework import serializers
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

import apps.api.serializers.auth_reset_password_serializers as reset_serializers
from apps.utils.verification import send_email_verification_code, send_phone_verification_code

logger = logging.getLogger(__name__)
User = get_user_model()


class PasswordResetViewSet(ViewSet):
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
        request=reset_serializers.PasswordResetRequestSerializer,
        responses={200: serializers.DictField()},
        description="Request a password reset code via email or phone.",
        tags=["Password Reset"],
    )
    @action(detail=False, methods=["post"], url_path="request")
    def request_reset(self, request):
        serializer = reset_serializers.PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        identifier = serializer.validated_data.get('identifier')

        user, cache_key = self._get_user_and_cache_key(identifier)

        if not user:
            return Response({'identifier': [_('User not found.')]}, status=status.HTTP_404_NOT_FOUND)

        self._send_verification_code(identifier)

        return Response({'message': _('Reset code sent.')}, status=status.HTTP_200_OK)

    @extend_schema(
        request=reset_serializers.PasswordResetSerializer,
        responses={200: serializers.DictField()},
        description="Reset password using the code sent via email or SMS.",
        tags=["Password Reset"],
    )
    @action(detail=False, methods=["post"], url_path="reset")
    def reset_password(self, request):
        serializer = reset_serializers.PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        identifier = serializer.validated_data.get('identifier')
        code = serializer.validated_data.get('code')
        new_password = serializer.validated_data.get('new_password')

        user, cache_key = self._get_user_and_cache_key(identifier)
        cached_code = cache.get(cache_key)

        if not user:
            return Response({'identifier': [_('User not found.')]}, status=status.HTTP_404_NOT_FOUND)

        if cached_code != code:
            logger.warning(f"Invalid reset code attempt for {identifier}")
            return Response({'code': [_('Invalid or expired code.')]}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        cache.delete(cache_key)

        return Response({'message': _('Password reset successfully.')}, status=status.HTTP_200_OK)
