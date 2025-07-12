from django.utils.translation import gettext as _
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.utils.google_auth import authenticate_with_google_token


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
