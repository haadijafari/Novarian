from django.contrib import admin

from apps.product.models import ProductCategory


@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    pass
