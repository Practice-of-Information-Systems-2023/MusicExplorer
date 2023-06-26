from django.shortcuts import render
from apiclient.discovery import build
from apiclient.errors import HttpError
import json
import os
from os.path import join, dirname
from dotenv import load_dotenv
from .serializers import AppUserSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


# Create your views here.

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(verbose=True, dotenv_path=dotenv_path)
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')

# youtubeからクエリに合致する音楽を検索する
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

        music_list = {}
        for search_result in search_response.get('items', []):
            music_id = search_result['id']['videoId']

            title = search_result['snippet']['title']
            description = search_result['snippet']['description']
            thumbnail_url = search_result['snippet']['thumbnails']['high']['url']
            url = f'https://www.youtube.com/watch?v={music_id}'

            music = {'title': title, 'url': url, 'description': description, 'thumbnail_url': thumbnail_url}
            music_list[music_id] = music

        response = json.dumps(music_list, ensure_ascii=False)
        return Response(response, status=status.HTTP_200_OK)


# ユーザ登録用API
@api_view(['POST'])
def register_user(request):
    if request.method == 'POST':
        serializer = AppUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            user_id = serializer.data['user_id']
            response = {'user_id': user_id}
            return Response(json.dumps(response), status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# テスト用
if __name__ == '__main__':
    print("")