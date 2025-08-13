from django.contrib import admin

from apps.product.models import QuestionAnswer


@admin.register(QuestionAnswer)
class QuestionAnswerAdmin(admin.ModelAdmin):
    list_display = (
        'short_product_title',
        'short_question',
        'short_answer',
        'is_active',
        'created_date',
        'modified_date',
    )
    list_filter = ('is_active', 'created_date', 'modified_date', 'product')
    search_fields = ('question', 'answer', 'product__title')
    ordering = ('product__title', '-created_date')
    readonly_fields = ('created_date', 'modified_date')
    list_editable = ('is_active',)
    fieldsets = (
        (None, {
            'fields': ('product', 'question', 'answer', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_date', 'modified_date'),
        }),
    )

    def short_question(self, obj):
        return obj.question[:50] + ('...' if len(obj.question) > 50 else '')

    short_question.short_description = 'Question'

    def short_answer(self, obj):
        return obj.answer[:50] + ('...' if len(obj.answer) > 50 else '')

    short_answer.short_description = 'Answer'

    def short_product_title(self, obj):
        return obj.product.title

    short_product_title.short_description = 'Product'
