import logging

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.utils.translation import gettext as _
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.utils.verification import send_email_verification_code, send_phone_verification_code

logger = logging.getLogger(__name__)
User = get_user_model()


class RequestPasswordResetAPIView(APIView):
    def post(self, request):
        identifier = request.data.get('identifier')
        if not identifier:
            return Response({'identifier': [_('Identifier is required.')]}, status=status.HTTP_400_BAD_REQUEST)

        if "@" in identifier:
            user = User.objects.filter(email__iexact=identifier).first()
            if not user:
                return Response({'identifier': [_('User not found.')]}, status=status.HTTP_404_NOT_FOUND)
            send_email_verification_code(user.email)
        else:
            user = User.objects.filter(phone_number=identifier).first()
            if not user:
                return Response({'identifier': [_('User not found.')]}, status=status.HTTP_404_NOT_FOUND)
            send_phone_verification_code(user.phone_number)

        return Response({'message': _('Reset code sent.')}, status=status.HTTP_200_OK)


class ResetPasswordAPIView(APIView):
    def post(self, request):
        identifier = request.data.get('identifier')
        code = request.data.get('code')
        new_password = request.data.get('new_password')

        if not all([identifier, code, new_password]):
            errors = {}
            if not identifier:
                errors['identifier'] = [_('This field is required.')]
            if not code:
                errors['code'] = [_('This field is required.')]
            if not new_password:
                errors['new_password'] = [_('This field is required.')]
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        if "@" in identifier:
            user = User.objects.filter(email__iexact=identifier).first()
            cached_code = cache.get(f'verify_email:{identifier.lower()}')
        else:
            user = User.objects.filter(phone_number=identifier).first()
            cached_code = cache.get(f'verify_phone:{identifier}')

        if not user:
            return Response({'identifier': [_('User not found.')]}, status=status.HTTP_404_NOT_FOUND)

        if cached_code != code:
            logger.warning(f"Invalid code attempt for {identifier}")
            return Response({'code': [_('Invalid or expired code.')]}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        if "@" in identifier:
            cache.delete(f'verify_email:{identifier.lower()}')
        else:
            cache.delete(f'verify_phone:{identifier}')

        return Response({'message': _('Password reset successfully.')}, status=status.HTTP_200_OK)
