from django.urls import path
from django.conf.urls import url
from rest_framework_simplejwt import views as jwt_views
from django.conf import settings
from django.conf.urls.static import static

from . import views
from .views import UserImage, ObtainTokenPairWithColorView, CustomUserCreate, LogoutAndBlacklistRefreshTokenForUserView, GetQuestionsAPIView, PostList, LikePost, EditPost, ViewUser, FollowUser, CommentPost

urlpatterns = [
    path("", views.index, name="index"),
    # path('current_user/', views.current_user),
    # path('users/', views.UserList.as_view()),
    path('api/user/create/', CustomUserCreate.as_view(), name="create_user"),
    path('api/image/<str:source>/<int:id>/', UserImage.as_view(), name="profile_image"),
    path('api/token/obtain/', ObtainTokenPairWithColorView.as_view(), name='token_create'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path("api/posts/<int:page>/<str:follow>/", PostList.as_view(), name="posts"),
    path("api/like/<int:id>/", LikePost.as_view(), name="like"),
    path("api/comment/<int:id>/", CommentPost.as_view(), name="comment"),
    path("api/edit/<int:id>/", EditPost.as_view(), name="edit"),
    path("api/user/<int:id>/", ViewUser.as_view(), name="user"),
    path("api/follow/<str:action>/<int:id>/", FollowUser.as_view(), name="follow"),
    path('api/blacklist/', LogoutAndBlacklistRefreshTokenForUserView.as_view(), name='blacklist'),
    url(r'^.*/$', views.index)
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
