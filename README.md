# DevilTutor 2.0

This is the Node-only copy of DevilTutor. The previous Flask, LangChain, Python virtual environment, and Python dependency files are not used here.

## Features

- AI tutor chat with per-user conversation memory
- AI viva question generation and answer evaluation
- PDF upload and document Q&A
- Browser speech recognition and text-to-speech
- React/Vite frontend connected to one Express API
- MongoDB Atlas signup and login with protected learning APIs

## Run locally

Create the local environment file and add a valid Gemini API key:

```bash
cp server/.env.example server/.env
```

Then replace `your_gemini_api_key`, `MONGO_URI`, and `JWT_SECRET` in `server/.env`. The MongoDB URI must point to the `DevilTutor` database; user records go into the `deviltutor_users` collection. Credentials are intentionally excluded from this repository.

```bash
cd server
npm install
npm run dev
```

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open <http://localhost:5173>. Vite proxies `/api` to the Express server on port 5050.

## Production build

```bash
cd client
npm run build
cd ../server
npm start
```

Express serves `client/dist`, so only the Node server is required after the frontend is built.

## API routes

- `GET /api/health`
- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/me` (authenticated)
- `POST /api/chat` (authenticated)
- `POST /api/viva/questions` (authenticated)
- `POST /api/viva/evaluate` (authenticated)
- `POST /api/rag/upload` (authenticated, multipart field: `pdf`)
- `POST /api/rag/ask` (authenticated)
