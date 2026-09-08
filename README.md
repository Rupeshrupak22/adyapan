# Adyapan — EdTech Platform

> A full-stack EdTech platform offering 65+ industry-aligned courses with placement support, live mentorship, and certification.

[![Frontend CI](https://github.com/Rupeshrupak22/adyapan/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/Rupeshrupak22/adyapan/actions/workflows/frontend-ci.yml)
[![Backend CI](https://github.com/Rupeshrupak22/adyapan/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/Rupeshrupak22/adyapan/actions/workflows/backend-ci.yml)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT, Google OAuth |
| Payments | Razorpay (Live) |
| Email | Resend, SendGrid |
| Storage | AWS S3 |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

---

## Project Structure

```
adyapan/
│
├── frontend/                    # Next.js web application (→ Vercel)
│   ├── src/
│   │   ├── app/                 # Next.js App Router (pages & API routes)
│   │   │   ├── (student)/       # Student-facing pages
│   │   │   ├── admin/           # Admin panel
│   │   │   ├── superadmin/      # Superadmin panel
│   │   │   ├── organization/    # Recruiter / company portal
│   │   │   └── api/             # Next.js API routes
│   │   ├── components/          # Reusable UI components
│   │   ├── models/              # Mongoose models (TypeScript)
│   │   ├── lib/                 # DB connection, auth, email utilities
│   │   ├── hooks/               # Custom React hooks
│   │   ├── context/             # React context providers
│   │   ├── types/               # Global TypeScript types
│   │   └── utils/               # Helper functions
│   ├── public/                  # Static assets
│   ├── .env                     # Frontend environment variables
│   ├── next.config.js
│   ├── middleware.ts             # Auth middleware
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                     # Express REST API (→ Render)
│   ├── src/
│   │   ├── config/              # DB, S3, Razorpay configs
│   │   ├── controllers/         # Route handler logic
│   │   ├── middleware/          # Auth, error handling, file upload
│   │   ├── models/              # Mongoose models (JavaScript)
│   │   ├── routes/              # Express route definitions
│   │   ├── utils/               # Email templates, media utils
│   │   └── scripts/             # Admin seed scripts
│   ├── .env                     # Backend environment variables
│   ├── server.js                # Express app entry point
│   └── package.json
│
├── database/                    # Database utilities & migrations
│   ├── scripts/                 # Seed scripts, data migration
│   └── prisma/                  # Prisma schema (SQLite dev)
│
├── .github/
│   ├── workflows/
│   │   ├── frontend-ci.yml      # Lint + build on every push
│   │   ├── backend-ci.yml       # Lint + auto deploy to Render
│   │   └── security-scan.yml    # Weekly npm audit + secret scan
│   └── PULL_REQUEST_TEMPLATE.md
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB Atlas account
- Render account (backend)
- Vercel account (frontend)

### 1. Clone the repository

```bash
git clone https://github.com/Rupeshrupak22/adyapan.git
cd adyapan
```

### 2. Setup Frontend

```bash
cd frontend
cp .env.example .env
# Fill in your values in .env
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

### 3. Setup Backend

```bash
cd backend
cp .env.example .env
# Fill in your values in .env
npm install
npm run dev
```

Backend runs at: `http://localhost:5000`

---

## Environment Variables

| File | Purpose |
|------|---------|
| `frontend/.env` | Next.js, Auth, DB, Payments (public keys) |
| `backend/.env` | Express, DB, Payments (secret keys), Email |
| `database/.env` | Seed scripts, DB connection |

See `.env.example` in each folder for required variables.

---

## Deployment

### Frontend → Vercel
1. Connect GitHub repo to Vercel
2. Set **Root Directory** = `frontend`
3. Add all env vars from `frontend/.env.example`

### Backend → Render
1. Connect GitHub repo to Render
2. Set **Root Directory** = `backend`
3. Set **Build Command** = `npm install`
4. Set **Start Command** = `node server.js`
5. Add all env vars from `backend/.env.example`

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/courses` | List all courses |
| GET | `/api/courses/:slug` | Get course by slug |
| POST | `/api/payments/create-order` | Create Razorpay order |
| POST | `/api/payments/verify` | Verify payment |
| GET | `/api/enrollments` | Get user enrollments |
| POST | `/api/admin/login` | Admin login (3-factor) |

---

## Key Features

- **65+ Courses** across CSE, Management, ECE, Bio Sciences, Civil Engineering
- **3-Factor Admin Auth** — Email + Password + Access Key (SHA-256)
- **Razorpay Live Payments** with webhook verification
- **AWS S3** for course thumbnails, brochures, certificates
- **Role-based Access** — Student, Admin, SuperAdmin, Recruiter
- **PDF Certificate Generation** with unique verification codes
- **Google OAuth** login
- **Resend Email** for transactional emails

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "feat: add your feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

Private — All rights reserved © 2026 Adyapan Skills Pvt. Ltd.
