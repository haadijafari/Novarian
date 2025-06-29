from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.mail import send_mail  # Keep this for email_user method
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from apps.utils.validators import iran_phone_regex


class CustomUserManager(BaseUserManager):
    def create_user(self, identifier, password=None, **extra_fields):
        if not identifier:
            raise ValueError("The Email or Phone number must be set")
        
        # Determine if identifier is email or phone
        if "@" in identifier:
            # TODO: Validate Email
            extra_fields['email'] = identifier
        else:
            # TODO: Validate Phone Number
            extra_fields['phone_number'] = identifier
        

        user = self.model(**extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, identifier, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self.create_user(identifier, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    phone_number = models.CharField(
        _("Phone Number"), unique=True, blank=True, null=True,
        validators=[iran_phone_regex], max_length=11,
        help_text=_("Iranian cell phone number like 09123456789."),
        error_messages={
            "unique": _("A user with this phone number already exists."),
        },
    )
    email = models.EmailField(
        _("Email Address"), unique=True, blank=True, null=True,
        # TODO: validators=[EmailValidator()],
        help_text=_("Email address like example@domain.com."),
        error_messages={
            "unique": _("A user with this email address already exists."),
            })
    first_name = models.CharField(_("First Name"), max_length=150, blank=True)
    last_name = models.CharField(_("Last Name"), max_length=150, blank=True)

    is_staff = models.BooleanField(
        _("Staff Status"),
        default=False,
        help_text=_("Designates whether the user can log into this admin site."),
    )
    is_active = models.BooleanField(
        _("Active"),
        default=True,
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
    )
    date_joined = models.DateTimeField(_("Date Joined"), default=timezone.now)

    is_verified_phone_number = models.BooleanField(
        _("Verified Phone Number"),
        default=False,
        help_text=_("Designates whether this user's phone number has been verified."),
    )
    is_verified_email = models.BooleanField(
        _("Verified Email"),
        default=False,
        help_text=_("Designates whether this user's Email has been verified."),
    )

    objects = CustomUserManager()

    USERNAME_FIELD = 'phone_number'
    EMAIL_FIELD = "email"  # Used by Django's email sending functions if needed

    REQUIRED_FIELDS = ['first_name', 'last_name']  # These are prompted for createsuperuser

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")

    def clean(self):
        super().clean()
        if self.email:  # Only normalize if email is provided
            self.email = self.__class__.objects.normalize_email(self.email)

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def get_short_name(self):
        return self.first_name

    def email_user(self, subject, message, from_email=None, **kwargs):
        """Emailing this user."""
        if self.email:  # Only try to send email if an email is present
            send_mail(subject, message, from_email, [self.email], **kwargs)
        else:
            # Optionally log a warning or raise an exception if email is expected but missing
            pass

    def __str__(self):
        if self.first_name and self.last_name:
            return self.get_full_name()
        return str(self.email) or str(self.phone_number)
