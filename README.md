# Jaliane (Jaja) — Full-Stack Developer Portfolio

A fast, accessible, single-page developer portfolio built with semantic HTML, modern CSS, and vanilla JavaScript — no frameworks, no build step.

## Features

- Responsive design (mobile, tablet, desktop)
- Dark / light theme with system-preference detection and localStorage persistence
- Sticky navigation with active-section indicator and mobile menu
- Project showcase with category filtering and detail modals
- Contact form with client-side validation, honeypot spam protection, and a Node.js/Express + Nodemailer backend
- Scroll-reveal animations (disabled automatically for `prefers-reduced-motion`)
- SEO metadata (Open Graph, Twitter Card, canonical URL)
- Accessible: semantic HTML, skip link, ARIA attributes, keyboard navigation, visible focus states

## Project structure

```
├── index.html                  # Single-page site (all sections)
├── css/
│   └── main.css                # Design system (themes, components, responsive)
├── js/
│   └── main.js                 # Theme, nav, filters, modal, form logic
├── images/                     # Portrait photos
├── favicon.svg
├── backend/
│   ├── server.js               # Express server (serves frontend + /api/contact)
│   ├── routes/contact.js
│   ├── controllers/contactController.js
│   ├── models/message.js       # Mongoose model (available, not wired up)
│   └── package.json
└── README.md
```

## Running locally

### Frontend only (static)

Any static file server works. For example:

```bash
# Python
python3 -m http.server 8080

# or Node
npx serve .
```

Then open http://localhost:8080

### With the contact-form backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in real credentials (see below)
npm start
```

The Express server serves the frontend and the `/api/contact` API together at http://localhost:5000.

## Contact form configuration

The contact form posts to `/api/contact` (same origin by default). To change the endpoint (e.g. a separately deployed API), edit `CONFIG.contactEndpoint` in `js/main.js`.

The backend sends form submissions via Gmail using Nodemailer. Required environment variables in `backend/.env`:

| Variable     | Description                                  |
| ------------ | -------------------------------------------- |
| `EMAIL_USER` | Gmail address used to send                   |
| `EMAIL_PASS` | Gmail app password (not your account password) |
| `EMAIL_TO`   | Address that receives the messages           |
| `EMAIL_FROM` | From address (optional, defaults to EMAIL_USER) |

Generate an app password at https://myaccount.google.com/apppasswords

If credentials are missing or still contain placeholder values, the API returns a clear `503` error and the form shows a friendly message instead of failing silently.

## Deployment

- **Frontend**: deploy the repository root to any static host (Vercel, Netlify, GitHub Pages). Update the canonical/OG URLs in `index.html` if the domain changes.
- **Backend**: deploy `backend/` to a Node host (Render, Railway, Fly.io...). Set the environment variables there and point `CONFIG.contactEndpoint` in `js/main.js` at the deployed API URL.

## Tech stack

- HTML5, CSS3 (custom properties, grid, flexbox), vanilla JavaScript (ES2022)
- Express 5, Nodemailer (backend)
- Fonts: Inter + Sora (Google Fonts)
- No runtime dependencies on the frontend
