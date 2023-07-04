from django.db import models

class AppUser(models.Model):
    user_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    twitter_id = models.CharField(max_length=255)
    instagram_id = models.CharField(max_length=255)
    genre_id = models.ForeignKey('Genre', on_delete=models.CASCADE)
    age = models.IntegerField()
    gender = models.IntegerField()

class Genre(models.Model):
    genre_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)

class Favorite(models.Model):
    user_id = models.ForeignKey('AppUser',on_delete=models.CASCADE)
    music_id = models.ForeignKey('Music',on_delete=models.CASCADE)

    class Meta:
        constraints=[
            models.UniqueConstraint(
                fields=["user_id","music_id"],
                name="unique"
            )
        ]
        
class Music(models.Model):
    music_id = models.CharField(primary_key=True,max_length=255)
    title = models.CharField(max_length=255)
    url = models.URLField()
    position_x = models.FloatField()
    position_y = models.FloatField()
    views = models.IntegerField()
    good = models.IntegerField()
    bad = models.IntegerField(null=True)
    comment_count = models.IntegerField()