# Loretto Central School Website

This repository contains the full source code for the Loretto Central School website, including both the frontend and the backend.

## Project Structure

- **`/frontend`**: Contains the static HTML, CSS, and JavaScript files for the website.
- **`/backend`**: Node.js/Express backend server for handling dynamic content, administrative functions, and contact form submissions.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [MongoDB](https://www.mongodb.com/) (Atlas or local)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the [`.env.example`](backend/.env.example):
   ```bash
   cp .env.example .env
   ```
4. Fill in your secrets in the `.env` file.
5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. The frontend consists of static files. You can serve them using any local web server (e.g., Live Server in VS Code, or `python -m http.server`).
2. Ensure the `shared-data-loader.js` and other scripts point to your local or deployed backend URL.

## Deployment

- **Frontend**: Can be deployed to Netlify, Vercel, or GitHub Pages.
- **Backend**: Can be deployed to Railway, Render, or Heroku.

## License

All rights reserved.
