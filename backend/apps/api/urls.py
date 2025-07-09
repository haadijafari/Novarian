from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views.cart_views import CartViewSet
from .views.product_views import ProductViewSet, ProductCategoryViewSet
from .views.authentication_views import (
    LoginAPIViewSet, LogoutAPIViewSet, RegisterViewSet, GoogleLoginAPIView
)
from .views.verification_views import (
    VerifyEmailAPIView, VerifyPhoneAPIView, ResendVerificationCodeAPIView
)
from .views.reset_password_views import RequestPasswordResetAPIView, ResetPasswordAPIView

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
    path('verify-email/', VerifyEmailAPIView.as_view(), name='verify-email'),
    path('verify-phone/', VerifyPhoneAPIView.as_view(), name='verify-phone'),
    path('resend-verification/', ResendVerificationCodeAPIView.as_view(), name='resend-verification'),
    path('request-password-reset/', RequestPasswordResetAPIView.as_view(), name='request-password-reset'),
    path('reset-password/', ResetPasswordAPIView.as_view(), name='reset-password'),
    path('auth/google/', GoogleLoginAPIView.as_view(), name='google-login'),
]
