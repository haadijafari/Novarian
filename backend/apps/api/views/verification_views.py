# Django imports
from django.core.cache import cache
from django.contrib.auth import get_user_model

# Third-party imports
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response

# Local app imports
from apps.utils.verification import send_email_verification_code, send_phone_verification_code


User = get_user_model()

class VerifyAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        identifier = request.data.get('identifier')
        code = request.data.get('code')

        if not identifier or not code:
            return Response(
                {'detail': 'Identifier (Email or Phone Number) and code are required.'}, 
                status=status.HTTP_400_BAD_REQUEST
                )
        
        if '@' in identifier:
            cached_code = cache.get(f'verify_email:{identifier}')
        else:
            cached_code = cache.get(f'verify_phone:{identifier}')

        if cached_code != code:
            return Response({'detail': 'Invalid or expired code.'}, status=status.HTTP_400_BAD_REQUEST)

        if '@' in identifier:
            user = User.objects.filter(email=identifier).first()
        else:
            user = User.objects.filter(phone_number=identifier).first()

        if user:
            if '@' in identifier:
                user.is_verified_email = True
            else:
                user.is_verified_phone_number = True

            user.save()
            cache.delete(f'verify_{'email' if '@' in identifier else 'phone'}:{identifier}')
            return Response({'message': 'Identifier verified successfully.'}, status=status.HTTP_202_ACCEPTED)
        return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)


class ResendVerificationCodeAPIView(APIView):
    def post(self, request):
        identifier = request.data.get('identifier')

        if not identifier:
            return Response({'detail': 'Identifier is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if it's an email or phone
        if "@" in identifier:
            user = User.objects.filter(email__iexact=identifier).first()
            if not user:
                return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
            if user.is_verified_email:
                return Response({'detail': 'Email is already verified.'}, status=status.HTTP_400_BAD_REQUEST)

            # Check if recently sent (rate limit)
            if cache.get(f'resend_wait_email:{identifier}'):
                return Response({'detail': 'Please wait before requesting a new code.'}, status=status.HTTP_429_TOO_MANY_REQUESTS)

            send_email_verification_code(identifier)
            cache.set(f'resend_wait_email:{identifier}', True, timeout=2 * 60)  # 2 minutes wait time

        else:
            user = User.objects.filter(phone_number=identifier).first()
            if not user:
                return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
            if user.is_verified_phone_number:
                return Response({'detail': 'Phone number is already verified.'}, status=status.HTTP_400_BAD_REQUEST)

            if cache.get(f'resend_wait_phone:{identifier}'):
                return Response({'detail': 'Please wait before requesting a new code.'}, status=status.HTTP_429_TOO_MANY_REQUESTS)

            send_phone_verification_code(identifier)
            cache.set(f'resend_wait_phone:{identifier}', True, timeout=2 * 60)  # 2 minutes wait time

        return Response({'message': 'Verification code resent.'}, status=status.HTTP_200_OK)
