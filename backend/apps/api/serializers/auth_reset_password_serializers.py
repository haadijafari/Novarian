from django.utils.translation import gettext as _
from rest_framework import serializers


class PasswordResetRequestSerializer(serializers.Serializer):
    identifier = serializers.CharField(help_text=_("Email or phone number"))


class PasswordResetSerializer(serializers.Serializer):
    identifier = serializers.CharField(help_text=_("Email or phone number"))
    code = serializers.CharField(help_text=_("Verification code sent to email or phone"))
    new_password = serializers.CharField(
        help_text=_("New password (must be strong)"),
        write_only=True,
        style={'input_type': 'password'}
    )

    def validate_new_password(self, value):
        # Enforce Django password validators
        from django.contrib.auth.password_validation import validate_password
        validate_password(value)
        return value
