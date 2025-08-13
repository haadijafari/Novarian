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
