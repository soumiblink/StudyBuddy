from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.db.models import Q

from base.models import Room, Topic, Message
from .serializers import (
    RegisterSerializer, UserSerializer, RoomSerializer,
    RoomDetailSerializer, TopicSerializer, MessageSerializer
)

User = get_user_model()


# ==================== AUTHENTICATION ====================

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Register a new user"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """Get current user profile"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    """Update current user profile"""
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_by_id(request, pk):
    """Get user by ID"""
    try:
        user = User.objects.get(id=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


# ==================== ROOMS ====================

class RoomListCreateView(generics.ListCreateAPIView):
    """List all rooms or create a new room"""
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = Room.objects.all()
        
        # Search functionality
        q = self.request.query_params.get('q', '')
        if q:
            queryset = queryset.filter(
                Q(topic__name__icontains=q) |
                Q(name__icontains=q) |
                Q(description__icontains=q)
            )
        
        # Filter by topic
        topic = self.request.query_params.get('topic', '')
        if topic:
            queryset = queryset.filter(topic__name__icontains=topic)
        
        return queryset.select_related('host', 'topic').prefetch_related('participants')
    
    def perform_create(self, serializer):
        room = serializer.save(host=self.request.user)
        room.participants.add(self.request.user)


class RoomDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a room"""
    queryset = Room.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return RoomDetailSerializer
        return RoomSerializer
    
    def get_queryset(self):
        return Room.objects.select_related('host', 'topic').prefetch_related('participants', 'message_set__user')
    
    def perform_update(self, serializer):
        if serializer.instance.host != self.request.user:
            return Response(
                {'error': 'You are not the host of this room'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save()
    
    def perform_destroy(self, instance):
        if instance.host != self.request.user:
            return Response(
                {'error': 'You are not the host of this room'},
                status=status.HTTP_403_FORBIDDEN
            )
        instance.delete()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def join_room(request, pk):
    """Join a room"""
    try:
        room = Room.objects.get(pk=pk)
        room.participants.add(request.user)
        return Response({'message': 'Joined room successfully'})
    except Room.DoesNotExist:
        return Response({'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def leave_room(request, pk):
    """Leave a room"""
    try:
        room = Room.objects.get(pk=pk)
        room.participants.remove(request.user)
        return Response({'message': 'Left room successfully'})
    except Room.DoesNotExist:
        return Response({'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)


# ==================== TOPICS ====================

class TopicListCreateView(generics.ListCreateAPIView):
    """List all topics or create a new topic"""
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = Topic.objects.all()
        q = self.request.query_params.get('q', '')
        if q:
            queryset = queryset.filter(name__icontains=q)
        return queryset


class TopicDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a topic"""
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# ==================== MESSAGES ====================

class MessageListCreateView(generics.ListCreateAPIView):
    """List messages or create a new message"""
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = Message.objects.select_related('user', 'room')
        
        # Filter by room
        room_id = self.request.query_params.get('room', None)
        if room_id:
            queryset = queryset.filter(room_id=room_id)
        
        # Filter by user
        user_id = self.request.query_params.get('user', None)
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        
        return queryset
    
    def perform_create(self, serializer):
        message = serializer.save(user=self.request.user)
        # Add user to room participants
        message.room.participants.add(self.request.user)


class MessageDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a message"""
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def perform_update(self, serializer):
        if serializer.instance.user != self.request.user:
            return Response(
                {'error': 'You can only edit your own messages'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save()
    
    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            return Response(
                {'error': 'You can only delete your own messages'},
                status=status.HTTP_403_FORBIDDEN
            )
        instance.delete()


# ==================== API ROUTES ====================

@api_view(['GET'])
@permission_classes([AllowAny])
def getRoutes(request):
    """Get all available API routes"""
    routes = {
        'Authentication': {
            'POST /api/register/': 'Register a new user',
            'POST /api/token/': 'Get JWT token (login)',
            'POST /api/token/refresh/': 'Refresh JWT token',
            'GET /api/profile/': 'Get current user profile',
            'PUT /api/profile/': 'Update current user profile',
            'GET /api/users/<id>/': 'Get user by ID',
        },
        'Rooms': {
            'GET /api/rooms/': 'List all rooms (supports ?q=search&topic=filter)',
            'POST /api/rooms/': 'Create a new room',
            'GET /api/rooms/<id>/': 'Get room details',
            'PUT /api/rooms/<id>/': 'Update room',
            'DELETE /api/rooms/<id>/': 'Delete room',
            'POST /api/rooms/<id>/join/': 'Join room',
            'POST /api/rooms/<id>/leave/': 'Leave room',
        },
        'Topics': {
            'GET /api/topics/': 'List all topics',
            'POST /api/topics/': 'Create a new topic',
            'GET /api/topics/<id>/': 'Get topic details',
            'PUT /api/topics/<id>/': 'Update topic',
            'DELETE /api/topics/<id>/': 'Delete topic',
        },
        'Messages': {
            'GET /api/messages/': 'List messages (supports ?room=<id>&user=<id>)',
            'POST /api/messages/': 'Create a new message',
            'GET /api/messages/<id>/': 'Get message details',
            'PUT /api/messages/<id>/': 'Update message',
            'DELETE /api/messages/<id>/': 'Delete message',
        }
    }
    return Response(routes)
