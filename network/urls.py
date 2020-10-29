from django.urls import path
from django.conf.urls import url
from rest_framework_simplejwt import views as jwt_views

from . import views
from .views import ObtainTokenPairWithColorView, CustomUserCreate, HelloWorldView, LogoutAndBlacklistRefreshTokenForUserView 

urlpatterns = [
    path("", views.index, name="index"),
    path('current_user/', views.current_user),
    path('users/', views.UserList.as_view()),

    path('api/hello/', HelloWorldView.as_view(), name='hello_world'),

    # API Routes
    path('api/token/obtain/', ObtainTokenPairWithColorView.as_view(), name='token_create'), 
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),

    path('api/user/create/', CustomUserCreate.as_view(), name="create_user"),
    path('token/obtain/', ObtainTokenPairWithColorView.as_view(), name='token_create'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),

    path("api/posts/<int:page>", views.post_list, name="posts"),
    path("api/edit/<int:id>", views.edit_post, name="edit"),
    path("api/like/<int:id>", views.like_post, name="like"),
    path("api/user/<int:id>", views.view_user, name="user"),
    path("api/follow/<str:action>/<int:id>", views.follow_user, name="follow"),
    path('api/blacklist/', LogoutAndBlacklistRefreshTokenForUserView.as_view(), name='blacklist'),
    url(r'^.*/$', views.index)
]

# urlpatterns = [ 
#     path('', index_view), # for the empty url 
#     url(r'^.*/$', index_view) # for all other urls 
# ]