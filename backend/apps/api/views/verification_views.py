import logging

from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

# Local app imports
from apps.utils.verification import send_email_verification_code, send_phone_verification_code

logger = logging.getLogger(__name__)
User = get_user_model()


class VerifyAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        identifier = request.data.get('identifier')
        code = request.data.get('code')

        if not all([identifier, code]):
            errors = {}
            if not identifier:
                errors['identifier'] = ['This field is required.']
            if not code:
                errors['code'] = ['This field is required.']

            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        if '@' in identifier:
            cached_code = cache.get(f'verify_email:{identifier}')
            user = User.objects.filter(email=identifier).first()
        else:
            cached_code = cache.get(f'verify_phone:{identifier}')
            user = User.objects.filter(phone_number=identifier).first()

        if not user:
            return Response({'identifier': ['User not found.']}, status=status.HTTP_404_NOT_FOUND)

        if cached_code != code:
            logger.warning(f"Invalid code attempt for {identifier}")
            return Response({'code': ['Invalid or expired code.']}, status=status.HTTP_400_BAD_REQUEST)

        if '@' in identifier:
            user.is_verified_email = True
        else:
            user.is_verified_phone_number = True

        user.save()
        cache.delete(f"verify_{'email' if '@' in identifier else 'phone'}:{identifier}")
        return Response({'message': 'Identifier verified successfully.'}, status=status.HTTP_202_ACCEPTED)


class ResendVerificationCodeAPIView(APIView):
    def post(self, request):
        identifier = request.data.get('identifier')

        if not identifier:
            return Response({'identifier': ['Identifier is required.']}, status=status.HTTP_400_BAD_REQUEST)

        # Check if it's an email or phone
        if "@" in identifier:
            user = User.objects.filter(email__iexact=identifier).first()
            if not user:
                return Response({'identifier': ['User not found.']}, status=status.HTTP_404_NOT_FOUND)
            if user.is_verified_email:
                return Response({'detail': ['Email is already verified.']}, status=status.HTTP_400_BAD_REQUEST)

            # Check if recently sent (rate limit)
            if cache.get(f'resend_wait_email:{identifier}'):
                return Response({'detail': ['Please wait before requesting a new code.']},
                                status=status.HTTP_429_TOO_MANY_REQUESTS)

            send_email_verification_code(identifier)
            cache.set(f'resend_wait_email:{identifier}', True, timeout=2 * 60)  # 2 minutes wait time

        else:
            user = User.objects.filter(phone_number=identifier).first()
            if not user:
                return Response({'identifier': ['User not found.']}, status=status.HTTP_404_NOT_FOUND)
            if user.is_verified_phone_number:
                return Response({'detail': ['Phone number is already verified.']}, status=status.HTTP_400_BAD_REQUEST)

            if cache.get(f'resend_wait_phone:{identifier}'):
                return Response({'detail': ['Please wait before requesting a new code.']},
                                status=status.HTTP_429_TOO_MANY_REQUESTS)

            send_phone_verification_code(identifier)
            cache.set(f'resend_wait_phone:{identifier}', True, timeout=2 * 60)  # 2 minutes wait time

        return Response({'message': 'Verification code resent.'}, status=status.HTTP_200_OK)
