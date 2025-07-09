from apps.api.serializers.cart_serializers import CartSerializer
from apps.cart.models import Cart
from apps.utils.permissions import IsOwner, IsSuperUser
from rest_framework import viewsets


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsOwner, IsSuperUser]

    def get_queryset(self):
        # Only return carts belonging to the logged-in user (unless admin)
        if self.request.user.is_superuser:
            return Cart.objects.all()
        return Cart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically assign the logged-in user to the new cart
        serializer.save(user=self.request.user)
