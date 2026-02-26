from rest_framework import serializers
from django.contrib.auth import get_user_model
from base.models import Room, Topic, Message

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'bio', 'avatar']
        read_only_fields = ['id']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'name']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords don't match"})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data.get('name', '')
        )
        return user


class TopicSerializer(serializers.ModelSerializer):
    room_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Topic
        fields = ['id', 'name', 'room_count']
    
    def get_room_count(self, obj):
        return obj.room_set.count()


class MessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Message
        fields = ['id', 'user', 'user_id', 'room', 'body', 'created', 'updated']
        read_only_fields = ['id', 'created', 'updated']


class RoomSerializer(serializers.ModelSerializer):
    host = UserSerializer(read_only=True)
    topic = TopicSerializer(read_only=True)
    topic_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    participants = UserSerializer(many=True, read_only=True)
    message_count = serializers.SerializerMethodField()
    participant_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Room
        fields = [
            'id', 'host', 'topic', 'topic_id', 'name', 'description',
            'participants', 'message_count', 'participant_count',
            'created', 'updated'
        ]
        read_only_fields = ['id', 'created', 'updated']
    
    def get_message_count(self, obj):
        return obj.message_set.count()
    
    def get_participant_count(self, obj):
        return obj.participants.count()


class RoomDetailSerializer(RoomSerializer):
    messages = MessageSerializer(many=True, read_only=True, source='message_set')
    
    class Meta(RoomSerializer.Meta):
        fields = RoomSerializer.Meta.fields + ['messages']
