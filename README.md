# Travel Decision Platform (MVP)

Mobile-first MVP for relocation / long stays (1–3 months). The flow is Q&A → Experience Cards → Scenario Search.

## Stack
- Backend: FastAPI + SQLAlchemy + Alembic
- Frontend: Next.js + TypeScript + Tailwind
- Database: PostgreSQL

## Local setup (Docker + Local Frontend)

## Local setup

The easiest way to start on Windows:
1. Double-click **`run.bat`** (or run `./run.bat` in terminal).
2. Alternatively, run `./start.ps1` (may require `Set-ExecutionPolicy`).

This script is intelligent:
1. **With Docker**: If Docker Desktop is running, it starts PostgreSQL and the Backend inside Docker.
2. **Without Docker**: If Docker is NOT running, it sets up a local Python virtual environment and uses **SQLite** for the database.
3. In both cases, it installs frontend dependencies and starts the Frontend locally.

### 1. Backend & DB (Docker)
```bash
docker compose up -d db backend
```

### 2. Frontend (Local)
```bash
cd frontend
npm install
npm run dev
```

Services:
- Frontend: http://localhost:3000
- Backend API + docs: http://localhost:8000/docs

## Environment variables

Backend:
- `DATABASE_URL` (default: `postgresql+psycopg2://postgres:postgres@db:5432/travel_decision`)
- `SECRET_KEY` (JWT signing)
- `ACCESS_TOKEN_EXPIRE_MINUTES` (default: 10080)
- `OTP_EXPIRE_MINUTES` (default: 15)

Frontend:
- `NEXT_PUBLIC_API_URL` (default: `http://localhost:8000`)

## Seed data
On container startup, Alembic migrations run and seed data is inserted:
- Cities: Tbilisi, Istanbul, Dubai, Bangkok, Bali
- Topics: Areas, Housing, Internet/Work, Safety, Transport, Documents, Cost of Living
- Sample admin user: `admin@travel.dev`
- Sample member user: `member@travel.dev`

## API quick start

### Request OTP
```bash
curl -X POST http://localhost:8000/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"member@travel.dev"}'
```

### Verify OTP (dev returns code directly)
```bash
curl -X POST http://localhost:8000/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"member@travel.dev","code":"123456"}'
```

### Create a question
```bash
curl -X POST http://localhost:8000/questions \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "city_id": 1,
    "topic_id": 2,
    "duration": "2 months",
    "budget_tier": "mid",
    "requirements": ["quiet", "good_internet"],
    "question_text": "Looking for a quiet area near cafes and co-working."
  }'
```

### Generate draft summary card
```bash
curl -X POST http://localhost:8000/questions/1/generate-summary \
  -H "Authorization: Bearer <TOKEN>"
```

## Folder structure
```
backend/   # FastAPI + Alembic + seed data
frontend/  # Next.js + Tailwind UI
```
