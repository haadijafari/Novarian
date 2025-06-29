from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views.cart_views import CartViewSet
from .views.product_views import ProductViewSet, ProductCategoryViewSet
from .views.authentication_views import LoginAPIViewSet, LogoutAPIViewSet, RegisterViewSet

app_name = 'api'

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', ProductCategoryViewSet, basename='category')
router.register(r'carts', CartViewSet, basename='cart')
router.register(r'login', LoginAPIViewSet, basename='login')
router.register(r'logout', LogoutAPIViewSet, basename='logout')
router.register(r'register', RegisterViewSet, basename='register')

urlpatterns = [
    path('', include(router.urls), name='api'),
]
