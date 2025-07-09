from django.urls import path
from .views import CustomLoginView, LogoutView, CertificateListView, CustomTokenRefreshView

urlpatterns = [
    path('login/', CustomLoginView.as_view(), name='login'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('certificates/', CertificateListView.as_view(), name='cert-list'),
]
