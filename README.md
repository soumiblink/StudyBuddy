# StudyBud

Modern full-stack study room platform with Django REST API and Next.js frontend.

## Architecture

- **Backend**: Django REST API with JWT authentication
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Database**: SQLite (development)
- **API**: RESTful with full CRUD operations

## Features

✅ User authentication (JWT)
✅ Room management (CRUD)
✅ Message system
✅ Topics and filtering
✅ Search functionality
✅ Modern responsive UI
✅ Protected routes
✅ Token auto-refresh

## Quick Setup

### Backend

```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## Access

- **Next.js Frontend**: http://localhost:3000
- **Django API**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin

## Project Structure

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed structure.

## API Documentation

See [API_GUIDE.md](API_GUIDE.md) for complete API documentation.

## Upgrade Progress

- ✅ **Option 1**: Complete REST API with JWT
- ✅ **Option 2**: Modern Frontend (Next.js)
- ✅ **Cleanup**: Removed old templates and unused files
- ⏳ **Option 3**: Real-time WebSocket
- ⏳ **Option 4**: Enhanced Features
- ⏳ **Option 5**: Production Ready

## Tech Stack

**Backend:**
- Django 6.0
- Django REST Framework
- SimpleJWT
- CORS Headers
- SQLite

**Frontend:**
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Axios


