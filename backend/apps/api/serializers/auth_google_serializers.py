from django.utils.translation import gettext as _
from rest_framework import serializers


class GoogleLoginRequestSerializer(serializers.Serializer):
    id_token = serializers.CharField(help_text=_("Google ID token"))


class GoogleLoginSuccessResponseSerializer(serializers.Serializer):
    message = serializers.CharField(help_text=_("Login success message"))
    refresh = serializers.CharField(help_text=_("Refresh token"))
    access = serializers.CharField(help_text=_("Access token"))
    user_id = serializers.IntegerField(help_text=_("User ID"))
    email = serializers.EmailField(help_text=_("User email"))
    phone_number = serializers.CharField(help_text=_("User phone number"))


class GoogleLoginErrorResponseSerializer(serializers.Serializer):
    detail = serializers.CharField(help_text=_("Error message"))
