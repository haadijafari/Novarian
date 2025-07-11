from .base import *

ALLOWED_HOSTS = [
    '127.0.0.1',
    'localhost',
]

INTERNAL_IPS = [
    '127.0.0.1',
    'localhost',
]

INSTALLED_APPS += [
    'debug_toolbar',
    'django_extensions',
]

MIDDLEWARE += [
    "debug_toolbar.middleware.DebugToolbarMiddleware",
]

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
MEDIA_URL = '/media/'

STATIC_ROOT = BASE_DIR / 'static'
MEDIA_ROOT = BASE_DIR / 'media'

STATICFILES_DIRS = [
    # BASE_DIR / "apps/frontend/next/src",
]

# reCaptcha
SILENCED_SYSTEM_CHECKS = ['captcha.recaptcha_test_key_error']

# Cros Origin Settings
CORS_ALLOWED_ORIGINS = [
    # 'http://localhost:3000',
    # 'http://127.0.0.1:3000',
]

# Get Redis host from environment variable, default to '127.0.0.1' for local development
REDIS_HOST = os.getenv('REDIS_HOST', '127.0.0.1')

CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': f'redis://{REDIS_HOST}:6379/1',
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "COMPRESSOR": "django_redis.compressors.zlib.ZlibCompressor",
        }
    }
}
