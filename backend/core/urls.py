from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from core.settings.base import DEBUG

if DEBUG:
    from debug_toolbar.toolbar import debug_toolbar_urls
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('', include('apps.frontend.urls')),
    # DRF
    path('api/', include('apps.api.urls')),
    path('api-auth/', include('rest_framework.urls')),
    # DRF Spectacular
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]

if DEBUG:
    urlpatterns += debug_toolbar_urls()

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
