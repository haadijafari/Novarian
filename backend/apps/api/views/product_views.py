from rest_framework import viewsets

from apps.api.serializers.product_serializers import ProductSerializer, CategorySerializer
from apps.api.serializers.question_answer_serializers import QuestionAnswerSerializer
from apps.product.models import Product, ProductCategory, QuestionAnswer
from apps.utils.permissions import ProductPermission, QuestionAnswerPermission


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
