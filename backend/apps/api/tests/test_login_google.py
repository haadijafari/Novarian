from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


@patch("apps.api.views.auth_google_login_views.GoogleLoginAPIView.get_throttles", return_value=[])
class GoogleLoginTests(APITestCase):
    def setUp(self):
        self.url = reverse("api:google-login")
        self.token = "fake-id-token"

    @patch("apps.api.views.auth_google_login_views.authenticate_with_google_token")
    def test_google_login_success(self, mock_authenticate, _):
        user = User.objects.create_user(
            email="test@example.com",
            phone_number="09120000000",
            password="irrelevant",
        )
        mock_authenticate.return_value = user

        response = self.client.post(self.url, {"id_token": self.token}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["email"], user.email)

    @patch("apps.api.views.auth_google_login_views.authenticate_with_google_token")
    def test_google_login_invalid_token(self, mock_authenticate, _):
        mock_authenticate.return_value = None

        response = self.client.post(self.url, {"id_token": self.token}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "Invalid or expired Google token.")

    def test_google_login_missing_token(self, _):
        response = self.client.post(self.url, {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "ID token is required.")
