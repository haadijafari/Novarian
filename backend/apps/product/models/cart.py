from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import models, transaction
from django.db.models import Sum, F, Case, When, DecimalField
from django.db.models.functions import Cast
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from djmoney.money import Money

from apps.product.models.product import Product

User = get_user_model()


# Todo: Send confirmation emails (After paid)
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
        total = result['total']
        return Money(total, 'IRR') if total else Money(0, 'IRR')

    def get_total_price_with_discount(self):
        result = self.items.aggregate(
            total=Sum(
                Case(
                    When(
                        product__has_discount=True,
                        then=F('product__price') * (
                                Decimal('1') - (
                                    Cast(F('product__discount_percentage'), DecimalField()) / Decimal('100'))
                        )
                    ),
                    default=F('product__price'),
                    output_field=DecimalField()
                ) * F('quantity'),
                output_field=DecimalField()
            )
        )
        total = result['total']
        return Money(total, 'IRR') if total else Money(0, 'IRR')

    def calculate_tax_price(self):
        return self.get_total_price() * Decimal('0.09')

    def checkout_cart(self):
        if self.is_paid:
            raise ValidationError("This cart is already paid.")

        with transaction.atomic():
            # Reduce product stock
            for item in self.items.select_related('product'):
                product = item.product
                if product.quantity < item.quantity:
                    raise ValidationError(f"Not enough stock for {product.title}.")
                product.quantity -= item.quantity
                product.save()

            # Set cart as paid
            self.is_paid = True
            self.paid_date = timezone.now()
            self.save()

            # Todo: Send confirmation email (placeholder)
            # if self.user and self.user.email:
            #     send_mail(
            #         subject="Order Confirmation",
            #         message=f"Thank you for your order, {self.user.get_full_name()}!",
            #         from_email="noreply@yourshop.com",
            #         recipient_list=[self.user.email],
            #         fail_silently=True,
            #     )

            # Update sales metrics (placeholder)
            self.update_sales_metrics()

            # Todo: send notification to admin that an order has been registered

    def update_sales_metrics(self):
        # TODO: Replace with real logic, e.g., update daily/weekly sales reports
        print(f"Updating sales metrics for cart {self.id}")

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

    @property
    def total_price_with_discount(self):
        if self.product.has_discount and self.product.discount_percentage:
            discount_factor = Decimal('1') - (Decimal(self.product.discount_percentage) / Decimal('100'))
            return self.product.price * self.quantity * discount_factor
        return self.total_price

    def save(self, *args, **kwargs):
        with transaction.atomic():
            if not self.product.is_active:
                raise ValidationError("Cannot add inactive product to cart.")
            if self.product.quantity < 1:
                raise ValidationError("Cannot add non-available items to cart.")
            if self.quantity < 1:
                raise ValidationError("Quantity must be at least 1.")
            if self.product.quantity < self.quantity:
                raise ValidationError(f"Only {self.product.quantity} units available for {self.product.title}.")
            super().save(*args, **kwargs)
