import random
import uuid
import os
from decimal import Decimal
from faker import Faker
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.core.files import File
from django.conf import settings

from apps.product.models import Product, ProductCategory, ProductImage

fake = Faker()

# Path to demo images folder inside your project root
DEMO_IMAGE_DIR = settings.BASE_DIR / "demo_images"

class Command(BaseCommand):
    help = "Generate sample ProductCategory and Product records with multiple demo images"

    def add_arguments(self, parser):
        parser.add_argument('--categories', type=int, default=5, help="Number of categories to create")
        parser.add_argument('--products', type=int, default=20, help="Number of products to create")

    def handle(self, *args, **options):
        category_count = options['categories']
        product_count = options['products']

        # Ensure demo image folder exists
        if not DEMO_IMAGE_DIR.exists():
            self.stdout.write(self.style.ERROR(f"Demo image folder not found: {DEMO_IMAGE_DIR}"))
            return

        # Filter for product_image_* files
        demo_images = [
            f for f in os.listdir(DEMO_IMAGE_DIR)
            if f.lower().startswith("product_image_") and f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))
        ]
        if not demo_images:
            self.stdout.write(self.style.ERROR("No product_image_* images found in demo image folder."))
            return

        # Create categories
        categories = [
            ProductCategory.objects.create(
                title=fake.word().capitalize(),
                color=fake.color(),
                is_active=True
            )
            for _ in range(category_count)
        ]
        self.stdout.write(self.style.SUCCESS(f"Created {len(categories)} categories."))

        # Create products
        for _ in range(product_count):
            product = Product.objects.create(
                title=fake.sentence(nb_words=3).rstrip('.'),
                price=Decimal(random.randint(1_000_000, 500_000_000)),  # IRR
                has_discount=random.choice([True, False]),
                discount_percentage=random.randint(0, 30),
                quantity=random.randint(1, 50),
                rating=round(random.uniform(0, 5), 1),
                short_description=fake.text(max_nb_chars=100),
                description=fake.paragraph(nb_sentences=5),
                is_active=True,
                is_draft=False,
                published_date=timezone.now(),
            )

            # Assign random categories
            product.category.set(random.sample(categories, random.randint(1, len(categories))))

            # Pick 1–5 random images for this product
            num_images = random.randint(1, 5)
            chosen_images = random.sample(demo_images, min(num_images, len(demo_images)))

            # Randomly choose one as primary
            primary_image_index = random.randint(0, len(chosen_images) - 1)

            for idx, image_filename in enumerate(chosen_images):
                image_path = DEMO_IMAGE_DIR / image_filename
                with open(image_path, 'rb') as img_file:
                    product_image = ProductImage(
                        product=product,
                        is_primary=(idx == primary_image_index)
                    )
                    product_image.image.save(
                        f"{uuid.uuid4().hex}{image_path.suffix}",
                        File(img_file),
                        save=True
                    )

        self.stdout.write(self.style.SUCCESS(f"Created {product_count} products with multiple demo images."))
