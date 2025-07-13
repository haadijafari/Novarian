from django.utils.translation import gettext as _
from rest_framework import serializers


class VerificationSerializer(serializers.Serializer):
    identifier = serializers.CharField(help_text=_("User email or phone number"))
    code = serializers.CharField(help_text=_("Verification code sent to user"))


class ResendVerificationCodeSerializer(serializers.Serializer):
    identifier = serializers.CharField(help_text=_("User email or phone number"))


class VerificationSuccessSerializer(serializers.Serializer):
    message = serializers.CharField(help_text=_("Success message"))


class VerificationErrorSerializer(serializers.Serializer):
    detail = serializers.CharField(help_text=_("Error message"), required=False)
    identifier = serializers.ListField(
        child=serializers.CharField(), required=False
    )
    code = serializers.ListField(
        child=serializers.CharField(), required=False
    )
