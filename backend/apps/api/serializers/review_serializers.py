from rest_framework import serializers

from apps.product.models.review import Review


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            'id',
            'product',
            'user_received_product_image',
            'rating',
            'description_title',
            'description',
            'is_active',
            'is_anonymous',
            'is_purchased',
            'created_date',
            'modified_date',
        ]
        read_only_fields = ('is_active', 'created_date', 'modified_date')
