# StudyBud Frontend

Modern Next.js 14 frontend for StudyBud.

## Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Access

Frontend: http://localhost:3000

## Features

✅ User authentication (login/register)
✅ JWT token management
✅ Protected routes
✅ Dashboard with room list
✅ Search and filter rooms
✅ Create rooms
✅ Modern UI with Tailwind CSS

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Axios for API calls
- JWT authentication

## Project Structure

```
frontend/
├── app/                # Pages
│   ├── login/         # Login page
│   ├── register/      # Register page
│   └── dashboard/     # Dashboard
├── components/        # Reusable components
├── lib/              # Utilities (auth, api)
├── services/         # API services
└── package.json
```

## Next Steps

- Room detail page with chat
- User profile page
- Real-time WebSocket chat
