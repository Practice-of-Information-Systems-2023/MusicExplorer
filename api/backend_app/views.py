from django.http import JsonResponse
from rest_framework import viewsets
from .models import Favorite, AppUser, Music
from .serializers import AppUserSerializer, MusicSerializer, FavoriteSerializer

class AppUserViewSet(viewsets.ModelViewSet):
    queryset = AppUser.objects.all()
    serializer_class = AppUserSerializer

class MusicViewSet(viewsets.ModelViewSet):
    queryset = Music.objects.all()
    serializer_class = MusicSerializer

class FavoriteViewSet(viewsets.ModelViewSet):
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer

    def create(self, request):
        user_id = request.data.get('user_id')
        music_id = request.data.get('music_id')

        try:
            user = AppUser.objects.get(user_id=user_id)
            music = Music.objects.get(music_id=music_id)
            favorite = Favorite(user_id=user, music_id=music)
            favorite.save()
            return JsonResponse({'status': 'success'})
        except AppUser.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'User not found.'})
        except Music.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Music not found.'})

    def destroy(self, request):
        user_id = request.data.get('user_id')
        music_id = request.data.get('music_id')

        try:
            favorite = Favorite.objects.get(user_id=user_id, music_id=music_id)
            favorite.delete()
            return JsonResponse({'status': 'success'})
        except Favorite.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Favorite not found.'})
