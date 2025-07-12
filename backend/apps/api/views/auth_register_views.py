from django.db import transaction
from django.utils.translation import gettext as _
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework_simplejwt.tokens import RefreshToken

from apps.api.serializers.auth_register_serializers import RegisterSerializer
from apps.api.throttles.auth_register_throttle import RegisterRateThrottle
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
