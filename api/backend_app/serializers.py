from rest_framework import serializers
from .models import AppUser, Genre, Favorite, Music

class AppUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ['user_id', 'name', 'password', 'twitter_id', 'instagram_id', 'genre_id', 'age', 'gender']

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['genre_id', 'name']

class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ['user_id', 'music_id']

class MusicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Music
        fields = ['music_id', 'title', 'url', 'position_x', 'position_y', 'views', 'good', 'bad', 'comment_count']