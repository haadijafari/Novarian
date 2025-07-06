from django.shortcuts import redirect

from core.settings.base import DEBUG


def index_view(request, *args, **kwargs):
    if DEBUG:
        return redirect('/api/schema/swagger-ui/')
    else:
        pass
