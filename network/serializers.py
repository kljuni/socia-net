from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from .models import User, Post, Like, Follower, Comment
import json

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ('id','username')

class MyTokenObtainPairSerializer(TokenObtainPairSerializer): 
    @classmethod 
    def get_token(cls, user): 
        token = super(MyTokenObtainPairSerializer, cls).get_token(user) 
        # Here add custom claims 
        token['username'] = user.username
        token['id'] = user.id
        return token
    

class CustomUserSerializer(serializers.ModelSerializer): 
    """ Currently unused in preference of the below. """ 
    email = serializers.EmailField(required=True) 
    username = serializers.CharField() 
    password = serializers.CharField(min_length=3, write_only=True)

    # image_thumbnail = serializers.CharField()  
    # class Meta: 
    #     model = User 
    #     # fields = ('email', 'username', 'password')
    #     fields = ('id', 'username', 'password', 'email') 
    #     extra_kwargs = {'password': {'write_only': True}} 
    #     def create(self, validated_data): 
    #         password = validated_data.pop('password', None) 
    #         instance = self.Meta.model(**validated_data) 
    #         # as long as the fields are the same, we can just use this 
    #         if password is not None: 
    #             instance.set_password(password) 
    #         instance.save() 
    #         return instance
    def create(self, validated_data): 
            password = validated_data.pop('password', None) 
            instance = self.Meta.model(**validated_data) 
            # as long as the fields are the same, we can just use this 
            if password is not None: 
                instance.set_password(password) 
            instance.save() 
            return instance

    # def get_image_thumbnail(self):
    #     return User.objects.get(pk=self.id).image_thumbnail.name
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'image')

# class UserSerializerWithToken(serializers.ModelSerializer):
#     token = serializers.SerializerMethodField()
#     password = serializers.CharField(write_only=True)

#     def get_token(self, obj):
#         jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
#         jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

#         payload = jwt_payload_handler(obj)
#         token = jwt_encode_handler(payload)
#         return token

#     def create(self, validate_data):
#         password = validate_data.pop('password', None)
#         instance = self.Meta.model(**validate_data)
#         if password is not None:
#             instance.set_password(password)
#         instance.save()
#         return instance

#     class Meta:
#         model = User
#         fields = ('id', 'token', 'username', 'password', 'email')


# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User 
#         fields = ['id', 'username', 'email']

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like 
        fields = ['id', 'liker', 'post']

class PostSerializer(serializers.ModelSerializer):
    like_count = serializers.SerializerMethodField('get_like_count')
    post_author = serializers.SerializerMethodField('get_author')
    isLiked = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'author', 'post_author', 'body', 'like_count', 'timestamp', 'isLiked', 'comments', 'image']

    def get_comments(self, obj):
         comment = Comment.objects.filter(post=obj).order_by('-timestamp')
         serializer = CommentSerializer(comment, many=True)
         return serializer.data

    def get_image(self, obj):
         img = User.objects.get(pk=obj.author.id).image
         imgs = json.dumps(str(img))
         imgs = imgs[1:-1]
         return imgs

    # def get_comments(self, obj):
    #     return Comment.objects.filter(post=obj).exists()

    def get_isLiked(self, obj):
        if self.context.get("user") == 'anonimus':
            return False
        requestUser = self.context['request'].user
        return Like.objects.filter(liker=requestUser, post=obj).exists()

    def update(self, instance, validated_data):
        instance.body = validated_data.get('body', instance.body)
        instance.save()
        return instance

    def get_like_count(self, tweet_post):
        return Like.objects.filter(post=tweet_post).count()

    def get_author(self, tweet_post):
        return User.objects.get(id=tweet_post.author.id).username

# class PostSerializer(serializers.ModelSerializer):
#     like_count = serializers.SerializerMethodField('get_like_count')
#     post_author = serializers.SerializerMethodField('get_author')
#     user_id = serializers.SerializerMethodField('get_user_id')
#     isLiked = serializers.SerializerMethodField()

#     def get_user_id(self, obj):
#         return obj.author.id

#     class Meta:
#         model = Post
#         fields = ['id', 'author' , 'user_id', 'body', 'timestamp', 'like_count', 'post_author', 'isLiked']

#     def get_isLiked(self, obj):
#         requestUser = self.context['request'].user
#         return Like.objects.filter(liker=requestUser, post=obj).exists()

#     def update(self, instance, validated_data):
#         instance.body = validated_data.get('body', instance.body)
#         instance.save()
#         return instance

#     def get_like_count(self, tweet_post):
#         return Like.objects.filter(post=tweet_post).count()

#     def get_author(self, tweet_post):
#         return User.objects.get(id=tweet_post.author.id).username

class FollowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follower 
        fields = ['id', 'follower', 'followed']

class CommentSerializer(serializers.ModelSerializer):
    comment_author = serializers.SerializerMethodField('get_author')

    def get_author(self, tweet_post):
        return User.objects.get(id=tweet_post.author.id).username

    class Meta:
        model = Comment 
        fields = ['id', 'author', 'comment_author', 'post', 'body', 'timestamp']