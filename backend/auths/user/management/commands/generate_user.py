import random

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from faker import Faker

fake = Faker()
User = get_user_model()


class Command(BaseCommand):
    help = "Generate demo users (normal or staff)"

    def add_arguments(self, parser):
        parser.add_argument(
            '--count', type=int, default=1,
            help='Number of users to create'
        )
        parser.add_argument(
            '--staff', action='store_true',
            help='Generate staff users (is_staff=True)'
        )

    def handle(self, *args, **options):
        count = options['count']
        is_staff = options['staff']

        created_users = 0

        for _ in range(count):
            first_name = fake.first_name()
            last_name = fake.last_name()
            email = fake.unique.email()
            phone_number = f'09{random.randint(100000000, 999999999)}'
            password = 'password123'  # default password for demo

            user = User.objects.create_user(
                email=email,
                phone_number=phone_number,
                password=password,
                first_name=first_name,
                last_name=last_name,
                is_staff=is_staff,
                is_active=True,
                is_verified_phone_number=True,
                is_verified_email=True,
            )

            created_users += 1
            self.stdout.write(self.style.SUCCESS(
                f"Created {'staff' if is_staff else 'normal'} user: {user} (Email: {email}, Phone: {phone_number})"
            ))

        self.stdout.write(self.style.SUCCESS(f"Total users created: {created_users}"))
