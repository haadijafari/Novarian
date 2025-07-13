from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils.translation import gettext as _

from rest_framework import serializers

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    identifier = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('identifier', 'password')

    def validate_identifier(self, value):
        if "@" in value:
            if User.objects.filter(email__iexact=value).exists():
                raise serializers.ValidationError({'detail': _("This email is already registered.")})
        else:
            if User.objects.filter(phone_number=value).exists():
                raise serializers.ValidationError({'detail': _("This phone number is already registered.")})
        return value

    @transaction.atomic
    def create(self, validated_data):
        identifier = validated_data.get('identifier')
        password = validated_data.get('password')

        if "@" in identifier:
            user = User.objects.create(email=identifier)
        else:
            user = User.objects.create(phone_number=identifier)

        user.set_password(password)
        user.save()

        return user


class RegisterSuccessResponseSerializer(serializers.Serializer):
    message = serializers.CharField(help_text=_("Success message"))
    user_id = serializers.IntegerField(help_text=_("ID of the registered user"))
    email = serializers.EmailField(help_text=_("Email of the registered user"))
    phone_number = serializers.CharField(help_text=_("Phone number of the registered user"))
    refresh = serializers.CharField(help_text=_("JWT refresh token"))
    access = serializers.CharField(help_text=_("JWT access token"))


class RegisterErrorResponseSerializer(serializers.Serializer):
    identifier = serializers.ListField(
        child=serializers.CharField(help_text=_("Error(s) related to email or phone number")),
        required=False
    )
    password = serializers.ListField(
        child=serializers.CharField(help_text=_("Error(s) related to password")),
        required=False
    )
    detail = serializers.CharField(help_text=_("General error message"), required=False)
