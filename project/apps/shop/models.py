from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models, transaction
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from djmoney.models.fields import MoneyField
from djmoney.money import Money

User = get_user_model()


class ActiveProductManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)


class Product(models.Model):
    title = models.CharField(_('Title'), max_length=64, null=False, blank=False, db_index=True)
    price = MoneyField(_('Price'), max_digits=14, decimal_places=2, default_currency='IRR')
    rating = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        validators=[MinValueValidator(Decimal('0.0')), MaxValueValidator(Decimal('5.0'))],
    )
    is_active = models.BooleanField(_('Active Status'), default=True, help_text=_('Turn off for Soft Delete'))
    is_draft = models.BooleanField(_('Draft'), default=True)
    created_date = models.DateTimeField(_('Created Date'), auto_now_add=True)
    modified_date = models.DateTimeField(_('Modified Date'), auto_now=True)
    published_date = models.DateTimeField(_('Published Date'), default=timezone.now)

    objects = models.Manager()
    active = ActiveProductManager()

    class Meta:
        ordering = ['title', 'price']
        verbose_name = _('Product')
        verbose_name_plural = _('Products')

    @property
    def primary_image(self):
        return self.images.filter(is_primary=True).first()

    def __str__(self):
        return self.title

    def delete(self, using=None, keep_parents=False):
        self.is_active = False
        self.save()


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(_('Image'), upload_to='product_images/')
    is_primary = models.BooleanField(_('Primary Image'), default=False)

    class Meta:
        verbose_name = _('Product Image')
        verbose_name_plural = _('Product Images')

    def __str__(self):
        return f"{self.product.title} - {'(Primary)' if self.is_primary else 'Image'}"

    def save(self, *args, **kwargs):
        if self.is_primary:
            # Unset other primary images for this product
            ProductImage.objects.filter(product=self.product, is_primary=True).exclude(pk=self.pk).update(
                is_primary=False)
        super().save(*args, **kwargs)

    # In case someone bypasses the save() method
    def clean(self):
        if self.is_primary:
            qs = ProductImage.objects.filter(product=self.product, is_primary=True)
            if self.pk:
                qs = qs.exclude(pk=self.pk)
            if qs.exists():
                raise ValidationError("Only one image can be primary per product.")


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
