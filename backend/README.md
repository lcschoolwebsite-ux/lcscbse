# Loretto Backend

Express + MongoDB + Cloudinary backend for the Loretto school website.

## What it covers

- `news` CRUD
- `faculty` CRUD
- `management` CRUD
- `documents` CRUD
- `testimonials` CRUD
- `contact` singleton
- `contact` enquiries with optional Resend email notifications
- structured page/content storage for:
  - `about/*`
  - `school-info/*`
  - `activities-clubs/*`
  - `settings/*`
  - generic `content/*`
- Cloudinary upload endpoint for images and PDFs

## Run locally

1. Copy `.env.example` to `.env`
2. Fill MongoDB and Cloudinary values
3. Install packages:

```bash
cd backend
npm install
```

4. Start the server:

```bash
npm run dev
```

The API will run on `http://localhost:3000` by default.

## Main routes

- `GET/POST/PUT/DELETE /api/news`
- `GET/POST/PUT/DELETE /api/faculty`
- `GET/POST/PUT/DELETE /api/management`
- `GET/POST/PUT/DELETE /api/documents`
- `GET/POST/PUT /api/contact`
- `POST /api/contact/enquiry`
- `GET /api/contact/inquiries`
- `GET/POST/PUT/DELETE /api/testimonials`
- `GET/POST/PUT /api/about/:section`
- `GET/POST/PUT /api/school-info/:section`
- `GET/POST/PUT /api/school-info`
- `GET/POST/PUT /api/activities-clubs/:slug`
- `GET/POST/PUT /api/settings/:key`
- `GET/POST/PUT /api/content/:key`
- `POST /api/upload`

## Admin auth

If `ADMIN_TOKEN` is set, all mutating routes require header:

```http
x-admin-token: <your token>
```

If `ADMIN_TOKEN` is empty, the backend allows writes without the header for local development.

## Resend setup

To send contact-form emails, set these environment variables:

```env
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=Loretto Central School <your-verified-sender@yourdomain.com>
CONTACT_EMAIL=admin@yourdomain.com
```

`CONTACT_EMAIL` is the inbox that receives website enquiries. The public contact form also sends an acknowledgement email back to the user when Resend is configured.

## Admin login identity

If you want the admin login page to require a username or email in addition to the token, add one or both of these to your `.env`:

```env
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
```
