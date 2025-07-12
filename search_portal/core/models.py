from django.db import models
from django.contrib.auth.models import User


class Certificate(models.Model):
    cert_number = models.CharField(max_length=100, unique=True)
    county = models.CharField(max_length=100)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='certificates')
    STATUS_CHOICES = [
        ('in_process', 'In Process'),
        ('ready', 'Ready'),
    ]
    status = models.CharField(
        max_length=30, choices=STATUS_CHOICES, default='in_process')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.cert_number} - {self.county} ({self.user.username})"
