from apps.api.serializers.product_serializers import ProductSerializer, CategorySerializer
from apps.product.models import Product, ProductCategory
from apps.utils.permissions import ProductPermission
from rest_framework import viewsets


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.active.all()
    serializer_class = ProductSerializer
    permission_classes = [ProductPermission]


class ProductCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProductCategory.active.all()
    serializer_class = CategorySerializer
    permission_classes = [ProductPermission]
