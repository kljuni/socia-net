# Generated by Django 3.1.2 on 2020-11-02 10:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0008_auto_20201102_1042'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='image',
            field=models.ImageField(blank=True, upload_to='profile_image'),
        ),
    ]