# Register your models here.

from django.contrib.auth.models import Group, Permission
from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from django.contrib import admin
from .models import Certificate, StatusChoice
from django.contrib import admin
from rest_framework_simplejwt.token_blacklist import models as blacklist_models


@admin.register(StatusChoice)
class StatusChoiceAdmin(admin.ModelAdmin):
    list_display = ['label', 'name', 'is_active', 'is_default', 'order']
    list_editable = ['is_active', 'is_default', 'order']

    # Only show fields admin needs to manage
    fields = ['label', 'is_active', 'is_default', 'order']
    readonly_fields = ['name']  # Show but don't allow editing


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ['cert_number', 'county', 'user', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['cert_number', 'county', 'user__username']

    # Optional: Make the form more user-friendly
    fieldsets = (
        ('Certificate Information', {
            'fields': ('cert_number', 'county')
        }),
        ('Assignment', {
            'fields': ('user',)
        }),
        ('Status', {
            'fields': ('status',)
        }),
    )


# Unregister BlacklistedToken and OutstandingToken
admin.site.unregister(blacklist_models.BlacklistedToken)
admin.site.unregister(blacklist_models.OutstandingToken)


admin.site.site_header = "Portal Admin Panel"
# admin.site.site_title = "Your Custom Admin"
admin.site.index_title = "Welcome to Your Admin Panel"


# admin.py - Clean user admin without groups and permissions


# admin.py - Clean user admin without groups and permissions


class CleanUserCreationForm(UserCreationForm):
    """Custom user creation form with only relevant fields"""
    email = forms.EmailField(required=False)
    first_name = forms.CharField(max_length=30, required=False)
    last_name = forms.CharField(max_length=30, required=False)
    is_staff = forms.BooleanField(required=False)

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'is_staff')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.is_staff = self.cleaned_data['is_staff']
        if commit:
            user.save()
        return user


class CleanUserChangeForm(UserChangeForm):
    """Custom user change form without groups and permissions"""
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name',
                  'is_active', 'is_staff', 'is_superuser')


class CleanUserAdmin(UserAdmin):
    form = CleanUserChangeForm
    add_form = CleanUserCreationForm

    # Fields to display in the user list
    list_display = ('username', 'email', 'first_name',
                    'last_name', 'is_active', 'is_staff', 'date_joined')
    list_filter = ('is_active', 'is_staff', 'is_superuser', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('username',)

    # Simplified add form - only essential fields
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2'),
        }),
        ('Personal Info (Optional)', {
            'fields': ('email', 'first_name', 'last_name'),
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff'),
        }),
    )

    # Simplified change form - removed groups and user_permissions
    fieldsets = (
        (None, {
            'fields': ('username', 'password')
        }),
        ('Personal Info (Optional)', {
            'fields': ('first_name', 'last_name', 'email')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser')
        }),
        ('Important Dates', {
            'fields': ('last_login', 'date_joined'),
            'classes': ('collapse',)
        }),
    )

    # Remove the horizontal filter for groups (since we're not using them)
    filter_horizontal = ()

    # Custom actions for bulk operations
    actions = ['activate_users', 'deactivate_users',
               'make_staff', 'remove_staff']

    def activate_users(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} users activated successfully.')
    activate_users.short_description = "Activate selected users"

    def deactivate_users(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(
            request, f'{updated} users deactivated successfully.')
    deactivate_users.short_description = "Deactivate selected users"

    def make_staff(self, request, queryset):
        updated = queryset.update(is_staff=True)
        self.message_user(request, f'{updated} users given staff access.')
    make_staff.short_description = "Give staff access to selected users"

    def remove_staff(self, request, queryset):
        updated = queryset.update(is_staff=False)
        self.message_user(request, f'{updated} users removed from staff.')
    remove_staff.short_description = "Remove staff access from selected users"


# Unregister the default User admin and register our clean version
admin.site.unregister(User)
admin.site.register(User, CleanUserAdmin)

# Optional: If you want to completely hide Groups and Permissions from admin

# Uncomment these lines if you want to remove Groups and Permissions from admin entirely
admin.site.unregister(Group)
# admin.site.unregister(Permission)  # This might cause issues, be careful
