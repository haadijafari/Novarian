from django.contrib.auth import get_user_model
from django.utils.translation import gettext as _
from rest_framework import serializers

User = get_user_model()


class LoginSerializer(serializers.ModelSerializer):
    identifier = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['identifier', 'password']

    def validate(self, data):
        identifier = data.get('identifier')
        password = data.get('password')

        query = {'email__iexact': identifier} if '@' in identifier else {'phone_number': identifier}
        user = User.objects.filter(**query).first()

        if not user:
            raise serializers.ValidationError({'detail': _("Invalid credentials.")})

        if not user.check_password(password):
            raise serializers.ValidationError({'detail': _("Invalid credentials.")})

        if not user.is_active:
            raise serializers.ValidationError({'detail': _("This account is inactive due to some restrictions.")})

        if '@' in identifier and not user.is_verified_email:
            raise serializers.ValidationError({'detail': _("Email is not verified yet.")})
        elif '@' not in identifier and not user.is_verified_phone_number:
            raise serializers.ValidationError({'detail': _("Phone number is not verified yet.")})

        data['user'] = user
        return data


class LoginSuccessResponseSerializer(serializers.Serializer):
    message = serializers.CharField(help_text=_("Login success message"))
    refresh = serializers.CharField(help_text=_("Refresh token"))
    access = serializers.CharField(help_text=_("Access token"))
    user_id = serializers.IntegerField(help_text=_("User ID"))
    email = serializers.EmailField(help_text=_("User email"))
    phone_number = serializers.CharField(help_text=_("User phone number"))


class LoginErrorResponseSerializer(serializers.Serializer):
    detail = serializers.CharField(help_text=_("Error detail"))


class AlreadyAuthenticatedResponseSerializer(serializers.Serializer):
    detail = serializers.CharField(help_text=_("Already logged in message"))
