from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from rest_framework.parsers import JSONParser
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Post, Like, Follower
from .serializers import PostSerializer, LikeSerializer, FollowerSerializer, CommentSerializer
from django.core.paginator import Paginator
from rest_framework.generics import GenericAPIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import MyTokenObtainPairSerializer, CustomUserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from PIL import Image
from django.core.files.storage import FileSystemStorage
import glob, os

from .models import User
from rest_framework import generics

class ObtainTokenPairWithColorView(TokenObtainPairView): 
    permission_classes = (permissions.AllowAny,) 
    serializer_class = MyTokenObtainPairSerializer

class GetQuestionsAPIView(APIView):
    permission_classes = (permissions.AllowAny,) 
    # permission_classes = [IsAuthenticated,]
    def get(self, request):
            if request.user.is_authenticated:
                print(request.user.username)
                print(request.user)
                return HttpResponse(status=200)
            else:
                return HttpResponse(status=406)


# @csrf_exempt
# def hello(request):
#         if request.method == 'GET':
#             print("hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
#             if request.user.is_authenticated:

#                 print(request.user.username)
#                 return HttpResponse(status=200)
#             else:
#                 return HttpResponse(status=406)

# class HelloWorldView(APIView): 
#     print("--------------------------1111111111111111111111-------------------------------------")
#     def get(self, request): 
#         print("--------------------------2222222222222222222222-------------------------------------")
#         print(request.user)
#         return Response(data={"hello":"world"}, status=status.HTTP_200_OK)

class CustomUserCreate(APIView): 
    permission_classes = (permissions.AllowAny,) 
    authentication_classes = () 
    def post(self, request, format='json'): 
        serializer = CustomUserSerializer(data=request.data) 
        if serializer.is_valid(): 
            user = serializer.save() 
            if user: 
                json = serializer.data 
                return Response(json, status=status.HTTP_201_CREATED) 
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutAndBlacklistRefreshTokenForUserView(APIView): 
    permission_classes = (permissions.AllowAny,) 
    authentication_classes = () 
    print("hello kttttttttttttttttttttty")
    def post(self, request): 
        try: 
            refresh_token = request.data["refresh_token"] 
            token = RefreshToken(refresh_token) 
            token.blacklist() 
            return Response(status=status.HTTP_205_RESET_CONTENT) 
        except Exception as e: 
            return Response(status=status.HTTP_400_BAD_REQUEST)

# class LogoutAndBlacklistRefreshTokenForUserView(APIView): 
#     print(".-------fffftoooooooooooooooooooooooooooo-------------------------------------------------")
#     permission_classes = (permissions.AllowAny,) 
#     authentication_classes = () 
#     @csrf_exempt
#     def post(self, request): 
#         print(".--------------------------------------------------------")
#         try: 
#             refresh_token = request.data["refresh_token"] 
#             token = RefreshToken(refresh_token) 
#             token.blacklist() 
#             return Response(status=status.HTTP_205_RESET_CONTENT) 
#         except Exception as e: 
#             return Response(status=status.HTTP_400_BAD_REQUEST)

# class CustomUserCreate(APIView): 
#     permission_classes = (permissions.AllowAny,) 
    
#     def post(self, request, format='json'):
#         serializer = CustomUserSerializer(data=request.data) 
#         if serializer.is_valid(): 
#             user = serializer.save() 
#             if user: 
#                 json = serializer.data 
#                 return Response(json, status=status.HTTP_201_CREATED) 
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def index(request):
    return render(request, "network/index.html", context=None)

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

class ViewUser(APIView):
    """
    API for providing individual user data for user profile.
    """
    permission_classes = (permissions.AllowAny,)

    def get(self, request, id):
        user = User.objects.get(pk=id)
        user_serializer = CustomUserSerializer(user)
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
            posts_serializer = PostSerializer(posts, context={'request': request}, many=True)
            return JsonResponse({
                'user': user_serializer.data,
                'posts': posts_serializer.data,
                'followers': followers,
                'user_following': user_following,
                'user_follows': user_follows
                }, safe=False)
        # If user does not exist return empty JSON
        return JsonResponse(user_serializer.errors, status=400)

    # if request.method == 'GET':
    #     print(request.user)
    #     user = User.objects.get(pk=id)
    #     user_serializer = UserSerializer(user)
    #     if user:            
    #         posts = Post.objects.filter(author=user).order_by('-timestamp')
    #         followers = Follower.objects.filter(followed=user).count()
    #         user_following = Follower.objects.filter(follower=user).count()
    #         try: 
    #             Follower.objects.get(follower = request.user, followed=user)
    #             user_follows = True
    #         except: 

    #             user_follows = False
    #         print(posts)
    #         posts_serializer = PostSerializer(posts, context={'request': request}, many=True)
    #         return JsonResponse({
    #             'user': user_serializer.data,
    #             'posts': posts_serializer.data,
    #             'followers': followers,
    #             'user_following': user_following,
    #             'user_follows': user_follows
    #             }, safe=False)
    #     # If user does not exist return empty JSON
    #     return JsonResponse(user_serializer.errors, status=400)

class UserImage(APIView):
    permission_classes = [IsAuthenticated,] 
    def put(self, request, id):
        try:
            im = Image.open(request.FILES['image'])
            request.user.image = request.FILES['image']
            print("works 4")
            request.user.save()
            print(request.user.image.url)
            return JsonResponse({'image': request.user.image.url}, status=200, safe=False)
        except:
            return HttpResponse(status=401)


class FollowUser(APIView):
    """
    API for following or unfollowing users.
    """
    permission_classes = [IsAuthenticated,]

    def post(self, request, action, id):
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

