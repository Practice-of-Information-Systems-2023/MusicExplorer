from django.shortcuts import render
from apiclient.discovery import build
from apiclient.errors import HttpError
import json
import os
from os.path import join, dirname
from dotenv import load_dotenv
from .models import AppUser, Genre, Music, Favorite
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Favorite, AppUser, Music
from .serializers import AppUserSerializer, MusicSerializer, FavoriteSerializer
from django.views.decorators.csrf import csrf_protect


dotenv_path = join(dirname(__file__), '.env')
load_dotenv(verbose=True, dotenv_path=dotenv_path)
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')


# お気に入り音楽登録API
@csrf_protect
@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            'music_id': openapi.Schema(type=openapi.TYPE_STRING),
        },
        required=['user_id', 'music_id']
    ),
    responses={
        status.HTTP_201_CREATED: "Created",
        status.HTTP_400_BAD_REQUEST: "Bad Request",
        status.HTTP_404_NOT_FOUND: "Not Found",
    },
)
@api_view(['POST'])
def create_favorite(request):
    if request.method == 'POST':
        get_music_details(request.data.get('music_id'))
        serializer = FavoriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()        
        return Response(status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def get_music_details(music_id): 
    youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

    response = youtube.videos().list(
        part='snippet, statistics',
        id=music_id
    ).execute()

    items = response['items']
    if len(items) > 0:
        video = items[0]
        snippet = video['snippet']
        statistics = video['statistics']
        title = snippet['title']
        url = f'https://www.youtube.com/watch?v={music_id}'
        views = int(statistics['viewCount'])
        likes = int(statistics['likeCount'])
        #dislikes = int(statistics['dislikeCount'])#
        comment_count = int(statistics['commentCount'])

        if Music.objects.filter(music_id=music_id).exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)

        music = Music(
            music_id=music_id,
            title=title,
            url=url,
            views=views,
            good=likes,
            #bad=dislikes,
            position_x=1000000000,
            position_y=3000000000,
            comment_count=comment_count
        )
        music.save()
        return Response(status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


# お気に入り楽曲削除API
@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            'music_id': openapi.Schema(type=openapi.TYPE_STRING),
        },
        required=['user_id', 'music_id']
    ),
    responses={
        status.HTTP_200_OK: "OK",
        status.HTTP_400_BAD_REQUEST: "Bad Request",
        status.HTTP_404_NOT_FOUND: "Not Found",
    },
)
@api_view(['POST'])
def delete_favorite(request):
    if request.method == 'POST':
        serializer = FavoriteSerializer(data=request.data)
        if serializer.is_valid():
            try:
                favorite = Favorite.objects.get(user_id=serializer.validated_data['user_id'], music_id=serializer.validated_data['music_id'])
                favorite.delete()
                return Response(status=status.HTTP_200_OK)
            except Favorite.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            print(serializer.errors) 
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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


# お気に入り楽曲取得API
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
            type=openapi.TYPE_ARRAY,
            items=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'music_id': openapi.Schema(type=openapi.TYPE_STRING),
                    'title': openapi.Schema(type=openapi.TYPE_STRING),
                    'url': openapi.Schema(type=openapi.TYPE_STRING),
                    'position_x': openapi.Schema(type=openapi.TYPE_NUMBER),
                    'position_y': openapi.Schema(type=openapi.TYPE_NUMBER),
                    'views': openapi.Schema(type=openapi.TYPE_INTEGER),
                    'good': openapi.Schema(type=openapi.TYPE_INTEGER),
                    'comment_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                }
            )
        ),
        status.HTTP_400_BAD_REQUEST: "Bad Request"
    },
)
@api_view(['POST'])
def get_favorite_music(request):
    if request.method == 'POST':
        user_id = request.data.get('user_id')
        try:
            favorite_music_ids = Favorite.objects.filter(user_id=user_id).all().values_list('music_id', flat=True)
        except Favorite.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        response = []
        for favorite_music_id in favorite_music_ids:
            try:
                music = Music.objects.get(music_id=favorite_music_id)
            except Music.DoesNotExist:
                pass
            response.append({
                'music_id': favorite_music_id,
                'title': music.title,
                'url': music.url,
                'position_x': music.position_x,
                'position_y': music.position_y,
                'views': music.views,
                'good': music.good,
                'comment_count': music.comment_count,
            })
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
