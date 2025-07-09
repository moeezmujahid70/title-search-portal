from django.db import models


class Certificate(models.Model):
    cert_number = models.CharField(max_length=100, unique=True)
    county = models.CharField(max_length=100)

    STATUS_CHOICES = [
        ('in_process', 'In Process'),
        ('ready', 'Ready'),
    ]
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='in_process')

    created_at = models.DateTimeField(
        auto_now_add=True)  # Set once when created
    updated_at = models.DateTimeField(auto_now=True)      # Updated every save(

    def __str__(self):
        return f"{self.cert_number} - {self.county}"
