from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.api.views.auth_google_login_views import GoogleLoginAPIView
from apps.api.views.auth_login_views import LoginAPIViewSet
from apps.api.views.auth_logout_views import LogoutAPIView
from apps.api.views.auth_register_views import RegisterViewSet
from apps.api.views.auth_reset_password_views import PasswordResetViewSet
from apps.api.views.cart_views import CartViewSet
from apps.api.views.product_views import ProductViewSet, ProductCategoryViewSet
from apps.api.views.verification_views import VerifyAPIView, ResendVerificationCodeAPIView

app_name = 'api'

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', ProductCategoryViewSet, basename='category')
router.register(r'carts', CartViewSet, basename='cart')
router.register(r'login', LoginAPIViewSet, basename='login')
router.register(r'register', RegisterViewSet, basename='register')
router.register(r'password-reset', PasswordResetViewSet, basename='password-reset')

urlpatterns = [
    path('', include(router.urls), name='api'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('verify/', VerifyAPIView.as_view(), name='verify'),
    path('resend-verification/', ResendVerificationCodeAPIView.as_view(), name='resend-verification'),
    path('login/google/', GoogleLoginAPIView.as_view(), name='google-login'),
]
