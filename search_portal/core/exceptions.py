from rest_framework.views import exception_handler
from rest_framework.exceptions import AuthenticationFailed, NotAuthenticated, ValidationError
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken, TokenError
from django.core.exceptions import PermissionDenied
from django.http import Http404


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    custom_response = {
        "status_code": None,
        "error": True,
        "message": "Something went wrong.",
        "details": []
    }

    if response is not None:
        custom_response["status_code"] = response.status_code

        # Authentication & token related
        if isinstance(exc, (AuthenticationFailed, NotAuthenticated)):
            custom_response["message"] = str(exc)
        elif isinstance(exc, (InvalidToken, TokenError)):
            custom_response["message"] = "Your session has expired. Please log in again."
        elif isinstance(exc, PermissionDenied):
            custom_response["message"] = "You do not have permission to perform this action."
        elif isinstance(exc, Http404):
            custom_response["message"] = "Resource not found."
        elif isinstance(exc, ValidationError):
            custom_response["message"] = "Validation failed."
            custom_response["details"] = response.data
        else:
            # fallback for other DRF exceptions
            custom_response["message"] = str(exc)

        response.data = custom_response
    else:
        # Exception not handled by DRF - probably a server error
        custom_response["status_code"] = 500
        custom_response["message"] = "Internal server error"
        response = response(custom_response, status=500)

    return response
