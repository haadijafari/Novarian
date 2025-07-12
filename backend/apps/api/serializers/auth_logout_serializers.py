from django.utils.translation import gettext as _
from rest_framework import serializers


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField(required=True, help_text=_("Refresh token to blacklist"))


class LogoutSuccessResponseSerializer(serializers.Serializer):
    message = serializers.CharField(
        help_text=_("A success message indicating successful logout.")
    )


class LogoutErrorResponseSerializer(serializers.Serializer):
    detail = serializers.CharField(
        help_text=_("An error message indicating why the logout failed (e.g., invalid token).")
    )
