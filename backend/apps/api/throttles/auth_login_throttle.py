import hashlib
import logging

from django.core.cache import cache
from rest_framework.throttling import SimpleRateThrottle

logger = logging.getLogger(__name__)


class LoginRateThrottle(SimpleRateThrottle):
    scope = 'login'

    def allow_request(self, request, view):
        # Store request/view for later use in throttle_success
        self.request = request
        self.view = view
        return super().allow_request(request, view)

    def get_cache_key(self, request, view):
        try:
            identifier = request.data.get('email') or request.data.get('phone_number')
        except Exception:
            identifier = None

        if identifier:
            ident_hash = hashlib.md5(identifier.strip().lower().encode()).hexdigest()
            ident = f'login-throttle-{ident_hash}'
        else:
            ip = self.get_ident(request)
            user_agent = request.META.get('HTTP_USER_AGENT', 'unknown').lower()
            ua_hash = hashlib.md5(user_agent.encode()).hexdigest()
            ident = f'login-ip-ua-{ip}-{ua_hash}'

        # Save full cache key for later use in view
        request._login_throttle_cache_key = self.cache_format % {
            'scope': self.scope,
            'ident': ident
        }

        return ident

    def throttle_success(self):
        """
        Called manually to reset throttle on successful login.
        """
        if hasattr(self, 'request') and hasattr(self, 'view'):
            try:
                cache_key = self.get_cache_key(self.request, self.view)
                if cache_key:
                    cache.delete(cache_key)
                    logger.debug(f"[Throttle] Cleared login cache key: {cache_key}")
            except Exception as e:
                logger.warning(f"[Throttle] Failed to clear cache key: {e}")
