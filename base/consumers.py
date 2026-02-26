import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Room, Message

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type', 'message')
        
        if message_type == 'message':
            message_body = data['message']
            user_id = data['user_id']
            
            # Save message to database
            message = await self.save_message(user_id, self.room_id, message_body)
            
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message_body,
                    'user_id': user_id,
                    'username': message['username'],
                    'created': message['created'],
                    'message_id': message['id']
                }
            )
    
    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message': event['message'],
            'user_id': event['user_id'],
            'username': event['username'],
            'created': event['created'],
            'message_id': event['message_id']
        }))
    
    @database_sync_to_async
    def save_message(self, user_id, room_id, body):
        user = User.objects.get(id=user_id)
        room = Room.objects.get(id=room_id)
        message = Message.objects.create(user=user, room=room, body=body)
        
        # Add user to room participants if not already
        if user not in room.participants.all():
            room.participants.add(user)
        
        return {
            'id': message.id,
            'username': user.username,
            'created': message.created.isoformat()
        }
