from django.contrib import admin

from apps.product.models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    pass
