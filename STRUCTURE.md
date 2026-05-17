# Project Structure

## Overview
Backend API berbasis **Hono.js** dengan arsitektur **Module-based Layered Architecture**. Project ini menyediakan sistem manajemen user, role, menu, dan permission (RBAC) dengan dukungan OpenAPI documentation dan file upload via Cloudinary.

- **Runtime**: Bun
- **Framework**: Hono.js
- **Database**: MySQL via Drizzle ORM
- **Validation**: Zod + @hono/zod-openapi
- **Deployment**: Vercel (serverless)
- **API Docs**: Scalar (via @scalar/hono-api-reference)

---

## Folder Tree

```
cafe-be-app/
├── drizzle/                        # Migrasi database (auto-generated oleh drizzle-kit)
│   ├── 0000_lyrical_shotgun.sql
│   └── meta/
│       ├── _journal.json
│       └── 0000_snapshot.json
├── src/
│   ├── index.ts                    # Entry point - app setup, global middleware, route mounting
│   ├── app/                        # Feature modules (domain-driven)
│   │   ├── menu/                   # Manajemen menu navigasi
│   │   │   ├── contract/           # Entity type definition
│   │   │   │   └── menu.contract.ts
│   │   │   ├── controller/         # HTTP handler (tipis, tanpa validasi manual)
│   │   │   │   └── menu.controller.ts
│   │   │   ├── dto/                # Zod schemas untuk request/response
│   │   │   │   ├── menu-request.dto.ts
│   │   │   │   └── menu-response.dto.ts
│   │   │   ├── repository/         # Database queries (CQRS split)
│   │   │   │   ├── menu-read.repository.ts
│   │   │   │   └── menu-write.repository.ts
│   │   │   ├── route/              # OpenAPI route definitions + middleware registration
│   │   │   │   ├── menu.openapi.ts
│   │   │   │   └── menu.route.ts
│   │   │   └── service/            # Business logic
│   │   │       └── menu.service.ts
│   │   ├── role/                   # CRUD role (struktur identik)
│   │   ├── role_permission/        # CRUD role permission + RBAC query
│   │   ├── upload/                 # Cloudinary signed upload (hanya controller + route)
│   │   └── user/                   # User management, auth, navigation
│   │       ├── contract/
│   │       │   └── user.contract.ts
│   │       ├── controller/
│   │       │   ├── user-auth.controller.ts       # Login handler
│   │       │   ├── user-navigation.controller.ts # Sidebar navigation tree
│   │       │   └── user.controller.ts            # CRUD user
│   │       ├── dto/
│   │       │   ├── user-request.dto.ts
│   │       │   └── user-response.dto.ts
│   │       ├── repository/
│   │       │   ├── user-navigation.repository.ts # Navigation tree builder
│   │       │   ├── user-read.repository.ts
│   │       │   └── user-write.repository.ts
│   │       ├── route/
│   │       │   ├── user.openapi.ts
│   │       │   └── user.route.ts
│   │       └── service/
│   │           ├── user-auth.service.ts
│   │           ├── user-navigation.service.ts
│   │           └── user.service.ts
│   ├── db/                         # Database layer
│   │   ├── connection.ts           # Drizzle + mysql2 connection
│   │   ├── index.ts                # Re-exports db & schema
│   │   ├── migrate.ts              # Migration runner script
│   │   ├── schema.ts               # Drizzle table definitions
│   │   └── seed.ts                 # Initial data seeder
│   ├── docs/                       # OpenAPI documentation infrastructure
│   │   ├── openapi-common.ts       # Shared helpers, schemas, utilities
│   │   ├── openapi-schemas.ts      # Reusable entity schemas (Zod → OpenAPI)
│   │   └── openapi.ts              # Document merger & Scalar setup
│   ├── middleware/                  # Global & shared middleware
│   │   ├── appToken.ts             # X-App-Token validation + request logger
│   │   ├── auth.ts                 # JWT Bearer authentication
│   │   ├── errorHandler.ts         # Global error handler + 404 handler
│   │   ├── originGuard.ts          # CORS policy + origin whitelist
│   │   └── permission.ts           # Dynamic RBAC permission checker
│   └── utils/                      # Utility functions
│       ├── cloudinary.ts           # Cloudinary config, signed upload, image delete
│       └── jwt.ts                  # JWT generate, verify, decode
├── drizzle.config.ts               # Drizzle Kit configuration
├── package.json                    # Dependencies & scripts (Bun)
├── tsconfig.json                   # TypeScript config
├── vercel.json                     # Vercel deployment config
├── .env.example                    # Environment variables template
└── README.md
```

---

## Database Schema

