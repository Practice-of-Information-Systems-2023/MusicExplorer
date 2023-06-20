from django.contrib import admin

from . models import AppUser,Genre,Favorite,Music

admin.site.register(AppUser)
admin.site.register(Genre)
admin.site.register(Favorite)
admin.site.register(Music)