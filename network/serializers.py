from rest_framework import serializers
from .models import User, Post, Like, Follower

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User 
        fields = ['id', 'username', 'email']

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like 
        fields = ['id', 'liker', 'post']

class PostSerializer(serializers.ModelSerializer):
    like_count = serializers.SerializerMethodField('get_like_count')

    class Meta:
        model = Post 
        fields = ['id', 'author', 'body', 'timestamp', 'like_count']

    def get_like_count(self, tweet_post):
        return Like.objects.filter(post=tweet_post).count()

class FollowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follower 
        fields = ['id', 'follower', 'followed']