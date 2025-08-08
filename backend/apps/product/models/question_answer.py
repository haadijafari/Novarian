from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.product.models.product import Product


class QuestionAnswer(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='questions_answers')
    question = models.TextField(_('Question'), null=False, blank=False)
    answer = models.TextField(_('Answer'), null=False, blank=False)
    is_active = models.BooleanField(_('Active Status'), default=True, db_index=True)
    created_date = models.DateTimeField(_('Created Date'), auto_now_add=True)
    modified_date = models.DateTimeField(_('Modified Date'), auto_now=True)

    class Meta:
        ordering = ['product__title', '-created_date']
        verbose_name = _('Question & Answer')
        verbose_name_plural = _('Questions & Answers')

    def __str__(self):
        q = self.question.strip()
        a = self.answer.strip()
        return f"Q: {q[:20]}{'...' if len(q) > 20 else ''} | A: {a[:20]}{'...' if len(a) > 20 else ''}"
