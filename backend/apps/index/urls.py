from django.urls import path
from apps.index.views import index_view


app_name = 'index'

urlpatterns = [
    path('', index_view, name="index"),
]
