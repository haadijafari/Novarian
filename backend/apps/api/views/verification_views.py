# Django imports
from django.core.cache import cache
from django.contrib.auth import get_user_model

# Third-party imports
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response


User = get_user_model()

class VerifyEmailAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')

        if not email or not code:
            return Response({'detail': 'Email and code are required.'}, status=status.HTTP_400_BAD_REQUEST)

        cached_code = cache.get(f'verify_email:{email}')
        if cached_code != code:
            return Response({'detail': 'Invalid or expired code.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email).first()
        if user:
            user.is_verified_email = True
            user.save(update_fields=['is_verified_email'])
            cache.delete(f'verify_email:{email}')
            return Response({'message': 'Email verified successfully.'}, status=status.HTTP_202_ACCEPTED)
        return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)


class VerifyPhoneAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        phone = request.data.get('phone_number')
        code = request.data.get('code')

        if not phone or not code:
            return Response({'detail': 'Phone number and code are required.'}, status=status.HTTP_400_BAD_REQUEST)

        cached_code = cache.get(f'verify_phone:{phone}')
        if cached_code != code:
            return Response({'detail': 'Invalid or expired code.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(phone_number=phone).first()
        if user:
            user.is_verified_phone_number = True
            user.save(update_fields=['is_verified_phone_number'])
            cache.delete(f'verify_phone:{phone}')
            return Response({'message': 'Phone number verified successfully.'}, status=status.HTTP_202_ACCEPTED)
        return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
