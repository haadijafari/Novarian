from rest_framework import viewsets, permissions

from apps.api.serializers.product_serializers import ProductSerializer, CategorySerializer
from apps.product.models import Product, ProductCategory
from apps.utils.permissions import IsSuperUser


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.active.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsSuperUser()]
        return [permissions.AllowAny()]


class ProductCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProductCategory.active.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsSuperUser()]
        return [permissions.AllowAny()]
