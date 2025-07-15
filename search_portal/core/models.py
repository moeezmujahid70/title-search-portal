from django.db import models
from django.contrib.auth.models import User
import re


class StatusChoice(models.Model):
    name = models.CharField(max_length=50, unique=True,
                            editable=False)  # Auto-generated
    label = models.CharField(max_length=50, unique=True)
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'label']

    def _generate_name_from_label(self):
        """Convert label to API-friendly name"""
        name = self.label.lower()
        # Replace spaces, hyphens, and special chars with underscores
        name = re.sub(r'[^a-z0-9]', '_', name)
        # Remove multiple consecutive underscores
        name = re.sub(r'_+', '_', name)
        # Remove leading/trailing underscores
        name = name.strip('_')
        # Ensure it starts with a letter
        if name and name[0].isdigit():
            name = f'status_{name}'
        return name or 'unnamed_status'

    def _generate_unique_name(self):
        """Generate unique name from label"""
        base_name = self._generate_name_from_label()

        # Handle duplicates by appending numbers
        counter = 1
        name = base_name
        while StatusChoice.objects.filter(name=name).exclude(pk=self.pk).exists():
            name = f"{base_name}_{counter}"
            counter += 1

        return name

    def save(self, *args, **kwargs):
        # Auto-generate name from label if not set or if label changed
        if not self.name:
            self.name = self._generate_unique_name()
        else:
            # Check if label changed and regenerate name
            if self.pk:
                try:
                    old_instance = StatusChoice.objects.get(pk=self.pk)
                    if old_instance.label != self.label:
                        self.name = self._generate_unique_name()
                except StatusChoice.DoesNotExist:
                    pass

        # Ensure only one default status
        if self.is_default:
            StatusChoice.objects.filter(is_default=True).exclude(
                pk=self.pk).update(is_default=False)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.label


class Certificate(models.Model):
    cert_number = models.CharField(max_length=100, unique=True)
    county = models.CharField(max_length=100)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='certificates')
    # STATUS_CHOICES = [
    #     ('in_process', 'In Process'),
    #     ('ready', 'Ready'),
    # ]
    # status = models.CharField(
    #     max_length=30, choices=STATUS_CHOICES, default='in_process')

    status = models.ForeignKey(StatusChoice, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.cert_number} - {self.county} ({self.user.username})"
