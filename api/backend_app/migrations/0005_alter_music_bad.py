# Generated by Django 3.2.18 on 2023-06-27 08:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_app', '0004_alter_music_music_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='music',
            name='bad',
            field=models.IntegerField(null=True),
        ),
    ]
