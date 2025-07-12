from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


@patch('rest_framework.viewsets.ViewSet.get_throttles', return_value=[])
class LogoutTests(APITestCase):
    def setUp(self):
        self.url = reverse('api:logout')

        self.user = User.objects.create_user(
            email='logoutuser@test.com',
            password='logout123',
            is_verified_email=True
        )
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.refresh_token = str(refresh)

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

    def tearDown(self):
        cache.clear()

    def test_logout_successful(self, _):
        response = self.client.post(self.url, {"refresh": self.refresh_token}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Logged out successfully.")

    def test_logout_without_token_fails(self, _):
        response = self.client.post(self.url, {}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("refresh", response.data)

    def test_logout_with_invalid_token_fails(self, _):
        response = self.client.post(self.url, {"refresh": "invalidtoken"}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("detail", response.data)

    def test_logout_unauthenticated_user_fails(self, _):
        self.client.credentials()  # delete token
        response = self.client.post(self.url, {"refresh": self.refresh_token}, format="json")
        self.assertEqual(response.status_code, 401)

    def test_logout_with_blacklisted_token_fails(self, _):
        # First logout works
        self.client.post(self.url, {"refresh": self.refresh_token}, format="json")

        # Second attempt with same token
        response = self.client.post(self.url, {"refresh": self.refresh_token}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("detail", response.data)
        self.assertEqual(response.data["detail"], "Token is blacklisted")


class LogoutThrottleTests(APITestCase):
    def setUp(self):
        self.url = reverse('api:logout')

        self.user = User.objects.create_user(
            email='throttlelogout@test.com',
            password='throttle123',
            is_verified_email=True
        )
        self.refresh_token = str(RefreshToken.for_user(self.user))
        self.access_token = str(RefreshToken.for_user(self.user).access_token)

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

    def tearDown(self):
        cache.clear()

    def test_logout_throttle_kicks_in(self):
        # Use a fake token to simulate repeated failed attempts (InvalidToken path)
        data = {"refresh": "fake.invalid.token"}

        for i in range(10):  # match your throttle limit in settings.py
            response = self.client.post(self.url, data, format='json')
            self.assertNotEqual(response.status_code, 429, f"Unexpected throttle at attempt {i + 1}")

        # The next attempt should trigger throttling
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 429)
        self.assertIn('detail', response.data)
