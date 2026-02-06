import { SkillType } from '../../types/skill.types.js';

export const backendSkills = [
  // ============ API Design ============
  {
    projectSlug: 'all',
    name: 'rest-api-design',
    type: SkillType.INSTRUCTIONS,
    description: 'REST API design best practices',
    tags: ['api', 'rest', 'design'],
    content: `# REST API Design Guidelines

## URL Structure
- Use nouns, not verbs: \`/users\` not \`/getUsers\`
- Use plural nouns: \`/users\` not \`/user\`
- Use hyphens for multi-word: \`/user-profiles\`
- Nest for relationships: \`/users/{id}/posts\`

## HTTP Methods
| Method | Purpose | Idempotent |
|--------|---------|------------|
| GET | Read resource(s) | Yes |
| POST | Create resource | No |
| PUT | Replace resource | Yes |
| PATCH | Partial update | Yes |
| DELETE | Remove resource | Yes |

## Status Codes
- 200 OK - Successful GET/PUT/PATCH
- 201 Created - Successful POST
- 204 No Content - Successful DELETE
- 400 Bad Request - Invalid input
- 401 Unauthorized - Not authenticated
- 403 Forbidden - Not authorized
- 404 Not Found - Resource doesn't exist
- 409 Conflict - Resource conflict
- 422 Unprocessable Entity - Validation error
- 500 Internal Server Error - Server error

## Response Format
\`\`\`json
{
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}

// Error response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
\`\`\`

## Pagination
\`\`\`
GET /users?page=1&limit=20
GET /users?cursor=abc123&limit=20  // Cursor-based
\`\`\`

## Filtering & Sorting
\`\`\`
GET /users?status=active&sort=-createdAt
GET /users?filter[status]=active&filter[role]=admin
\`\`\`

## Versioning
- URL: \`/api/v1/users\`
- Header: \`Accept: application/vnd.api+json;version=1\`
`,
  },

  // ============ Error Handling ============
  {
    projectSlug: 'all',
    name: 'error-handling-backend',
    type: SkillType.INSTRUCTIONS,
    description: 'Backend error handling patterns',
    tags: ['error-handling', 'backend'],
    content: `# Backend Error Handling

## Custom Error Class
\`\`\`typescript
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: unknown) {
    return new AppError(400, 'BAD_REQUEST', message, details);
  }

  static unauthorized(message = 'Unauthorized') {
    return new AppError(401, 'UNAUTHORIZED', message);
  }

  static forbidden(message = 'Forbidden') {
    return new AppError(403, 'FORBIDDEN', message);
  }

  static notFound(resource: string) {
    return new AppError(404, 'NOT_FOUND', \`\${resource} not found\`);
  }

  static conflict(message: string) {
    return new AppError(409, 'CONFLICT', message);
  }

  static validation(details: unknown) {
    return new AppError(422, 'VALIDATION_ERROR', 'Validation failed', details);
  }
}
\`\`\`

## Express Error Middleware
\`\`\`typescript
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }

  // Zod validation error
  if (err instanceof ZodError) {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: err.errors,
      },
    });
  }

  // Default to 500
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    },
  });
}
\`\`\`

## Async Handler Wrapper
\`\`\`typescript
export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage
router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await userService.findById(req.params.id);
  if (!user) throw AppError.notFound('User');
  res.json(user);
}));
\`\`\`
`,
  },

  // ============ Authentication ============
  {
    projectSlug: 'all',
    name: 'jwt-authentication',
    type: SkillType.CODE_TEMPLATE,
    description: 'JWT authentication implementation',
    tags: ['auth', 'jwt', 'security'],
    content: `# JWT Authentication Template

## Token Generation
\`\`\`typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

export function generateTokenPair(payload: TokenPayload) {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
}
\`\`\`

## Auth Middleware
\`\`\`typescript
import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Role-based access
export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}
\`\`\`

## Password Hashing
\`\`\`typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
\`\`\`
`,
  },

  // ============ Validation ============
  {
    projectSlug: 'all',
    name: 'zod-validation',
    type: SkillType.CODE_TEMPLATE,
    description: 'Zod validation patterns',
    tags: ['validation', 'zod', 'typescript'],
    content: `# Zod Validation Patterns

## Basic Schemas
\`\`\`typescript
import { z } from 'zod';

// User schemas
export const createUserSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1).max(100).optional(),
});

export const updateUserSchema = createUserSchema.partial();

export const userIdSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
});

// Infer types
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
\`\`\`

## Common Patterns
\`\`\`typescript
// Pagination
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// Sort
export const sortSchema = z.object({
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Search
export const searchSchema = z.object({
  q: z.string().min(1).optional(),
  filters: z.record(z.string()).optional(),
});

// Date range
export const dateRangeSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
}).refine(
  (data) => !data.startDate || !data.endDate || data.startDate <= data.endDate,
  { message: 'Start date must be before end date' }
);
\`\`\`

## Express Middleware
\`\`\`typescript
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validate<T>(schema: ZodSchema<T>, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req[source] = schema.parse(req[source]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(422).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: error.errors.map(e => ({
              field: e.path.join('.'),
              message: e.message,
            })),
          },
        });
      }
      next(error);
    }
  };
}

// Usage
router.post('/users', validate(createUserSchema), createUser);
router.get('/users', validate(paginationSchema, 'query'), listUsers);
\`\`\`
`,
  },

  // ============ Database Patterns ============
  {
    projectSlug: 'all',
    name: 'repository-pattern',
    type: SkillType.CODE_TEMPLATE,
    description: 'Repository pattern for data access',
    tags: ['database', 'pattern', 'architecture'],
    content: `# Repository Pattern

## Base Repository Interface
\`\`\`typescript
export interface BaseRepository<T, CreateInput, UpdateInput> {
  findById(id: string): Promise<T | null>;
  findMany(options?: FindManyOptions): Promise<T[]>;
  create(data: CreateInput): Promise<T>;
  update(id: string, data: UpdateInput): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export interface FindManyOptions {
  where?: Record<string, unknown>;
  orderBy?: Record<string, 'asc' | 'desc'>;
  skip?: number;
  take?: number;
}
\`\`\`

## Prisma Implementation
\`\`\`typescript
import { PrismaClient, User } from '@prisma/client';

export class UserRepository implements BaseRepository<User, CreateUserInput, UpdateUserInput> {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findMany(options?: FindManyOptions): Promise<User[]> {
    return this.prisma.user.findMany({
      where: options?.where,
      orderBy: options?.orderBy,
      skip: options?.skip,
      take: options?.take,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: CreateUserInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: UpdateUserInput): Promise<User | null> {
    try {
      return await this.prisma.user.update({ where: { id }, data });
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
\`\`\`

## Service Layer Usage
\`\`\`typescript
export class UserService {
  constructor(private userRepo: UserRepository) {}

  async createUser(input: CreateUserInput) {
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      throw new AppError(409, 'CONFLICT', 'Email already exists');
    }

    const hashedPassword = await hashPassword(input.password);
    return this.userRepo.create({
      ...input,
      password: hashedPassword,
    });
  }
}
\`\`\`
`,
  },

  // ============ Rate Limiting ============
  {
    projectSlug: 'all',
    name: 'rate-limiting',
    type: SkillType.CODE_TEMPLATE,
    description: 'API rate limiting implementation',
    tags: ['security', 'rate-limit', 'api'],
    content: `# Rate Limiting

## Express Rate Limit
\`\`\`typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Standard rate limit
export const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
});

// Strict rate limit for auth
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 failed attempts
  skipSuccessfulRequests: true,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many attempts, please try again later',
    },
  },
});

// API key based limiting
export const apiKeyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  keyGenerator: (req) => req.headers['x-api-key'] as string || req.ip,
});

// Usage
app.use('/api', standardLimiter);
app.use('/api/auth/login', authLimiter);
\`\`\`

## Custom Sliding Window
\`\`\`typescript
export class RateLimiter {
  constructor(private redis: Redis) {}

  async isAllowed(
    key: string,
    limit: number,
    windowSeconds: number
  ): Promise<boolean> {
    const now = Date.now();
    const windowStart = now - windowSeconds * 1000;

    const pipe = this.redis.pipeline();
    pipe.zremrangebyscore(key, 0, windowStart);
    pipe.zadd(key, now, \`\${now}\`);
    pipe.zcard(key);
    pipe.expire(key, windowSeconds);

    const results = await pipe.exec();
    const count = results?.[2]?.[1] as number;

    return count <= limit;
  }
}
\`\`\`
`,
  },
];