4 tabel utama dengan relasi:

```
┌──────────────┐     ┌──────────────────┐
│    roles     │     │      menus       │
├──────────────┤     ├──────────────────┤
│ id (PK)      │     │ id (PK)          │
│ code (UQ)    │     │ name             │
│ name         │     │ path             │
│ created_at   │     │ permission_path  │ ← digunakan utk RBAC matching
│ updated_at   │     │ icon             │
└──────┬───────┘     │ parent_id (FK→id)│ ← self-referencing (hierarchical menu)
       │             │ created_at       │
       │             │ updated_at       │
       │             └────────┬─────────┘
       │                      │
       ▼                      ▼
┌──────────────┐     ┌──────────────────┐
│    users     │     │ role_permissions  │
├──────────────┤     ├──────────────────┤
│ id (PK)      │     │ id (PK)          │
│ email (UQ)   │     │ role_id (FK→roles)│
│ password     │     │ menu_id (FK→menus)│
│ name         │     │ can_read         │
│ role_id (FK) │────→│ can_create       │
│ created_at   │     │ can_update       │
│ updated_at   │     │ can_delete       │
└──────────────┘     │ can_report       │
                     │ created_at       │
                     │ updated_at       │
                     └──────────────────┘
```

**Catatan penting:**
- `menus.permission_path` berisi path API (contoh: `/api/roles`) yang digunakan oleh `permission.ts` middleware untuk mencocokkan permission secara dinamis
- `menus.parent_id` mendukung hierarki menu (parent → children) untuk sidebar navigation
- `role_permissions` menghubungkan role ke menu dengan 5 flag aksi: `can_read`, `can_create`, `can_update`, `can_delete`, `can_report`

---

## Alur Request (Request Flow)

### Protected Endpoint (standar)
```
HTTP Request
    ↓
[Global Middleware - index.ts]
    ├── corsMiddleware        → CORS headers
    ├── originGuard           → Whitelist origin validation
    ├── logger()              → Hono built-in logger
    └── loggerMiddleware      → Custom timing logger
    ↓
[Module Middleware - route.ts]
    ├── jwtMiddleware         → Verify Bearer token, attach user ke context
    ├── appTokenMiddleware    → Verify X-App-Token header
    └── requirePermission()   → Dynamic RBAC: resolve path → lookup role_permissions → check action
    ↓
[Zod Validation - OpenAPIHono defaultHook]
    └── Auto-validate request body/params berdasarkan schema di *.openapi.ts
    ↓
Controller (*.controller.ts)
    └── Extract params/body → call Service → return JSON response
    ↓
Service (*.service.ts)
    └── Business logic → call Repository
    ↓
Repository (*-read.repository.ts / *-write.repository.ts)
    └── Drizzle query builder → Database
    ↓
Database (MySQL)
```

### Public Endpoint (login)
```
HTTP Request → POST /api/users/login
    ↓
[Global Middleware] → CORS, Origin Guard, Logger
    ↓
[Zod Validation] → loginRequestSchema (email, password)
    ↓
UserAuthController.login
    ↓
UserAuthService.login → bcrypt compare → generateToken (JWT)
    ↓
Response: { token, user }
```

---

## Arsitektur Module

Setiap module mengikuti **6-layer pattern** yang konsisten:

### 1. Contract (`contract/*.contract.ts`)
- **Tujuan**: Type definition murni (TypeScript types)
- **Pattern**: `export type EntityNameEntity = { ... }`
- **Contoh**: `MenuEntity`, `PublicUser`, `NavigationItem`

### 2. DTO (`dto/*-request.dto.ts`, `dto/*-response.dto.ts`)
- **Tujuan**: Zod schema untuk validasi input/output + OpenAPI spec generation
- **Request DTO**: `z.object({...}).openapi("CreateXxxRequest")` → `export type CreateXxxRequestDto = z.infer<...>`
- **Response DTO**: Menggunakan `createSuccessEnvelopeSchema()` untuk envelope `{ success, data, message }`
- **Naming**: `create*RequestSchema`, `update*RequestSchema`, `*ListResponseSchema`, `*DetailResponseSchema`, `*MutationResponseSchema`

### 3. Route (`route/*.openapi.ts`, `route/*.route.ts`)
- **`*.openapi.ts`**: Definisi route per-endpoint via `createRoute()` dari `@hono/zod-openapi`
  - Berisi: method, path, tags, security, request schema, response schema
  - Endpoint public menggunakan `security: []`
  - Endpoint protected menggunakan `security: protectedSecurity`
