<p align="center">
  <img src="https://img.shields.io/badge/Nexora-Backend%20API-14b8a6?style=for-the-badge&logo=express&logoColor=white" alt="Nexora Backend" />
</p>

<h1 align="center">Nexora — Backend API</h1>

<p align="center">
  <strong>RESTful API server powering the Nexora Learning Management System</strong><br/>
  Express 5 · Prisma ORM · Better Auth · Stripe · Cloudinary
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Prisma-7.x-2D3748?logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Stripe-API-635BFF?logo=stripe&logoColor=white" alt="Stripe" />
</p>

---

## 🌐 Live Demo

| Service  | URL                                      |
| -------- | ---------------------------------------- |
| API Base | [nexora-backend-rust.vercel.app](https://nexora-backend-rust.vercel.app) |
| Frontend | [https://nexorafrontend-one.vercel.app](https://nexorafrontend-one.vercel.app) |

---

## 🔌 API Endpoints

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint                          | Description                          | Auth |
|--------|-----------------------------------|--------------------------------------|:----:|
| POST   | `/api/auth/register`              | Register a new user                  | ❌   |
| POST   | `/api/auth/login`                 | Login with email & password          | ❌   |
| GET    | `/api/auth/me`                    | Get current user session             | ✅   |
| POST   | `/api/auth/logout`                | Logout (clear cookies)               | ❌   |
| POST   | `/api/auth/verify-email`          | Verify email with OTP                | ❌   |
| POST   | `/api/auth/resend-verification-email` | Resend verification OTP          | ❌   |
| POST   | `/api/auth/forgetPassword`        | Request password reset OTP           | ❌   |
| POST   | `/api/auth/verifyResetOtp`        | Verify password reset OTP            | ❌   |
| POST   | `/api/auth/resetPassword`         | Reset password with token            | ❌   |
| POST   | `/api/auth/changePassword`        | Change password (logged in)          | ✅   |
| PATCH  | `/api/auth/updateProfile`         | Update user profile                  | ✅   |
| GET    | `/api/auth/login/google`          | Initiate Google OAuth flow           | ❌   |
| GET    | `/api/auth/google/success`        | Google OAuth callback handler        | ❌   |

### 📚 Courses (`/api/courses`)

| Method | Endpoint                                | Description                          | Auth |
|--------|-----------------------------------------|--------------------------------------|:----:|
| GET    | `/api/courses`                          | List teacher's courses               | ✅   |
| POST   | `/api/courses`                          | Create a new course                  | ✅   |
| GET    | `/api/courses/:id`                      | Get course details                   | ✅   |
| PATCH  | `/api/courses/:id`                      | Update course                        | ✅   |
| POST   | `/api/courses/:id/submit`               | Submit course for approval           | ✅   |
| POST   | `/api/courses/:id/close`                | Close a course                       | ✅   |
| GET    | `/api/courses/:id/public`               | Get public course info               | ❌   |
| GET    | `/api/courses/public`                   | Public course catalog                | ❌   |
| GET    | `/api/courses/:id/missions`             | List missions for a course           | ✅   |
| POST   | `/api/courses/:id/missions`             | Create mission in course             | ✅   |
| PATCH  | `/api/courses/:cId/missions/:mId`       | Update a mission                     | ✅   |
| DELETE | `/api/courses/:cId/missions/:mId`       | Delete a mission                     | ✅   |
| POST   | `/api/courses/:cId/missions/:mId/submit`| Submit mission for approval          | ✅   |
| GET    | `/api/courses/:id/price-requests`       | Get price requests for course        | ✅   |
| POST   | `/api/courses/:id/price-request`        | Create a price request               | ✅   |
| GET    | `/api/courses/:id/enrollments`          | Get enrollments for course           | ✅   |
| GET    | `/api/courses/:id/enrollments/stats`    | Get enrollment statistics            | ✅   |

### 📝 Missions & Content (`/api/missions`)

| Method | Endpoint                                | Description                          | Auth |
|--------|-----------------------------------------|--------------------------------------|:----:|
| GET    | `/api/missions/:id/contents`            | List content for a mission           | ✅   |
| POST   | `/api/missions/:id/contents`            | Add content to a mission             | ✅   |
| DELETE | `/api/missions/:mId/contents/:cId`      | Delete a content item                | ✅   |
| PATCH  | `/api/missions/:id/contents/reorder`    | Reorder mission contents             | ✅   |

### 💳 Payments (`/api/payments`)

| Method | Endpoint                          | Description                          | Auth |
|--------|-----------------------------------|--------------------------------------|:----:|
| POST   | `/api/payments/create-intent`     | Create Stripe payment intent         | ✅   |
| POST   | `/api/payments/confirm`           | Confirm payment after Stripe success | ✅   |
| POST   | `/api/payments/enroll/:courseId`   | Free enrollment                      | ✅   |
| GET    | `/api/payments/status/:courseId`   | Get payment status for course        | ✅   |
| GET    | `/api/payments/history`           | Student payment history              | ✅   |
| POST   | `/api/payments/sync/:courseId`     | Sync payment with Stripe             | ✅   |
| POST   | `/api/payments/sync-pending`      | Sync all pending payments            | ✅   |

### 🎓 Student APIs (`/api/student`)

| Method | Endpoint                                        | Description                      | Auth |
|--------|-------------------------------------------------|----------------------------------|:----:|
| GET    | `/api/student/enrollments`                      | My enrolled courses              | ✅   |
| GET    | `/api/student/enrollments/:courseId`             | Enrollment details               | ✅   |
| POST   | `/api/student/enrollments/:cId/missions/:mId/complete` | Mark mission complete     | ✅   |
| GET    | `/api/student/missions/:mId/contents`           | Get mission content (student)    | ✅   |
| GET    | `/api/student/leaderboard`                      | Get leaderboard                  | ✅   |
| GET    | `/api/student/leaderboard/opt-in-status`        | Check opt-in status              | ✅   |
| POST   | `/api/student/leaderboard/opt-in`               | Opt into leaderboard             | ✅   |
| POST   | `/api/student/leaderboard/opt-out`              | Opt out of leaderboard           | ✅   |
| GET    | `/api/student/study-planner`                    | Get study goals                  | ✅   |
| GET    | `/api/student/study-planner/streak`             | Get study streak                 | ✅   |
| POST   | `/api/student/study-planner`                    | Create study goal                | ✅   |
| PATCH  | `/api/student/study-planner/:id`                | Update study goal                | ✅   |
| DELETE | `/api/student/study-planner/:id`                | Delete study goal                | ✅   |
| GET    | `/api/student/annotations/resources`            | Get annotatable resources        | ✅   |
| GET    | `/api/student/annotations`                      | Get my annotations               | ✅   |
| GET    | `/api/student/annotations/shared`               | Get shared annotations           | ✅   |
| POST   | `/api/student/annotations`                      | Create annotation                | ✅   |
| PATCH  | `/api/student/annotations/:id`                  | Update annotation                | ✅   |
| DELETE | `/api/student/annotations/:id`                  | Delete annotation                | ✅   |

### 👨‍🏫 Teacher APIs (`/api/teacher`)

| Method | Endpoint                              | Description                      | Auth |
|--------|---------------------------------------|----------------------------------|:----:|
| GET    | `/api/teacher/earnings`               | Get teacher earnings             | ✅   |
| GET    | `/api/teacher/earnings/transactions`  | Get earning transactions         | ✅   |
| GET    | `/api/teacher/analytics`              | Teacher dashboard analytics      | ✅   |
| GET    | `/api/teacher/session-history`        | Past session history             | ✅   |
| GET    | `/api/teacher/task-templates`         | Get task templates               | ✅   |
| POST   | `/api/teacher/task-templates`         | Create task template             | ✅   |
| PATCH  | `/api/teacher/task-templates/:id`     | Update task template             | ✅   |
| DELETE | `/api/teacher/task-templates/:id`     | Delete task template             | ✅   |
| GET    | `/api/teacher/notices`                | Get teacher notices              | ✅   |
| PATCH  | `/api/teacher/notices/:id/read`       | Mark notice as read              | ✅   |

### 🛡 Admin APIs (`/api/admin`)

| Method | Endpoint                                | Description                      | Auth |
|--------|-----------------------------------------|----------------------------------|:----:|
| GET    | `/api/admin/courses`                    | List all courses (with filters)  | ✅   |
| GET    | `/api/admin/courses/:id`                | Get course details               | ✅   |
| POST   | `/api/admin/courses/:id/approve`        | Approve a course                 | ✅   |
| POST   | `/api/admin/courses/:id/reject`         | Reject a course                  | ✅   |
| DELETE | `/api/admin/courses/:id`                | Delete a course                  | ✅   |
| POST   | `/api/admin/courses/:id/feature`        | Toggle featured status           | ✅   |
| PATCH  | `/api/admin/courses/:id/revenue-percent`| Set revenue percentage           | ✅   |
| GET    | `/api/admin/missions`                   | List missions (with filters)     | ✅   |
| POST   | `/api/admin/missions/:id/approve`       | Approve a mission                | ✅   |
| POST   | `/api/admin/missions/:id/reject`        | Reject a mission                 | ✅   |
| GET    | `/api/admin/price-requests`             | List price requests              | ✅   |
| POST   | `/api/admin/price-requests/:id/approve` | Approve price request            | ✅   |
| POST   | `/api/admin/price-requests/:id/reject`  | Reject price request             | ✅   |
| GET    | `/api/admin/enrollments`                | List all enrollments             | ✅   |
| GET    | `/api/admin/revenue`                    | Get revenue overview             | ✅   |
| GET    | `/api/admin/revenue/transactions`       | Get revenue transactions         | ✅   |
| POST   | `/api/admin/createTeacher`              | Create teacher accounts by email | ✅   |
| POST   | `/api/admin/createAdmin`                | Create admin accounts by email   | ✅   |

### 🛡 Admin Platform (`/api/admin/platform`)

| Method | Endpoint                                    | Description                      | Auth |
|--------|---------------------------------------------|----------------------------------|:----:|
| GET    | `/api/admin/platform/analytics`             | Platform-wide analytics          | ✅   |
| GET    | `/api/admin/platform/announcements`         | List announcements               | ✅   |
| POST   | `/api/admin/platform/announcements`         | Create announcement              | ✅   |
| DELETE | `/api/admin/platform/announcements/:id`     | Delete announcement              | ✅   |
| GET    | `/api/admin/platform/clusters`              | List clusters                    | ✅   |
| GET    | `/api/admin/platform/moderation`            | Content moderation feed          | ✅   |
| DELETE | `/api/admin/platform/moderation/courses/:id`| Remove flagged course            | ✅   |
| POST   | `/api/admin/platform/moderation/warn/:uid`  | Warn a user                      | ✅   |
| GET    | `/api/admin/platform/certificates`          | List certificates                | ✅   |
| POST   | `/api/admin/platform/certificates/:eid`     | Generate certificate             | ✅   |
| POST   | `/api/admin/platform/enroll`                | Admin-enroll a user              | ✅   |
| POST   | `/api/admin/platform/unenroll`              | Admin-unenroll a user            | ✅   |
| GET    | `/api/admin/platform/email-templates`       | List email templates             | ✅   |
| POST   | `/api/admin/platform/email-templates`       | Create email template            | ✅   |
| PATCH  | `/api/admin/platform/email-templates/:id`   | Update email template            | ✅   |
| DELETE | `/api/admin/platform/email-templates/:id`   | Delete email template            | ✅   |

### 🛡 Admin Users (`/api/admin/users`)

| Method | Endpoint                              | Description                      | Auth |
|--------|---------------------------------------|----------------------------------|:----:|
| GET    | `/api/admin/users`                    | List all users (paginated)       | ✅   |
| GET    | `/api/admin/users/:id`                | Get user details                 | ✅   |
| PATCH  | `/api/admin/users/:id`                | Update user                      | ✅   |
| DELETE | `/api/admin/users/:id`                | Deactivate user                  | ✅   |
| POST   | `/api/admin/users/:id/reset-password` | Reset user's password            | ✅   |
| POST   | `/api/admin/users/:id/impersonate`    | Impersonate user                 | ✅   |

### ⚙️ Settings (`/api/settings`)

| Method | Endpoint                 | Description                      | Auth |
|--------|--------------------------|----------------------------------|:----:|
| GET    | `/api/settings/account`  | Get account + profile + prefs    | ✅   |
| PATCH  | `/api/settings/account`  | Update account settings          | ✅   |

### 🔧 Other Endpoints

| Method | Endpoint              | Description                      | Auth |
|--------|-----------------------|----------------------------------|:----:|
| GET    | `/api/cluster`         | List clusters                    | ✅   |
| GET    | `/api/homePage`        | Homepage dynamic content         | ❌   |
| GET    | `/`                    | Health check                     | ❌   |

---

## 🛠 Tech Stack

| Layer          | Technology                                  |
| -------------- | ------------------------------------------- |
| Runtime        | **Node.js 20+**                             |
| Framework      | **Express 5**                               |
| Language       | **TypeScript 5**                            |
| ORM            | **Prisma 7** (multi-file schema)            |
| Database       | **PostgreSQL** (Neon serverless)             |
| Authentication | **Better Auth** + custom JWT middleware      |
| Payments       | **Stripe** (Payment Intents + webhooks)      |
| File Storage   | **Cloudinary** (images, resources)           |
| Email          | **Nodemailer** + **EJS** templates           |
| Validation     | **Zod** schemas                              |
| Build          | **tsup** (ESM bundle for Vercel)             |
| Deployment     | **Vercel** (serverless functions)            |

---

## 📁 Project Structure

```
nexora_backend/
├── prisma/
│   ├── schema/                 # Multi-file Prisma schema
│   │   ├── schema.prisma       # Datasource & generator config
│   │   ├── auth.prisma         # User, Session, Account models
│   │   ├── course.prisma       # Course, Mission, Content models
│   │   ├── payment.prisma      # Payment & enrollment models
│   │   ├── roles.prisma        # Role-specific models
│   │   ├── teacherProfile.prisma
│   │   ├── studentProfile.prisma
│   │   ├── adminProfile.prisma
│   │   ├── resource.prisma     # Learning resources
│   │   ├── cluster.prisma      # Study clusters
│   │   ├── task.prisma         # Tasks & homework
│   │   ├── announcement.prisma # Global announcements
│   │   └── ... (26 schema files)
│   └── migrations/             # Database migration history
├── src/
│   ├── modules/
│   │   ├── auth/               # Register, Login, OAuth, Email verify
│   │   ├── course/             # Course CRUD & management
│   │   ├── mission/            # Mission & content management
│   │   ├── payments/           # Stripe integration
│   │   ├── admin/              # Admin APIs (courses, users, platform)
│   │   ├── teacher/            # Teacher APIs
│   │   ├── student/            # Student APIs
│   │   ├── studentDashboard/   # Leaderboard, planner, annotations
│   │   ├── teacherDashboard/   # Analytics, notices, templates
│   │   ├── settings/           # Account settings
│   │   ├── cluster/            # Study clusters
│   │   ├── resource/           # Resource management
│   │   ├── studySession/       # Study sessions
│   │   └── homePage/           # Homepage content
│   ├── middleware/
│   │   ├── checkAuth.ts        # JWT authentication guard
│   │   └── globalErrorHandler.ts
│   ├── lib/
│   │   └── auth.ts             # Better Auth configuration
│   ├── config/                 # App configuration
│   ├── templates/              # EJS email templates
│   ├── utils/                  # Shared utilities
│   ├── interfaces/             # TypeScript interfaces
│   ├── errorHelpers/           # Custom error classes
│   ├── app.ts                  # Express app setup & route registration
│   └── server.ts               # Server entry point
├── .env                        # Environment variables
├── package.json
├── tsconfig.json
├── prisma.config.ts
└── vercel.json                 # Vercel deployment config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.x
- **npm** ≥ 9.x
- **PostgreSQL** database (or [Neon](https://neon.tech) serverless Postgres)
- **Stripe** account for payment processing
- **Cloudinary** account for media uploads
- **Gmail** app password for SMTP email

### 1. Install dependencies

```bash
cd nexora_backend
npm install
```

### 2. Setup environment variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/nexora?sslmode=require"

# Better Auth
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:5000

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# Email (SMTP)
EMAIL_SENDER_SMTP_HOST=smtp.gmail.com
EMAIL_SENDER_SMTP_PORT=465
EMAIL_SENDER_SMTP_USER=your_email@gmail.com
EMAIL_SENDER_SMTP_PASS=your_app_password
EMAIL_SENDER_SMTP_FROM=your_email@gmail.com

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend
FRONTEND_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Super Admin Seed
SUPER_ADMIN_EMAIL=admin@nexora.com
SUPER_ADMIN_PASSWORD=Admin@123456
```

### 3. Setup the database

```bash
# Generate Prisma client
npm run generate

# Run database migrations
npm run migrate

# (Optional) Seed super admin account
npm run seeding
```

### 4. Run the development server

```bash
npm run dev
```

The API server will be available at [http://localhost:5000](http://localhost:5000).

---

## 🧠 Key Concepts / Architecture

### Modular Architecture
Each feature domain lives in its own module under `src/modules/` with a consistent structure:
```
module/
├── module.route.ts       # Express router definitions
├── module.controller.ts  # Request handlers
├── module.service.ts     # Business logic
└── module.type.ts        # Zod schemas & TypeScript types
```

### Authentication Flow
1. **Registration** → user created → verification OTP sent via email
2. **Email verification** → 6-digit OTP validated → `emailVerified: true`
3. **Login** → JWT access + refresh tokens set as HTTP-only cookies
4. **Google OAuth** → Better Auth handles callback → auto-register/login → redirect to frontend
5. **Session check** → `GET /api/auth/me` reads JWT from cookies → returns user data

### Multi-File Prisma Schema
The database schema is split across 26 `.prisma` files in `prisma/schema/` for maintainability. Each file covers a specific domain (auth, courses, payments, etc.).

### Role-Based Access Control
- **checkAuth middleware** validates JWT tokens on every protected route
- Three roles: `ADMIN`, `TEACHER`, `STUDENT`
- Each role has dedicated API routes with service-level permission checks

### Payment Processing
- **Free courses**: Direct enrollment via `/api/payments/enroll/:courseId`
- **Paid courses**: Stripe Payment Intents → client confirms → backend syncs → enrollment created
- **Revenue tracking**: Platform keeps a configurable percentage per course

---

## ⚡ Performance & Optimization

| Technique | Implementation |
|-----------|---------------|
| **Connection pooling** | Neon serverless with `@prisma/adapter-pg` |
| **Stateless auth** | JWT tokens — no session store needed |
| **Selective fields** | Prisma `select` / `include` to minimize data transfer |
| **Pagination** | All list endpoints support `page` & `limit` params |
| **No-op guard** | `checkAuth()` middleware skips DB on invalid tokens |
| **ESM build** | `tsup` bundles to ESM for modern Node.js runtime |
| **Serverless-ready** | Vercel deployment via `vercel.json` + `api/` output |
| **Template caching** | EJS email templates compiled once at boot |

---

## 👤 Author

**Md Abu Syeed Abdullah**

- 📧 Email: [abusyeed2001@gmail.com](mailto:abusyeed2001@gmail.com)
- 🔗 GitHub: [github.com/asapial](https://github.com/asapial)


---

<p align="center">
  Built with ❤️ using Express, Prisma & TypeScript
</p>
