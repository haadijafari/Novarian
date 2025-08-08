from django.contrib import admin

from apps.product.models import QuestionAnswer


@admin.register(QuestionAnswer)
class QuestionAnswerAdmin(admin.ModelAdmin):
    pass
