from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.urls import reverse
from rest_framework.test import APITestCase

User = get_user_model()


@patch('apps.api.views.auth_reset_password_views.PasswordResetViewSet.get_throttles', return_value=[])
class RequestPasswordResetTests(APITestCase):
    def setUp(self):
        self.url = reverse('api:password-reset-request-reset')
        self.email = "resetemail@test.com"
        self.phone = "09123456789"
        self.user_email = User.objects.create_user(email=self.email, password="oldpass", is_verified_email=True)
        self.user_phone = User.objects.create_user(phone_number=self.phone, password="oldpass",
                                                   is_verified_phone_number=True)

    def tearDown(self):
        cache.clear()

    def test_request_password_reset_with_email(self, _):
        response = self.client.post(self.url, {"identifier": self.email}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.data)

    def test_request_password_reset_with_phone(self, _):
        response = self.client.post(self.url, {"identifier": self.phone}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.data)

    def test_request_password_reset_with_invalid_identifier(self, _):
        response = self.client.post(self.url, {"identifier": "invalid@test.com"}, format="json")
        self.assertEqual(response.status_code, 404)
        self.assertIn("identifier", response.data)

    def test_request_password_reset_with_email_with_extra_spaces_and_caps(self, _):
        response = self.client.post(self.url, {"identifier": f' {self.email.capitalize()}   '}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.data)

    def test_request_password_reset_with_phone_number_with_extra_spaces(self, _):
        response = self.client.post(self.url, {"identifier": f' {self.phone}   '}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.data)

    def test_request_password_reset_with_empty_identifier(self, _):
        response = self.client.post(self.url, {"identifier": ""}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("identifier", response.data)


@patch('apps.api.views.auth_reset_password_views.PasswordResetViewSet.get_throttles', return_value=[])
class ResetPasswordTests(APITestCase):
    def setUp(self):
        self.url = reverse('api:password-reset-reset-password')
        self.email = "resetfinal@test.com"
        self.phone = "09301234567"
        self.old_password = "oldpass123"
        self.new_password = "newpass456"

        self.user_email = User.objects.create_user(email=self.email, password=self.old_password, is_verified_email=True)
        self.user_phone = User.objects.create_user(phone_number=self.phone, password=self.old_password,
                                                   is_verified_phone_number=True)

        # Assume the verification codes where like this
        cache.set(f"verify_email:{self.email.lower().strip()}", "999999", timeout=2 * 60)
        cache.set(f"verify_phone:{self.phone.strip()}", "888888", timeout=2 * 60)

    def tearDown(self):
        cache.clear()

    def test_reset_password_with_email_successfully(self, _):
        data = {
            "identifier": self.email,
            "code": "999999",
            "new_password": self.new_password
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.data)

        self.user_email.refresh_from_db()
        self.assertTrue(self.user_email.check_password(self.new_password))

    def test_reset_password_with_phone_successfully(self, _):
        data = {
            "identifier": self.phone,
            "code": "888888",
            "new_password": self.new_password
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.data)

        self.user_phone.refresh_from_db()
        self.assertTrue(self.user_phone.check_password(self.new_password))

    def test_reset_password_with_email_with_extra_spaces_and_caps(self, _):
        data = {
            "identifier": f' {self.email.capitalize()}   ',
            "code": "999999",
            "new_password": self.new_password
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.data)

        self.user_email.refresh_from_db()
        self.assertTrue(self.user_email.check_password(self.new_password))

    def test_reset_password_with_phone_with_extra_spaces(self, _):
        data = {
            "identifier": f'   {self.phone} ',
            "code": "888888",
            "new_password": self.new_password
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.data)

        self.user_phone.refresh_from_db()
        self.assertTrue(self.user_phone.check_password(self.new_password))

    def test_reset_password_with_invalid_code_fails(self, _):
        data = {
            "identifier": self.email,
            "code": "000000",
            "new_password": self.new_password
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("code", response.data)

        # Refresh user and assert password did not change
        self.user_email.refresh_from_db()
        self.assertTrue(self.user_email.check_password(self.old_password))
        self.assertFalse(self.user_email.check_password(self.new_password))

    def test_reset_password_with_invalid_identifier_fails(self, _):
        data = {
            "identifier": "notfound@test.com",
            "code": "999999",
            "new_password": self.new_password
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 404)
        self.assertIn("identifier", response.data)

        # Refresh user and assert password did not change
        self.user_email.refresh_from_db()
        self.assertTrue(self.user_email.check_password(self.old_password))
        self.assertFalse(self.user_email.check_password(self.new_password))

    def test_reset_password_with_weak_password_fails(self, _):
        data = {
            "identifier": self.email,
            "code": "999999",  # valid code
            "new_password": "123"  # clearly weak
        }

        response = self.client.post(self.url, data, format="json")

        # It should return 400 because password is too weak
        self.assertEqual(response.status_code, 400)
        self.assertIn("new_password", response.data)

        # Make sure the password is not changed
        self.user_email.refresh_from_db()
        self.assertTrue(self.user_email.check_password(self.old_password))
        self.assertFalse(self.user_email.check_password('123'))


class RequestPasswordResetThrottleTests(APITestCase):
    def setUp(self):
        self.url = reverse('api:password-reset-request-reset')
        self.email = "throttleemail@test.com"
        self.phone = "09309990000"
        self.user_email = User.objects.create_user(email=self.email, password="pass", is_verified_email=True)
        self.user_phone = User.objects.create_user(phone_number=self.phone, password="pass",
                                                   is_verified_phone_number=True)

    def tearDown(self):
        cache.clear()

    def test_email_throttle_kicks_in(self):
        for _ in range(10):
            self.client.post(self.url, {"identifier": self.email}, format="json")
        # Should now trigger throttling
        response = self.client.post(self.url, {"identifier": self.email}, format="json")
        self.assertEqual(response.status_code, 429)
        self.assertIn("detail", response.data)

    def test_phone_throttle_kicks_in(self):
        for _ in range(10):
            self.client.post(self.url, {"identifier": self.phone}, format="json")
        response = self.client.post(self.url, {"identifier": self.phone}, format="json")
        self.assertEqual(response.status_code, 429)
        self.assertIn("detail", response.data)


class PasswordResetThrottleTests(APITestCase):
    def setUp(self):
        self.url = reverse('api:password-reset-reset-password')
        self.email = "resetthrottle@test.com"
        self.phone = "09308880000"
        self.user_email = User.objects.create_user(email=self.email, password="oldpass", is_verified_email=True)
        self.user_phone = User.objects.create_user(phone_number=self.phone, password="oldpass",
                                                   is_verified_phone_number=True)

        # Simulate codes in cache
        cache.set(f"verification_code:{self.email.lower().strip()}", "123456", timeout=300)
        cache.set(f"verification_code:{self.phone.strip()}", "654321", timeout=300)

    def tearDown(self):
        cache.clear()

    def test_reset_password_email_throttling(self):
        data = {
            "identifier": self.email,
            "code": "wrongcode",  # intentionally wrong
            "new_password": "somepass123"
        }
        for _ in range(10):
            self.client.post(self.url, data, format="json")
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 429)
        self.assertIn("detail", response.data)

    def test_reset_password_phone_throttling(self):
        data = {
            "identifier": self.phone,
            "code": "wrongcode",
            "new_password": "somepass123"
        }
        for _ in range(10):
            self.client.post(self.url, data, format="json")
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 429)
        self.assertIn("detail", response.data)
