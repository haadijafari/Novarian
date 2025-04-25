from rest_framework import serializers

from apps.cart.models import Cart, CartItem
from .product_serializers import ProductSerializer


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'add_date', 'total_price']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'is_paid', 'created_date', 'paid_date', 'items', 'total_price']

    def get_total_price(self, obj):
        return obj.get_total_price()
