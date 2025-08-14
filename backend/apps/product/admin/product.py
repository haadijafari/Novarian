from django.contrib import admin
from django.utils.safestring import mark_safe

from apps.product.models.product import Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline]
    # readonly_fields = ['slug', ]
    prepopulated_fields = {
        'slug': ['title']
    }
    list_display = (
        '__str__', 'price', 'rating', 'is_active', 'is_draft', 'created_date', 'modified_date', 'image_thumbnail')
    list_filter = ('category', 'is_active', 'is_draft')
    search_fields = ('title',)
    ordering = ('-created_date',)
    list_editable = ('is_active', 'is_draft')

    def image_thumbnail(self, obj):
        if obj.primary_image:
            return mark_safe(f'<img src="{obj.primary_image.image.url}" width="50" height="50"/>')
        return "-"

    image_thumbnail.short_description = 'Primary Image'


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'image_thumbnail', 'is_primary')
    list_filter = ('is_primary',)
    search_fields = ('product__title',)
    ordering = ('product',)

    def image_thumbnail(self, obj):
        return mark_safe(f'<img src="{obj.image.url}" width="50" height="50"/>')

    image_thumbnail.short_description = 'Image'

    def save_model(self, request, obj, form, change):
        if obj.is_primary:
            # Unset other primary images for this product
            ProductImage.objects.filter(product=obj.product, is_primary=True).exclude(pk=obj.pk).update(
                is_primary=False)
        super().save_model(request, obj, form, change)