- **`*.route.ts`**: Router setup
  - Membuat router via `createOpenApiRouter()`
  - Register security schemes via `registerDefaultSecuritySchemes(router)`
  - Apply module middleware: `router.use("*", jwtMiddleware, appTokenMiddleware, requirePermission())`
  - Register routes via `registerOpenApiRoute(router, routeConfig, controllerMethod)`
  - Export `getXxxOpenApiDocument()` untuk merger di `openapi.ts`

**Dua pola middleware yang digunakan:**
- **Global di route.ts**: `router.use("*", ...)` → berlaku untuk semua endpoint di module (contoh: menu, role, role_permission)
- **Per-endpoint di openapi.ts**: `middleware: [jwtMiddleware, ...] as const` → hanya untuk endpoint tertentu (contoh: user module yang punya login public)

### 4. Controller (`controller/*.controller.ts`)
- **Pattern**: Static class methods
- **Prinsip**: Sangat tipis - **tidak ada try-catch** (ditangani global error handler), **tidak ada validasi manual** (ditangani Zod defaultHook)
- **Tugas**: Extract param/body → call Service → return `c.json({ success, data, message }, statusCode)`

### 5. Service (`service/*.service.ts`)
- **Pattern**: Static class methods
- **Tugas**: Business logic, existence check sebelum update/delete, orchestrate repository calls
- **Return**: Data langsung atau `null` untuk not-found cases

### 6. Repository (`repository/*-read.repository.ts`, `repository/*-write.repository.ts`)
- **Pattern**: CQRS split (read/write terpisah), static class methods
- **Read**: Select queries, joins, filtering
- **Write**: Insert, update (dengan `updated_at: new Date()`), delete
- **Error handling**: try-catch dengan throw new Error untuk memberikan konteks pesan

---

## Sistem RBAC (Dynamic Permission)

Permission middleware (`src/middleware/permission.ts`) bekerja secara **dinamis**:

1. **Resolve path**: Extract `/api/{resource}` dari `c.req.path` → menjadi `permissionPath`
2. **Resolve action**: Map HTTP method ke permission flag:
   - `GET` → `can_read`
   - `POST` → `can_create`
   - `PUT/PATCH` → `can_update`
   - `DELETE` → `can_delete`
3. **Lookup**: Query `role_permissions` JOIN `menus` WHERE `role_id` = user's role AND `menus.permission_path` = resolved path
4. **Check**: Jika permission flag bernilai `true` → `next()`, jika tidak → `403 Forbidden`

**Implikasi saat menambah module baru:**
- Harus menambahkan entry di tabel `menus` dengan `permission_path` yang sesuai (contoh: `/api/new-feature`)
- Harus menambahkan `role_permissions` untuk setiap role yang perlu akses

---

## OpenAPI Documentation System

Sistem dokumentasi terdiri dari 3 lapisan:

### `openapi-common.ts` - Shared Helpers
- `protectedSecurity` - Security requirement array
- `createSuccessEnvelopeSchema()` - Buat response wrapper `{ success, data, message }`
- `apiErrorResponseSchema` - Schema error standar
- `createNumericPathParamsSchema()` - Helper path param `:id`
- `createNullableOptionalCoercedIntSchema()` - Nullable int helper untuk form fields
- `jsonResponse()`, `errorResponses` - Response helper
- `createOpenApiRouter()` - Factory OpenAPIHono dengan Zod validation hook
- `registerOpenApiRoute()` - Bridge controller ke typed route
- `registerDefaultSecuritySchemes()` - Register BearerAuth + AppToken
- `createModuleOpenApiDocument()` - Generate per-module OpenAPI doc

### `openapi-schemas.ts` - Entity Schemas
- Zod schemas untuk semua entity: `roleSchema`, `menuSchema`, `userSchema`, `rolePermissionSchema`, dll.
- Dipakai oleh response DTOs dan OpenAPI documentation

### `openapi.ts` - Document Merger
- Mengumpulkan semua module OpenAPI documents
- Mount paths dengan prefix (`/api/users`, `/api/roles`, dll.)
- Merge menjadi satu unified OpenAPI 3.0.3 document
- Served di `GET /openapi.json`, UI di `GET /docs`

---

## Environment Variables

| Variable | Keterangan |
|---|---|
| `DATABASE_URL` | MySQL connection string |
| `PORT` | Server port (default: 3000) |
| `APP_TOKEN` | Static token untuk header `X-App-Token` |
| `JWT_SECRET` | Secret key untuk JWT sign/verify |
| `ALLOWED_APP_URL` | Comma-separated allowed origins |
| `CLOUDINARY_URL` | Cloudinary connection URL |
| `CLOUDINARY_FOLDER` | Cloudinary upload folder (default: `uploads`) |

---

