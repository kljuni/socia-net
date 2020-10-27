from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('current_user/', views.current_user),
    path('users/', views.UserList.as_view()),

    # API Routes
    path("api/posts/<int:page>", views.post_list, name="posts"),
    path("api/edit/<int:id>", views.edit_post, name="edit"),
    path("api/like/<int:id>", views.like_post, name="like"),
    path("api/user/<int:id>", views.view_user, name="user"),
    path("api/follow/<str:action>/<int:id>", views.follow_user, name="follow"),
]
