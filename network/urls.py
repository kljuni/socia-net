from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('current_user/', views.current_user),
    path('users/', views.UserList.as_view()),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("api/posts", views.post_list, name="posts"),
    path("api/user/<int:id>", views.view_user, name="user"),
]
