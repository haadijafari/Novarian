from rest_framework import viewsets

from apps.api.serializers.cart_serializers import CartSerializer
from apps.cart.models import Cart


class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
