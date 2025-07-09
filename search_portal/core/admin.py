# Register your models here.
from django.contrib import admin
from .models import Certificate


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ('cert_number', 'county', 'status',
                    'created_at')
    list_editable = ('status',)
    search_fields = ('cert_number', 'county')
    list_filter = ('status',)
