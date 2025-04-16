from rest_framework import viewsets

from apps.api.serializers.product_serializers import ProductSerializer
from apps.shop.models import Product


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
