import uuid
from decimal import Decimal

from ckeditor.fields import RichTextField
from colorfield.fields import ColorField
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.db.models import Q
from django.utils import timezone
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from djmoney.models.fields import MoneyField
from taggit.managers import TaggableManager


class ActiveCategoryManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)


class ProductCategory(models.Model):
    title = models.CharField(_('Title'), max_length=300, db_index=True)
    img = models.ImageField(_('Image'), blank=True, null=True)
    color = ColorField(default='#FFFFFF')
    is_active = models.BooleanField(_('Is Active'), default=False, db_index=True)

    objects = models.Manager()
    active = ActiveCategoryManager()

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _('Category')
        verbose_name_plural = _('Categories')


class ActiveProductManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(
            Q(is_active=True) & Q(published_date__lt=timezone.now())).order_by('-published_date')


class Product(models.Model):
    title = models.CharField(_('Title'), max_length=64, null=False, blank=False, db_index=True)
    category = models.ManyToManyField(ProductCategory, verbose_name=_('Category'),
                                      related_name='product_categories', blank=True)
    price = MoneyField(_('Price'), max_digits=14, decimal_places=2, default_currency='IRR')
    quantity = models.IntegerField(_('Quantity'), default=0,
                                   validators=[MinValueValidator(0)], )
    rating = models.DecimalField(
        max_digits=2, decimal_places=1, null=True, blank=True,
        validators=[MinValueValidator(Decimal('0.0')), MaxValueValidator(Decimal('5.0'))],
    )
    tags = TaggableManager(_('Tags'), blank=True)
    short_description = models.CharField(_('Short Description'), max_length=360, null=True)
    description = RichTextField(_('Full Description'), null=True, blank=True)
    slug = models.SlugField(_('Slug'), default="", null=False, blank=True, db_index=True, max_length=200, unique=True)
    is_active = models.BooleanField(_('Active Status'), default=True, help_text=_('Turn off for Soft Delete'),
                                    db_index=True)
    is_draft = models.BooleanField(_('Draft'), default=True)
    created_date = models.DateTimeField(_('Created Date'), auto_now_add=True)
    modified_date = models.DateTimeField(_('Modified Date'), auto_now=True)
    published_date = models.DateTimeField(_('Published Date'), default=timezone.now, db_index=True)

    objects = models.Manager()
    active = ActiveProductManager()

    class Meta:
        ordering = ['title', 'price']
        verbose_name = _('Product')
        verbose_name_plural = _('Products')

    # def get_absolute_url(self):
    #     return reverse('product:product_details', args=[self.id, self.slug])

    @property
    def primary_image(self):
        return self.images.filter(is_primary=True).first()

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:  # Auto-generate only if empty
            self.slug = slugify(self.title)
            # Ensure uniqueness by appending a random string if needed
            while Product.objects.filter(slug=self.slug).exists():
                self.slug = f"{slugify(self.title)}-{uuid.uuid4().hex[:4]}"
        super().save(*args, **kwargs)

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
