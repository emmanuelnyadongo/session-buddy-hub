# Session Buddy Hub - Project Structure

```
session-buddy-hub/
├── 📁 backend/                          # Backend API Server
│   ├── 📁 src/
│   │   ├── 📁 config/                   # Configuration files
│   │   │   └── database.js              # PostgreSQL connection & helpers
│   │   ├── 📁 database/                 # Database management
│   │   │   ├── schema.sql               # Complete database schema
│   │   │   ├── migrate.js               # Database migration script
│   │   │   └── seed.js                  # Sample data seeding script
│   │   ├── 📁 middleware/               # Express middleware
│   │   │   ├── auth.js                  # JWT authentication middleware
│   │   │   ├── errorHandler.js          # Global error handling
│   │   │   └── notFound.js              # 404 handler
│   │   ├── 📁 routes/                   # API route handlers
│   │   │   ├── auth.js                  # Authentication routes
│   │   │   ├── users.js                 # User management routes
│   │   │   └── sessions.js              # Study session routes
│   │   ├── 📁 utils/                    # Utility functions
│   │   │   └── email.js                 # Email sending utilities
│   │   └── server.js                    # Main server entry point
│   ├── package.json                     # Backend dependencies
│   ├── Dockerfile                       # Backend container config
│   ├── .gitignore                       # Backend git ignore rules
│   └── env.example                      # Environment variables template
│
├── 📁 src/                              # Frontend React Application
│   ├── 📁 components/                   # Reusable React components
│   │   ├── 📁 ui/                       # Shadcn/ui components
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── aspect-ratio.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── button.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── card.tsx
│   │   │   ├── carousel.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── command.tsx
│   │   │   ├── context-menu.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── drawer.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── hover-card.tsx
│   │   │   ├── input-otp.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── menubar.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── resizable.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── toggle-group.tsx
│   │   │   ├── toggle.tsx
│   │   │   └── tooltip.tsx
│   │   └── ProtectedRoute.tsx           # Route protection component
│   ├── 📁 contexts/                     # React Context providers
│   │   └── AuthContext.tsx              # Authentication context
│   ├── 📁 hooks/                        # Custom React hooks
│   │   ├── use-mobile.tsx               # Mobile detection hook
│   │   └── use-toast.ts                 # Toast notification hook
│   ├── 📁 lib/                          # Utility libraries
│   │   ├── api.ts                       # API client & endpoints
│   │   └── utils.ts                     # General utilities
│   ├── 📁 pages/                        # Page components
│   │   ├── CreateSession.tsx            # Create study session page
│   │   ├── Dashboard.tsx                # Main dashboard page
│   │   ├── Index.tsx                    # Landing page
│   │   ├── Login.tsx                    # Login page
│   │   ├── NotFound.tsx                 # 404 error page
│   │   ├── Profile.tsx                  # User profile page
│   │   ├── Register.tsx                 # Registration page
│   │   └── SessionDetails.tsx           # Session details page
│   ├── App.css                          # Main app styles
│   ├── App.tsx                          # Main app component
│   ├── index.css                        # Global styles
│   ├── main.tsx                         # App entry point
│   └── vite-env.d.ts                    # Vite type definitions
│
├── 📁 public/                           # Static assets
│   ├── favicon.ico                      # Site favicon
│   ├── placeholder.svg                  # Placeholder image
│   └── robots.txt                       # SEO robots file
│
├── 📄 package.json                      # Frontend dependencies & scripts
├── 📄 package-lock.json                 # Dependency lock file
├── 📄 bun.lockb                         # Bun lock file
├── 📄 vite.config.ts                    # Vite configuration
├── 📄 tsconfig.json                     # TypeScript configuration
├── 📄 tsconfig.app.json                 # App TypeScript config
├── 📄 tsconfig.node.json                # Node TypeScript config
├── 📄 tailwind.config.ts                # Tailwind CSS configuration
├── 📄 postcss.config.js                 # PostCSS configuration
├── 📄 eslint.config.js                  # ESLint configuration
├── 📄 components.json                   # Shadcn/ui configuration
├── 📄 index.html                        # HTML entry point
├── 📄 .gitignore                        # Git ignore rules
│
├── 📄 README.md                         # Project documentation
├── 📄 SETUP_GUIDE.md                    # Detailed setup instructions
├── 📄 PROJECT_STRUCTURE.md              # This file
├── 📄 setup.sh                          # Linux/Mac setup script
├── 📄 setup.bat                         # Windows setup script
├── 📄 docker-compose.yml                # Docker services configuration
├── 📄 Dockerfile.frontend               # Frontend container config
└── 📄 .git/                             # Git repository data
```

