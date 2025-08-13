import hashlib

from django.core.cache import cache
from django.db.models import F
from django.db.models import Q, Count
from rapidfuzz import fuzz
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.api.serializers.product_serializers import ProductSerializer, CategorySerializer
from apps.api.serializers.question_answer_serializers import QuestionAnswerSerializer
from apps.api.serializers.review_serializers import ReviewSerializer
from apps.product.models import Product, ProductCategory, QuestionAnswer
from apps.product.models.review import Review
from apps.utils.permissions import ProductPermission, QuestionAnswerPermission
from apps.utils.permissions import ReviewPermission


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.active.all()
    serializer_class = ProductSerializer
    permission_classes = [ProductPermission]

    def retrieve(self, request, *args, **kwargs):
        product = self.get_object()

        # Get visitor IP
        ip = request.META.get('HTTP_X_FORWARDED_FOR')
        if ip:
            ip = ip.split(',')[0]  # first IP in the list
        else:
            ip = request.META.get('REMOTE_ADDR')

        # Hash ip for privacy
        ip_hash = hashlib.sha256(ip.encode()).hexdigest()
        # Unique cache key per product per IP
        cache_key = f'product_{product.id}_viewed_by_{ip_hash}'

        # Only increment if this IP hasn't viewed in the last 24 hours
        if not cache.get(cache_key):
            # Atomic increment
            Product.objects.filter(id=product.id).update(view_count=F('view_count') + 1)
            cache.set(cache_key, True, 60 * 60 * 24)  # expire after 1 day

        # Refresh the object so that the serializer has the updated view_count
        product.refresh_from_db()

        serializer = self.get_serializer(product)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def similar(self, request, pk=None):
        product = self.get_object()
        similar_products = product.get_similar_products(limit=10)
        serializer = self.get_serializer(similar_products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('search', '').strip()
        category = request.query_params.get('category')
        tags = request.query_params.getlist('tags')  # ?tags=tag1&tags=tag2
        ordering = request.query_params.get('ordering', '-published_date')

        qs = Product.active.all()

        # Title/description search (broad DB filter)
        if query:
            qs = qs.filter(
                Q(title__icontains=query) |
                Q(short_description__icontains=query) |
                Q(description__icontains=query)
            )

        # Filter by category ID or name
        if category:
            try:
                category_id = int(category)
                qs = qs.filter(
                    Q(category__id=category_id) |
                    Q(category__title__iexact=category)
                )
            except ValueError:
                # Not a number, filter only by title
                qs = qs.filter(category__title__iexact=category)

        # Filter by multiple tags
        if tags:
            qs = qs.filter(tags__name__in=tags).annotate(tag_count=Count('tags')).order_by('-tag_count')

        # Apply ordering (only if it's allowed)
        allowed_orderings = [
            '-rating', 'rating',
            '-price_amount', 'price_amount',
            '-published_date', 'published_date'
        ]
        if ordering in allowed_orderings:
            qs = qs.order_by(ordering)

        qs = qs.distinct()

        # If query exists, rank results by fuzzy match
        if query:
            qs = sorted(
                qs,
                key=lambda p: fuzz.token_sort_ratio(p.title, query),
                reverse=True
            )

        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class ProductCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProductCategory.active.all()
    serializer_class = CategorySerializer
    permission_classes = [ProductPermission]


class QuestionAnswerViewSet(viewsets.ModelViewSet):
    queryset = QuestionAnswer.objects.filter(is_active=True)
    serializer_class = QuestionAnswerSerializer
    permission_classes = [QuestionAnswerPermission]


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.filter(is_active=True)
    serializer_class = ReviewSerializer
    permission_classes = [ReviewPermission]

    def perform_create(self, serializer):
        # Automatically mark as inactive (needs admin approval)
        serializer.save(is_active=False)
