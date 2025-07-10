from django.contrib.auth import get_user_model
from django.test import TestCase

User = get_user_model()

class SuperUserTests(TestCase):
    def test_create_superuser_successfully(self):
        superuser = User.objects.create_superuser(
            email='admin@example.com',
            password='supersecret123'
        )
        self.assertEqual(superuser.email, 'admin@example.com')
        self.assertTrue(superuser.is_superuser)
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_active)

    def test_create_superuser_without_email_raises_error(self):
        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                email='',
                password='supersecret123'
            )

    def test_create_superuser_with_is_superuser_false_raises_error(self):
        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                email='admin@example.com',
                password='supersecret123',
                is_superuser=False
            )

    def test_create_superuser_with_is_staff_false_raises_error(self):
        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                email='admin@example.com',
                password='supersecret123',
                is_staff=False
            )
