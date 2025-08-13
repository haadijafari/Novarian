from rest_framework.permissions import BasePermission, SAFE_METHODS


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


class ReviewPermission(BasePermission):
    """
    Any authenticated user can create a review.
    Users can edit/delete their own review.
    Staff/admin can edit/delete any review.
    Safe methods (GET, HEAD, OPTIONS) allowed for everyone.
    """

    def has_permission(self, request, view):
        # Allow GET/HEAD/OPTIONS for everyone
        if request.method in SAFE_METHODS:
            return True
        # Any authenticated user can POST a review
        if request.method == 'POST':
            return request.user and request.user.is_authenticated
        # Other methods (PUT, PATCH, DELETE) will check object permissions
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow GET/HEAD/OPTIONS for everyone
        if request.method in SAFE_METHODS:
            return True
        # Staff/admin can edit/delete any review
        if request.user.is_staff or request.user.is_superuser:
            return True
        # Regular user can edit/delete only their own review
        return obj.user == request.user
