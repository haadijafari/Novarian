from django.shortcuts import render

from django.urls import reverse
from django.shortcuts import render


def index_view(request):
    urls = {
        "API List": reverse("api:api-root"),
        "Login": reverse("api:login-list"),
        "Registration": reverse("api:register-list"),
        "Logout": reverse("api:logout-list"),
    }
    return render(request, "index.html", {"urls": urls})
