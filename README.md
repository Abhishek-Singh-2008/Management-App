<div align="center">

# 🚀 ProManage
### *Full-Stack Project & Task Management App*

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

**Ek full-stack project management app jisme Kanban board, JWT auth, aur dual-database support hai.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Setup](#-setup) • [API Docs](#-api-documentation) • [Folder Structure](#-folder-structure)

</div>

---

## ✨ Features

- 🔐 **JWT Authentication** — Register/Login with secure token-based sessions (7 din valid)
- 📂 **Projects CRUD** — Projects banao, edit karo, delete karo (cascade task deletion ke saath)
- 📋 **Kanban Board** — Tasks ko `To Do → In Progress → Done` me move karo with one click
- 🔍 **Live Search & Filters** — Tasks dhundo instantly, column-wise filter karo
- 💾 **Dual Database Mode** — MongoDB nahi mila? Automatically JSON file fallback ho jaata hai
- ✅ **Joi Validations** — Server-side strict schema validation har request pe
- 💀 **Shimmer Skeleton Loaders** — Loading states premium feel dete hain
- 🍞 **Toast Notifications** — Success/error alerts globally
- 📊 **Analytics Banner** — Project stats at a glance
- 🎨 **Glassmorphic Dark UI** — Neon violet + ocean cyan theme with smooth animations

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React (Vite), React Router v6, Vanilla CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) + JSON file fallback |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **Validation** | Joi |
| **Testing** | Jest + Supertest |
| **Dev Tools** | Nodemon, Concurrently, ESLint |

---

## 📁 Folder Structure

```
ENEST PROJECT/
├── backend/
│   ├── src/
│   │   ├── config/        # DB connection (MongoDB + JSON fallback)
│   │   ├── controllers/   # Auth, Project, Task logic
│   │   ├── middleware/    # JWT auth + Joi validation
│   │   ├── models/        # User, Project, Task schemas
│   │   └── routes/        # API route definitions
│   ├── tests/             # Jest + Supertest integration tests
│   ├── data.json          # Local JSON DB (auto-used as fallback)
│   ├── server.js          # Entry point
│   └── .env               # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── context/       # Auth + Toast global contexts
│   │   ├── pages/         # Login, Dashboard, ProjectDetails
│   │   ├── services/      # API call functions
│   │   └── App.jsx        # Routes setup
│   └── index.html
│
└── package.json           # Root workspace scripts
```

---

## 🚀 Setup

### Prerequisites

- **Node.js** v16+ aur **npm** v8+ hona chahiye
- MongoDB optional hai — bina MongoDB ke bhi kaam karta hai!

### Step 1 — Clone & Install

```bash
git clone https://github.com/your-username/enest-project.git
cd "ENEST PROJECT"

# Ek command se dono frontend + backend install
npm run setup
```

### Step 2 — Environment Setup (Optional)

`backend/.env` already bana hua hai. Chahte ho toh change karo:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mini_project_manager
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

> **💡 Note:** Agar MongoDB nahi hai toh chinta mat karo — app automatically `data.json` file use kar lega!

### Step 3 — Run Karo

```bash
npm run dev
```

Ye command dono simultaneously start karta hai:

| Service | URL |
|---|---|
| 🌐 Frontend (React) | http://localhost:5173 |
| ⚙️ Backend (Express) | http://localhost:5000 |

### Step 4 — Tests Chalao (Optional)

```bash
npm run test
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

> 🔒 **Protected routes** me `Authorization: Bearer <token>` header zaroori hai

---

### 🔑 Auth APIs (Public)

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response (201):**
```json
{
  "message": "Registration successful!",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "abc123", "email": "user@example.com" }
}
```

---

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response (200):**
```json
{
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "abc123", "email": "user@example.com" }
}
```

---

### 📂 Projects APIs (Protected 🔒)

| Method | Endpoint | Kya karta hai |
|---|---|---|
| `GET` | `/api/projects` | Saare projects fetch karo (task count ke saath) |
| `POST` | `/api/projects` | Naya project banao |
| `GET` | `/api/projects/:id` | Ek project + uske tasks |
| `PUT` | `/api/projects/:id` | Project update karo |
| `DELETE` | `/api/projects/:id` | Project delete karo (saare tasks bhi delete honge) |

**Project banane ka example:**
```http
POST /api/projects
Authorization: Bearer <token>

{
  "name": "Website Redesign",
  "description": "Corporate landing page ko naya look dena hai"
}
```

---

### 📋 Tasks APIs (Protected 🔒)

| Method | Endpoint | Kya karta hai |
|---|---|---|
| `POST` | `/api/projects/:id/tasks` | Project me naya task add karo |
| `PUT` | `/api/tasks/:id` | Task update karo (status, assignee, etc.) |
| `DELETE` | `/api/tasks/:id` | Task delete karo |

**Task banane ka example:**
```http
POST /api/projects/abc123/tasks
Authorization: Bearer <token>

{
  "title": "Design Figma Mockups",
  "description": "Homepage ke liye responsive mockups banana",
  "status": "todo",
  "assignedTo": "Rahul"
}
```

**Task status values:** `todo` | `in-progress` | `done`

---

### 🏥 Health Check

```http
GET /api/health
```

```json
{
  "status": "OK",
  "timestamp": "2026-05-20T19:00:00.000Z",
  "database": "MongoDB"   // ya "Local JSON File"
}
```

---

## 📐 Data Models

### User
```json
{
  "id": "uuid-ya-objectid",
  "email": "user@example.com",
  "password": "hashed-password"
}
```

### Project
```json
{
  "id": "uuid-ya-objectid",
  "name": "Website Redesign",
  "description": "Project description",
  "userId": "owner-id",
  "createdAt": "2026-05-20T18:45:00.000Z"
}
```

### Task
```json
{
  "id": "uuid-ya-objectid",
  "projectId": "parent-project-id",
  "title": "Design Figma Mockups",
  "description": "Task details",
  "status": "todo | in-progress | done",
  "assignedTo": "Rahul",
  "createdAt": "2026-05-20T18:47:00.000Z",
  "updatedAt": "2026-05-20T18:49:00.000Z"
}
```

---

## 🗃️ Available Scripts

| Command | Kya karta hai |
|---|---|
| `npm run setup` | Frontend + Backend dono ke dependencies install karo |
| `npm run dev` | Dono servers simultaneously start karo |
| `npm run test` | Backend integration tests chalao |
| `npm run build` | Frontend ka production build banao |
| `npm start` | Sirf backend start karo (production) |

---

## 💾 Dual Database — Kaise kaam karta hai?

```
App start hoti hai
       ↓
MongoDB se connect karne ki koshish
       ↓
   ┌───┴───┐
   ↓       ↓
Success  Failed / Timeout
   ↓       ↓
MongoDB  data.json (local file)
mode     fallback mode
```

Dono modes me **same controllers, routes, aur validation** kaam karta hai. Switch transparent hai!

---

## 🧪 Testing

Tests cover karte hain:
- ✅ User registration + login flow
- ✅ Protected route access (without token = 401)
- ✅ Project CRUD operations
- ✅ Task creation aur status update
- ✅ Joi validation errors

```bash
npm run test
```

---

## 🤝 Contributing

1. Fork karo
2. Feature branch banao: `git checkout -b feature/cool-feature`
3. Commit karo: `git commit -m 'Add cool feature'`
4. Push karo: `git push origin feature/cool-feature`
5. Pull Request open karo

---

<div align="center">

Made with ❤️ | ProManage — *Apne projects ka boss bano!*

</div>
