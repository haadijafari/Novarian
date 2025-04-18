from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views.cart_views import CartViewSet
from .views.product_views import ProductViewSet

app_name = 'api'

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'carts', CartViewSet, basename='cart')

urlpatterns = [
    path('', include(router.urls)),
]
