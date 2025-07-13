from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.urls import reverse
from rest_framework.test import APITestCase

User = get_user_model()


@patch('rest_framework.views.APIView.get_throttles', return_value=[])
class VerifyAPITests(APITestCase):
    def setUp(self):
        self.email = "verifyuser@example.com"
        self.phone = "09123456789"
        self.password = "securepass123"
        self.url = reverse("api:verification-verify-identifier")

        self.user_email = User.objects.create_user(email=self.email, password=self.password)
        self.user_phone = User.objects.create_user(phone_number=self.phone, password=self.password)

        cache.set(f"verify_email:{self.email.lower()}", "123456", timeout=300)
        cache.set(f"verify_phone:{self.phone}", "654321", timeout=300)

    def test_verify_email_successfully(self, _):
        response = self.client.post(self.url, {"identifier": self.email, "code": "123456"})
        self.assertEqual(response.status_code, 202)
        self.user_email.refresh_from_db()
        self.assertTrue(self.user_email.is_verified_email)

    def test_verify_phone_successfully(self, _):
        response = self.client.post(self.url, {"identifier": self.phone, "code": "654321"})
        self.assertEqual(response.status_code, 202)
        self.user_phone.refresh_from_db()
        self.assertTrue(self.user_phone.is_verified_phone_number)

    def test_verify_with_invalid_code(self, _):
        response = self.client.post(self.url, {"identifier": self.email, "code": "000000"})
        self.assertEqual(response.status_code, 400)
        self.assertIn("code", response.data)

    def test_verify_with_missing_fields(self, _):
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, 400)
        self.assertIn("identifier", response.data)
        self.assertIn("code", response.data)
        # self.assertEqual(response.data["identifier"], ["This field is required."])
        # self.assertEqual(response.data["code"], ["This field is required."])

    def test_verify_with_unknown_user(self, _):
        response = self.client.post(self.url, {"identifier": "unknown@example.com", "code": "123456"})
        self.assertEqual(response.status_code, 404)
        self.assertIn("identifier", response.data)


@patch('rest_framework.views.APIView.get_throttles', return_value=[])
class ResendVerificationCodeAPITests(APITestCase):
    def setUp(self):
        self.email = "resend@example.com"
        self.phone = "09301234567"
        self.password = "securepass456"
        self.url = reverse("api:verification-resend-code")

        self.user_email = User.objects.create_user(email=self.email, password=self.password, is_verified_email=False)
        self.user_phone = User.objects.create_user(phone_number=self.phone, password=self.password,
                                                   is_verified_phone_number=False)

        # Clean up possible cache interference to avoid 429 errors
        cache.delete(f"resend_wait_email:{self.email}")
        cache.delete(f"resend_wait_phone:{self.phone}")

    @patch("apps.api.views.auth_verification_views.send_email_verification_code")
    def test_resend_email_code_successfully(self, mock_send_email, _):
        response = self.client.post(self.url, {"identifier": self.email})
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.data)
        mock_send_email.assert_called_once()

    @patch("apps.api.views.auth_verification_views.send_phone_verification_code")
    def test_resend_phone_code_successfully(self, mock_send_phone, _):
        response = self.client.post(self.url, {"identifier": self.phone})
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.data)
        mock_send_phone.assert_called_once()

    def test_resend_with_verified_email_fails(self, _):
        self.user_email.is_verified_email = True
        self.user_email.save()
        response = self.client.post(self.url, {"identifier": self.email})
        self.assertEqual(response.status_code, 400)
        self.assertIn("detail", response.data)

    def test_resend_with_verified_phone_fails(self, _):
        self.user_phone.is_verified_phone_number = True
        self.user_phone.save()
        response = self.client.post(self.url, {"identifier": self.phone})
        self.assertEqual(response.status_code, 400)
        self.assertIn("detail", response.data)

    def test_resend_without_identifier(self, _):
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, 400)
        self.assertIn("identifier", response.data)

    def test_resend_throttle_wait(self, _):
        # Set the cooldown manually
        cache.set(f"resend_wait_email:{self.email}", True, timeout=120)
        response = self.client.post(self.url, {"identifier": self.email})
        self.assertEqual(response.status_code, 429)
        self.assertIn("detail", response.data)
