from rest_framework import viewsets

from apps.api.serializers.product_serializers import ProductSerializer, CategorySerializer
from apps.product.models import Product, ProductCategory


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.active.all()
    serializer_class = ProductSerializer


class ProductCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProductCategory.active.all()
    serializer_class = CategorySerializer
