# Nexora Backend API

The server-side application for **Nexora**, a SaaS learning management platform. This repository contains the REST API, authentication and authorization rules, database access, business logic, payment processing, file storage integrations, email delivery, and server-side security used by the Nexora frontend.

> This backend is maintained separately from the frontend and can be developed, tested, deployed, and scaled independently.

## Backend Overview

Nexora Backend is a modular **Node.js**, **Express**, and **TypeScript** application. It exposes REST endpoints for students, teachers, and administrators while keeping transport logic, business rules, and database operations separated.

The application uses **PostgreSQL** through **Prisma ORM**, **Better Auth** and JWT-based authentication, **Zod** for request validation, and centralized error handling for consistent API responses.

## Key Features

- **User authentication and authorization** — registration, login, email verification, password recovery, Google OAuth, two-factor authentication, and session management.
- **Role-based access control** — protected resources for `ADMIN`, `TEACHER`, and `STUDENT` roles.
- **REST API endpoints** — domain-focused APIs for courses, missions, study sessions, dashboards, resources, payments, settings, and more.
- **Database integration** — PostgreSQL with a typed, multi-file Prisma schema and versioned migrations.
- **Secure environment configuration** — secrets and deployment-specific settings are loaded from environment variables and validated at startup.
- **Error handling and validation** — centralized error middleware, custom application errors, and Zod request schemas.
- **Scalable modular structure** — routes, controllers, services, validation, and types are grouped by feature domain.
- **External integrations** — Stripe payments, Cloudinary uploads, SMTP email, Google OAuth, and AI providers.
- **Deployment ready** — ESM production builds and Vercel serverless configuration.

## Backend Architecture Flow

```text
Client Request
      |
      v
API Route
      |
      v
Middleware (authentication, authorization, validation)
      |
      v
Controller (HTTP request and response handling)
      |
      v
Service Layer (business rules and use cases)
      |
      v
Prisma ORM -> PostgreSQL Database
      |
      v
Standardized JSON Response
```

| Layer | Responsibility |
| --- | --- |
| API route | Matches the URL and HTTP method to the correct handler. |
| Middleware | Checks credentials, roles, request data, cookies, and cross-origin access. |
| Controller | Reads request data, calls a service, and passes the result to the response helper. |
| Service | Implements business logic and coordinates database or third-party operations. |
| Database | Prisma performs type-safe queries against PostgreSQL. |
| Response | A consistent JSON payload or centralized error response is returned to the client. |

Controllers remain intentionally thin. Reusable business rules belong in services, while database access is performed through Prisma.

## Folder Structure

```text
nexora_backend/
|-- api/                       # Generated serverless production bundle
|-- prisma/
|   |-- migrations/            # Versioned PostgreSQL migrations
|   `-- schema/                # Multi-file Prisma models and enums
|-- src/
|   |-- config/                # Environment, Cloudinary, and upload configuration
|   |-- errorHelpers/          # Custom and validation error helpers
|   |-- generated/             # Generated Prisma client
|   |-- interfaces/            # Shared TypeScript declarations
|   |-- lib/                   # Shared clients such as Prisma and authentication
|   |-- middleware/            # Authentication, validation, and global error middleware
|   |-- modules/               # Feature-based application modules
|   |   |-- auth/
|   |   |-- course/
|   |   |-- payments/
|   |   |-- studentDashboard/
|   |   |-- teacherDashboard/
|   |   `-- ...
|   |-- scripts/               # Administrative and seed scripts
|   |-- templates/             # EJS email and redirect templates
|   |-- utils/                 # JWT, cookies, email, responses, PDFs, and helpers
|   |-- app.ts                 # Express configuration and route registration
|   `-- server.ts              # Database connection and HTTP server startup
|-- package.json
|-- prisma.config.ts
|-- tsconfig.json
`-- vercel.json
```

Nexora uses feature-based modules rather than global `routes`, `controllers`, `services`, and `models` directories. Each module may contain files such as:

```text
course/
|-- course.route.ts            # REST endpoint definitions
|-- course.controller.ts       # HTTP request handlers
|-- course.service.ts          # Business and database logic
|-- course.validation.ts       # Zod request schemas
`-- course.type.ts             # Module-specific TypeScript types
```

Common backend folder responsibilities are:

| Folder or concern | Purpose in this project |
| --- | --- |
| Routes | `*.route.ts` files map endpoints to middleware and controllers. |
| Controllers | `*.controller.ts` files translate HTTP requests into service calls. |
| Services | `*.service.ts` files contain business logic and Prisma operations. |
| Models | Prisma models are grouped by domain under `prisma/schema/`. |
| Middleware | `src/middleware/` contains authentication, request validation, and global error handling. |
| Config | `src/config/` centralizes environment and external-service configuration. |
| Utils | `src/utils/` contains small reusable helpers shared across modules. |

## Technology Stack

| Category | Technology |
| --- | --- |
| Runtime | Node.js 20+ |
| Language | TypeScript 5 |
| Web framework | Express 5 |
| Database | PostgreSQL |
| ORM | Prisma 7 with PostgreSQL adapter |
| Authentication | Better Auth, JWT, HTTP-only cookies |
| Password security | Better Auth password hashing and credential management |
| Validation | Zod |
| Payments | Stripe |
| File storage | Cloudinary and Multer |
| Email | Nodemailer and EJS templates |
| Configuration | dotenv |
| Build tooling | tsx and tsup |
| Deployment | Vercel serverless functions |

> Many Node.js backends use Mongoose with MongoDB or bcrypt directly. Nexora instead uses PostgreSQL with Prisma and delegates credential hashing to Better Auth.

## Installation Guide

### Prerequisites

- Node.js 20 or newer
- npm
- A PostgreSQL database
- Credentials for any optional external services you intend to use

### 1. Clone the repository

```bash
git clone <repository-url>
cd Nexora/nexora_backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the environment

