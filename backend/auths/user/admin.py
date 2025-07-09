# accounts/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin  # Import default UserAdmin
from django.utils.translation import gettext_lazy as _

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import User


@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    # Use your custom forms for adding and changing users
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm

    # The fields to display in the list view of the admin
    list_display = (
        'phone_number', 'first_name', 'last_name', 'email', 'is_staff', 'is_active', 'is_verified_phone_number',
        'is_verified_email')
    list_filter = ('is_staff', 'is_active', 'is_superuser', 'is_verified_phone_number',
                   'is_verified_email')  # Added is_verified to filter

    # Define the sections and fields for the 'change user' view
    fieldsets = (
        (None, {'fields': ('phone_number', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'email')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_verified_phone_number',
                                       'is_verified_email', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

    # Define the sections and fields for the 'add user' view
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('phone_number', 'first_name', 'last_name', 'email', 'password', 'password2'),
        }),
        (_('Permissions'),
         {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_verified_phone_number', 'is_verified_email', 'groups',
                     'user_permissions')}),
    )

    search_fields = ('phone_number', 'first_name', 'last_name', 'email')
    ordering = ('-date_joined', 'first_name', 'last_name')  # Order by most recently joined user
    filter_horizontal = ('groups', 'user_permissions',)  # For many-to-many fields
