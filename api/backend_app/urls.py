from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AppUserViewSet, MusicViewSet, FavoriteViewSet

router = DefaultRouter()
router.register('app-users', AppUserViewSet)
router.register('music', MusicViewSet)
router.register('favorites', FavoriteViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