## NPM Scripts

| Script | Keterangan |
|---|---|
| `bun run dev` | Hot-reload development server |
| `bun run start` | Production server |
| `bun run db:generate` | Generate Drizzle migration files |
| `bun run db:migrate` | Run pending migrations |
| `bun run db:push` | Push schema langsung ke DB (dev only) |
| `bun run db:studio` | Buka Drizzle Studio (DB GUI) |
| `bun run db:seed` | Jalankan seeder (reset + populate data awal) |

---

## API Endpoints

### Public
| Method | Path | Keterangan |
|---|---|---|
| `GET` | `/` | Welcome endpoint |
| `GET` | `/api/health` | Health check |
| `GET` | `/openapi.json` | OpenAPI specification |
| `GET` | `/docs` | Scalar API documentation UI |
| `POST` | `/api/users/login` | User authentication |

### Protected (JWT + AppToken + Permission)
| Method | Path | Keterangan |
|---|---|---|
| `GET` | `/api/users` | List all users |
| `GET` | `/api/users/{id}` | Get user by ID |
| `POST` | `/api/users` | Create user |
| `PUT` | `/api/users/{id}` | Update user |
| `DELETE` | `/api/users/{id}` | Delete user |
| `GET` | `/api/users/me/navigation` | Get current user navigation tree |
| `GET` | `/api/roles` | List all roles |
| `GET` | `/api/roles/{id}` | Get role by ID |
| `POST` | `/api/roles` | Create role |
| `PUT` | `/api/roles/{id}` | Update role |
| `DELETE` | `/api/roles/{id}` | Delete role |
| `GET` | `/api/menus` | List all menus |
| `GET` | `/api/menus/{id}` | Get menu by ID |
| `POST` | `/api/menus` | Create menu |
| `PUT` | `/api/menus/{id}` | Update menu |
| `DELETE` | `/api/menus/{id}` | Delete menu |
| `GET` | `/api/role-permissions` | List all role permissions |
| `GET` | `/api/role-permissions/{id}` | Get role permission by ID |
| `POST` | `/api/role-permissions` | Create role permission |
| `PUT` | `/api/role-permissions/{id}` | Update role permission |
| `DELETE` | `/api/role-permissions/{id}` | Delete role permission |
| `POST` | `/api/uploads/signature` | Generate Cloudinary signed upload params |

### Protected (JWT + AppToken, tanpa Permission check)
| Method | Path | Keterangan |
|---|---|---|
| `GET` | `/api/users/me/navigation` | Navigation tree (hanya butuh auth) |
| `POST` | `/api/uploads/signature` | Upload signature (hanya butuh auth) |

---

## Seed Data

Seeder (`src/db/seed.ts`) membuat data awal:

- **Roles**: `ADMIN` (Administrator), `USER` (User)
- **Users**: `admin@example.com` (role: ADMIN), `user@example.com` (role: USER) — password: `password123`
- **Menus** (hierarchical):
  - Dashboard `/dashboard`
  - Master Data `/master-data`
    - Role `/master-data/roles` → permission_path: `/api/roles`
    - User `/master-data/users` → permission_path: `/api/users`
  - Web Management `/web-management`
    - Menu `/web-management/menus` → permission_path: `/api/menus`
    - Role Permission `/web-management/role-permissions` → permission_path: `/api/role-permissions`
- **Role Permissions**: Admin mendapat full access (semua `can_*` = true) ke semua menu

---

## Teknologi & Dependencies

| Kategori | Package | Versi | Keterangan |
|---|---|---|---|
| **Framework** | `hono` | ^4.12.9 | Lightweight web framework |
| **Validation** | `zod` | ^4.3.6 | Schema validation |
| **OpenAPI** | `@hono/zod-openapi` | ^1.3.0 | Zod ↔ OpenAPI bridge |
| **API Docs** | `@scalar/hono-api-reference` | ^0.10.14 | Interactive API docs UI |
| **Database** | `drizzle-orm` | ^0.45.1 | TypeScript ORM |
| **DB Driver** | `mysql2` | ^3.20.0 | MySQL driver |
| **Auth** | `jsonwebtoken` | ^9.0.3 | JWT handling |
| **Hashing** | `bcryptjs` | ^3.0.3 | Password hashing |
| **Upload** | `cloudinary` | ^2.9.0 | Cloud image management |
| **Env** | `dotenv` | ^17.3.1 | Environment variables |
| **Dev** | `drizzle-kit` | ^0.31.10 | DB migration tooling |
| **Dev** | `tsx` | ^4.21.0 | TypeScript execution |
| **Runtime** | `bun` | 1.3 | JavaScript runtime |
