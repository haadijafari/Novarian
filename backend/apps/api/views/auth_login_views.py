from django.core.cache import cache
from django.db import transaction
from django.utils.timezone import now
from django.utils.translation import gettext as _
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework_simplejwt.tokens import RefreshToken

from apps.api.serializers.auth_login_serializers import LoginSerializer
from apps.api.throttles.auth_login_throttle import LoginRateThrottle


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
