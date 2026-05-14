# Project Structure

## Overview
Ini adalah struktur folder project Hono Starter yang menggunakan arsitektur layered dengan pembagian per module/fitur.

```
hono_starter/
├── drizzle/                    # Migrasi database
│   ├── 0000_lyrical_shotgun.sql
│   └── meta/
│       ├── _journal.json
│       └── 0000_snapshot.json
├── src/
│   ├── index.ts               # Entry point aplikasi
│   ├── app/                   # Module aplikasi (fitur bisnis)
│   │   ├── menu/
│   │   │   ├── contract/      # Interface/Type definition
│   │   │   │   └── menu.contract.ts
│   │   │   ├── controller/    # HTTP request handler
│   │   │   │   └── menu.controller.ts
│   │   │   ├── dto/           # Data Transfer Object
│   │   │   │   ├── menu-request.dto.ts
│   │   │   │   └── menu-response.dto.ts
│   │   │   ├── repository/    # Data access layer
│   │   │   │   ├── menu-read.repository.ts
│   │   │   │   └── menu-write.repository.ts
│   │   │   ├── route/         # Route definition & OpenAPI
│   │   │   │   ├── menu.openapi.ts
│   │   │   │   └── menu.route.ts
│   │   │   └── service/       # Business logic
│   │   │       └── menu.service.ts
│   │   ├── role/              # Role management module
│   │   │   ├── contract/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── repository/
│   │   │   ├── route/
│   │   │   └── service/
│   │   ├── role_permission/   # Role permission module
│   │   │   ├── contract/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── repository/
│   │   │   ├── route/
│   │   │   └── service/
│   │   ├── upload/            # File upload module
│   │   │   ├── controller/
│   │   │   └── route/
│   │   └── user/              # User management module
│   │       ├── contract/
│   │       ├── controller/
│   │       │   ├── user-auth.controller.ts
│   │       │   ├── user-navigation.controller.ts
│   │       │   └── user.controller.ts
│   │       ├── dto/
│   │       ├── repository/
│   │       │   ├── user-navigation.repository.ts
│   │       │   ├── user-read.repository.ts
│   │       │   └── user-write.repository.ts
│   │       ├── route/
│   │       └── service/
│   │           ├── user-auth.service.ts
│   │           ├── user-navigation.service.ts
│   │           └── user.service.ts
│   ├── db/                    # Database configuration
│   │   ├── connection.ts      # Database connection setup
│   │   ├── index.ts
│   │   ├── migrate.ts         # Database migration runner
│   │   ├── schema.ts          # Database schema definition
│   │   └── seed.ts            # Database seeding
│   ├── docs/                  # Documentation & OpenAPI
│   │   ├── openapi-common.ts  # Common OpenAPI definitions
│   │   ├── openapi-schemas.ts # OpenAPI schemas
│   │   └── openapi.ts         # Main OpenAPI setup
│   ├── middleware/            # Express-like middleware
│   │   ├── appToken.ts        # Token/credentials middleware
│   │   ├── auth.ts            # Authentication middleware
│   │   ├── errorHandler.ts    # Error handling middleware
│   │   ├── originGuard.ts     # CORS/origin validation
│   │   └── permission.ts      # Permission checking middleware
│   └── utils/                 # Utility functions
│       ├── cloudinary.ts      # Cloudinary integration
│       └── jwt.ts             # JWT token handling
├── drizzle.config.ts          # Drizzle ORM configuration
├── package.json               # Project dependencies
├── tsconfig.json              # TypeScript configuration
├── vercel.json                # Vercel deployment config
└── README.md                  # Project readme
```

## Penjelasan Folder Utama

### `/drizzle`
Berisi file migrasi database yang dihasilkan oleh Drizzle ORM. Setiap file migrasi merepresentasikan perubahan skema database.

### `/src/app`
Mengelompokkan kode aplikasi berdasarkan fitur/module (Module-based architecture). Setiap module memiliki struktur yang sama:
- **contract**: Type definition dan interface utama entitas.
- **dto**: Zod Schemas & Data Transfer Object (Menangani validasi ketat untuk input/output API).
- **route**: Definisi endpoint, registrasi global middleware, dan integrasi OpenAPI.
- **controller**: Menangani HTTP request/response. Berkat *global error handler* dan *Zod validation*, layer ini sangat tipis dan terbebas dari validasi/try-catch manual.
- **service**: Business logic aplikasi.
- **repository**: Layer akses data (database query builder).

### `/src/db`
Konfigurasi database dan migrasi:
- `connection.ts`: Setup koneksi ke database
- `schema.ts`: Definisi tabel dan relasi
- `migrate.ts`: Script runner untuk migrasi
- `seed.ts`: Script untuk populate data awal

### `/src/docs`
Dokumentasi API menggunakan OpenAPI/Swagger specification.

### `/src/middleware`
Middleware untuk request processing:
- Authentication & Authorization
- Error handling
- CORS/origin validation
- Token management

### `/src/utils`
Fungsi-fungsi utilitas yang reusable (JWT, image upload, dll).

## Alur Data (Data Flow)

```
HTTP Request
    ↓
Route (route.ts)
    ↓
Middleware (auth.ts, permission.ts)
    ↓
Controller (controller.ts)
    ↓
Service (service.ts) - Business Logic
    ↓
Repository (repository.ts) - Database Query
    ↓
Database
```

## Module yang Tersedia

1. **Menu** - Manajemen menu navigasi
2. **Role** - Manajemen role/posisi user
3. **Role Permission** - Manajemen permission per role
4. **User** - Manajemen user, auth, dan navigation
5. **Upload** - File upload handling

## Teknologi yang Digunakan

- **Framework**: Hono.js (lightweight web framework)
- **Validation & Routing**: Zod & @hono/zod-openapi
- **Database**: MySQL dengan Drizzle ORM
- **Language**: TypeScript
- **API Documentation**: Scalar (@scalar/hono-api-reference)
- **Deployment**: Vercel
