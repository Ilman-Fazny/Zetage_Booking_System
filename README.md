# Zentage Talent Show Booking System

A premium event ticketing system built for the Zentage Talent Show, organized by the Sasnaka Sansada Foundation. 

## Tech Stack
- **Frontend**: React (Vite), Framer Motion, Tailwind CSS
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL, PayHere integration
- **Authentication**: Google OAuth2 + JWT
- **Email**: Resend API

## Setup Instructions

### 1. Database Setup
1. Ensure PostgreSQL is installed and running.
2. Create a database (e.g., `zetage_db`).

### 2. Backend Setup
1. Navigate to the `backend` directory: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements-dev.txt`
5. Copy `.env.example` to `.env` and fill in the required values (Database URL, Google Client ID/Secret, PayHere credentials, Resend API key).
6. Run database migrations: `alembic upgrade head`
7. Seed the initial seat map: `python seed_seats.py`
8. Start the backend server: `uvicorn app.main:app --reload`

### 3. Frontend Setup
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your Google Client ID and API URL.
4. Start the frontend development server: `npm run dev`

## Deployment Stub
- **Backend**: Can be deployed on Render, Heroku, or AWS EC2. Ensure that CORS origins in `app/main.py` are restricted to the production frontend URL.
- **Frontend**: Can be deployed on Vercel or Netlify. Set the appropriate `VITE_API_URL` environment variable during build.
- **Database**: Use a managed PostgreSQL instance (e.g. Supabase, RDS, Render Postgres).

## Environment Variables
Refer to `backend/.env.example` and `frontend/.env.example` for the list of required environment variables.
