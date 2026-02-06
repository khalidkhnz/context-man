import { SkillType } from '../../types/skill.types.js';

export const generalSkills = [
  // ============ Git Conventions ============
  {
    projectSlug: 'all',
    name: 'git-conventions',
    type: SkillType.INSTRUCTIONS,
    description: 'Git workflow and commit conventions',
    tags: ['git', 'workflow', 'conventions'],
    content: `# Git Conventions

## Commit Message Format
\`\`\`
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

## Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation only
- **style**: Formatting, missing semi-colons
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding or updating tests
- **chore**: Build process, dependencies, tooling

## Examples
\`\`\`
feat(auth): add JWT refresh token support

Implement refresh token rotation for better security.
Tokens are stored in httpOnly cookies.

Closes #123
\`\`\`

\`\`\`
fix(api): handle null response from external service

- Add null check before processing
- Return empty array instead of throwing
\`\`\`

## Branch Naming
- \`feature/add-user-auth\`
- \`fix/login-redirect-bug\`
- \`hotfix/critical-security-patch\`
- \`release/v1.2.0\`

## Git Workflow
1. Create feature branch from \`main\`
2. Make small, focused commits
3. Write meaningful commit messages
4. Push and create PR
5. Request review
6. Squash merge to main

## .gitignore Essentials
\`\`\`
# Dependencies
node_modules/
vendor/

# Build outputs
dist/
build/
.next/
out/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Testing
coverage/
.nyc_output/
\`\`\`
`,
  },

  // ============ Code Review ============
  {
    projectSlug: 'all',
    name: 'code-review-checklist',
    type: SkillType.INSTRUCTIONS,
    description: 'Code review best practices and checklist',
    tags: ['code-review', 'best-practices', 'quality'],
    content: `# Code Review Checklist

## Functionality
- [ ] Does the code do what it's supposed to do?
- [ ] Are edge cases handled?
- [ ] Is error handling appropriate?
- [ ] Are there any obvious bugs?

## Code Quality
- [ ] Is the code readable and self-explanatory?
- [ ] Are variable/function names descriptive?
- [ ] Is there any duplicated code that should be refactored?
- [ ] Are functions small and focused?

## Security
- [ ] Is user input validated and sanitized?
- [ ] Are there any SQL injection vulnerabilities?
- [ ] Is sensitive data properly protected?
- [ ] Are authentication/authorization checks in place?

## Performance
- [ ] Are there any obvious performance issues?
- [ ] Are database queries optimized?
- [ ] Is caching used appropriately?
- [ ] Are there any N+1 query problems?

## Testing
- [ ] Are there sufficient unit tests?
- [ ] Do tests cover edge cases?
- [ ] Are tests meaningful, not just for coverage?
- [ ] Do all tests pass?

## Documentation
- [ ] Is the code self-documenting?
- [ ] Are complex algorithms explained?
- [ ] Is the README updated if needed?
- [ ] Are API changes documented?

## Review Etiquette
- Be constructive, not critical
- Ask questions instead of making demands
- Acknowledge good code
- Focus on the code, not the person
- Be specific about what needs to change
`,
  },

  // ============ TypeScript Best Practices ============
  {
    projectSlug: 'all',
    name: 'typescript-best-practices',
    type: SkillType.INSTRUCTIONS,
    description: 'TypeScript coding best practices',
    tags: ['typescript', 'best-practices', 'types'],
    content: `# TypeScript Best Practices

## Strict Mode
Always enable strict mode in tsconfig.json:
\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}
\`\`\`

## Type Annotations
\`\`\`typescript
// Prefer inference for local variables
const name = 'John'; // string inferred

// Annotate function parameters and returns
function greet(name: string): string {
  return \`Hello, \${name}\`;
}

// Use const assertions for literals
const config = {
  env: 'production',
  port: 3000,
} as const;
\`\`\`

## Interfaces vs Types
\`\`\`typescript
// Use interfaces for objects that can be extended
interface User {
  id: string;
  name: string;
}

interface Admin extends User {
  permissions: string[];
}

// Use types for unions, intersections, primitives
type Status = 'pending' | 'active' | 'completed';
type Result<T> = { data: T } | { error: string };
\`\`\`

## Avoid 'any'
\`\`\`typescript
// Bad
function parse(data: any) { ... }

// Good - use unknown and narrow
function parse(data: unknown) {
  if (typeof data === 'string') {
    return JSON.parse(data);
  }
  throw new Error('Expected string');
}
\`\`\`

## Utility Types
\`\`\`typescript
// Partial - all props optional
type UpdateUser = Partial<User>;

// Pick - select specific props
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit - exclude props
type CreateUser = Omit<User, 'id'>;

// Record - object with specific key/value types
type UserMap = Record<string, User>;

// Required - make all props required
type RequiredUser = Required<Partial<User>>;
\`\`\`

## Generics
\`\`\`typescript
// Generic function
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

// Generic with constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
  timestamp: Date;
}
\`\`\`

## Discriminated Unions
\`\`\`typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function handle<T>(result: Result<T>) {
  if (result.success) {
    console.log(result.data); // T
  } else {
    console.error(result.error); // string
  }
}
\`\`\`
`,
  },

  // ============ Testing Patterns ============
  {
    projectSlug: 'all',
    name: 'testing-patterns',
    type: SkillType.CODE_TEMPLATE,
    description: 'Testing patterns and best practices',
    tags: ['testing', 'jest', 'vitest', 'best-practices'],
    content: `# Testing Patterns

## Test Structure (AAA)
\`\`\`typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a user with valid input', async () => {
      // Arrange
      const input = { email: 'test@example.com', name: 'Test' };
      const mockRepo = { create: vi.fn().mockResolvedValue({ id: '1', ...input }) };
      const service = new UserService(mockRepo);

      // Act
      const result = await service.createUser(input);

      // Assert
      expect(result).toEqual({ id: '1', ...input });
      expect(mockRepo.create).toHaveBeenCalledWith(input);
    });

    it('should throw on duplicate email', async () => {
      // Arrange
      const input = { email: 'existing@example.com', name: 'Test' };
      const mockRepo = {
        findByEmail: vi.fn().mockResolvedValue({ id: '1' }),
      };
      const service = new UserService(mockRepo);

      // Act & Assert
      await expect(service.createUser(input))
        .rejects.toThrow('Email already exists');
    });
  });
});
\`\`\`

## Mocking
\`\`\`typescript
// Mock module
vi.mock('./database', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Mock implementation
const mockFn = vi.fn()
  .mockImplementationOnce(() => 'first')
  .mockImplementationOnce(() => 'second');

// Spy on method
const spy = vi.spyOn(service, 'sendEmail');
expect(spy).toHaveBeenCalledTimes(1);
\`\`\`

## API Testing
\`\`\`typescript
import request from 'supertest';
import { app } from './app';

describe('GET /api/users', () => {
  it('should return users list', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', 'Bearer token')
      .expect(200);

    expect(response.body).toMatchObject({
      data: expect.arrayContaining([
        expect.objectContaining({ id: expect.any(String) })
      ]),
    });
  });

  it('should require authentication', async () => {
    await request(app)
      .get('/api/users')
      .expect(401);
  });
});
\`\`\`

## Test Data Factories
\`\`\`typescript
// factories/user.factory.ts
import { faker } from '@faker-js/faker';

export function createUser(overrides?: Partial<User>): User {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    createdAt: faker.date.past(),
    ...overrides,
  };
}

// Usage
const user = createUser({ name: 'Specific Name' });
const users = Array.from({ length: 5 }, () => createUser());
\`\`\`

## Test Coverage Goals
- Aim for 80%+ coverage on business logic
- Don't chase 100% - focus on meaningful tests
- Cover happy paths and error cases
- Test edge cases and boundary conditions
`,
  },

  // ============ Documentation Standards ============
  {
    projectSlug: 'all',
    name: 'documentation-standards',
    type: SkillType.INSTRUCTIONS,
    description: 'Documentation and commenting standards',
    tags: ['documentation', 'comments', 'standards'],
    content: `# Documentation Standards

## README Structure
\`\`\`markdown
# Project Name

Brief description of what this project does.

## Features

- Feature 1
- Feature 2

## Quick Start

\\\`\\\`\\\`bash
npm install
npm run dev
\\\`\\\`\\\`

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| DATABASE_URL | Database connection | - |

## API Documentation

Link to API docs or brief overview.

## Contributing

Guidelines for contributors.

## License

MIT
\`\`\`

## Code Comments

### When to Comment
- Complex algorithms
- Non-obvious business logic
- Workarounds for bugs
- TODO/FIXME items

### When NOT to Comment
- Self-explanatory code
- What the code does (code should show that)
- Obvious operations

### Comment Examples
\`\`\`typescript
// Good - explains WHY
// Using setTimeout to debounce rapid API calls
// and prevent rate limiting

// Bad - explains WHAT (obvious from code)
// Loop through users array
users.forEach(user => ...);

// Good - documents complex logic
/**
 * Calculates compound interest with monthly contributions.
 * Formula: A = P(1 + r/n)^(nt) + PMT * (((1 + r/n)^(nt) - 1) / (r/n))
 */
function calculateCompoundInterest(...) { }

// TODO/FIXME format
// TODO(username): Add pagination support
// FIXME: This breaks with negative numbers
\`\`\`

## JSDoc for Public APIs
\`\`\`typescript
/**
 * Creates a new user account.
 *
 * @param input - User creation data
 * @param input.email - Must be unique
 * @param input.password - Min 8 characters
 * @returns The created user without password
 * @throws {ConflictError} If email already exists
 * @example
 * const user = await createUser({
 *   email: 'user@example.com',
 *   password: 'securepass123'
 * });
 */
async function createUser(input: CreateUserInput): Promise<User> {
  // ...
}
\`\`\`

## API Documentation (OpenAPI style)
\`\`\`yaml
/users:
  post:
    summary: Create user
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [email, password]
            properties:
              email: { type: string, format: email }
              password: { type: string, minLength: 8 }
    responses:
      201:
        description: User created
      409:
        description: Email already exists
\`\`\`
`,
  },

  // ============ Security Best Practices ============
  {
    projectSlug: 'all',
    name: 'security-best-practices',
    type: SkillType.INSTRUCTIONS,
    description: 'Application security best practices',
    tags: ['security', 'owasp', 'best-practices'],
    content: `# Security Best Practices

## Input Validation
\`\`\`typescript
// Always validate and sanitize user input
import { z } from 'zod';
import DOMPurify from 'dompurify';

const userSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(1).max(100).transform(s => DOMPurify.sanitize(s)),
  age: z.number().int().positive().max(150),
});

// Never trust client data
const data = userSchema.parse(req.body);
\`\`\`

## SQL Injection Prevention
\`\`\`typescript
// BAD - SQL injection vulnerable
const query = \`SELECT * FROM users WHERE id = '\${userId}'\`;

// GOOD - Parameterized query
const user = await prisma.user.findUnique({ where: { id: userId } });

// GOOD - Raw query with parameters
const users = await prisma.$queryRaw\`SELECT * FROM users WHERE id = \${userId}\`;
\`\`\`

## XSS Prevention
\`\`\`typescript
// Escape HTML output
import { escape } from 'html-escaper';

const safeHtml = escape(userInput);

// Use framework's built-in protection
// React: automatically escapes
<div>{userInput}</div>

// Dangerous - avoid unless necessary
<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
\`\`\`

## Authentication
\`\`\`typescript
// Password hashing
import bcrypt from 'bcrypt';
const SALT_ROUNDS = 12;

const hash = await bcrypt.hash(password, SALT_ROUNDS);
const isValid = await bcrypt.compare(password, hash);

// Secure session config
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true, // HTTPS only
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));
\`\`\`

## Environment Variables
\`\`\`bash
# Never commit secrets
DATABASE_URL=postgresql://...
JWT_SECRET=your-32-char-secret
API_KEY=sensitive-key

# .gitignore
.env
.env.local
.env.*.local
\`\`\`

## CORS Configuration
\`\`\`typescript
import cors from 'cors';

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
\`\`\`

## Rate Limiting
\`\`\`typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests',
});

app.use('/api', limiter);
\`\`\`

## Security Headers
\`\`\`typescript
import helmet from 'helmet';

app.use(helmet());
// Sets: X-Content-Type-Options, X-Frame-Options,
// Strict-Transport-Security, X-XSS-Protection, etc.
\`\`\`

## OWASP Top 10 Quick Reference
1. Injection - Use parameterized queries
2. Broken Auth - Strong passwords, MFA, secure sessions
3. Sensitive Data - Encrypt at rest and in transit
4. XXE - Disable external entities in XML parsers
5. Broken Access Control - Check permissions on every request
6. Misconfig - Secure defaults, update dependencies
7. XSS - Escape output, CSP headers
8. Insecure Deserialization - Validate serialized data
9. Using Components with Vulnerabilities - Keep updated
10. Insufficient Logging - Log security events
`,
  },

  // ============ Performance Optimization ============
  {
    projectSlug: 'all',
    name: 'performance-optimization',
    type: SkillType.INSTRUCTIONS,
    description: 'Performance optimization techniques',
    tags: ['performance', 'optimization', 'best-practices'],
    content: `# Performance Optimization

## Database Optimization

### Indexing
\`\`\`typescript
// Add indexes for frequently queried fields
@@index([email])
@@index([createdAt])
@@index([status, createdAt]) // Composite index

// Check query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
\`\`\`

### Query Optimization
\`\`\`typescript
// BAD - N+1 problem
const users = await prisma.user.findMany();
for (const user of users) {
  const posts = await prisma.post.findMany({ where: { authorId: user.id } });
}

// GOOD - Include related data
const users = await prisma.user.findMany({
  include: { posts: true },
});

// GOOD - Select only needed fields
const users = await prisma.user.findMany({
  select: { id: true, email: true },
});
\`\`\`

### Pagination
\`\`\`typescript
// Offset pagination (simple but slow for large offsets)
const users = await prisma.user.findMany({
  skip: (page - 1) * limit,
  take: limit,
});

// Cursor pagination (better for large datasets)
const users = await prisma.user.findMany({
  take: limit,
  cursor: lastId ? { id: lastId } : undefined,
  skip: lastId ? 1 : 0,
});
\`\`\`

## Caching

### In-Memory Cache
\`\`\`typescript
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 }); // 5 min

async function getUser(id: string) {
  const cached = cache.get<User>(\`user:\${id}\`);
  if (cached) return cached;

  const user = await prisma.user.findUnique({ where: { id } });
  if (user) cache.set(\`user:\${id}\`, user);
  return user;
}
\`\`\`

### Redis Cache
\`\`\`typescript
import Redis from 'ioredis';
const redis = new Redis();

async function getCachedData<T>(key: string, fetchFn: () => Promise<T>, ttl = 300): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const data = await fetchFn();
  await redis.setex(key, ttl, JSON.stringify(data));
  return data;
}
\`\`\`

## Frontend Optimization

### Code Splitting
\`\`\`typescript
// React lazy loading
const Dashboard = lazy(() => import('./Dashboard'));

// Next.js dynamic import
const Chart = dynamic(() => import('./Chart'), { ssr: false });
\`\`\`

### Image Optimization
\`\`\`tsx
// Next.js Image
import Image from 'next/image';

<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  placeholder="blur"
  loading="lazy"
/>
\`\`\`

### Memoization
\`\`\`typescript
// React.memo for components
const ExpensiveList = memo(({ items }) => (
  <ul>{items.map(item => <li key={item.id}>{item.name}</li>)}</ul>
));

// useMemo for values
const sortedItems = useMemo(
  () => items.sort((a, b) => a.name.localeCompare(b.name)),
  [items]
);

// useCallback for functions
const handleClick = useCallback((id) => {
  setSelected(id);
}, []);
\`\`\`

## API Optimization

### Compression
\`\`\`typescript
import compression from 'compression';
app.use(compression());
\`\`\`

### Response Caching
\`\`\`typescript
// Cache-Control headers
res.set('Cache-Control', 'public, max-age=300'); // 5 min

// ETag for conditional requests
res.set('ETag', hash(data));
\`\`\`

### Batch Operations
\`\`\`typescript
// BAD - Multiple requests
for (const id of ids) {
  await api.getUser(id);
}

// GOOD - Single batch request
const users = await api.getUsers(ids);
\`\`\`
`,
  },

  // ============ Error Handling ============
  {
    projectSlug: 'all',
    name: 'error-handling-patterns',
    type: SkillType.CODE_TEMPLATE,
    description: 'Error handling patterns across stack',
    tags: ['error-handling', 'patterns', 'best-practices'],
    content: `# Error Handling Patterns

## Custom Error Classes
\`\`\`typescript
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public isOperational = true
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, 'NOT_FOUND', \`\${resource} not found\`);
  }
}

export class ValidationError extends AppError {
  constructor(public details: unknown) {
    super(422, 'VALIDATION_ERROR', 'Validation failed');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, 'UNAUTHORIZED', message);
  }
}
\`\`\`

## Result Type Pattern
\`\`\`typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

// Usage
async function createUser(input: CreateUserInput): Promise<Result<User, string>> {
  const existing = await userRepo.findByEmail(input.email);
  if (existing) {
    return err('Email already exists');
  }

  const user = await userRepo.create(input);
  return ok(user);
}

// Handling
const result = await createUser(input);
if (result.ok) {
  console.log(result.value); // User
} else {
  console.error(result.error); // string
}
\`\`\`

## Try-Catch Wrapper
\`\`\`typescript
type AsyncFunction<T> = (...args: unknown[]) => Promise<T>;

function tryCatch<T>(fn: AsyncFunction<T>) {
  return async (...args: unknown[]): Promise<[T, null] | [null, Error]> => {
    try {
      const result = await fn(...args);
      return [result, null];
    } catch (error) {
      return [null, error as Error];
    }
  };
}

// Usage
const [user, error] = await tryCatch(userService.findById)(id);
if (error) {
  // handle error
}
\`\`\`

## React Error Boundary
\`\`\`tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
\`\`\`

## Async Error Handling in Express
\`\`\`typescript
// Wrapper for async route handlers
const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage
router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await userService.findById(req.params.id);
  if (!user) throw new NotFoundError('User');
  res.json(user);
}));

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message }
    });
  }

  console.error(err);
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }
  });
});
\`\`\`
`,
  },

  // ============ Project Structure ============
  {
    projectSlug: 'all',
    name: 'project-structure',
    type: SkillType.INSTRUCTIONS,
    description: 'Common project structure patterns',
    tags: ['architecture', 'structure', 'organization'],
    content: `# Project Structure Patterns

## Feature-Based Structure (Recommended)
\`\`\`
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── users/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── index.ts
│   └── posts/
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── types/
├── lib/
│   ├── api.ts
│   ├── db.ts
│   └── cache.ts
└── app/ (or pages/)
\`\`\`

## Layer-Based Structure
\`\`\`
src/
├── controllers/    # HTTP handlers
├── services/       # Business logic
├── repositories/   # Data access
├── models/         # Data models
├── middlewares/    # Express middlewares
├── routes/         # Route definitions
├── utils/          # Utility functions
├── types/          # TypeScript types
├── config/         # Configuration
└── app.ts          # App entry point
\`\`\`

## Monorepo Structure
\`\`\`
apps/
├── web/           # Next.js frontend
├── api/           # Express backend
└── mobile/        # React Native app

packages/
├── ui/            # Shared UI components
├── utils/         # Shared utilities
├── types/         # Shared types
└── config/        # Shared configs (ESLint, TS)

package.json       # Workspace root
turbo.json         # Turborepo config
\`\`\`

## Barrel Exports
\`\`\`typescript
// features/users/index.ts
export * from './components';
export * from './hooks';
export * from './services';
export * from './types';

// Usage
import { UserCard, useUser, userService } from '@/features/users';
\`\`\`

## Path Aliases
\`\`\`json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/features/*": ["src/features/*"],
      "@/shared/*": ["src/shared/*"],
      "@/lib/*": ["src/lib/*"]
    }
  }
}
\`\`\`

## Naming Conventions
- **Files**: kebab-case (user-service.ts)
- **Components**: PascalCase (UserCard.tsx)
- **Hooks**: camelCase with use prefix (useUser.ts)
- **Types**: PascalCase (User, CreateUserInput)
- **Constants**: UPPER_SNAKE_CASE
- **Functions**: camelCase

## Index Files Best Practices
- Use barrel exports for clean imports
- Don't re-export everything blindly
- Group related exports
- Avoid circular dependencies
`,
  },

  // ============ Naming Conventions ============
  {
    projectSlug: 'all',
    name: 'naming-conventions',
    type: SkillType.INSTRUCTIONS,
    description: 'Consistent naming conventions',
    tags: ['naming', 'conventions', 'standards'],
    content: `# Naming Conventions

## Variables & Functions
\`\`\`typescript
// camelCase for variables and functions
const userName = 'John';
const isActive = true;
const userCount = 42;

function getUserById(id: string) { }
function calculateTotal(items: Item[]) { }

// Boolean names should be questions
const isLoading = true;
const hasPermission = false;
const canEdit = true;
const shouldRefresh = false;
\`\`\`

## Constants
\`\`\`typescript
// UPPER_SNAKE_CASE for constants
const MAX_RETRY_COUNT = 3;
const DEFAULT_PAGE_SIZE = 20;
const API_BASE_URL = 'https://api.example.com';

// Enum values
enum Status {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}
\`\`\`

## Types & Interfaces
\`\`\`typescript
// PascalCase for types
interface User {
  id: string;
  email: string;
}

type Status = 'pending' | 'active';

// Input/Output suffix for DTOs
interface CreateUserInput {
  email: string;
  password: string;
}

interface UserResponse {
  user: User;
  token: string;
}
\`\`\`

## Files & Folders
\`\`\`
# kebab-case for files
user-service.ts
auth-middleware.ts
create-user.dto.ts

# PascalCase for React components
UserCard.tsx
AuthProvider.tsx

# Specific suffixes
user.controller.ts
user.service.ts
user.repository.ts
user.model.ts
user.test.ts
user.types.ts
\`\`\`

## React Components & Hooks
\`\`\`typescript
// PascalCase for components
function UserProfile() { }
function AuthProvider() { }

// camelCase with use prefix for hooks
function useAuth() { }
function useUserProfile(id: string) { }

// Event handlers: handle + Event
function handleClick() { }
function handleSubmit() { }
function handleInputChange() { }

// Props: on + Event for callbacks
interface ButtonProps {
  onClick: () => void;
  onHover?: () => void;
}
\`\`\`

## Database
\`\`\`sql
-- snake_case for tables and columns
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Singular table names preferred
users (not user)
posts (not post)
user_posts (junction table)
\`\`\`

## API Endpoints
\`\`\`
# kebab-case for URLs
GET  /api/users
GET  /api/users/:id
POST /api/users/:id/profile-picture
GET  /api/user-settings

# Plural for collections
GET /api/users      # list
GET /api/users/:id  # single

# Nested resources
GET /api/users/:id/posts
GET /api/posts/:id/comments
\`\`\`
`,
  },
];
