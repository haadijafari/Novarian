import hashlib

from rest_framework.throttling import SimpleRateThrottle


class LoginRateThrottle(SimpleRateThrottle):
    scope = 'login'

    def get_cache_key(self, request, view):
        try:
            identifier = request.data.get('email') or request.data.get('phone_number')
        except Exception:
            identifier = None

        if identifier:
            ident = f'login-throttle-{identifier.strip().lower()}'
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
