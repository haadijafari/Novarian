from django.contrib import admin

from apps.product.models.category import Category


@admin.register(Category)
class ProductCategoryAdmin(admin.ModelAdmin):
    pass
