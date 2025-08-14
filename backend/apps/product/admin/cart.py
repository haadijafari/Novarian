from django.contrib import admin
from django.utils.html import mark_safe
from apps.product.models.cart import Cart, CartItem


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user_display', 'is_paid', 'created_date', 'updated_date', 'paid_date', 'display_total_price'
    )
    list_filter = ('is_paid', 'created_date', 'updated_date')
    search_fields = ('user__username', 'user__email', 'user__first_name', 'user__last_name')
    ordering = ('-created_date',)
    readonly_fields = ('created_date', 'updated_date', 'paid_date', 'display_total_price')

    def user_display(self, obj):
        return obj.user.get_full_name() if obj.user else 'No User'
    user_display.short_description = 'User'

    def display_total_price(self, obj):
        total = obj.get_total_price()
        return str(total) if total else '0 IRR'
    display_total_price.short_description = 'Total Price'


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'cart_id', 'product_title', 'quantity', 'add_date', 'display_total_price', 'product_image'
    )
    list_filter = ('add_date',)
    search_fields = (
        'product__title', 'cart__user__username', 'cart__user__email',
        'cart__user__first_name', 'cart__user__last_name'
    )
    ordering = ('-add_date',)
    readonly_fields = ('add_date', 'display_total_price')

    def cart_id(self, obj):
        return obj.cart.id
    cart_id.short_description = 'Cart ID'

    def product_title(self, obj):
        return obj.product.title
    product_title.short_description = 'Product'

    def display_total_price(self, obj):
        return str(obj.total_price)
    display_total_price.short_description = 'Total Price'

    def product_image(self, obj):
        if obj.product.primary_image and hasattr(obj.product.primary_image, 'image'):
            return mark_safe(f'<img src="{obj.product.primary_image.image.url}" width="50" height="50"/>')
        return "-"
    product_image.short_description = 'Product Image'
