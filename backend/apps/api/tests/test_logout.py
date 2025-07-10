from unittest.mock import patch

from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


@patch('rest_framework.viewsets.ViewSet.get_throttles', return_value=[])
class LogoutTests(APITestCase):
    def setUp(self):
        self.url = reverse('api:logout-list')

        self.user = User.objects.create_user(
            email='logoutuser@test.com',
            password='logout123',
            is_verified_email=True
        )
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.refresh_token = str(refresh)

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

    def test_logout_successful(self, _):
        response = self.client.post(self.url, {"refresh": self.refresh_token}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Logged out successfully.")

    def test_logout_without_token_fails(self, _):
        response = self.client.post(self.url, {}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("detail", response.data)
        self.assertEqual(response.data["detail"], "Refresh token is required.")

    def test_logout_with_invalid_token_fails(self, _):
        response = self.client.post(self.url, {"refresh": "invalidtoken"}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("detail", response.data)
        self.assertEqual(response.data["detail"], "Invalid or expired token.")

    def test_logout_unauthenticated_user_fails(self, _):
        self.client.credentials()  # delete token
        response = self.client.post(self.url, {"refresh": self.refresh_token}, format="json")
        self.assertEqual(response.status_code, 401)


class LogoutThrottleTests(APITestCase):
    def setUp(self):
        self.url = reverse('api:logout-list')

        self.user = User.objects.create_user(
            email='throttlelogout@test.com',
            password='throttle123',
            is_verified_email=True
        )
        self.refresh_token = str(RefreshToken.for_user(self.user))
        self.access_token = str(RefreshToken.for_user(self.user).access_token)

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

    def test_logout_throttle_kicks_in(self):
        data = {"refresh": self.refresh_token}

        for _ in range(5):
            response = self.client.post(self.url, data, format='json')

        # The next time should raise 429 Error
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 429)
        self.assertIn('detail', response.data)
