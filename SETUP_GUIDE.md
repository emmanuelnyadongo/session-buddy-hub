# Session Buddy Hub - Setup Guide

This guide will help you set up the Session Buddy Hub project with a complete backend, database, and authentication system.

## 🎯 What's Been Implemented

### Backend Features
- ✅ **Express.js API** with proper middleware setup
- ✅ **PostgreSQL Database** with comprehensive schema
- ✅ **JWT Authentication** with secure token management
- ✅ **Password Hashing** using bcryptjs
- ✅ **Email Functionality** for verification and password reset
- ✅ **Rate Limiting** and security headers
- ✅ **Input Validation** and error handling
- ✅ **Database Migrations** and seeding scripts

### Frontend Features
- ✅ **React Authentication Context** for state management
- ✅ **Protected Routes** with automatic redirects
- ✅ **API Integration** with proper error handling
- ✅ **Form Validation** and user feedback
- ✅ **Responsive Design** with modern UI components

### Database Schema
- ✅ **Users Table** - Complete user management
- ✅ **Study Sessions Table** - Session creation and management
- ✅ **Session Participants** - Many-to-many relationships
- ✅ **Session Messages** - In-session chat functionality
- ✅ **User Relationships** - Friend/following system
- ✅ **Session Reviews** - Rating and feedback system
- ✅ **User Preferences** - Settings and customization

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

#### For Linux/Mac:
```bash
chmod +x setup.sh
./setup.sh
```

#### For Windows:
```cmd
setup.bat
```

### Option 2: Manual Setup

#### 1. Install Dependencies
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

#### 2. Set Up Environment Variables

**Frontend (.env.local):**
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend (backend/.env):**
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

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
SMTP_FROM=noreply@sessionbuddyhub.com
```

#### 3. Set Up Database
```bash
# Create PostgreSQL database
createdb session_buddy_hub

# Run migrations
cd backend
npm run migrate

# (Optional) Seed with sample data
npm run seed
```

#### 4. Start the Application
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
npm run dev
```

### Option 3: Docker Setup

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📊 Database Schema Overview

### Core Tables

1. **users** - User accounts and profiles
   - Basic info (name, email, university)
   - Authentication (password_hash, verification tokens)
   - Profile data (avatar, bio, preferences)

2. **study_sessions** - Study session information
   - Session details (title, description, subject)
   - Scheduling (date, time, duration)
   - Capacity and status management

3. **session_participants** - Many-to-many relationship
   - Links users to sessions
   - Tracks participation status

4. **session_messages** - In-session communication
   - Real-time chat functionality
   - Message types (text, file, image)

5. **user_relationships** - Social connections
   - Friend/following system
   - Relationship status management

## 🔐 Authentication Flow

1. **Registration**
   - User fills registration form
   - Password is hashed with bcryptjs
   - JWT token is generated
   - Verification email is sent (optional)

2. **Login**
   - User provides credentials
   - Password is verified against hash
   - JWT token is generated and stored
   - User is redirected to dashboard

3. **Protected Routes**
   - JWT token is validated on each request
   - Invalid tokens redirect to login
   - User context is maintained across the app

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs with salt rounds
- **Rate Limiting** - Protection against brute force
- **CORS Configuration** - Controlled cross-origin requests
- **Helmet Security** - Security headers
- **Input Validation** - Server-side validation
- **SQL Injection Protection** - Parameterized queries

## 📧 Email Configuration

To enable email functionality:

1. **Gmail Setup:**
   - Enable 2-factor authentication
   - Generate app password
   - Use app password in SMTP_PASS

2. **Other Providers:**
   - Update SMTP_HOST and SMTP_PORT
   - Configure authentication credentials

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `GET /api/auth/verify-email/:token` - Email verification

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/sessions` - Get user sessions
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/search` - Search users

### Sessions
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get session details
- `POST /api/sessions` - Create session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session
- `POST /api/sessions/:id/join` - Join session
- `POST /api/sessions/:id/leave` - Leave session

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### API Testing
Use tools like Postman or curl to test endpoints:

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","university":"Test University"}'
```

## 🚀 Deployment

### Production Setup

1. **Environment Variables:**
   - Set NODE_ENV=production
   - Use strong JWT_SECRET
   - Configure production database
   - Set up email service

2. **Database:**
   - Use production PostgreSQL instance
   - Run migrations: `npm run migrate`
   - Consider database backups

3. **Frontend Build:**
   ```bash
   npm run build
   ```

4. **Backend:**
   ```bash
   cd backend
   npm start
   ```

### Docker Deployment
```bash
# Production build
docker-compose -f docker-compose.prod.yml up -d
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error:**
   - Check PostgreSQL is running
   - Verify database credentials
   - Ensure database exists

2. **JWT Token Issues:**
   - Check JWT_SECRET is set
   - Verify token expiration
   - Clear browser storage

3. **Email Not Sending:**
   - Check SMTP credentials
   - Verify email service settings
   - Check firewall/network settings

4. **CORS Errors:**
   - Verify FRONTEND_URL in backend .env
   - Check CORS configuration
   - Ensure proper headers

## 📝 Development Notes

### File Structure
```
session-buddy-hub/
├── src/                    # Frontend source
│   ├── components/        # React components
│   │   ├── contexts/          # React contexts
│   │   ├── lib/              # Utilities and API
│   │   └── pages/            # Page components
│   ├── backend/               # Backend source
│   │   ├── src/
│   │   │   ├── config/       # Database config
│   │   │   ├── middleware/   # Express middleware
│   │   │   ├── routes/       # API routes
│   │   │   ├── utils/        # Utilities
│   │   │   └── database/     # Database files
│   │   └── package.json
│   └── README.md
```

### Code Standards
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for formatting
- **Conventional commits** for version control

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Need Help?** Check the main README.md for more detailed information or create an issue in the repository. 