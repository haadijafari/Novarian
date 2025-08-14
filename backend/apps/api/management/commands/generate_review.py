import random
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.files import File
from django.core.management.base import BaseCommand
from faker import Faker
from apps.product.models.product import Product
from apps.product.models.review import Review

from pathlib import Path

fake = Faker()
User = get_user_model()

DEMO_IMAGES_DIR = settings.BASE_DIR / "demo_images"  # folder containing review images


class Command(BaseCommand):
    help = "Generate random reviews for all products"

    def add_arguments(self, parser):
        parser.add_argument('--min', type=int, default=0, help='Minimum number of reviews per product')
        parser.add_argument('--max', type=int, default=5, help='Maximum number of reviews per product')

    def handle(self, *args, **options):
        min_reviews = options['min']
        max_reviews = options['max']

        products = Product.objects.all()
        users = User.objects.filter(is_active=True)

        if not users.exists():
            self.stdout.write(self.style.ERROR("No users found. Generate users first."))
            return

        if not DEMO_IMAGES_DIR.exists():
            self.stdout.write(self.style.ERROR(f"Demo image folder {DEMO_IMAGES_DIR} does not exist."))
            return

        # Only product_image_* files
        image_files = [f for f in DEMO_IMAGES_DIR.iterdir()
                       if f.is_file() and f.name.lower().startswith("product_image_")
                       and f.suffix.lower() in ('.png', '.jpg', '.jpeg', '.webp')]

        if not image_files:
            self.stdout.write(self.style.ERROR("No product_image_* images found in demo image folder."))
            return

        created_reviews = 0

        for product in products:
            num_reviews = random.randint(min_reviews, max_reviews)
            for _ in range(num_reviews):
                user = random.choice(users)
                title = fake.sentence(nb_words=6)
                description = fake.paragraph(nb_sentences=random.randint(3, 10))
                rating = random.randint(0, 10) * 0.5
                is_anonymous = random.choice([True, False])
                is_purchased = random.choice([True, False])
                review_image = None

                # Attach random image
                if image_files:
                    image_path = random.choice(image_files)
                    # Open file outside context manager
                    review_image = File(open(image_path, 'rb'), name=image_path.name)

                Review.objects.create(
                    product=product,
                    user=user,
                    rating=rating,
                    description_title=title,
                    description=description,
                    is_active=True,
                    is_anonymous=is_anonymous,
                    is_purchased=is_purchased,
                    user_received_product_image=review_image,
                )
                created_reviews += 1

        self.stdout.write(self.style.SUCCESS(f"Generated {created_reviews} reviews for {products.count()} products."))
