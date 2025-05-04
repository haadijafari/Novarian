from apps.api.serializers.product_serializers import ProductSerializer
from rest_framework import serializers

from apps.cart.models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'add_date', 'total_price']

    def get_total_price(self, obj):
        return str(obj.total_price)  # Ensures Money object is serialized as string


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    tax_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = [
            'id',
            'user',
            'is_paid',
            'created_date',
            'updated_date',
            'paid_date',
            'items',
            'total_price',
            'tax_price',
        ]

    def get_total_price(self, obj):
        total = obj.get_total_price()
        return str(total) if total else '0 IRR'

    def get_tax_price(self, obj):
        tax = obj.calculate_tax_price()
        return str(tax) if tax else '0 IRR'
