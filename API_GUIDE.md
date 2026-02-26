# StudyBud API Guide

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run migrations:
```bash
python manage.py migrate
```

3. Create superuser:
```bash
python manage.py createsuperuser
```

4. Run server:
```bash
python manage.py runserver
```

## API Endpoints

Base URL: `http://localhost:8000/api/`

### Authentication

#### Register
```bash
POST /api/register/
{
    "username": "john",
    "email": "john@example.com",
    "password": "password123",
    "password2": "password123",
    "name": "John Doe"
}
```

#### Login (Get Token)
```bash
POST /api/token/
{
    "email": "john@example.com",
    "password": "password123"
}
```

Response:
```json
{
    "refresh": "...",
    "access": "..."
}
```

#### Use Token
Add to headers:
```
Authorization: Bearer <access_token>
```

### Rooms

#### List Rooms
```bash
GET /api/rooms/
GET /api/rooms/?q=python
GET /api/rooms/?topic=django
```

#### Create Room
```bash
POST /api/rooms/
Authorization: Bearer <token>
{
    "name": "Python Study Group",
    "description": "Learn Python together",
    "topic_id": 1
}
```

#### Get Room Details
```bash
GET /api/rooms/1/
```

#### Update Room
```bash
PUT /api/rooms/1/
Authorization: Bearer <token>
{
    "name": "Updated Room Name",
    "description": "Updated description"
}
```

#### Delete Room
```bash
DELETE /api/rooms/1/
Authorization: Bearer <token>
```

#### Join Room
```bash
POST /api/rooms/1/join/
Authorization: Bearer <token>
```

### Messages

#### List Messages
```bash
GET /api/messages/
GET /api/messages/?room=1
GET /api/messages/?user=1
```

#### Create Message
```bash
POST /api/messages/
Authorization: Bearer <token>
{
    "room": 1,
    "body": "Hello everyone!"
}
```

#### Update Message
```bash
PUT /api/messages/1/
Authorization: Bearer <token>
{
    "body": "Updated message"
}
```

#### Delete Message
```bash
DELETE /api/messages/1/
Authorization: Bearer <token>
```

### Topics

#### List Topics
```bash
GET /api/topics/
```

#### Create Topic
```bash
POST /api/topics/
Authorization: Bearer <token>
{
    "name": "Django"
}
```

### User Profile

#### Get Current User
```bash
GET /api/profile/
Authorization: Bearer <token>
```

#### Update Profile
```bash
PUT /api/profile/update/
Authorization: Bearer <token>
{
    "name": "New Name",
    "bio": "My bio"
}
```

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test1234","password2":"test1234","name":"Test User"}'
```

### Login
```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test1234"}'
```

### Get Rooms (with auth)
```bash
curl -X GET http://localhost:8000/api/rooms/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Next Steps

✅ **Option 1 Complete!** You now have:
- Full CRUD API for rooms, messages, topics
- JWT authentication
- User registration and profile management
- Search and filter functionality

Ready for **Option 2: Modern Frontend** or **Option 3: Real-time WebSocket**?
