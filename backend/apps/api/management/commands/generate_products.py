import os
import random
import uuid
from decimal import Decimal

from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand
from django.utils import timezone
from faker import Faker

from apps.product.models.product import Product, ProductImage
from apps.product.models.category import Category

fake = Faker()

# Path to demo images folder inside your project root
DEMO_IMAGE_DIR = settings.BASE_DIR / "demo_images"


class Command(BaseCommand):
    help = "Generate sample Category, Product records with multiple demo images and tags"

    def add_arguments(self, parser):
        parser.add_argument('--categories', type=int, default=5, help="Number of categories to create")
        parser.add_argument('--products', type=int, default=20, help="Number of products to create")
        parser.add_argument('--tags', type=int, default=15, help="Number of unique tags to generate")

    def handle(self, *args, **options):
        category_count = options['categories']
        product_count = options['products']
        total_tags = options['tags']

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
            Category.objects.create(
                title=fake.word().capitalize(),
                color=fake.color(),
                is_active=True
            )
            for _ in range(category_count)
        ]
        self.stdout.write(self.style.SUCCESS(f"Created {len(categories)} categories."))

        # Generate a pool of tags for overlap
        tag_pool = [fake.word().lower() for _ in range(total_tags)]

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

            # Assign random tags (1–5 tags per product)
            num_tags = random.randint(1, 5)
            product.tags.set(random.sample(tag_pool, num_tags))

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

        self.stdout.write(self.style.SUCCESS(f"Created {product_count} products with multiple demo images and tags."))
