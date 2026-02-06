export const backendTechstacks = [
  // ============ Node.js Backends ============
  {
    slug: 'node-express-mongodb',
    name: 'Node.js Express + MongoDB',
    description: 'Classic Node.js backend with Express and MongoDB',
    tags: ['backend', 'nodejs', 'express', 'mongodb', 'mongoose', 'javascript', 'typescript'],
    techstack: `# Node.js Express + MongoDB Stack

## Runtime & Language
- **Runtime**: Node.js 20+ LTS
- **Language**: TypeScript 5.x with strict mode
- **Package Manager**: pnpm (recommended) or npm

## Core Framework
- **Express.js** 4.x - Minimalist web framework
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **compression** - Response compression
- **morgan** - HTTP request logging

## Database
- **MongoDB** 7.x - Document database
- **Mongoose** 8.x - ODM for MongoDB
- Indexes for frequently queried fields
- Embedded documents for related data

## Validation & Parsing
- **Zod** - Runtime type validation
- **express-validator** - Request validation middleware

## Authentication
- **jsonwebtoken** - JWT tokens
- **bcrypt** - Password hashing
- **passport** (optional) - Authentication strategies

## Development
- **tsx** - TypeScript execution
- **nodemon** - Auto-reload in development
- **dotenv** - Environment variables

## Testing
- **Jest** or **Vitest** - Unit testing
- **Supertest** - HTTP assertions
- **mongodb-memory-server** - In-memory MongoDB for tests

## Project Structure
\`\`\`
src/
├── config/         # Configuration files
├── models/         # Mongoose schemas
├── routes/         # Express routes
├── controllers/    # Request handlers
├── services/       # Business logic
├── middleware/     # Custom middleware
├── utils/          # Helper functions
├── types/          # TypeScript types
└── app.ts          # Express app setup
\`\`\`
`,
    codingGuidelines: `# Express + MongoDB Coding Guidelines

## Route Handlers
- Use async/await with try-catch
- Return consistent response format
- Use proper HTTP status codes

## Error Handling
\`\`\`typescript
// Custom error class
class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

// Error middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: { message: err.message, statusCode }
  });
});
\`\`\`

## Mongoose Best Practices
- Use lean() for read-only queries
- Add indexes for query patterns
- Use virtuals for computed fields
- Implement soft deletes with timestamps
`,
  },

  {
    slug: 'node-express-postgresql',
    name: 'Node.js Express + PostgreSQL',
    description: 'Node.js backend with Express and PostgreSQL using Prisma',
    tags: ['backend', 'nodejs', 'express', 'postgresql', 'prisma', 'typescript'],
    techstack: `# Node.js Express + PostgreSQL Stack

## Runtime & Language
- **Runtime**: Node.js 20+ LTS
- **Language**: TypeScript 5.x with strict mode
- **Package Manager**: pnpm

## Core Framework
- **Express.js** 4.x - Web framework
- **cors**, **helmet**, **compression** - Middleware

## Database
- **PostgreSQL** 16.x - Relational database
- **Prisma** 5.x - Type-safe ORM
- Migrations with Prisma Migrate
- Connection pooling with PgBouncer (production)

## Validation
- **Zod** - Schema validation
- Type inference from Prisma schema

## Authentication
- **@lucia-auth/lucia** or **next-auth** adapter
- Session-based or JWT authentication

## Development
- **prisma studio** - Database GUI
- **prisma generate** - Type generation

## Project Structure
\`\`\`
src/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── routes/
├── controllers/
├── services/
├── middleware/
└── lib/
    └── prisma.ts    # Prisma client singleton
\`\`\`
`,
  },

  {
    slug: 'node-express-drizzle',
    name: 'Node.js Express + Drizzle ORM',
    description: 'Modern Node.js backend with Express and Drizzle ORM',
    tags: ['backend', 'nodejs', 'express', 'drizzle', 'postgresql', 'typescript'],
    techstack: `# Node.js Express + Drizzle Stack

## Runtime & Language
- **Runtime**: Node.js 20+ or Bun
- **Language**: TypeScript 5.x
- **Package Manager**: pnpm or bun

## Core Framework
- **Express.js** 4.x or **Hono** (lightweight alternative)

## Database & ORM
- **PostgreSQL** or **MySQL** or **SQLite**
- **Drizzle ORM** - TypeScript-first ORM
- **drizzle-kit** - Migrations and studio
- **drizzle-zod** - Zod schema generation

## Key Features of Drizzle
- SQL-like syntax, full type safety
- No code generation needed
- Lightweight, serverless-ready
- Built-in relation queries

## Schema Example
\`\`\`typescript
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});
\`\`\`

## Project Structure
\`\`\`
src/
├── db/
│   ├── schema.ts      # Drizzle schema
│   ├── index.ts       # DB connection
│   └── migrations/
├── routes/
├── services/
└── app.ts
\`\`\`
`,
  },

  {
    slug: 'node-nestjs',
    name: 'NestJS Backend',
    description: 'Enterprise-grade Node.js backend with NestJS framework',
    tags: ['backend', 'nodejs', 'nestjs', 'typescript', 'enterprise'],
    techstack: `# NestJS Stack

## Runtime & Language
- **Runtime**: Node.js 20+ LTS
- **Language**: TypeScript 5.x (required)
- **Package Manager**: pnpm or npm

## Core Framework
- **NestJS** 10.x - Progressive Node.js framework
- Modular architecture with dependency injection
- Decorators for routing and validation
- Built-in support for microservices

## Key Packages
- **@nestjs/config** - Configuration management
- **@nestjs/swagger** - OpenAPI documentation
- **@nestjs/throttler** - Rate limiting
- **@nestjs/cache-manager** - Caching
- **@nestjs/schedule** - Task scheduling

## Database Options
- **@nestjs/typeorm** + TypeORM
- **@nestjs/prisma** + Prisma
- **@nestjs/mongoose** + Mongoose

## Validation
- **class-validator** - Decorator-based validation
- **class-transformer** - Object transformation

## Authentication
- **@nestjs/passport** - Passport integration
- **@nestjs/jwt** - JWT utilities

## Testing
- **@nestjs/testing** - Testing utilities
- Jest with built-in support

## Project Structure
\`\`\`
src/
├── modules/
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── dto/
│   │   └── entities/
│   └── auth/
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   └── interceptors/
├── config/
├── app.module.ts
└── main.ts
\`\`\`
`,
    codingGuidelines: `# NestJS Coding Guidelines

## Module Structure
- One feature per module
- Export only what's needed
- Use barrel exports (index.ts)

## DTOs
\`\`\`typescript
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
\`\`\`

## Services
- Keep business logic in services
- Inject dependencies via constructor
- Use interfaces for repositories

## Controllers
- Thin controllers, delegate to services
- Use proper HTTP decorators
- Document with @ApiTags, @ApiOperation
`,
  },

  {
    slug: 'node-fastify',
    name: 'Node.js Fastify Backend',
    description: 'High-performance Node.js backend with Fastify',
    tags: ['backend', 'nodejs', 'fastify', 'typescript', 'performance'],
    techstack: `# Fastify Stack

## Runtime & Language
- **Runtime**: Node.js 20+ LTS
- **Language**: TypeScript 5.x
- **Package Manager**: pnpm

## Core Framework
- **Fastify** 4.x - High-performance web framework
- Schema-based validation (JSON Schema)
- Built-in logging with Pino
- Plugin architecture

## Key Plugins
- **@fastify/cors** - CORS support
- **@fastify/helmet** - Security headers
- **@fastify/jwt** - JWT authentication
- **@fastify/swagger** - OpenAPI docs
- **@fastify/rate-limit** - Rate limiting

## Validation
- JSON Schema (built-in)
- **typebox** - TypeScript-first schema builder

## Why Fastify?
- 2-3x faster than Express
- Built-in schema validation
- Excellent TypeScript support
- Low overhead, async by default
`,
  },

  {
    slug: 'bun-elysia',
    name: 'Bun + Elysia Backend',
    description: 'Ultra-fast backend with Bun runtime and Elysia framework',
    tags: ['backend', 'bun', 'elysia', 'typescript', 'performance'],
    techstack: `# Bun + Elysia Stack

## Runtime & Language
- **Runtime**: Bun 1.x - Fast JavaScript runtime
- **Language**: TypeScript (native support)
- **Package Manager**: bun

## Core Framework
- **Elysia** 1.x - Ergonomic web framework for Bun
- End-to-end type safety
- ~18x faster than Express
- Built-in validation with TypeBox

## Key Plugins
- **@elysiajs/cors** - CORS
- **@elysiajs/jwt** - JWT auth
- **@elysiajs/swagger** - OpenAPI docs
- **@elysiajs/bearer** - Bearer token

## Database
- **Drizzle ORM** - Recommended
- **Prisma** - Also works with Bun

## Example
\`\`\`typescript
import { Elysia, t } from 'elysia';

const app = new Elysia()
  .get('/users/:id', ({ params: { id } }) => {
    return { id, name: 'John' };
  }, {
    params: t.Object({ id: t.String() })
  })
  .listen(3000);
\`\`\`

## Benefits
- Blazing fast startup and runtime
- Native TypeScript, JSX support
- Drop-in Node.js compatibility
- Built-in SQLite support
`,
  },

  {
    slug: 'bun-hono',
    name: 'Bun + Hono Backend',
    description: 'Lightweight and fast backend with Bun and Hono',
    tags: ['backend', 'bun', 'hono', 'typescript', 'edge', 'serverless'],
    techstack: `# Bun + Hono Stack

## Runtime & Language
- **Runtime**: Bun 1.x or Node.js or Edge
- **Language**: TypeScript
- **Package Manager**: bun or pnpm

## Core Framework
- **Hono** 4.x - Ultrafast web framework
- Works on Bun, Node.js, Deno, Edge (Cloudflare)
- ~4KB, zero dependencies
- Express-like API

## Key Middleware
- **@hono/zod-validator** - Zod validation
- **@hono/swagger-ui** - API docs
- **hono/jwt** - JWT authentication
- **hono/cors** - CORS support

## Why Hono?
- Universal runtime support
- Perfect for serverless/edge
- Excellent TypeScript support
- RPC-style client generation

## Example
\`\`\`typescript
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const app = new Hono();

app.post('/users',
  zValidator('json', z.object({ email: z.string().email() })),
  (c) => {
    const { email } = c.req.valid('json');
    return c.json({ email });
  }
);

export default app;
\`\`\`
`,
  },

  // ============ Java Backends ============
  {
    slug: 'java-springboot',
    name: 'Java Spring Boot',
    description: 'Enterprise Java backend with Spring Boot',
    tags: ['backend', 'java', 'spring', 'springboot', 'enterprise'],
    techstack: `# Java Spring Boot Stack

## Language & Build
- **Java** 21 LTS (or 17 LTS)
- **Build Tool**: Gradle (Kotlin DSL) or Maven
- **Spring Boot** 3.2.x

## Core Dependencies
- **spring-boot-starter-web** - REST APIs
- **spring-boot-starter-data-jpa** - JPA/Hibernate
- **spring-boot-starter-validation** - Bean validation
- **spring-boot-starter-security** - Security
- **spring-boot-starter-actuator** - Monitoring

## Database
- **PostgreSQL** or **MySQL** (production)
- **H2** (development/testing)
- **Flyway** or **Liquibase** for migrations

## Key Libraries
- **Lombok** - Reduce boilerplate
- **MapStruct** - Object mapping
- **SpringDoc OpenAPI** - API documentation

## Security
- Spring Security with JWT
- OAuth2 Resource Server
- Method-level security

## Testing
- **JUnit 5** - Unit tests
- **Mockito** - Mocking
- **Testcontainers** - Integration tests
- **@SpringBootTest** - Full app tests

## Project Structure
\`\`\`
src/main/java/com/example/
├── config/
├── controller/
├── service/
├── repository/
├── model/
│   ├── entity/
│   └── dto/
├── exception/
├── security/
└── Application.java
\`\`\`
`,
    codingGuidelines: `# Spring Boot Coding Guidelines

## REST Controllers
\`\`\`java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(
        @Valid @RequestBody CreateUserDto dto
    ) {
        UserDto created = userService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
\`\`\`

## Service Layer
- Use @Service annotation
- Handle business logic
- Use @Transactional for database operations

## Exception Handling
\`\`\`java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(EntityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse(ex.getMessage()));
    }
}
\`\`\`
`,
  },

  {
    slug: 'java-springboot-webflux',
    name: 'Java Spring WebFlux (Reactive)',
    description: 'Reactive Java backend with Spring WebFlux',
    tags: ['backend', 'java', 'spring', 'webflux', 'reactive'],
    techstack: `# Java Spring WebFlux Stack

## Language & Build
- **Java** 21 LTS
- **Build Tool**: Gradle
- **Spring Boot** 3.2.x with WebFlux

## Core Dependencies
- **spring-boot-starter-webflux** - Reactive web
- **spring-boot-starter-data-r2dbc** - Reactive DB access
- **reactor-core** - Project Reactor

## Database (Reactive)
- **R2DBC** - Reactive database connectivity
- **r2dbc-postgresql** or **r2dbc-mysql**
- **MongoDB Reactive** - spring-boot-starter-data-mongodb-reactive

## When to Use
- High-concurrency applications
- Streaming data
- Microservices with back-pressure
- Non-blocking I/O requirements

## Example
\`\`\`java
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/{id}")
    public Mono<User> getUser(@PathVariable String id) {
        return userRepository.findById(id);
    }

    @GetMapping
    public Flux<User> getAllUsers() {
        return userRepository.findAll();
    }
}
\`\`\`
`,
  },

  // ============ Python Backends ============
  {
    slug: 'python-fastapi',
    name: 'Python FastAPI',
    description: 'Modern Python backend with FastAPI',
    tags: ['backend', 'python', 'fastapi', 'async'],
    techstack: `# Python FastAPI Stack

## Language & Runtime
- **Python** 3.11+
- **Package Manager**: uv or pip with venv

## Core Framework
- **FastAPI** 0.100+ - Modern async framework
- **Uvicorn** - ASGI server
- **Pydantic** v2 - Data validation

## Database
- **SQLAlchemy** 2.x - ORM (async support)
- **alembic** - Migrations
- **asyncpg** - Async PostgreSQL driver

## Key Features
- Automatic OpenAPI/Swagger docs
- Type hints = validation
- Async/await native
- Dependency injection

## Project Structure
\`\`\`
app/
├── api/
│   ├── routes/
│   └── deps.py
├── core/
│   ├── config.py
│   └── security.py
├── models/
├── schemas/
├── services/
├── db/
│   ├── session.py
│   └── migrations/
└── main.py
\`\`\`

## Example
\`\`\`python
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel, EmailStr

app = FastAPI()

class UserCreate(BaseModel):
    email: EmailStr
    password: str

@app.post("/users", response_model=User)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    return await user_service.create(db, user)
\`\`\`
`,
  },

  {
    slug: 'python-django',
    name: 'Python Django',
    description: 'Full-featured Python backend with Django',
    tags: ['backend', 'python', 'django', 'fullstack'],
    techstack: `# Python Django Stack

## Language & Runtime
- **Python** 3.11+
- **Package Manager**: pip with venv or poetry

## Core Framework
- **Django** 5.x - Batteries-included framework
- **Django REST Framework** - API toolkit
- **Django Ninja** (alternative) - FastAPI-like for Django

## Database
- **PostgreSQL** (recommended)
- Django ORM (built-in)
- Django migrations

## Key Packages
- **django-cors-headers** - CORS
- **django-filter** - QuerySet filtering
- **drf-spectacular** - OpenAPI schema
- **celery** - Task queue

## Admin & Auth
- Built-in admin panel
- django-allauth for social auth
- djangorestframework-simplejwt

## Project Structure
\`\`\`
project/
├── config/
│   ├── settings/
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── users/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   └── ...
├── manage.py
└── requirements.txt
\`\`\`
`,
  },

  // ============ Go Backends ============
  {
    slug: 'go-gin',
    name: 'Go Gin Backend',
    description: 'High-performance Go backend with Gin framework',
    tags: ['backend', 'go', 'golang', 'gin', 'performance'],
    techstack: `# Go Gin Stack

## Language
- **Go** 1.21+
- **Module**: Go modules

## Core Framework
- **Gin** - Fast HTTP framework
- Built-in middleware support
- JSON validation with binding

## Key Packages
- **gorm** - ORM for Go
- **sqlx** - SQL extensions (alternative)
- **jwt-go** - JWT authentication
- **validator** - Struct validation
- **zap** or **zerolog** - Logging
- **viper** - Configuration

## Database
- PostgreSQL with pgx driver
- MySQL with mysql driver
- Redis for caching

## Project Structure
\`\`\`
cmd/
├── api/
│   └── main.go
internal/
├── handler/
├── service/
├── repository/
├── model/
├── middleware/
└── config/
pkg/
└── utils/
\`\`\`

## Example
\`\`\`go
func main() {
    r := gin.Default()

    r.GET("/users/:id", func(c *gin.Context) {
        id := c.Param("id")
        user, err := userService.FindByID(id)
        if err != nil {
            c.JSON(404, gin.H{"error": "not found"})
            return
        }
        c.JSON(200, user)
    })

    r.Run(":8080")
}
\`\`\`
`,
  },

  // ============ Rust Backends ============
  {
    slug: 'rust-axum',
    name: 'Rust Axum Backend',
    description: 'Type-safe and performant Rust backend with Axum',
    tags: ['backend', 'rust', 'axum', 'performance', 'type-safe'],
    techstack: `# Rust Axum Stack

## Language & Build
- **Rust** 1.75+ (stable)
- **Cargo** - Package manager

## Core Framework
- **Axum** - Ergonomic web framework from Tokio team
- **Tokio** - Async runtime
- **Tower** - Middleware

## Key Crates
- **serde** - Serialization
- **sqlx** - Async SQL toolkit
- **sea-orm** - ORM (alternative)
- **jsonwebtoken** - JWT
- **validator** - Validation
- **tracing** - Logging

## Database
- PostgreSQL with sqlx
- SQLite for embedded
- Redis with redis-rs

## Example
\`\`\`rust
use axum::{routing::get, Router, Json, extract::Path};
use serde::Serialize;

#[derive(Serialize)]
struct User {
    id: u64,
    name: String,
}

async fn get_user(Path(id): Path<u64>) -> Json<User> {
    Json(User { id, name: "John".into() })
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/users/:id", get(get_user));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
\`\`\`
`,
  },
];
