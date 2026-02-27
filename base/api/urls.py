from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from . import views, auth_views

# API v1 URLs
v1_patterns = [
    # API Documentation
    path('schema/', SpectacularAPIView.as_view(), name='api-schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='api-schema'), name='api-docs'),
    path('redoc/', SpectacularRedocView.as_view(url_name='api-schema'), name='api-redoc'),
    
    # API Routes
    path('', views.getRoutes, name='api-routes'),
    
    # Authentication
    path('auth/register/', views.register, name='api-register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='api-login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/password-reset/', auth_views.request_password_reset, name='password-reset-request'),
    path('auth/password-reset/confirm/', auth_views.confirm_password_reset, name='password-reset-confirm'),
    path('auth/email-verify/', auth_views.verify_email, name='email-verify'),
    path('auth/email-verify/resend/', auth_views.resend_verification_email, name='email-verify-resend'),
    
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

urlpatterns = [
    path('v1/', include(v1_patterns)),
]
