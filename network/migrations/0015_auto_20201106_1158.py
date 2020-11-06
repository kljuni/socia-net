# Generated by Django 3.1.2 on 2020-11-06 10:58

from django.db import migrations, models
import django_resized.forms


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0014_auto_20201102_1346'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='image_url',
            field=models.URLField(blank=True, default='https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg'),
        ),
        migrations.AlterField(
            model_name='user',
            name='image',
            field=django_resized.forms.ResizedImageField(blank=True, crop=None, default='default.jpg', force_format='JPEG', keep_meta=False, quality=75, size=[170, 170], upload_to='profile_image'),
        ),
    ]
