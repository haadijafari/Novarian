from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied

from apps.api.serializers.cart_serializers import CartSerializer
from apps.cart.models import Cart


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user or request.user.is_staff


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        # Only return carts belonging to the logged-in user (unless admin)
        if self.request.user.is_staff:
            return Cart.objects.all()
        return Cart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically assign the logged-in user to the new cart
        serializer.save(user=self.request.user)
