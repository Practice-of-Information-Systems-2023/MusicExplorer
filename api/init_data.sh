#!/bin/bash
rm db.sqlite3 # DBのデータ削除
python manage.py makemigrations
python manage.py migrate
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@example.com', 'admin')" | python manage.py shell # 管理者権限の発行

# 初期データの投入
python manage.py loaddata backend_app/fixtures/init_genre.json
python manage.py loaddata backend_app/fixtures/init_user.json
python manage.py loaddata backend_app/fixtures/init_music.json
python manage.py loaddata backend_app/fixtures/init_favorite.json