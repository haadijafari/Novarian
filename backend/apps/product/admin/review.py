from django.contrib import admin
from django.utils.html import format_html

from apps.product.models.review import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = (
        'short_product_title',
        'description_title',
        'short_description',
        'rating',
        'is_active',
        'is_anonymous',
        'is_purchased',
        'created_date',
        'modified_date',
        'preview_image',
    )
    list_filter = ('is_active', 'is_anonymous', 'is_purchased', 'created_date', 'modified_date', 'product')
    search_fields = ('description_title', 'description', 'product__title')
    ordering = ('-created_date', 'description_title')
    readonly_fields = ('created_date', 'modified_date', 'preview_image')
    list_editable = ('is_active', 'is_anonymous', 'is_purchased')

    fieldsets = (
        (None, {
            'fields': (
            'product', 'description_title', 'description', 'rating', 'is_active', 'is_anonymous', 'is_purchased')
        }),
        ('User Image', {
            'fields': ('user_received_product_image', 'preview_image'),
        }),
        ('Timestamps', {
            'fields': ('created_date', 'modified_date'),
        }),
    )

    # Truncate description in list display
    def short_description(self, obj):
        return obj.description[:50] + ('...' if len(obj.description) > 50 else '')

    short_description.short_description = 'Description'

    # Display product title
    def short_product_title(self, obj):
        return obj.product.title

    short_product_title.short_description = 'Product'

    # Display a small preview of the image
    def preview_image(self, obj):
        if obj.user_received_product_image:
            return format_html('<img src="{}" width="50" style="object-fit: cover;"/>',
                               obj.user_received_product_image.url)
        return "-"

    preview_image.short_description = 'Image Preview'
