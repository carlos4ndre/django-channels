from django.conf import settings


def custom_cors_middleware(get_response):
    def middleware(request):
        response = get_response(request)
        return _add_cors_to_response(response)
    return middleware


def _add_cors_to_response(response):
    """
    Adds CORS headers for local testing only to allow the frontend, which is served on
    localhost:3000, to access the API, which is served on localhost:8000.
    """
    if settings.DEBUG:
        response['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, OPTIONS, DELETE, HEAD'
        response['Access-Control-Allow-Headers'] = 'Content-Type, X-CSRFToken'
        response['Access-Control-Allow-Credentials'] = 'true'
    return response
