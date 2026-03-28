# Admin API Map

This is the backend contract inferred from the current admin UI in `/frontend/admin`.

## Existing CRUD-backed pages

### News

- Admin page: `frontend/admin/admin-news.html`
- Collection: `news`
- Routes:
  - `GET /api/news`
  - `POST /api/news`
  - `PUT /api/news/:id`
  - `DELETE /api/news/:id`
- Suggested fields:
  - `title`
  - `category`
  - `date`
  - `excerpt`
  - `content`
  - `image`
  - `published`

### Faculty

- Admin page: `frontend/admin/admin-academics.html`
- Collection: `faculty`
- Routes:
  - `GET /api/faculty`
  - `POST /api/faculty`
  - `PUT /api/faculty/:id`
  - `DELETE /api/faculty/:id`
- Suggested fields:
  - `name`
  - `subject`
  - `qualification`
  - `experience`
  - `photo`
  - `sortOrder`

### Management

- Admin page: `frontend/admin/admin-academics.html`
- Collection: `management`
- Routes:
  - `GET /api/management`
  - `POST /api/management`
  - `PUT /api/management/:id`
  - `DELETE /api/management/:id`
- Suggested fields:
  - `name`
  - `role`
  - `group`
  - `contact`
  - `photo`
  - `sortOrder`

### Documents

- Admin pages:
  - `frontend/admin/admin-academics.html`
  - `frontend/admin/admin-magazine.html`
  - `frontend/admin/admin-disclosure.html`
- Collection: `documents`
- Routes:
  - `GET /api/documents`
  - `POST /api/documents`
  - `PUT /api/documents/:id`
  - `DELETE /api/documents/:id`
- Suggested shared fields:
  - `title`
  - `category`
  - `date`
  - `url`
  - `thumbnail`
  - `description`
  - `order`
  - `published`
- Known category families:
  - `e-magazine`
  - `cbse-circular`
  - `school-circular`
  - `book-list`
  - `disclosure-*`

### Testimonials

- Public usage found in `frontend/index.html`
- Collection: `testimonials`
- Routes:
  - `GET /api/testimonials`
  - `POST /api/testimonials`
  - `PUT /api/testimonials/:id`
  - `DELETE /api/testimonials/:id`

### Contact settings

- Public usage found in:
  - `frontend/contact.html`
  - `frontend/components/Footer.js`
  - `frontend/index.html`
- Singleton route:
  - `GET /api/contact`
  - `POST /api/contact`
  - `PUT /api/contact`
- Suggested fields:
  - `address`
  - `phone1`
  - `phone2`
  - `email`
  - `hours`
  - `mapEmbedUrl`
  - `socialLinks`

## Singleton content sections

These admin pages are mostly UI-only today, but the backend can support them now through `ContentBlock`.

### About pages

- Admin page: `frontend/admin/adminschool-profile.html`
- Routes:
  - `GET /api/about/:section`
  - `POST /api/about/:section`
  - `PUT /api/about/:section`
- Known sections:
  - `school-profile`
  - `management`
  - `manager-speaks`
  - `principals-message`
  - `pta`
  - `cbse-details`
  - `annual-report`

### School info pages

- Admin page: `frontend/admin/admin-schoolinfo.html`
- Routes:
  - `GET /api/school-info/:section`
  - `POST /api/school-info/:section`
  - `PUT /api/school-info/:section`
  - `POST /api/school-info`
  - `PUT /api/school-info`
- Known sections:
  - `curriculum`
  - `uniform`
  - `calendar`
  - `timings`
  - `provisions`
  - `facilities`
  - `harassment`
  - `child-protection`
  - `privacy-policy`

### Activities and clubs

- Admin page: `frontend/admin/admin-activities.html`
- Routes:
  - `GET /api/activities-clubs/:slug`
  - `POST /api/activities-clubs/:slug`
  - `PUT /api/activities-clubs/:slug`

### Site-wide settings

- Admin page: `frontend/admin/admin-panel.html`
- Routes:
  - `GET /api/settings/:key`
  - `POST /api/settings/:key`
  - `PUT /api/settings/:key`
- Recommended keys:
  - `homepage.hero`
  - `homepage.about`
  - `homepage.why-us`
  - `homepage.stats`
  - `homepage.gallery`
  - `homepage.cta`
  - `site.footer`
  - `site.seo`
  - `site.general`

## Upload service

- Shared route:
  - `POST /api/upload`
- Backed by Cloudinary
- Supports:
  - images
  - PDF documents

## Suggested next implementation steps

1. Wire `adminschool-profile.html` to `GET/POST /api/about/:section`.
2. Wire `admin-schoolinfo.html` to `GET/POST /api/school-info`.
3. Wire `admin-activities.html` to `GET/POST /api/activities-clubs/:slug`.
4. Add a real settings UI contract for `admin-panel.html`.
5. Add admin login/session handling instead of only a shared token header.
