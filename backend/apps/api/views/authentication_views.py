# Django imports
from django.core.cache import cache
from django.db import transaction
from django.utils.timezone import now
from django.utils.translation import gettext as _
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

# Local app imports
from apps.api.serializers.authentication_serializers import LoginSerializer, RegisterSerializer
from apps.api.throttles import LoginRateThrottle, RegisterRateThrottle
from apps.utils.google_auth import authenticate_with_google_token
from apps.utils.verification import send_email_verification_code, send_phone_verification_code


class RegisterViewSet(ViewSet):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    throttle_classes = [RegisterRateThrottle]

    @transaction.atomic
    def create(self, request):
        if request.user.is_authenticated:
            return Response(
                {'detail': _('You are already logged in.')},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Send Verification code
            if user.email:
                send_email_verification_code(user.email)
            if user.phone_number:
                send_phone_verification_code(user.phone_number)

            # JWT
            refresh = RefreshToken.for_user(user)

            return Response({
                'message': _('User registered successfully and verification codes have been sent.'),
                'user_id': user.id,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIViewSet(ViewSet):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle]

    @transaction.atomic
    def create(self, request):
        if request.user.is_authenticated:
            return Response(
                {'detail': _('You are already logged in.')},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']

            # update last_login manually
            user.last_login = now()
            user.save(update_fields=["last_login"])

            refresh = RefreshToken.for_user(user)

            # Clear throttle after successful login
            cache_key = getattr(request, '_login_throttle_cache_key', None)
            if cache_key:
                cache.delete(cache_key)

            return Response({
                'message': _('Logged in successfully.'),
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.id,
                'email': user.email,
                'phone_number': user.phone_number
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GoogleLoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("id_token")
        if not token:
            return Response({'detail': _('ID token is required.')}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate_with_google_token(token)
        if user is None:
            return Response({'detail': _('Invalid or expired Google token.')}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)

        return Response({
            'message': _('Logged in with Google successfully.'),
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': user.id,
            'email': user.email,
            'phone_number': user.phone_number,
        }, status=status.HTTP_200_OK)


class LogoutAPIViewSet(ViewSet):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def create(self, request):
        try:
            refresh_token = request.data.get("refresh", "").strip()
            if not refresh_token:
                return Response({'detail': _('Refresh token is required.')}, status=status.HTTP_400_BAD_REQUEST)
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': _('Logged out successfully.')}, status=status.HTTP_200_OK)
        except KeyError:
            return Response({'detail': _('Refresh token is required.')}, status=status.HTTP_400_BAD_REQUEST)
        except TokenError:
            return Response({'detail': _('Invalid or expired token.')}, status=status.HTTP_400_BAD_REQUEST)
