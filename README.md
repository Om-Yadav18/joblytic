# Joblytic

AI-powered job recommendation platform with resume parsing, skill-based job matching, application tracking, and Gemini-powered interview practice.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Vite, TailwindCSS, React Router, Axios, Framer Motion |
| Backend | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcryptjs |
| APIs | Adzuna Job Search API, Google Gemini |

## Project Structure

```
joblytic/
├── server/                 # Express API
│   ├── config/             # DB connection
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
├── src/                    # React frontend
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   └── utils/
└── public/
```

## Prerequisites

- Node.js 18+
- MongoDB Atlas cluster
- (Optional) Adzuna API App ID and Key for [Adzuna Job Search API](https://developer.adzuna.com/)
- (Optional) Google Gemini API key

Without API keys, the app uses realistic dummy jobs and fallback interview Q&A.

## Setup

### 1. Clone and install

```bash
# Backend
cd server
cp .env.example .env
npm install

# Frontend (from project root)
cd ..
cp .env.example .env
npm install
```

### 2. Configure environment

**server/.env**

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/joblytic
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
RAPIDAPI_KEY=your_rapidapi_key
GEMINI_API_KEY=your_gemini_key
```

**Root .env** (frontend)

```env
VITE_API_URL=
```

Leave `VITE_API_URL` empty for local dev — Vite proxies `/api` to `http://localhost:5000`.

### 3. Run locally

```bash
# Terminal 1 — API
cd server
npm run dev

# Terminal 2 — UI
npm run dev
```

- Frontend: http://localhost:5173  
- API health: http://localhost:5000/api/health  

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/user/profile` | Get profile (auth) |
| PUT | `/api/user/profile` | Update profile (auth) |
| POST | `/api/resume/upload` | Upload PDF resume (auth) |
| GET | `/api/jobs/recommended` | Skill-based jobs (auth) |
| GET | `/api/jobs/search` | Search by keyword/location (auth) |
| POST | `/api/jobs/save/:id` | Save job (auth) |
| DELETE | `/api/jobs/save/:id` | Unsave job (auth) |
| POST | `/api/jobs/apply/:id` | Track application (auth) |
| PATCH | `/api/jobs/apply/:id/status` | Update status (auth) |
| POST | `/api/ai/interview` | Generate/evaluate interview (auth) |

## API Testing (Postman / curl)

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"secret12\"}"
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"secret12\"}"
```

Save the `token` from the response.

### Get profile

```bash
curl http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Search jobs

```bash
curl "http://localhost:5000/api/jobs/search?keyword=react&location=remote" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### AI interview — generate questions

```bash
curl -X POST http://localhost:5000/api/ai/interview \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"generate\",\"role\":\"Frontend Developer\"}"
```

### AI interview — evaluate

```bash
curl -X POST http://localhost:5000/api/ai/interview \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"evaluate\",\"role\":\"Frontend Developer\",\"questions\":[\"Q1?\"],\"answers\":[\"My answer\"]}"
```

## Deployment

### Backend — Render

1. Push repo to GitHub.
2. Create a **Web Service** on [Render](https://render.com).
3. Root directory: `server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables from `server/.env.example`.
7. Note your Render URL (e.g. `https://joblytic-api.onrender.com`).

### Frontend — Vercel

1. Import the repo on [Vercel](https://vercel.com).
2. Framework preset: **Vite**
3. Root directory: `.` (project root)
4. Build command: `npm run build`
5. Output directory: `dist`
6. Environment variable:
   - `VITE_API_URL` = your Render API URL (e.g. `https://joblytic-api.onrender.com`)
7. Update `CLIENT_URL` on Render to your Vercel URL.

## Features

- JWT authentication with protected routes
- User profile (skills, education, experience, LinkedIn)
- PDF resume upload and skill extraction
- Adzuna job fetch with keyword matching scores
- Save / apply tracking with status updates
- AI interview (5 questions + scored feedback via Gemini)
- Dark glassmorphism UI with Framer Motion

## License

MIT
