from django.shortcuts import render
from apiclient.discovery import build
from apiclient.errors import HttpError
import json
import os
from os.path import join, dirname
from dotenv import load_dotenv
from .models import AppUser, Genre, Music
from .serializers import AppUserSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


# Create your views here.

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(verbose=True, dotenv_path=dotenv_path)
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')

# youtubeからクエリに合致する音楽を検索するAPI
@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'query': openapi.Schema(type=openapi.TYPE_STRING),
        },
        required=['query']
    ),
    responses={
        status.HTTP_200_OK: openapi.Schema(
            type=openapi.TYPE_ARRAY,
            items=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'music_id': openapi.Schema(type=openapi.TYPE_STRING),
                    'title': openapi.Schema(type=openapi.TYPE_STRING),
                    'description': openapi.Schema(type=openapi.TYPE_STRING),
                    'thumbnail_url': openapi.Schema(type=openapi.TYPE_STRING),
                    'url': openapi.Schema(type=openapi.TYPE_STRING),
                }
            )
        ),
    },
)
@api_view(['POST'])
def search_music(request):
    MAX_RESULTS = 10
    if request.method == 'POST':
        query = request.data.get('query')
        print(query)

        youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

        search_response = youtube.search().list(
            q=query,
            part="id,snippet",
            order="viewCount", # 視聴回数順
            type="video",
            videoCategoryId="10",
            maxResults=MAX_RESULTS
        ).execute()

        music_list = []
        for search_result in search_response.get('items', []):
            music_id = search_result['id']['videoId']
            title = search_result['snippet']['title']
            description = search_result['snippet']['description']
            thumbnail_url = search_result['snippet']['thumbnails']['high']['url']
            url = f'https://www.youtube.com/watch?v={music_id}'
            music = {'music_id': music_id, 'title': title, 'url': url, 'description': description, 'thumbnail_url': thumbnail_url}
            music_list.append(music)

        return Response(music_list, status=status.HTTP_200_OK)


# ユーザ登録用API
@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'name': openapi.Schema(type=openapi.TYPE_STRING),
            'password': openapi.Schema(type=openapi.TYPE_STRING),
            'twitter_id': openapi.Schema(type=openapi.TYPE_STRING),
            'instagram_id': openapi.Schema(type=openapi.TYPE_STRING),
            'genre_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            'age': openapi.Schema(type=openapi.TYPE_INTEGER),
            'gender': openapi.Schema(type=openapi.TYPE_INTEGER),
        },
        required=['name', 'password', 'twitter_id', 'instagram_id', 'genre_id', 'age', 'gender']
    ),
    responses={
        status.HTTP_200_OK: openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            }
        ),
        status.HTTP_400_BAD_REQUEST: "Bad Request"
    },
)
@api_view(['POST'])
def register_user(request):
    if request.method == 'POST':
        serializer = AppUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            user_id = serializer.data['user_id']
            response = {"user_id": user_id}
            return Response(response, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ユーザ情報更新用API
@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            'name': openapi.Schema(type=openapi.TYPE_STRING),
            'password': openapi.Schema(type=openapi.TYPE_STRING),
            'twitter_id': openapi.Schema(type=openapi.TYPE_STRING),
            'instagram_id': openapi.Schema(type=openapi.TYPE_STRING),
            'genre_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            'age': openapi.Schema(type=openapi.TYPE_INTEGER),
            'gender': openapi.Schema(type=openapi.TYPE_INTEGER),
        },
        required=['user_id']
    ),
    responses={
        status.HTTP_200_OK: "OK",
        status.HTTP_400_BAD_REQUEST: "Bad Request"
    },
)
@api_view(['POST'])
def update_user(request):
    if request.method == 'POST':
        user_id = request.data.get('user_id')
        try:
            user = AppUser.objects.get(user_id=user_id)
        except AppUser.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if 'name' in request.data:
            user.name = request.data.get('name')
        if 'password' in request.data:
            user.password = request.data.get('password')
        if 'twitter_id' in request.data:
            user.twitter_id = request.data.get('twitter_id')
        if 'instagram_id' in request.data:
            user.instagram_id = request.data.get('instagram_id')
        if 'genre_id' in request.data:
            genre_id = Genre.objects.get(genre_id=request.data.get('genre_id'))
            user.genre_id = genre_id
        if 'age' in request.data:
            user.age = request.data.get('age')
        if 'gender' in request.data:
            user.gender = request.data.get('gender')
        try:
            user.save()
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)


# ユーザ情報取得用API
@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
        },
        required=['user_id']
    ),
    responses={
        status.HTTP_200_OK: openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'name': openapi.Schema(type=openapi.TYPE_STRING),
                'twitter_id': openapi.Schema(type=openapi.TYPE_STRING),
                'instagram_id': openapi.Schema(type=openapi.TYPE_STRING),
                'genre_name': openapi.Schema(type=openapi.TYPE_STRING),
            }
        ),
        status.HTTP_400_BAD_REQUEST: "Bad Request"
    },
)
@api_view(['POST'])
def get_profile(request):
    if request.method == 'POST':
        user_id = request.data.get('user_id')
        try:
            user = AppUser.objects.get(user_id=user_id)
        except AppUser.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            genre_name = Genre.objects.get(genre_id=(user.genre_id).genre_id).name
        except Genre.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        response = {
            'user_id': user.user_id,
            'name': user.name,
            'twitter_id': user.twitter_id,
            'instagram_id': user.instagram_id,
            'genre_name': genre_name,
        }
        return Response(response, status=status.HTTP_200_OK)


# 周囲の楽曲を取得するAPI
@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'x_1': openapi.Schema(type=openapi.TYPE_NUMBER),
            'x_2': openapi.Schema(type=openapi.TYPE_NUMBER),
            'y_1': openapi.Schema(type=openapi.TYPE_NUMBER),
            'y_2': openapi.Schema(type=openapi.TYPE_NUMBER),
        },
        required=['x_1', 'x_2', 'y_1', 'y_2']
    ),
    responses={
        status.HTTP_200_OK: openapi.Schema(
            type=openapi.TYPE_ARRAY,
            items=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'music_id': openapi.Schema(type=openapi.TYPE_STRING),
                    'title': openapi.Schema(type=openapi.TYPE_STRING),
                    'url': openapi.Schema(type=openapi.TYPE_STRING),
                    'position_x': openapi.Schema(type=openapi.TYPE_NUMBER),
                    'position_y': openapi.Schema(type=openapi.TYPE_NUMBER),
                }
            )
        ),
        status.HTTP_400_BAD_REQUEST: "Bad Request"
    },
)
@api_view(['POST'])
def get_surrounding_music(request):
    if request.method == 'POST':
        x_1 = request.data.get('x_1')
        x_2 = request.data.get('x_2')
        y_1 = request.data.get('y_1')
        y_2 = request.data.get('y_2')
        try:
            music_list = Music.objects.filter(
                position_x__range=(x_1, x_2),
                position_y__range=(y_1, y_2),
            ).all()
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        response = []
        for music in music_list:
            response.append({
                'music_id': music.music_id,
                'title': music.title,
                'url': music.url,
                'position_x': music.position_x,
                'position_y': music.position_y,
            })
        return Response(response, status=status.HTTP_200_OK)


# テスト用
if __name__ == '__main__':
    print("")