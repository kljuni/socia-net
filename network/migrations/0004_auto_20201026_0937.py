# Generated by Django 3.1.2 on 2020-10-26 08:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0003_auto_20201021_1748'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='follower',
            unique_together={('follower', 'followed')},
        ),
    ]