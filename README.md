# 🚀 ProManage — Mini Project Management App

ProManage is a state-of-the-art, high-fidelity, full-stack project and task management application. It features a premium, responsive glassmorphic dark theme using modern CSS typography (Outfit & Plus Jakarta Sans), sleek slide transitions, micro-animations, and full-featured Kanban boards with click-to-transition directional controls.

The backend is built using **Node.js, Express.js, and Mongoose (MongoDB)**. It features strict **Joi-based request body validation**, robust JWT-signed authentication, protected session routing, and an integration test suite.

---

## 🎨 Visual Excellence & Design System
ProManage is designed to feel highly premium and fluid:
*   **Aesthetics**: Glassmorphism cards with fine borders (`backdrop-filter: blur`), dark cosmic slate backgrounds, glowing neon violet accents, ocean cyan highlights for active elements, and emerald green finishes for completed states.
*   **Micro-interactions**: Scale-ups on hover, slide-down modals, smooth inline card shifts, and responsive task flow animations.
*   **State management**: Built-in shimmering skeleton loaders for projects and tasks to ensure a smooth transition from loading to loaded, alongside custom empty states with clear action prompts.
*   **Notification Engine**: Integrated custom Toast notification alerts for seamless form error reporting or action successes.

---

## 💾 Transparent Dual-Mode Database Engine
To guarantee 100% out-of-the-box runnability without requiring you to have a local MongoDB service configured or running, the backend features a **hybrid database provider layer**:
1.  **MongoDB Mode (Production/Default)**: Automatically attempts to connect to your MongoDB database (configured via `.env` or defaulting to `mongodb://localhost:27017/mini_project_manager`).
2.  **Graceful Local JSON Fallback Mode**: If MongoDB is offline, unconfigured, or connection times out, the backend logs a warning and **seamlessly switches to a local file system JSON database (`data.json`)**.
*   *Note*: The routes, validation middleware, and controllers remain 100% identical. The system abstracts Mongoose models to proxy operations automatically!

---

## 🛠️ Technical Stack
*   **Frontend**: React (Vite), React Router (v6), custom high-performance Vanilla CSS variables.
*   **Backend**: Node.js, Express.js, Mongoose/MongoDB, bcryptjs, JSON Web Tokens.
*   **Validations**: Joi Schema Validations.
*   **Test Suite**: Jest & Supertest.

---

## 🚀 Getting Started

### 📋 Prerequisites
*   Node.js (v16.x or higher)
*   npm (v8.x or higher)

### 📥 1. Installation
Simply navigate to the workspace root directory (`c:/Users/abhis/Desktop/New folder`) and run the setup script to install all dependencies for both frontend and backend automatically:
```bash
npm run setup
```

### 🛰️ 2. Configuration (Optional)
A `.env` file is already created for you in the `backend/` directory. You can inspect or modify it as needed:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mini_project_manager
JWT_SECRET=default_super_secret_key_change_me_in_production
```

### 🏃 3. Run the Application
Start both the Express backend server and the Vite React frontend concurrently with one single command from the root folder:
```bash
npm run dev
```
Once run:
*   **Frontend Client**: `http://localhost:5173` (Vite dev server)
*   **Backend API Service**: `http://localhost:5000`

### 🧪 4. Run API Automated Tests
To run the automated integration tests checking authentication flow, secure routing, validations, and project/task CRUD APIs:
```bash
npm run test
```

---

## 🌐 API Specifications

### 🔒 1. Authentication APIs (Public)
*   `POST /api/auth/register` - Register a new account.
*   `POST /api/auth/login` - Sign in to get a signed JWT token.

### 📂 2. Projects CRUD APIs (Protected)
*   `GET /api/projects` - Get all projects owned by the user, including computed task counts for each project.
*   `POST /api/projects` - Create a new project.
*   `GET /api/projects/:id` - Retrieve project details and all its related tasks in one call.
*   `PUT /api/projects/:id` - Update project details.
*   `DELETE /api/projects/:id` - Delete project (includes cascade task deletion).

### 📋 3. Tasks CRUD APIs (Protected)
*   `POST /api/projects/:id/tasks` - Create a task nested inside the specified project.
*   `PUT /api/tasks/:id` - Update task details, assignee, or column state status (`todo`, `in-progress`, `done`).
*   `DELETE /api/tasks/:id` - Delete a task.

---

## 📐 Data Models

### 📂 Project
```json
{
  "id": "unique-uuid-or-objectid",
  "name": "Website Redesign",
  "description": "Redo the corporate landing page and blog",
  "userId": "owner-user-uuid",
  "createdAt": "2026-05-20T18:45:28.000Z"
}
```

### 📋 Task
```json
{
  "id": "unique-uuid-or-objectid",
  "projectId": "parent-project-uuid",
  "title": "Design Figma Mockups",
  "description": "Create the visual assets and responsive mockups",
  "status": "todo | in-progress | done",
  "assignedTo": "Alice Smith",
  "createdAt": "2026-05-20T18:47:35.000Z",
  "updatedAt": "2026-05-20T18:49:14.000Z"
}
```

---

## ✨ Features Checklist (All Specs Met + Bonuses)
- [x] **Registration & Login Screen**: Seamless form with email/password verification and switching actions.
- [x] **Joi API Validations**: Form errors returned elegantly by server schemas.
- [x] **JWT Auth & Session Storage**: Protected routes preventing unauthenticated dashboard visits.
- [x] **Projects Dashboard**: Responsive list/grid cards featuring created dates, task quantities, and project edit/delete actions.
- [x] **Analytics Overview Stats Banner**: Interactive visual metrics calculations.
- [x] **Project Details Page**: Displays current project details with full breadcrumb navigation.
- [x] **Interactive Kanban Board**: Clean visual columns representing task categories (`To Do`, `In Progress`, `Done`).
- [x] **Directional Quick Move Controls**: Single-click task state modifications (move tasks between stages rapidly).
- [x] **Task Search & Column Filters**: Live React-state filters to find tasks in a flash.
- [x] **Form Validations**: Live field checks on project and task creation.
- [x] **Shimmer Skeleton States**: Premium interface placeholders.
- [x] **Global Toast Context**: Beautiful floating response messages.
