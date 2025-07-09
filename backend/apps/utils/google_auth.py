from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.contrib.auth import get_user_model

User = get_user_model()

def authenticate_with_google_token(id_token_str):
    try:
        # Specify the CLIENT_ID of the app that accesses the backend
        idinfo = id_token.verify_oauth2_token(id_token_str, google_requests.Request())

        email = idinfo['email']
        first_name = idinfo.get('given_name', '')
        last_name = idinfo.get('family_name', '')

        user, created = User.objects.get_or_create(email=email, defaults={
            'first_name': first_name,
            'last_name': last_name,
            'is_verified_email': True,
        })

        if created:
            user.set_unusable_password()
            user.save()

        return user
    except ValueError:
        return None
