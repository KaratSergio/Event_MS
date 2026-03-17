# Event Management System

Event Management System is a full-featured application for managing events with the ability to create, edit, and participate in events.
The project is built on React + NestJS + PostgreSQL stack.
---
## 📋Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
---
## ✨Features

- **Authentication**: Sign up and login with JWT
- **Public Events**: Browse public events with join/leave functionality
- **Event Details**: Full event information + participants list
- **Create Event**: Form with validation (title, date, location required)
- **Calendar**: View user's events in monthly/weekly views
- **Management**: Edit and delete events (organizer only)
- **Responsive Design**: Mobile and desktop versions

---
## 🛠Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- Zustand (state management)
- React Hook Form + Yup (validation)
- React Router DOM v7
- Tailwind CSS
- React Big Calendar
- Axios
- Heroicons
- **Storybook** (UI component development and documentation)

### Backend
- NestJS
- TypeORM
- PostgreSQL
- JWT Authentication
- Class Validator
- Swagger

### Infrastructure
- Docker + Docker Compose
- PostgreSQL
- PgAdmin

[⬆️ Back to Top](#)
---
## 🚀Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### Running with Docker (recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/KaratSergio/Application
   cd Application

2. **Create .env file in the /backend directory, take advantage env.example, to create environment variables**
   ```bash
   cp .env.example backend/.env

3. **Run Docker containers**
   ```bash
   docker-compose up -d

4. **Check that everything works**
   ```bash
   docker-compose ps

5. **Open the application in a browser:**
  - Frontend: http://localhost:3000
  - Backend API: http://localhost:5000
  - Swagger: http://localhost:5000/api/docs
  - PgAdmin: http://localhost:5050

  ## 📚 Storybook

UI components are isolated in the Storybook development environment.

1. **Run Storybook**
   ```bash
    cd frontend
    npx storybook@latest init
    npm run storybook

Storybook will be available at: http://localhost:6006

[⬆️ Back to Top](#)
---
  ## 📚API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login user |
| `POST` | `/auth/logout` | Logout user |
| `POST` | `/auth/refresh` | Refresh JWT token |
| `GET`  | `/auth/me` | Get current user info |

### 📅 Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`    | `/events` | Get all public events |
| `POST`   | `/events` | Create new event |
| `GET`    | `/events/:id` | Get event details |
| `PATCH`  | `/events/:id` | Update event |
| `DELETE` | `/events/:id` | Delete event |

### 👥 Event Participants
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`    | `/events/:id/participants` | Get all participants |
| `POST`   | `/events/:id/participants` | Join event |
| `GET`    | `/events/:id/participants/me` | Check if user joined |
| `DELETE` | `/events/:id/participants/me` | Leave event |
| `GET`    | `/events/:id/participants/count` | Get participants count |

### 👤 Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users/me` | Get current user profile |
| `GET` | `/users/me/events` | Get user's created events |
| `GET` | `/users/me/participations` | Get events user joined |
| `GET` | `/users/:id` | Get user details by ID |

---
## 📁Project Structure
```
Application/
├── backend/                 # NestJS application
│   ├── src/
│   │   ├── auth/            # Authentication
│   │   ├── users/           # Users
│   │   ├── events/          # Events
│   │   ├── common/          # Shared resources across modules
│   │   ├── database/        # Entities and seeds
│   │   ├── app.module.ts    # Root module
│   │   └── main.ts          # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Pages
│   │   ├── services/        # API and state management
│   │   ├── utils/           # Helpers
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .env.example
└── README.md
```
[⬆️ Back to Top](#)
---
After seeding, the following test users are available:
- bob@g.com / 123456
- jane@g.com / 123456