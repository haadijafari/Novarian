from rest_framework import serializers

from apps.product.models import Product, ProductImage


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary']


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    primary_image = ProductImageSerializer(read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'rating', 'is_active', 'is_draft',
                  'created_date', 'modified_date', 'published_date', 'primary_image', 'images']
