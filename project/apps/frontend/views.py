from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponseRedirect


def index_view(request, *args, **kwargs):
    """
    In development: Redirect to Next.js dev server
    In production: Render the Next.js app from static files
    """
    if settings.DEBUG:
        # In development, redirect to Next.js dev server
        nextjs_url = f"http://localhost:3000{request.path}"
        return HttpResponseRedirect(nextjs_url)
    else:
        # In production, render the Next.js app
        return render(request, 'index.html')