# def follow_user(request, action, id):
#     """
#     API for following or unfollowing users.
#     """
#     if request.method == 'POST':
#         if action == 'follow':
#             data = JSONParser().parse(request)
#             serializer = FollowerSerializer(data=data)
#             if serializer.is_valid():
#                 serializer.save()
#                 following = True
#                 return JsonResponse({'following':following}, status=201, safe=False)
#             return JsonResponse(serializer.errors, status=400)
#         elif action == 'unfollow':
#             try:
#                 Follower.objects.filter(follower = request.user, followed=User.objects.get(pk=id)).delete()
#                 following = False
#                 return JsonResponse({'following':following}, status=201, safe=False)
#             except: 
#                 deleted = False          
#                 return JsonResponse(deleted, status=400, safe=False)

# class PostList(APIView):
#     """
#     Create a new user. It's called 'UserList' because normally we'd have a get
#     method here too, for retrieving a list of all User objects.
#     """
#     permission_classes = (permissions.AllowAny,)
#     print("gets to 1 -----------------------------------------------------")
#     def get_serializer_context(self):
#         return {
#             'request': self.request,
#             'format': self.format_kwarg,
#             'view': self
#         }
#     print("gets to 2 -----------------------------------------------------")
#     try:
#         def post(self, request, format=None):
#             """
#             List all posts, or create a new post.
#             """
#             print("gets to 3 -----------------------------------------------------")
#             page = self.kwargs['page']
#             if request.method == 'GET':
#                 posts = Paginator(Post.objects.all().order_by('-timestamp'), 10) 
#                 serializer = PostSerializer(posts.page(page), many=True)
#                 num_pages = posts.num_pages
#                 return JsonResponse({'data':serializer.data,'num_pages':num_pages}, safe=False)
#             elif request.method == 'POST':
#                 data = JSONParser().parse(request)
#                 serializer = PostSerializer(data=data)
#                 if serializer.is_valid():
#                     serializer.save()
#                     return JsonResponse(serializer.data, status=201)
#                 return JsonResponse(serializer.errors, status=400)
#     except Exception as e: 
#         print(e)
#         print("uppppppppppppppppppppppp")
    # def post(self, request, format=None):
    #     serializer = UserSerializerWithToken(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PostList(APIView):
    """
    List all posts, or create a new post.
    """
    permission_classes = (permissions.AllowAny,) 
    def get(self, request, page, follow):
            if True:
            # if request.user.is_authenticated:
                if request.user.is_authenticated and follow == 'follow':
                    posts = Paginator(Post.objects.filter(author__followeds__follower=request.user).order_by('-timestamp'), 10)
                else:
                    posts = Paginator(Post.objects.all().order_by('-timestamp'), 10) 
                if request.user.is_authenticated:
                    serializer = PostSerializer(posts.page(page), context={'request': request}, many=True)
                else: 
                    serializer = PostSerializer(posts.page(page), context={'user': 'anonimus'}, many=True)
                num_pages = posts.num_pages
                return JsonResponse({'data':serializer.data,'num_pages':num_pages}, safe=False)
            else:
                return HttpResponse(status=406)
    def post(self, request, page, follow):
        data = JSONParser().parse(request)
        serializer = PostSerializer(data=data, context={'user': 'anonimus'})
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

def post_list(request, page):
    """
    List all posts, or create a new post.
    """
    if request.method == 'GET':
        posts = Paginator(Post.objects.all().order_by('-timestamp'), 10) 
        print(request.user)
        serializer = PostSerializer(posts.page(page), context={'request': request}, many=True)
        num_pages = posts.num_pages
        return JsonResponse({'data':serializer.data,'num_pages':num_pages}, safe=False)
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = PostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

class LikePost(APIView):
    """
    Like a post.
    """
    permission_classes = [IsAuthenticated,]
    def post(self, request, id):
        data = JSONParser().parse(request)
        serializer = LikeSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'action':'like'}, status=201, safe=False)
        elif Like.objects.get(liker=User.objects.get(pk=request.user.id), post=Post.objects.get(pk=id)).delete():
            return JsonResponse({'action':'deleted'}, status=201, safe=False)
        print(serializer.errors)
        return JsonResponse(serializer.errors, status=400)


# @api_view(['POST'])
# @csrf_exempt
# def like_post(request, id):
#     if request.method == 'POST':
#         print(request.user)
#         data = JSONParser().parse(request)
#         serializer = LikeSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return JsonResponse({'action':'like'}, status=201, safe=False)
#         elif Like.objects.get(post=Post.objects.get(pk=id)).delete():
#             return JsonResponse({'action':'deleted'}, status=201, safe=False)
#         print(serializer.errors)
#         return JsonResponse(serializer.errors, status=400)

class EditPost(APIView):
    permission_classes = [IsAuthenticated,]

    def post(self, request, id):
        if Post.objects.get(pk=id).author != request.user:
            return JsonResponse({'fail':'yes'}, status=400)
        data = JSONParser().parse(request)
        serializer = PostSerializer(Post.objects.get(pk=id), context={'request': request}, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        print(serializer.errors)
        return JsonResponse(serializer.errors, status=400)

class CommentPost(APIView):
    permission_classes = [IsAuthenticated,]

    def post(self, request, id):
        data = JSONParser().parse(request)
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


# def edit_post(request, id):
#     if request.method == 'POST':
#         if Post.objects.get(pk=id).author != request.user:
#             return JsonResponse({'fail':'yes'}, status=400)
#         data = JSONParser().parse(request)
#         serializer = PostSerializer(Post.objects.get(pk=id), data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return JsonResponse(serializer.data, status=201)
#         print(serializer.errors)
#         return JsonResponse(serializer.errors, status=400)