## 📋 File Descriptions

### 🖥️ **Frontend (React + TypeScript)**

#### **Core Files**
- `src/App.tsx` - Main application component with routing
- `src/main.tsx` - Application entry point
- `src/index.css` - Global CSS styles
- `src/App.css` - App-specific styles

#### **Components**
- `src/components/ui/` - Reusable UI components (Shadcn/ui)
- `src/components/ProtectedRoute.tsx` - Authentication route guard

#### **Pages**
- `src/pages/Index.tsx` - Landing page
- `src/pages/Login.tsx` - User login
- `src/pages/Register.tsx` - User registration
- `src/pages/Dashboard.tsx` - Main dashboard
- `src/pages/CreateSession.tsx` - Create study session
- `src/pages/SessionDetails.tsx` - Session details view
- `src/pages/Profile.tsx` - User profile management
- `src/pages/NotFound.tsx` - 404 error page

#### **Context & State Management**
- `src/contexts/AuthContext.tsx` - Authentication state management
- `src/hooks/` - Custom React hooks
- `src/lib/api.ts` - API client and endpoints
- `src/lib/utils.ts` - Utility functions

### 🖥️ **Backend (Node.js + Express)**

#### **Core Files**
- `backend/src/server.js` - Main server entry point
- `backend/package.json` - Backend dependencies and scripts

#### **Configuration**
- `backend/src/config/database.js` - PostgreSQL connection and helpers
- `backend/env.example` - Environment variables template

#### **Database**
- `backend/src/database/schema.sql` - Complete database schema
- `backend/src/database/migrate.js` - Database migration script
- `backend/src/database/seed.js` - Sample data seeding

#### **Middleware**
- `backend/src/middleware/auth.js` - JWT authentication
- `backend/src/middleware/errorHandler.js` - Global error handling
- `backend/src/middleware/notFound.js` - 404 handler

#### **Routes**
- `backend/src/routes/auth.js` - Authentication endpoints
- `backend/src/routes/users.js` - User management endpoints
- `backend/src/routes/sessions.js` - Study session endpoints

#### **Utilities**
- `backend/src/utils/email.js` - Email sending functionality

### 🐳 **Deployment & DevOps**

#### **Docker**
- `docker-compose.yml` - Multi-service container orchestration
- `backend/Dockerfile` - Backend container configuration
- `Dockerfile.frontend` - Frontend container configuration

#### **Setup Scripts**
- `setup.sh` - Linux/Mac automated setup
- `setup.bat` - Windows automated setup

#### **Configuration Files**
- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - Code linting rules
- `components.json` - Shadcn/ui configuration

## 🏗️ **Architecture Overview**

### **Frontend Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Pages         │    │   Components    │    │   Contexts      │
│                 │    │                 │    │                 │
│ • Dashboard     │    │ • UI Components │    │ • AuthContext   │
│ • Login         │    │ • ProtectedRoute│    │                 │
│ • Register      │    │                 │    │                 │
│ • CreateSession │    │                 │    │                 │
│ • Profile       │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   API Client    │
                    │                 │
                    │ • HTTP requests │
                    │ • Error handling│
                    │ • Token mgmt    │
                    └─────────────────┘
```

### **Backend Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Routes        │    │   Middleware    │    │   Database      │
│                 │    │                 │    │                 │
│ • /auth         │    │ • Authentication│    │ • PostgreSQL    │
│ • /users        │    │ • Error Handler │    │ • Migrations    │
│ • /sessions     │    │ • Rate Limiting │    │ • Seeding       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Utilities     │
                    │                 │
                    │ • Email Service │
                    │ • Validation    │
                    │ • Security      │
                    └─────────────────┘
```

## 📊 **Database Schema Overview**

### **Core Tables**
- **users** - User accounts and profiles
- **study_sessions** - Study session information
- **session_participants** - Many-to-many relationships
- **session_messages** - In-session chat messages
- **user_relationships** - Friend/following system
- **session_reviews** - Ratings and feedback
- **user_preferences** - User settings

### **Key Relationships**
```
users (1) ──── (many) study_sessions (creator)
users (many) ──── (many) study_sessions (participants)
study_sessions (1) ──── (many) session_messages
users (many) ──── (many) users (relationships)
```

## 🔧 **Development Workflow**

1. **Setup** - Run setup script or manual installation
2. **Database** - Run migrations and seed data
3. **Development** - Start both frontend and backend servers
4. **Testing** - Use API endpoints and frontend features
5. **Deployment** - Use Docker or manual deployment

This structure follows modern software engineering best practices with clear separation of concerns, modular architecture, and comprehensive documentation. 