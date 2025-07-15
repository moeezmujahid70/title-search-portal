from rest_framework import serializers
from .models import Certificate, StatusChoice
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed


class CertificateSerializer(serializers.ModelSerializer):

    cert_number = serializers.CharField(help_text="Unique certificate number")
    county = serializers.CharField(
        help_text="County where the certificate is issued")
    status = serializers.CharField(source='status.name', read_only=True)
    created_at = serializers.DateTimeField(
        read_only=True, help_text="Date and time the certificate was created")
    updated_at = serializers.DateTimeField(
        read_only=True, help_text="Date and time the certificate was last updated")

    class Meta:
        model = Certificate
        fields = [
            'id',
            'cert_number',
            'county',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class StatusChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusChoice
        fields = ['id', 'name', 'label']
        read_only_fields = ['id', 'name']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        if not self.user.is_active:
            raise AuthenticationFailed("This account is disabled.")

        data.update({
            "username": self.user.username,
            "is_superuser": self.user.is_superuser,
        })

        return data
