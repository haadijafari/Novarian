import hashlib
from rest_framework.throttling import SimpleRateThrottle


class RegisterRateThrottle(SimpleRateThrottle):
    scope = 'register'

    def get_cache_key(self, request, view):
        # Prefer throttling by email/phone_number if included in request
        try:
            identifier = request.data.get('email') or request.data.get('phone_number')
        except Exception:
            identifier = None
        if identifier:
            return f'register-throttle-{identifier.strip().lower()}'
        
        ident = self.get_ident(request)
        user_agent = request.META.get('HTTP_USER_AGENT', 'unknown').lower()
        # Hash the User-Agent to avoid db overheating
        ua_hash = hashlib.md5(user_agent.encode()).hexdigest()
        return f'register-ip-ua-{ident}-{ua_hash}' # fallback to IP + User-Agent


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
    