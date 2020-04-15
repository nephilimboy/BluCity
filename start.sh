#!/bin/bash

# Start Gunicorn processes
echo Starting Django Server...
exec ng serve --host 0.0.0.0 &
#exec  python manage.py runserver 0.0.0.0:8000
exec  python manage.py runserver 0.0.0.0