Create a `.env` file in `nexora_backend/` and add the variables described below. Never commit this file.

### 4. Generate the Prisma client

```bash
npm run generate
```

### 5. Apply database migrations

```bash
npm run migrate
```

### 6. Optionally seed initial accounts

```bash
npm run seeding
```

## Environment Variables

Use the following template as a starting point:

```dotenv
# Application
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# PostgreSQL
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require

# Better Auth and JWT
BETTER_AUTH_SECRET=replace-with-a-long-random-secret
BETTER_AUTH_URL=http://localhost:5000
ACCESS_TOKEN_SECRET=replace-with-a-long-random-secret
REFRESH_TOKEN_SECRET=replace-with-a-different-long-random-secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=30d
BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN=604800
BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE=86400

# SMTP email
EMAIL_SENDER_SMTP_USER=your-smtp-user
EMAIL_SENDER_SMTP_PASS=your-smtp-password
EMAIL_SENDER_SMTP_HOST=smtp.example.com
EMAIL_SENDER_SMTP_PORT=587
EMAIL_SENDER_SMTP_FROM=no-reply@example.com

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/callback/google

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Payments
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# AI provider
OpenRouter_API_KEY=your-openrouter-api-key

# Optional seed accounts
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=change-this-password
DEMO_TEACHER_EMAIL=teacher@example.com
DEMO_TEACHER_PASSWORD=change-this-password
DEMO_STUDENT_EMAIL=student@example.com
DEMO_STUDENT_PASSWORD=change-this-password
```

Generate strong, unique secrets for every environment. Values such as database credentials, API keys, SMTP passwords, and token secrets must never be placed in source control or shared in logs.

## Running the Backend Locally

Start the development server with automatic reload:

```bash
npm run dev
```

By default, the API is available at `http://localhost:5000`. Verify the server with:

```bash
curl http://localhost:5000/
```

Build the production server:

```bash
npm run build
```

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the TypeScript development server in watch mode. |
| `npm run generate` | Generate the Prisma client. |
| `npm run migrate` | Create or apply a development database migration. |
| `npm run seeding` | Seed configured administrative and demo accounts. |
| `npm run build` | Generate Prisma and bundle the server for Node.js 20. |

## API Documentation Format

All application endpoints are prefixed with `/api`, except the root health check.

Document new endpoints in this format:

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Register a new user. |
| `POST` | `/api/auth/login` | Public | Authenticate a user. |
| `GET` | `/api/courses/public` | Public | List public courses. |
| `GET` | `/api/student/enrollments` | Student | List the current student's enrollments. |
| `GET` | `/api/teacher/analytics` | Teacher | Return teacher dashboard analytics. |
| `GET` | `/api/admin/users` | Admin | Return a paginated user list. |

### Example request

```http
POST /api/auth/login HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "your-password"
}
```

### Example success response

```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": {}
}
```

### Example error response

```json
{
  "success": false,
  "message": "Validation failed",
  "errorSources": [
    {
      "path": "email",
      "message": "A valid email address is required"
    }
  ]
}
```

When adding an endpoint, document its method, path, access role, parameters, request body, success response, validation errors, and relevant HTTP status codes. An OpenAPI/Swagger specification is recommended as the project grows.

## Security Practices

- Store secrets only in environment variables or a managed secrets service.
- Use HTTP-only, secure, and appropriately configured same-site cookies for authentication tokens.
- Keep access tokens short-lived and rotate refresh-token secrets carefully.
- Enforce authentication and role authorization in middleware and recheck resource ownership in services.
- Validate and sanitize all client-controlled input with Zod.
- Restrict CORS to trusted frontend origins in each environment.
- Hash passwords using the authentication provider; never store or log plain-text passwords.
- Use parameterized Prisma queries to reduce SQL injection risk.
- Limit upload size and type, and validate Cloudinary resources before use.
- Verify Stripe webhook signatures before processing payment events.
- Return safe production errors without stack traces or secret values.
- Apply rate limiting, security headers, audit logging, dependency updates, and automated security scans before production launch.

## Future Improvements

- Add OpenAPI/Swagger documentation and interactive API exploration.
- Add unit, integration, and end-to-end test suites.
- Introduce request rate limiting and abuse protection.
- Add Helmet-based security headers and stricter production CORS configuration.
- Add structured logging, request correlation IDs, metrics, and error monitoring.
- Add Redis caching and background job queues for email, exports, and long-running tasks.
- Add CI workflows for linting, type checking, tests, migrations, and security scanning.
- Add API versioning and a documented deprecation policy.
- Expand audit trails for sensitive administrative actions.

## License

This project is licensed under the **ISC License**, as declared in `package.json`.

---

Built for the Nexora SaaS platform with Node.js, Express, TypeScript, Prisma, and PostgreSQL.
