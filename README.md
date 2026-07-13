# Sales Auth Dashboard

This repository contains the implementation for the sales authentication and user management experience that complements the monday.com tickets on the **sunny** board (ID `5029803146`). The following items were created when the work was started:

- **sales login** (`2779922597`)
- **sales signup** (`2779952141`)
- **sales user crud** (`2779975320`)

## Repository structure

- `backend/` – Express + SQLite API providing `/auth` and `/users` endpoints with JWT protection.
- `frontend/` – React (Create React App) client with login, signup, and protected user management views.

## Getting started

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm start
```

The backend listens on `PORT` (default `5000`) and persists data to the SQLite file defined by `DATABASE_FILE`. Stop the server with `Ctrl+C`.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm start
```

If your backend does not run on `http://localhost:5000`, adjust `REACT_APP_API_BASE_URL` in the frontend `.env` file.

## Development tips

- Use `npm run dev` in the backend directory to run with `nodemon`.
- The frontend can be built with `npm run build` or tested with `npm run test` as needed.
- Both apps log meaningful messages to help track API requests and routing issues.
