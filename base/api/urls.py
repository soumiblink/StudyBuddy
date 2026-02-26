from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # API Routes
    path('', views.getRoutes, name='api-routes'),
    
    # Authentication
    path('register/', views.register, name='api-register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User Profile
    path('profile/', views.get_user_profile, name='api-profile'),
    path('profile/update/', views.update_user_profile, name='api-profile-update'),
    path('users/<str:pk>/', views.get_user_by_id, name='api-user-detail'),
    
    # Rooms
    path('rooms/', views.RoomListCreateView.as_view(), name='api-rooms'),
    path('rooms/<str:pk>/', views.RoomDetailView.as_view(), name='api-room-detail'),
    path('rooms/<str:pk>/join/', views.join_room, name='api-room-join'),
    path('rooms/<str:pk>/leave/', views.leave_room, name='api-room-leave'),
    
    # Topics
    path('topics/', views.TopicListCreateView.as_view(), name='api-topics'),
    path('topics/<str:pk>/', views.TopicDetailView.as_view(), name='api-topic-detail'),
    
    # Messages
    path('messages/', views.MessageListCreateView.as_view(), name='api-messages'),
    path('messages/<str:pk>/', views.MessageDetailView.as_view(), name='api-message-detail'),
]
