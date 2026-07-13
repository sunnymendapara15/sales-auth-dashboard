# Backend

## Prerequisites

- Node.js 18 or newer

## Environment variables

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | HTTP port for the API | `5000` |
| `JWT_SECRET` | Secret used to sign JWTs (should be unique per deployment) | *required* |
| `DATABASE_FILE` | File path for the SQLite database | `./data/dev.db` |

## Running locally

```bash
cd backend
cp .env.example .env
npm install
npm start
```

Use `npm run dev` to start the server with `nodemon` for live reload.

The database directory (`./data`) is created automatically on first start.
