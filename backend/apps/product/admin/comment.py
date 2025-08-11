from django.contrib import admin

from apps.product.models import Comment


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    pass
