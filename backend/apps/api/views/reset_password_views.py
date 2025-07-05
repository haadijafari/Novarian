from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from django.contrib.auth import get_user_model
from apps.utils.verification import send_email_verification_code, send_phone_verification_code

User = get_user_model()

class RequestPasswordResetAPIView(APIView):
    def post(self, request):
        identifier = request.data.get('identifier')
        if not identifier:
            return Response({'detail': 'Identifier is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if "@" in identifier:
            user = User.objects.filter(email__iexact=identifier).first()
            if not user:
                return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
            send_email_verification_code(user.email)
        else:
            user = User.objects.filter(phone_number=identifier).first()
            if not user:
                return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
            send_phone_verification_code(user.phone_number)

        return Response({'message': 'Reset code sent.'}, status=status.HTTP_200_OK)


class ResetPasswordAPIView(APIView):
    def post(self, request):
        identifier = request.data.get('identifier')
        code = request.data.get('code')
        new_password = request.data.get('new_password')

        if not all([identifier, code, new_password]):
            return Response({'detail': 'Required fields were not provided.'}, status=status.HTTP_400_BAD_REQUEST)

        if "@" in identifier:
            user = User.objects.filter(email__iexact=identifier).first()
            cached_code = cache.get(f'verify_email:{identifier}')
        else:
            user = User.objects.filter(phone_number=identifier).first()
            cached_code = cache.get(f'verify_phone:{identifier}')

        if not user:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if cached_code != code:
            return Response({'detail': 'Invalid or expired code.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        cache.delete(f'verify_email:{identifier}')
        cache.delete(f'verify_phone:{identifier}')

        return Response({'message': 'Password reset successfully.'}, status=status.HTTP_200_OK)
