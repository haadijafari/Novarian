from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField  # For admin to display password hash
from django.utils.translation import gettext_lazy as _

from auths.user.models import User


class CustomUserCreationForm(forms.ModelForm):
    """
    A form for creating new users in the public-facing signup.
    Includes all the required fields and two password fields for confirmation.
    """
    password = forms.CharField(label=_("Password"), widget=forms.PasswordInput)
    password2 = forms.CharField(label=_("Password confirmation"), widget=forms.PasswordInput)

    class Meta:
        model = User
        # fields should list the fields the user will input.
        # 'email' is included here if you want it on the signup form,
        # even if it's not a REQUIRED_FIELD for createsuperuser.
        fields = ('phone_number', 'first_name', 'last_name', 'email')

    def clean_password2(self):
        """Custom cleaning to ensure passwords match."""
        password = self.cleaned_data.get("password")
        password2 = self.cleaned_data.get("password2")

        if password and password2 and password != password2:
            raise forms.ValidationError(_("Passwords don't match."))
        return password2

    def save(self, commit=True):
        """
        Save the user, handling password hashing.
        """
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user


class CustomUserChangeForm(forms.ModelForm):
    """
    A form for updating existing users in the Django admin.
    It replaces the password field with a read-only hash display.
    """
    # This field is read-only and displays the password hash
    password = ReadOnlyPasswordHashField(
        label=_("Password"),
        help_text=_(
            "Raw passwords are not stored, so there is no way to see this "
            "user's password, but you can change the password using "
            "<a href=\"../password/\">this form</a>."
        ),
    )

    class Meta:
        model = User
        # List all fields that should be editable in the admin
        fields = (
            'phone_number', 'first_name', 'last_name', 'email',
            'is_active', 'is_staff', 'is_superuser', 'is_verified_phone_number', 'is_verified_email',
            'groups', 'user_permissions',
            'last_login', 'date_joined', 'password'  # Password field is handled by ReadOnlyPasswordHashField
        )
        # You might use 'exclude' if you have many fields and only want to hide a few.

    def clean_password(self):
        # When changing a user in the admin, the password field is read-only.
        # This ensures it's not accidentally changed.
        return self.initial.get("password")
