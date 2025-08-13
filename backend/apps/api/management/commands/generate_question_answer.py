import random
from faker import Faker
from django.core.management.base import BaseCommand
from apps.product.models import Product
from apps.product.models import QuestionAnswer

fake = Faker()

class Command(BaseCommand):
    help = "Generate random QuestionAnswer records for existing products"

    def add_arguments(self, parser):
        parser.add_argument(
            '--min', type=int, default=0,
            help='Minimum number of Q&A per product'
        )
        parser.add_argument(
            '--max', type=int, default=5,
            help='Maximum number of Q&A per product'
        )

    def handle(self, *args, **options):
        min_qas = options['min']
        max_qas = options['max']

        products = Product.objects.all()
        total_created = 0

        for product in products:
            num_qas = random.randint(min_qas, max_qas)
            for _ in range(num_qas):
                qa = QuestionAnswer.objects.create(
                    product=product,
                    question=fake.sentence(nb_words=random.randint(8, 20)),
                    answer=fake.paragraph(nb_sentences=random.randint(2, 10)),
                    is_active=True
                )
                total_created += 1

        self.stdout.write(self.style.SUCCESS(
            f"Generated {total_created} QuestionAnswer records for {products.count()} products."
        ))
