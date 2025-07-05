import random
from django.core.cache import cache

from core.settings.base import DEBUG

def generate_code():
    return str(random.randint(100000, 999999))

def send_email_verification_code(email):
    code = generate_code()
    cache.set(f'verify_email:{email}', code, timeout=2 * 60)  # expires in 2 minutes
    if DEBUG:
        print(f"[DEBUG] Email code for {email}: {code}")  # Replace with real email sending
    else:
        # TODO: Implement real email sending
        pass

def send_phone_verification_code(phone):
    code = generate_code()
    cache.set(f'verify_phone:{phone}', code, timeout=2 * 60)
    if DEBUG:
        print(f"[DEBUG] Phone code for {phone}: {code}")  # Replace with real SMS sending
    else:
        # TODO: Implement real SMS sending
        pass