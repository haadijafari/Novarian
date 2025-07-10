import uuid
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase

User = get_user_model()


@patch('rest_framework.viewsets.ViewSet.get_throttles', return_value=[])
class LoginTests(APITestCase):
    def setUp(self):
        self.url = reverse('api:login-list')
        unique = uuid.uuid4().hex[:6]
        self.email = f"login_{unique}@example.com"
        self.phone = f"09{unique[:9].zfill(9)}"
        self.password = "loginpassword123"

        # User with verified email
        self.user_email = User.objects.create_user(email=self.email, password=self.password)
        self.user_email.is_verified_email = True
        self.user_email.save()

        # User with verified phone
        self.user_phone = User.objects.create_user(phone_number=self.phone, password=self.password)
        self.user_phone.is_verified_phone_number = True
        self.user_phone.save()

    def test_login_with_email(self, _):
        data = {
            "identifier": self.email,
            "password": self.password,
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_login_with_phone(self, _):
        data = {
            "identifier": self.phone,
            "password": self.password,
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_login_with_wrong_password_fails(self, _):
        data = {
            "identifier": self.email,
            "password": "wrongpassword",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("non_field_errors", response.data)

    def test_login_with_unverified_email_fails(self, _):
        user = User.objects.create_user(email="unverified@test.com", password=self.password)
        data = {
            "identifier": user.email,
            "password": self.password,
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("non_field_errors", response.data)

    def test_login_with_unverified_phone_fails(self, _):
        user = User.objects.create_user(phone_number="09999999999", password=self.password)
        data = {
            "identifier": user.phone_number,
            "password": self.password,
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("non_field_errors", response.data)


class LoginThrottleTests(APITestCase):
    def setUp(self):
        self.url = reverse('api:login-list')
        self.user = User.objects.create_user(
            email='throttle@test.com',
            password='strongpass123',
            is_verified_email=True
        )

    def test_throttle_kicks_in_after_repeated_requests(self):
        data = {
            "identifier": self.user.email,
            "password": "wrongpass"  # intentionally wrong
        }

        for i in range(10):
            self.client.post(self.url, data, format='json')

        # One more request, should trigger throttling
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 429)
        self.assertIn('detail', response.data)
