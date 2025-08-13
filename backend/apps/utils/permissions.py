from rest_framework.permissions import BasePermission
from rest_framework.permissions import SAFE_METHODS


class IsSuperUser(BasePermission):
    # Checks if the user has permission to access the view as a whole,
    # before any object-specific logic is involved.
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_superuser

    def has_object_permission(self, request, view, obj):
        # Allow if SuperUser to edit
        return request.user and request.user.is_authenticated and request.user.is_superuser


class IsStaffUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff


class IsOwner(BasePermission):
    def has_permission(self, request, view):
        # Only authenticated users can proceed to object-level checks
        return request.user and request.user.is_authenticated

    # Checks if the user has permission to access a specific object.
    def has_object_permission(self, request, view, obj):
        # return obj.user == request.user
        return getattr(obj, "user", None) == request.user


class ProductPermission(BasePermission):
    def has_permission(self, request, view):
        # Allow GET/HEAD/OPTIONS for everyone
        if request.method in SAFE_METHODS:
            return True
        # Other methods only for admins
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow GET/HEAD/OPTIONS for everyone
        if request.method in SAFE_METHODS:
            return True
        # Other methods only for admins or object owner
        return request.user.is_superuser or request.user.is_staff or obj.user == request.user


class QuestionAnswerPermission(BasePermission):
    def has_permission(self, request, view):
        # Allow GET/HEAD/OPTIONS for everyone
        if request.method in SAFE_METHODS:
            return True
        # Other methods only for authenticated users
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow GET/HEAD/OPTIONS for everyone
        if request.method in SAFE_METHODS:
            return True
        # Other methods only for admins
        return request.user.is_superuser or request.user.is_staff
