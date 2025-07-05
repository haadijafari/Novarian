from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils.translation import gettext_lazy as _

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
            raise serializers.ValidationError(_("Invalid credentials."))

        if not user.check_password(password):
            raise serializers.ValidationError(_("Invalid credentials."))

        if not user.is_active:
            raise serializers.ValidationError(_("This account is inactive due to some restrictions."))

        if '@' in identifier and not user.is_verified_email:
            raise serializers.ValidationError(_("Email is not verified yet."))
        elif '@' not in identifier and not user.is_verified_phone_number:
            raise serializers.ValidationError(_("Phone number is not verified yet."))

        data['user'] = user
        return data


class RegisterSerializer(serializers.ModelSerializer):
    identifier = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('identifier', 'password')

    def validate_identifier(self, value):
        if "@" in value:
            if User.objects.filter(email__iexact=value).exists():
                raise serializers.ValidationError("This email is already registered.")
        else:
            if User.objects.filter(phone_number=value).exists():
                raise serializers.ValidationError("This phone number is already registered.")
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
