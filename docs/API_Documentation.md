# CRM Pro - API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require: `Authorization: Bearer <token>`

---

## Auth Routes `/api/auth`

| Method | Endpoint        | Access  | Description          |
|--------|-----------------|---------|----------------------|
| POST   | `/register`     | Public  | Register new user    |
| POST   | `/login`        | Public  | Login user           |
| GET    | `/me`           | Private | Get current user     |
| PUT    | `/profile`      | Private | Update profile       |

### POST /register
```json
{ "name": "John", "email": "john@example.com", "password": "123456", "role": "sales" }
```

### POST /login
```json
{ "email": "john@example.com", "password": "123456" }
```

---

## Lead Routes `/api/leads`

| Method | Endpoint          | Access         | Description            |
|--------|-------------------|----------------|------------------------|
| GET    | `/`               | Private        | Get all leads          |
| POST   | `/`               | Private        | Create lead            |
| GET    | `/:id`            | Private        | Get single lead        |
| PUT    | `/:id`            | Private        | Update lead            |
| DELETE | `/:id`            | Admin/Manager  | Delete lead            |
| POST   | `/:id/convert`    | Private        | Convert lead→customer  |

**Query Params (GET /):** `status`, `priority`, `search`, `page`, `limit`

---

## Customer Routes `/api/customers`

| Method | Endpoint  | Access  | Description          |
|--------|-----------|---------|----------------------|
| GET    | `/`       | Private | Get all customers    |
| POST   | `/`       | Private | Create customer      |
| GET    | `/:id`    | Private | Get single customer  |
| PUT    | `/:id`    | Private | Update customer      |
| DELETE | `/:id`    | Admin   | Delete customer      |

---

## Task Routes `/api/tasks`

| Method | Endpoint  | Access  | Description       |
|--------|-----------|---------|-------------------|
| GET    | `/`       | Private | Get all tasks     |
| POST   | `/`       | Private | Create task       |
| GET    | `/:id`    | Private | Get single task   |
| PUT    | `/:id`    | Private | Update task       |
| DELETE | `/:id`    | Private | Delete task       |

---

## Dashboard Routes `/api/dashboard`

| Method | Endpoint      | Access  | Description           |
|--------|---------------|---------|-----------------------|
| GET    | `/stats`      | Private | Get dashboard stats   |
| GET    | `/activities` | Private | Get recent activities |

---

## Roles & Permissions

| Role    | Leads          | Customers      | Tasks     |
|---------|----------------|----------------|-----------|
| admin   | Full access    | Full access    | Full      |
| manager | Create/Edit/Delete | Create/Edit | Full   |
| sales   | Own leads only | Own customers  | Own tasks |
