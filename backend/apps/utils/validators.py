from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _

iran_phone_regex = RegexValidator(
    regex=r'^09\d{9}$',
    message=_("Enter a valid Iranian cell phone number (e.g., 09123456789).")
)
