from django.contrib import admin
from django.utils.html import mark_safe

from .models import Cart, CartItem


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
