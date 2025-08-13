from django.core.cache import cache
from django.db.models import F
from rest_framework import viewsets

from apps.api.serializers.product_serializers import ProductSerializer, CategorySerializer
from apps.api.serializers.question_answer_serializers import QuestionAnswerSerializer
from apps.api.serializers.review_serializers import ReviewSerializer
from apps.product.models import Product, ProductCategory, QuestionAnswer
from apps.product.models.review import Review
from apps.utils.permissions import ProductPermission, QuestionAnswerPermission
from apps.utils.permissions import ReviewPermission


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.active.all()
    serializer_class = ProductSerializer
    permission_classes = [ProductPermission]

    def retrieve(self, request, *args, **kwargs):
        product = self.get_object()

        # Get visitor IP
        ip = request.META.get('REMOTE_ADDR')

        # Unique cache key per product per IP
        cache_key = f'product_{product.id}_viewed_by_{ip}'

        # Only increment if this IP hasn't viewed in the last 24 hours
        if not cache.get(cache_key):
            # Atomic increment
            Product.objects.filter(id=product.id).update(view_count=F('view_count') + 1)
            cache.set(cache_key, True, 60 * 60 * 24)  # expire after 1 day

        # Refresh the object so that the serializer has the updated view_count
        product.refresh_from_db()

        serializer = self.get_serializer(product)
        return Response(serializer.data)


class ProductCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProductCategory.active.all()
    serializer_class = CategorySerializer
    permission_classes = [ProductPermission]


class QuestionAnswerViewSet(viewsets.ModelViewSet):
    queryset = QuestionAnswer.objects.filter(is_active=True)
    serializer_class = QuestionAnswerSerializer
    permission_classes = [QuestionAnswerPermission]


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.filter(is_active=True)
    serializer_class = ReviewSerializer
    permission_classes = [ReviewPermission]

    def perform_create(self, serializer):
        # Automatically mark as inactive (needs admin approval)
        serializer.save(is_active=False)
