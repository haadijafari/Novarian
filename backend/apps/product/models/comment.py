from decimal import Decimal

from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.product.models.product import Product


class Comment(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='comments')
    user_received_product_image = models.ImageField(
        _('User Received Product Image'),
        upload_to='product_images/comments', null=True, blank=True
    )
    rating = models.DecimalField(
        verbose_name=_('Rating'),
        max_digits=2, decimal_places=1, null=True, blank=True,
        validators=[MinValueValidator(Decimal('0.0')), MaxValueValidator(Decimal('5.0'))],
    )
    description_title = models.CharField(_('Description Title'), max_length=128, null=False, blank=False)
    description = models.TextField(_('Description'), null=False, blank=False)
    is_active = models.BooleanField(
        _('Active Status'), default=False, db_index=True,
        help_text=_('Set True for confirmed comments (Set False for Soft Delete)')
    )
    is_anonymous = models.BooleanField(_('Anonymity Status'),
                                       default=True, help_text=_('User with True is anonymous'))
    is_purchased = models.BooleanField(_('Purchased Status'), default=True,
                                       help_text=_('User purchased the product or not'))
    created_date = models.DateTimeField(_('Created Date'), auto_now_add=True)
    modified_date = models.DateTimeField(_('Modified Date'), auto_now=True)

    class Meta:
        ordering = ['-created_date', 'description_title']
        verbose_name = _('Comment')
        verbose_name_plural = _('Comments')

    def __str__(self):
        return f"{self.product} - {self.description_title}"

    def delete(self, using=None, keep_parents=False):
        self.is_active = False
        self.save()
