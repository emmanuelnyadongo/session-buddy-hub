# Session Buddy Hub

A collaborative study session platform built with React, Node.js, and PostgreSQL. Connect with fellow students, create study sessions, and enhance your learning experience together.

## 🌐 Live Application

**Live URL:** https://sbhubwebapp2024.azurewebsites.net

The application is deployed on Azure using Docker containers and Azure App Service.

## Features

- 🔐 **Secure Authentication** - JWT-based authentication with email verification
- 👥 **User Management** - Profile management, user search, and friend connections
- 📚 **Study Sessions** - Create, join, and manage collaborative study sessions
- 💬 **Real-time Chat** - In-session messaging for effective communication
- 📅 **Session Scheduling** - Flexible scheduling with date and time management
- 🏫 **Subject Organization** - Categorized sessions by academic subjects
- 📧 **Email Notifications** - Session reminders and account verification
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **React Router** for navigation
- **React Query** for data fetching
- **React Hook Form** for form management

### Backend
- **Node.js** with Express.js
- **PostgreSQL** for database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Nodemailer** for email functionality
- **Helmet** for security headers
- **CORS** for cross-origin requests

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn** or **bun**

## Installation

### 1. Clone the repository

```bash

cd session-buddy-hub
```

### 2. Set up the database

1. Create a PostgreSQL database:
```sql
CREATE DATABASE session_buddy_hub;
```

2. Navigate to the backend directory:
```bash
cd backend
```

3. Install backend dependencies:
```bash
npm install
```

4. Set up environment variables:
```bash
cp env.example .env
```

Edit the `.env` file with your database credentials and other configuration:
```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=session_buddy_hub
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password


# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
SMTP_FROM=noreply@sessionbuddyhub.com
```

5. Run database migrations:
```bash
npm run migrate
```

6. (Optional) Seed the database with sample data:
```bash
npm run seed
```

### 3. Set up the frontend

1. Navigate back to the root directory:
```bash
cd ..
```

2. Install frontend dependencies:
```bash
npm install
```

3. Create environment variables file:
```bash
echo "VITE_API_URL=http://localhost:5000/api" > .env.local
```

## Running the Application

### Development Mode

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. In a new terminal, start the frontend development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Production Mode

1. Build the frontend:
```bash
npm run build
```

2. Start the production server:
```bash
cd backend
npm start
```

## Docker-based Local Development

You can run the entire stack (backend, frontend, and database) locally using Docker Compose.

### Prerequisites
- [Docker](https://www.docker.com/get-started) installed
- [Docker Compose](https://docs.docker.com/compose/install/) (if not included with Docker Desktop)

### Steps
1. Copy the backend environment example:
   ```sh
   cp backend/env.example backend/.env
   # Edit backend/.env as needed
   ```
2. Build and start all services:
   ```sh
   docker-compose up --build
   ```
3. The backend API will be available at [http://localhost:5000/api](http://localhost:5000/api)
4. The frontend will be available at [http://localhost:5173](http://localhost:5173)
5. To stop the services:
   ```sh
   docker-compose down
   ```

> **Reminder:** Before running Docker Compose, copy `backend/env.example` to `backend/.env` and update values as needed.

---

## Azure Deployment Guide

### 1. Provision Azure Resources with Terraform
1. Install [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli) and [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli).
2. Login to Azure:
   ```sh
   az login
   ```
3. Go to the terraform directory:
   ```sh
   cd terraform
   ```
4. Copy and edit terraform.tfvars:
   ```sh
   cp terraform.tfvars terraform.tfvars # Edit values as needed
   ```
5. Initialize and apply Terraform:
   ```sh
   terraform init
   terraform apply
   ```

### 2. Build and Push Docker Image to Azure Container Registry (ACR)
1. Get ACR login server from Terraform output or Azure Portal.
2. Login to ACR:
   ```sh
   az acr login --name <acr_name>
   ```
3. Build and tag your Docker image:
   ```sh
   docker build -t <acr_login_server>/session-buddy-hub:latest .
   ```
4. Push the image:
   ```sh
   docker push <acr_login_server>/session-buddy-hub:latest
   ```

### 3. Deploy to Azure Web App for Containers
1. In the Azure Portal, go to your Web App resource.
2. Set the container image to `<acr_login_server>/session-buddy-hub:latest`.
3. Set environment variables (DATABASE_URL, NODE_ENV, etc.) in the Web App Configuration.
4. Save and restart the Web App.
5. Your app will be live at the Web App URL (see Terraform output or Azure Portal).

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/verify-email/:token` - Verify email address

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/sessions` - Get user's sessions
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/search` - Search users
- `GET /api/users/:userId` - Get user by ID

### Study Sessions
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get session by ID
- `POST /api/sessions` - Create new session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session
- `POST /api/sessions/:id/join` - Join session
- `POST /api/sessions/:id/leave` - Leave session
- `GET /api/sessions/:id/messages` - Get session messages
- `POST /api/sessions/:id/messages` - Send message

## Database Schema

The application uses the following main tables:

- **users** - User accounts and profiles
- **study_sessions** - Study session information
- **session_participants** - Many-to-many relationship between users and sessions
- **session_messages** - Chat messages within sessions
- **user_relationships** - Friend/following relationships
- **session_reviews** - Session ratings and reviews
- **user_preferences** - User settings and preferences

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for secure password storage
- **Rate Limiting** - Protection against brute force attacks
- **CORS Configuration** - Controlled cross-origin requests
- **Helmet Security** - Security headers for protection
- **Input Validation** - Server-side validation for all inputs
- **SQL Injection Protection** - Parameterized queries

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`