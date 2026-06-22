# CRM Pro - Full Stack CRM Application

A complete Customer Relationship Management system built with **React + Redux** (frontend) and **Node.js + Express + MongoDB** (backend).

## Features

- **Auth** — Register, login, JWT-based sessions, role-based access (admin / manager / sales)
- **Leads** — Create, update, delete, filter, search, paginate, convert to customer
- **Customers** — Auto-created from leads, manage and track
- **Tasks** — Create and assign tasks, mark complete, overdue alerts
- **Dashboard** — Stats cards, bar chart, pie chart, recent activity feed
- **Profile** — Edit name, email, phone, change password

## Tech Stack

| Layer    | Technology                            |
|----------|---------------------------------------|
| Frontend | React 18, Redux Toolkit, React Router, Tailwind CSS, Recharts |
| Backend  | Node.js, Express.js, MongoDB, Mongoose |
| Auth     | JWT, bcryptjs                         |
| Storage  | Cloudinary (file uploads)             |
| Email    | Nodemailer                            |

## Project Structure

```
CRM-PROJECT/
├── backend/      → Express API server
└── frontend/     → React Vite app
```

## Setup & Installation

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

Edit `backend/.env` with your values:

```env
MONGO_URI=mongodb://localhost:27017/crm_db
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Run

```bash
# Backend (port 5000)
cd backend && npm run dev

# Frontend (port 3000)
cd frontend && npm run dev
```

Open `http://localhost:3000`

## API Docs

See [`docs/API_Documentation.md`](docs/API_Documentation.md)

## Default Roles

- **admin** — Full access to everything
- **manager** — Manage leads, customers, tasks
- **sales** — Access only to their own assigned records
