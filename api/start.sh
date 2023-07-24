#!/bin/sh
python manage.py runserver 0.0.0.0:3001 &
python /bat/src/set_position.py
