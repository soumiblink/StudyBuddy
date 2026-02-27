# 🎓 StudyBud

A modern, real-time study room platform where students connect, collaborate, and learn together. Built with Django REST Framework and Next.js with enterprise-grade security and features.

![StudyBud](https://img.shields.io/badge/Django-6.0-green) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-blue) ![API](https://img.shields.io/badge/API-v1-orange)

## ✨ Features

### Core Features
- 🔐 **JWT Authentication** - Secure user registration and login
- 📧 **Email Verification** - Account verification via email
- 🔑 **Password Reset** - Secure password recovery
- 💬 **Real-time Chat** - WebSocket-powered instant messaging
- 🏠 **Study Rooms** - Create and join topic-based study rooms
- 👥 **User Profiles** - Customizable profiles with bio
- 🔍 **Search & Filter** - Find rooms by name or topic
- 📱 **Responsive Design** - Beautiful UI that works on all devices

### Security Features
- 🛡️ **Rate Limiting** - Protection against abuse (5 login attempts/min, 3 registrations/hour)
- 🔒 **CORS Whitelist** - Controlled cross-origin access
- 🎯 **CSP Headers** - Content Security Policy protection
- 🔐 **Secure Sessions** - HTTPOnly, Secure, SameSite cookies
- ✅ **Password Validation** - Strong password requirements (min 8 chars)
- 🚫 **XSS Protection** - Multiple layers of security

### API Features
- 📚 **API Documentation** - Interactive Swagger UI and ReDoc
- 🔢 **API Versioning** - Clean `/api/v1/` structure
- 📄 **Pagination** - Efficient data loading (20 items/page)
- 🔍 **Filtering & Search** - Advanced query capabilities
- ⚡ **Rate Limiting** - 1000 requests/hour per user
- 📊 **OpenAPI Schema** - Auto-generated API documentation

### Developer Experience
- 🎨 **Modern UI** - Gradient designs with glassmorphism
- 📝 **Comprehensive Docs** - Setup guides and API documentation
- 🔧 **Easy Setup** - Simple environment configuration
- 📦 **Production Ready** - Security and performance optimized

## 🚀 Quick Start

> **📖 For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Install dependencies**
```bash
pip install -r requirements.txt
```

2. **Configure environment**

Create a `.env` file:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
FRONTEND_URL=http://localhost:3000
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

3. **Setup database**
```bash
mkdir logs
python manage.py migrate
python manage.py createsuperuser  # Optional
```

4. **Run server**
```bash
python manage.py runserver
```

Backend: `http://localhost:8000`  
API Docs: `http://localhost:8000/api/v1/docs/`

### Frontend Setup

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Configure environment**

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. **Run development server**
```bash
npm run dev
```

Frontend: `http://localhost:3000`

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
- **Django-allauth** - OAuth2 (Google, GitHub)
- **Django-ratelimit** - Rate limiting
- **Django-CSP** - Content Security Policy
- **drf-spectacular** - API documentation
- **SQLite** - Database (development)

### Frontend
- **Next.js 14** - React framework (App Router)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **WebSocket API** - Real-time communication

### Security
- JWT token authentication
- Rate limiting on all endpoints
- CORS whitelist
- CSP headers
- Secure session management
- Password strength validation
- Email verification
- Password reset functionality

## 📚 API Documentation

The API is fully documented and interactive!

- **Swagger UI**: http://localhost:8000/api/v1/docs/
- **ReDoc**: http://localhost:8000/api/v1/redoc/
- **OpenAPI Schema**: http://localhost:8000/api/v1/schema/

### Main Endpoints

#### Authentication (`/api/v1/auth/`)
- `POST /register/` - Register new user
- `POST /login/` - Login and get tokens
- `POST /token/refresh/` - Refresh access token
- `POST /password-reset/` - Request password reset
- `POST /password-reset/confirm/` - Confirm password reset
- `POST /email-verify/` - Verify email address
- `POST /email-verify/resend/` - Resend verification email

#### Rooms (`/api/v1/rooms/`)
- `GET /` - List all rooms (paginated, searchable)
- `POST /` - Create new room
- `GET /{id}/` - Get room details
- `PUT /{id}/` - Update room
- `DELETE /{id}/` - Delete room
- `POST /{id}/join/` - Join room
- `POST /{id}/leave/` - Leave room

#### Messages (`/api/v1/messages/`)
- `GET /` - List messages (filter by room/user)
- `POST /` - Send message
- `GET /{id}/` - Get message details
- `PUT /{id}/` - Update message
- `DELETE /{id}/` - Delete message

#### Topics (`/api/v1/topics/`)
- `GET /` - List all topics
- `POST /` - Create topic
- `GET /{id}/` - Get topic details

#### WebSocket
- `ws://localhost:8000/ws/chat/{room_id}/` - Real-time chat

### Rate Limits
- **Anonymous**: 100 requests/hour
- **Authenticated**: 1000 requests/hour
- **Login**: 5 attempts/minute
- **Registration**: 3 attempts/hour
- **Password Reset**: 3 attempts/hour

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

> **📖 For detailed deployment instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md#-production-deployment)**

### Key Production Changes

1. **Environment Variables**
```env
DEBUG=False
SECRET_KEY=generate-new-secure-key
ALLOWED_HOSTS=your-domain.com
FRONTEND_URL=https://your-frontend.com
```

2. **Database**: Switch to PostgreSQL
3. **Static Files**: Run `python manage.py collectstatic`
4. **Server**: Use Gunicorn/Daphne with Nginx
5. **HTTPS**: Enable SSL certificates
6. **Email**: Configure production email service

### Recommended Services
- **Backend**: AWS EC2, DigitalOcean, Heroku
- **Frontend**: Vercel, Netlify
- **Database**: AWS RDS, DigitalOcean Managed Database
- **Email**: SendGrid, Mailgun, AWS SES
- **Monitoring**: Sentry, DataDog

## 📝 Documentation

- **[README.md](README.md)** - This file, project overview
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup instructions
- **[API_GUIDE.md](API_GUIDE.md)** - Complete API documentation
- **[ROADMAP.md](ROADMAP.md)** - Development roadmap and future features
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What's been implemented

## 🗺️ Roadmap

See [ROADMAP.md](ROADMAP.md) for the complete development roadmap.

### ✅ Completed (Phase 1)
- JWT Authentication with email verification
- Password reset functionality
- Rate limiting and security headers
- API versioning and documentation
- Real-time WebSocket chat
- Modern responsive UI
- Pagination and filtering

### 🚧 In Progress (Phase 2)
- Typing indicators
- Online/offline status
- Message reactions
- File sharing
- Dark mode

### 📋 Planned (Phase 3+)
- Video/audio calling (WebRTC)
- Screen sharing
- Study analytics
- Mobile app
- AI-powered features

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint/Prettier for TypeScript/React
- Write tests for new features
- Update documentation
- Keep commits atomic and descriptive

## 🐛 Troubleshooting

### Common Issues

**Backend won't start**
- Check if port 8000 is available
- Verify all dependencies are installed
- Check `.env` file exists and is configured

**Frontend can't connect to API**
- Verify backend is running
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check CORS settings in backend

**Emails not sending**
- Verify email credentials in `.env`
- For Gmail, use App Password (not regular password)
- Check spam folder

For more troubleshooting, see [SETUP_GUIDE.md](SETUP_GUIDE.md#-troubleshooting)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Built with ❤️ for the developer community

## 🙏 Acknowledgments

- Django and Django REST Framework teams
- Next.js and Vercel teams
- The open-source community

---

**Happy Studying! 📚✨**




