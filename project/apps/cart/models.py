from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import models, transaction
from django.db.models import Sum, F
from django.utils.translation import gettext_lazy as _
from djmoney.money import Money

from apps.product.models import Product

User = get_user_model()


# Todo: Manage No User Carts (Avoid DOS Attack to fill the database)
# Todo: Reduce product stock (After paid)
# Todo: Send confirmation emails (After paid)
# Todo: Update sales metrics (After paid)
class Cart(models.Model):
    user = models.ForeignKey(User, verbose_name=_('User'), on_delete=models.SET_NULL, null=True, related_name='carts')
    is_paid = models.BooleanField(_('Paid Status'), default=False)
    is_deleted = models.BooleanField(_('Deleted'), default=False)
    created_date = models.DateTimeField(_('Created Date'), auto_now_add=True)
    paid_date = models.DateTimeField(_('Paid Date'), null=True, blank=True)
    updated_date = models.DateTimeField(_('Updated Date'), auto_now=True)

    class Meta:
        ordering = ['-paid_date', '-created_date']
        # For large tables, add DB indexes to speed up queries
        indexes = [
            models.Index(fields=['user', 'is_paid']),
            models.Index(fields=['created_date']),
        ]
        verbose_name = _('Cart')
        verbose_name_plural = _('Carts')

    def __str__(self):
        status = "Paid" if self.is_paid else "In Progress"
        user_display = self.user.get_full_name() if self.user else "No User"
        return f'{status} - {user_display}'

    def get_total_price(self):
        result = self.items.aggregate(
            total=Sum(F('product__price') * F('quantity'))
        )
        return result['total'] or Money(0, 'IRR')

    def calculate_tax_price(self):
        return self.get_total_price() * Decimal('0.09')

    def clean(self):
        if not self.is_paid and Cart.objects.filter(user=self.user, is_paid=False).exists():
            raise ValidationError("You already have an unpaid cart.")

    def save(self, *args, **kwargs):
        if not self.pk and not self.is_paid and Cart.objects.filter(user=self.user, is_paid=False).exists():
            raise ValidationError("You already have an unpaid cart.")
        super().save(*args, **kwargs)


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items', verbose_name=_('Cart'))
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name=_('Product'))
    quantity = models.PositiveIntegerField(default=1)
    add_date = models.DateTimeField(_('Add to Cart Date'), auto_now_add=True)

    class Meta:
        ordering = ['-add_date']
        unique_together = ['cart', 'product']
        verbose_name = _('Cart Item')
        verbose_name_plural = _('Cart Items')

    def __str__(self):
        return f'CartItem {self.id}: {self.product.title} x {self.quantity} (Cart {self.cart.id})'

    @property
    def total_price(self):
        return self.product.price * self.quantity

    def save(self, *args, **kwargs):
        with transaction.atomic():
            if not self.product.is_active:
                raise ValidationError("Cannot add inactive product to cart.")
            if self.quantity < 1:
                raise ValidationError("Quantity must be at least 1.")
            super().save(*args, **kwargs)
