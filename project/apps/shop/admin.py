from django.contrib import admin
from django.utils.html import mark_safe

from .models import Product, Cart, CartItem, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline]
    list_display = (
        'title', 'price', 'rating', 'is_active', 'is_draft', 'created_date', 'modified_date', 'image_thumbnail')
    list_filter = ('is_active', 'is_draft', 'created_date')
    search_fields = ('title',)
    ordering = ('-created_date',)
    list_editable = ('is_active', 'is_draft')

    def image_thumbnail(self, obj):
        if obj.primary_image:
            return mark_safe(f'<img src="{obj.primary_image.image.url}" width="50" height="50"/>')
        return "-"

    image_thumbnail.short_description = 'Primary Image'


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'is_paid', 'created_date', 'paid_date', 'get_total_price')
    list_filter = ('is_paid', 'created_date')
    search_fields = ('user__username', 'user__email')
    ordering = ('-created_date',)

    def get_total_price(self, obj):
        return obj.get_total_price()

    get_total_price.short_description = 'Total Price'


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'cart', 'product', 'quantity', 'add_date', 'total_price', 'product_image')
    list_filter = ('add_date',)
    search_fields = (
        'product__title', 'cart__user__username', 'cart__user__email', 'cart__user__first_name',
        'cart__user__last_name')
    ordering = ('-add_date',)

    def product_image(self, obj):
        if obj.product.primary_image:
            return mark_safe(f'<img src="{obj.product.primary_image.image.url}" width="50" height="50"/>')
        return "-"

    product_image.short_description = 'Product Image'


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
