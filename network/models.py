from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import date
from django.utils import timezone

class User(AbstractUser):
    pass

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