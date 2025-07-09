# Create your views here.
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Certificate
from .serializers import CertificateSerializer, CustomTokenObtainPairSerializer
from .utils import success_response

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.views import TokenRefreshView
from django.core.paginator import Paginator, EmptyPage
from django.db.models import Q
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


class CertificateListView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Get a paginated, filterable list of certificates",
        manual_parameters=[
            openapi.Parameter(
                'page', openapi.IN_QUERY, description="Page number", type=openapi.TYPE_INTEGER),
            openapi.Parameter(
                'limit', openapi.IN_QUERY, description="Items per page", type=openapi.TYPE_INTEGER),
            openapi.Parameter('status', openapi.IN_QUERY,
                              description="Filter by status (ready or in_process)", type=openapi.TYPE_STRING),
            openapi.Parameter('county', openapi.IN_QUERY,
                              description="Filter by county", type=openapi.TYPE_STRING),
            openapi.Parameter('search', openapi.IN_QUERY,
                              description="Search in cert_number or county", type=openapi.TYPE_STRING),
        ],
        responses={200: CertificateSerializer(many=True)}
    )
    def get(self, request):
        queryset = Certificate.objects.all()

        # 🔍 Filters
        status_param = request.query_params.get('status')
        county_param = request.query_params.get('county')
        search_param = request.query_params.get('search')

        if status_param:
            queryset = queryset.filter(status=status_param)

        if county_param:
            queryset = queryset.filter(county__iexact=county_param)

        if search_param:
            queryset = queryset.filter(
                Q(cert_number__icontains=search_param) |
                Q(county__icontains=search_param)
            )

        # 📄 Pagination
        page = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 10))
        paginator = Paginator(queryset, limit)

        try:
            page_obj = paginator.page(page)
        except EmptyPage:
            return success_response(
                data=[],
                message="No records found for this page.",
                status_code=status.HTTP_204_NO_CONTENT
            )

        serializer = CertificateSerializer(page_obj.object_list, many=True)

        return success_response(
            data={
                "results": serializer.data,
                "total": paginator.count,
                "pages": paginator.num_pages,
                "current_page": page,
                "page_size": limit,
            },
            message="Certificates fetched successfully.",
            status_code=status.HTTP_200_OK
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return success_response(message="Logout successful", status_code=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return success_response(
            data=response.data,
            message="Login successful"
        )


class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = TokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return success_response(
            data=response.data,
            message="Access token refreshed successfully"
        )
