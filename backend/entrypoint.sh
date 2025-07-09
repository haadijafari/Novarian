#!/bin/sh

echo "Making migrations..."
uv run backend/manage.py makemigrations

echo "Applying migrations..."
uv run backend/manage.py migrate

# echo "Collecting static files..."
# uv run core/manage.py collectstatic --noinput

echo "Starting server..."
uv run backend/manage.py runserver 0.0.0.0:8000
