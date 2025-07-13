from rest_framework.throttling import SimpleRateThrottle


class FailedLogoutAttemptThrottle(SimpleRateThrottle):
    scope = 'failed_logout'

    def get_cache_key(self, request, view):
        # Use user ID if authenticated, else IP address
        if request.user.is_authenticated:
            ident = str(request.user.pk)
        else:
            ident = self.get_ident(request)
        return self.cache_format % {
            'scope': self.scope,
            'ident': ident
        }
