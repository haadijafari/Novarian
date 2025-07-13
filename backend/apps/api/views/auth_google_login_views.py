import logging

from django.utils.translation import gettext as _
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.api.serializers.auth_google_serializers import (
    GoogleLoginRequestSerializer,
    GoogleLoginSuccessResponseSerializer,
    GoogleLoginErrorResponseSerializer,
)
from apps.utils.google_auth import authenticate_with_google_token

logger = logging.getLogger(__name__)


class GoogleLoginAPIView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        request=GoogleLoginRequestSerializer,
        responses={
            200: GoogleLoginSuccessResponseSerializer,
            400: GoogleLoginErrorResponseSerializer,
        },
        description="Authenticate user using a Google ID token and return JWT tokens.",
        tags=["Authentication"],
    )
    def post(self, request):
        token = request.data.get("id_token")
        if not token:
            return Response(
                GoogleLoginErrorResponseSerializer({'detail': _('ID token is required.')}).data,
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate_with_google_token(token)
        if user is None:
            logger.warning("Invalid Google ID token received.")
            return Response(
                GoogleLoginErrorResponseSerializer({'detail': _('Invalid or expired Google token.')}).data,
                status=status.HTTP_400_BAD_REQUEST
            )

        refresh = RefreshToken.for_user(user)

        logger.info(f"User {user.id} ({user.email}) logged in via Google.")

        return Response(
            GoogleLoginSuccessResponseSerializer({
                'message': _('Logged in with Google successfully.'),
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.id,
                'email': user.email,
                'phone_number': user.phone_number,
            }).data,
            status=status.HTTP_200_OK
        )
