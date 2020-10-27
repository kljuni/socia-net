from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Post, Like, Follower
from .serializers import UserSerializer, UserSerializerWithToken, PostSerializer, LikeSerializer, FollowerSerializer
from django.core.paginator import Paginator

from .models import User
from rest_framework import generics

def index(request):
    return render(request, "network/index.html")

@api_view(['GET'])
def current_user(request):
    """
    Determine the current user by their token, and return their data
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

class UserList(APIView):
    """
    Create a new user. It's called 'UserList' because normally we'd have a get
    method here too, for retrieving a list of all User objects.
    """
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
def view_user(request, id):
    """
    API for providing individual user data for React.
    """
    if request.method == 'GET':
        user = User.objects.get(pk=id)
        user_serializer = UserSerializer(user)
        if user:            
            posts = Post.objects.filter(author=user).order_by('-timestamp')
            followers = Follower.objects.filter(followed=user).count()
            user_following = Follower.objects.filter(follower=user).count()
            try: 
                Follower.objects.get(follower = request.user, followed=user)
                user_follows = True
            except: 
                user_follows = False
            print(posts)
            posts_serializer = PostSerializer(posts, many=True)
            return JsonResponse({
                'user': user_serializer.data,
                'posts': posts_serializer.data,
                'followers': followers,
                'user_following': user_following,
                'user_follows': user_follows
                }, safe=False)
        # If user does not exist return empty JSON
        return JsonResponse(user_serializer.errors, status=400)

@api_view(['GET', 'POST'])
@csrf_exempt
def follow_user(request, action, id):
    """
    API for following or unfollowing users.
    """
    if request.method == 'POST':
        if action == 'follow':
            data = JSONParser().parse(request)
            serializer = FollowerSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                following = True
                return JsonResponse({'following':following}, status=201, safe=False)
            return JsonResponse(serializer.errors, status=400)
        elif action == 'unfollow':
            try:
                Follower.objects.filter(follower = request.user, followed=User.objects.get(pk=id)).delete()
                following = False
                return JsonResponse({'following':following}, status=201, safe=False)
            except: 
                deleted = False          
                return JsonResponse(deleted, status=400, safe=False)

@csrf_exempt
def post_list(request, page):
    """
    List all posts, or create a new post.
    """
    if request.method == 'GET':
        posts = Paginator(Post.objects.all().order_by('-timestamp'), 10) 
        serializer = PostSerializer(posts.page(page), many=True)
        num_pages = posts.num_pages
        return JsonResponse({'data':serializer.data,'num_pages':num_pages}, safe=False)
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = PostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

@api_view(['POST'])
@csrf_exempt
def edit_post(request, id):
    if request.method == 'POST':
        if Post.objects.get(pk=id).author != request.user:
            return JsonResponse({'fail':'yes'}, status=400)
        data = JSONParser().parse(request)
        serializer = PostSerializer(Post.objects.get(pk=id), data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        print(serializer.errors)
        return JsonResponse(serializer.errors, status=400)
