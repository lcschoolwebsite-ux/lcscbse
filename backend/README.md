# Loretto Central School — Backend

Node.js/Express REST API backend for the Loretto Central School website.

## Tech Stack
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 4
- **Database:** MongoDB via Mongoose
- **File Uploads:** Cloudinary + Multer
- **Email:** Resend
- **Auth:** Token-based admin auth

## Local Setup

```bash
cd backend
npm install
cp .env.example .env   # Fill in your real values
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and fill in all values. See `.env.example` for reference.

> ⚠️ Never commit `.env` to Git.

## Deployment (Render)

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js`
5. Add all environment variables from `.env.example` in Render's dashboard
6. Update `CORS_ORIGIN` to include your Cloudflare Pages domain

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/health | Health check |
| GET/PUT | /api/contact | Contact info |
| POST | /api/contact/enquiry | Submit contact form |
| GET/POST | /api/news | News items |
| GET/POST | /api/faculty | Faculty list |
| GET/POST | /api/management | Management list |
| GET/POST | /api/documents | Documents |
| GET/POST | /api/testimonials | Testimonials |
| GET/POST | /api/enquiries | Admission enquiries |
| POST | /api/upload | File upload to Cloudinary |
| GET/PUT | /api/content/:key | Content blocks |
