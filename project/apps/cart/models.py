from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import models, transaction
from django.utils.translation import gettext_lazy as _
from djmoney.money import Money

from apps.product.models import Product

User = get_user_model()


class Cart(models.Model):
    user = models.ForeignKey(User, verbose_name=_('User'), on_delete=models.SET_NULL, null=True, related_name='carts')
    is_paid = models.BooleanField(_('Paid Status'), default=False)
    created_date = models.DateTimeField(_('Created Date'), auto_now_add=True)
    paid_date = models.DateTimeField(_('Paid Date'), null=True, blank=True)

    class Meta:
        ordering = ['id']
        verbose_name = _('Cart')
        verbose_name_plural = _('Carts')

    def __str__(self):
        return f'{self.id} - {self.user.get_full_name() if self.user else "No User"} | Total: {self.get_total_price()}'

    def get_total_price(self):
        return sum((item.total_price for item in self.items.select_related('product')), Money(0, 'IRR'))


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    add_date = models.DateTimeField(_('Add to Cart Date'), auto_now_add=True)

    class Meta:
        ordering = ['-add_date']
        unique_together = ['cart', 'product']
        verbose_name = _('Cart Item')
        verbose_name_plural = _('Cart Items')

    @property
    def total_price(self):
        return self.product.price * self.quantity

    def save(self, *args, **kwargs):
        with transaction.atomic():
            if not self.product.is_active:
                raise ValidationError("Cannot add inactive product to cart.")
            super().save(*args, **kwargs)
