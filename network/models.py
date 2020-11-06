from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import date
from django.utils import timezone
from sorl.thumbnail import ImageField, get_thumbnail
from PIL import Image
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill

from django_resized import ResizedImageField

class User(AbstractUser):
    image = ResizedImageField(upload_to='profile_image', blank=True, default='default.jpg')
    image_url = models.URLField(blank=True, default='https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg')

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    body = models.CharField(max_length=140)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author}: {self.body}"

class Like(models.Model):
    liker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likers')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='liked_posts')

    def __str__(self):
        return f"{self.liker} likes post {self.post}"
    
    class Meta:
        unique_together = ('liker', 'post')

class Follower(models.Model):  
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers')
    followed = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followeds')

    class Meta:
        unique_together = ('follower', 'followed')

    def __str__(self):
        return f"{self.follower} follows {self.followed}"

class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='commented_posts')
    body = models.CharField(max_length=140)
    timestamp = models.DateTimeField(auto_now_add=True)