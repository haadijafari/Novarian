from rest_framework import serializers

from apps.api.serializers.product_serializers import ProductSerializer
from apps.product.models import ProductCategory


class CategorySerializer(serializers.ModelSerializer):
    # product_categories = ProductSerializer(many=True, required=False)

    class Meta:
        model = ProductCategory
        fields = [
            'id',
            'title',
            'color',
            'product_categories',
            'is_active',
        ]
