from drf_writable_nested import WritableNestedModelSerializer
from rest_framework import serializers
from taggit.serializers import TagListSerializerField, TaggitSerializer

from apps.product.models import Product, ProductImage, ProductCategory


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = [
            'id',
            'title',
            'color',
            'product_categories',
            'is_active',
        ]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary']


class ProductSerializer(TaggitSerializer, WritableNestedModelSerializer):
    tags = TagListSerializerField(required=False, default=None)
    images = ProductImageSerializer(many=True, required=False)
    primary_image = ProductImageSerializer(read_only=True)
    category = serializers.PrimaryKeyRelatedField(
        many=True, read_only=False,
        queryset=ProductCategory.active.all()
    )

    class Meta:
        model = Product
        fields = [
            'id',
            'title',
            'slug',
            'category',
            'price',
            'quantity',
            'tags',
            'short_description',
            'description',
            'is_draft',
            'created_date',
            'modified_date',
            'published_date',
            'images',
            'primary_image',
        ]

        def create(self, validated_data):
            images_data = validated_data.pop('images', [])
            categories = validated_data.pop('category', [])
            tags = validated_data.pop('tags', [])
            product = Product.objects.create(**validated_data)
            product.category.set(categories)
            product.tags.set(*tags)

            for image_data in images_data:
                ProductImage.objects.create(product=product, **image_data)

            return product

        def update(self, instance, validated_data):
            images_data = validated_data.pop('images', None)
            categories = validated_data.pop('category', [])
            tags = validated_data.pop('tags', [])

            for attr, value in validated_data.items():
                setattr(instance, attr, value)

            instance.category.set(categories)
            instance.tags.set(*tags)
            instance.save()

            if images_data is not None:
                instance.images.all().delete()
                for image_data in images_data:
                    ProductImage.objects.create(product=instance, **image_data)

            return instance
