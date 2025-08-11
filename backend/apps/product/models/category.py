from colorfield.fields import ColorField
from django.db import models
from django.utils.translation import gettext_lazy as _


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
