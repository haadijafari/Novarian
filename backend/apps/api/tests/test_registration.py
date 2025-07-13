import uuid
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase

User = get_user_model()


@patch('apps.api.views.auth_register_views.RegisterViewSet.get_throttles', return_value=[])
class RegisterTests(APITestCase):
    def setUp(self):
        # Because registered ViewSet with basename='register'
        self.url = reverse('api:register-list')
        unique = uuid.uuid4().hex[:6]
        self.email = f"testuser_{unique}@example.com"
        self.phone = f"09{unique[:9].zfill(9)}"
        self.password = "testpassword123"

    def test_register_with_email(self, _):
        data = {
            "identifier": self.email,
            "password": self.password,
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIsInstance(response.data['access'], str)
        self.assertTrue(User.objects.filter(email=self.email).exists())

    def test_register_with_existing_email_fails(self, _):
        User.objects.create_user(email=self.email, password=self.password)
        data = {
            "identifier": self.email,
            "password": "newpassword123",
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('identifier', response.data)

    def test_register_with_phone(self, _):
        data = {
            "identifier": self.phone,
            "password": self.password
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIsInstance(response.data['access'], str)
        self.assertTrue(User.objects.filter(phone_number=self.phone).exists())

    def test_register_with_no_identifier_fails(self, _):
        data = {
            "password": self.password,
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('identifier', response.data)


class RegisterThrottleTests(APITestCase):
    def setUp(self):
        self.url = reverse('api:register-list')
        self.password = "testpass123"

    def test_throttling_kicks_in(self):
        for _ in range(10):
            email = f"user_{uuid.uuid4().hex[:6]}@example.com"
            self.client.post(self.url, {"identifier": email, "password": self.password})
        response = self.client.post(self.url, {"identifier": "some@random.com", "password": self.password})
        self.assertEqual(response.status_code, 429)
