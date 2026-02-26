# 🎓 StudyBud

A modern, real-time study room platform where students connect, collaborate, and learn together. Built with Django REST Framework and Next.js.

![StudyBud](https://img.shields.io/badge/Django-6.0-green) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-blue)

## ✨ Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 💬 **Real-time Chat** - WebSocket-powered instant messaging
- 🏠 **Study Rooms** - Create and join topic-based study rooms
- 👥 **User Profiles** - Customizable profiles with bio and avatar
- 🔍 **Search & Filter** - Find rooms by name or topic
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- 🎨 **Modern Interface** - Gradient designs with glassmorphism effects

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd StudyBud
```

2. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
```

4. **Run migrations**
```bash
python manage.py migrate
```

5. **Create a superuser (optional)**
```bash
python manage.py createsuperuser
```

6. **Start the Django server**
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. **Start the development server**
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
StudyBud/
├── base/                      # Django app
│   ├── api/                   # REST API endpoints
│   │   ├── serializers.py     # Data serializers
│   │   ├── views.py           # API views
│   │   └── urls.py            # API routes
│   ├── consumers.py           # WebSocket consumers
│   ├── routing.py             # WebSocket routing
│   ├── models.py              # Database models
│   └── admin.py               # Admin configuration
├── StudyBud/                  # Django project
│   ├── settings/              # Settings modules
│   │   ├── base.py            # Base settings
│   │   ├── dev.py             # Development settings
│   │   └── prod.py            # Production settings
│   ├── asgi.py                # ASGI config (WebSocket)
│   └── urls.py                # Main URL configuration
├── frontend/                  # Next.js frontend
│   ├── app/                   # App router pages
│   │   ├── dashboard/         # Dashboard page
│   │   ├── login/             # Login page
│   │   ├── register/          # Register page
│   │   ├── profile/           # Profile page
│   │   └── rooms/[id]/        # Room chat page
│   ├── components/            # React components
│   ├── lib/                   # Utilities
│   │   ├── api.ts             # API client
│   │   └── auth.ts            # Auth service
│   └── services/              # API services
├── requirements.txt           # Python dependencies
├── manage.py                  # Django management
└── README.md                  # This file
```

## 🛠️ Tech Stack

### Backend
- **Django 6.0** - Web framework
- **Django REST Framework** - API toolkit
- **Django Channels** - WebSocket support
- **Daphne** - ASGI server
- **SimpleJWT** - JWT authentication
- **SQLite** - Database (development)

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **WebSocket API** - Real-time communication

## 📚 API Documentation

The API is fully documented in [API_GUIDE.md](API_GUIDE.md). Here are the main endpoints:

### Authentication
- `POST /api/register/` - Register new user
- `POST /api/login/` - Login and get tokens
- `POST /api/token/refresh/` - Refresh access token

### Rooms
- `GET /api/rooms/` - List all rooms
- `POST /api/rooms/` - Create new room
- `GET /api/rooms/{id}/` - Get room details
- `PUT /api/rooms/{id}/` - Update room
- `DELETE /api/rooms/{id}/` - Delete room

### Messages
- `GET /api/rooms/{id}/messages/` - Get room messages
- `POST /api/messages/` - Send message

### WebSocket
- `ws://localhost:8000/ws/chat/{room_id}/` - Real-time chat

## 🎨 UI Features

- **Modern Gradient Design** - Violet, purple, and fuchsia color scheme
- **Glassmorphism** - Frosted glass effects with backdrop blur
- **Smooth Animations** - Hover effects and transitions
- **Responsive Layout** - Mobile-first design
- **Real-time Updates** - Live connection status indicators

## 🔧 Development

### Running Tests
```bash
# Backend tests
python manage.py test

# Frontend tests
cd frontend
npm test
```

### Code Style
```bash
# Format Python code
black .

# Format TypeScript/React code
cd frontend
npm run lint
```

## 📦 Production Deployment

### Backend

1. Update settings in `StudyBud/settings/prod.py`
2. Set environment variables:
```env
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com
```

3. Collect static files:
```bash
python manage.py collectstatic
```

4. Use a production ASGI server (Daphne with Nginx)

### Frontend

1. Build the production bundle:
```bash
cd frontend
npm run build
```

2. Start the production server:
```bash
npm start
```

Or deploy to Vercel/Netlify for automatic deployments.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Built with ❤️ by [Your Name]

## 🙏 Acknowledgments

- Django and Django REST Framework teams
- Next.js and Vercel teams
- The open-source community

---

**Happy Studying! 📚✨**
