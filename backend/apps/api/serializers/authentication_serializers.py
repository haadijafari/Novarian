from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

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

        user = None
        if '@' in identifier:
            user = User.objects.filter(email=identifier).first()
        else:
            user = User.objects.filter(phone_number=identifier).first()

        if user is None or not user.check_password(password):
            raise serializers.ValidationError('Invalid credentials.')

        data['user'] = user
        return data

    def create(self, validated_data):
        user = validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        return {'token': token.key, 'user_id': user.id}


class RegisterSerializer(serializers.ModelSerializer):
    identifier = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('identifier', 'password')

    def validate_identifier(self, value):
        if "@" in value:
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("This email is already registered.")
        else:
            if User.objects.filter(phone_number=value).exists():
                raise serializers.ValidationError("This phone number is already registered.")
        return value

    def create(self, validated_data):
        identifier = validated_data.get('identifier')
        password = validated_data.get('password')

        if "@" in identifier:
            user = User.objects.create(email=identifier)
        else:
            user = User.objects.create(phone_number=identifier)

        user.set_password(password)
        user.save()

        # Token.objects.get_or_create(user=user)  # optional: create token on signup

        return user
