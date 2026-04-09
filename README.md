# Calendar App

## Project overview

Calendar application with separated frontend and backend.

- Frontend renders calendar UI with month, week, day, and agenda views.
- Backend provides CRUD API for calendar events.
- Main features are create, edit, delete, drag and drop, and resize.

## Tech stack

- React
- Vite
- FullCalendar
- Zustand
- Nest.js
- MongoDB
- Mongoose
- Docker Compose

## Run locally

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run start:dev
```

### Docker

```bash
docker compose up --build
```

## Environment variables

### `frontend/.env`

```env
VITE_API_URL=http://localhost:3001
```

### `backend/.env`

```env
PORT=3001
MONGODB_URI=mongodb://mongo:27017/calendar_db
CLIENT_URL=http://localhost:5173
```

## API endpoints

- `GET /events`
- `POST /events`
- `PATCH /events/:id`
- `DELETE /events/:id`
- `GET /health`

## Architecture decisions

- Frontend and backend are separated into dedicated folders.
- Frontend state management goes through a single calendar store.
- API integration is centralized in `frontend/src/api/eventsApi.js`.
- Drag and drop updates are reverted in UI when request fails.
- Docker Compose runs backend and MongoDB in one network.

## Smoke test checklist

- Create event, event is persisted and visible after refresh.
- Edit event fields, changes remain after refresh.
- Drag and drop updates event time, data remains after refresh.
- Resize updates event end time, data remains after refresh.
- Delete removes event, it does not return after refresh.
- Validation errors are shown for invalid payloads.