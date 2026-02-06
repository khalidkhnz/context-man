import { SkillType } from '../../types/skill.types.js';

export const devopsSkills = [
  // ============ Docker ============
  {
    projectSlug: 'all',
    name: 'dockerfile-best-practices',
    type: SkillType.CODE_TEMPLATE,
    description: 'Dockerfile best practices and patterns',
    tags: ['docker', 'containers', 'devops'],
    content: `# Dockerfile Best Practices

## Node.js Multi-stage Build
\`\`\`dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile

# Build app
COPY . .
RUN pnpm build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy built artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

USER nodejs

EXPOSE 3000

CMD ["node", "dist/index.js"]
\`\`\`

## .dockerignore
\`\`\`
node_modules
.git
.env*
*.md
.vscode
coverage
.nyc_output
dist
\`\`\`

## Tips
- Use multi-stage builds to reduce image size
- Copy package.json before source for better caching
- Use specific version tags (not latest)
- Run as non-root user
- Use .dockerignore
- Minimize layers
- Order commands from least to most frequently changing
`,
  },

  // ============ Environment Variables ============
  {
    projectSlug: 'all',
    name: 'env-management',
    type: SkillType.INSTRUCTIONS,
    description: 'Environment variable management',
    tags: ['devops', 'env', 'configuration'],
    content: `# Environment Variable Management

## .env Files Structure
\`\`\`
.env              # Default/development (committed, no secrets)
.env.local        # Local overrides (not committed)
.env.development  # Development-specific
.env.production   # Production-specific
.env.test         # Test-specific
.env.example      # Template with all variables (committed)
\`\`\`

## .env.example Template
\`\`\`bash
# App
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your-secret-here
JWT_EXPIRES_IN=7d

# External Services
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG...
\`\`\`

## Type-safe Env with Zod
\`\`\`typescript
// env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(32),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
\`\`\`

## Best Practices
- Never commit .env files with secrets
- Use .env.example as documentation
- Validate env vars at startup
- Use different values per environment
- Rotate secrets regularly
`,
  },

  // ============ Logging ============
  {
    projectSlug: 'all',
    name: 'logging-patterns',
    type: SkillType.CODE_TEMPLATE,
    description: 'Application logging patterns',
    tags: ['devops', 'logging', 'monitoring'],
    content: `# Logging Patterns

## Pino Logger Setup
\`\`\`typescript
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: { colorize: true },
  } : undefined,
  base: {
    env: process.env.NODE_ENV,
    revision: process.env.GIT_COMMIT,
  },
});

// Child logger with context
export function createLogger(context: Record<string, unknown>) {
  return logger.child(context);
}

// Usage
const log = createLogger({ service: 'user-service' });
log.info({ userId: '123' }, 'User created');
\`\`\`

## Express Logging Middleware
\`\`\`typescript
import { pinoHttp } from 'pino-http';

app.use(pinoHttp({
  logger,
  autoLogging: true,
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: (req, res) => {
    return \`\${req.method} \${req.url} \${res.statusCode}\`;
  },
  redact: ['req.headers.authorization', 'req.headers.cookie'],
}));
\`\`\`

## Log Levels
\`\`\`typescript
// fatal - App is unusable
logger.fatal({ err }, 'Database connection failed');

// error - Runtime errors
logger.error({ err, userId }, 'Failed to process payment');

// warn - Potentially problematic
logger.warn({ attempts }, 'Rate limit approaching');

// info - Normal operations
logger.info({ orderId }, 'Order placed successfully');

// debug - Detailed debugging
logger.debug({ query, params }, 'Executing database query');

// trace - Very detailed (rarely used)
logger.trace({ data }, 'Raw request payload');
\`\`\`

## Structured Logging
\`\`\`typescript
// Good - structured data
logger.info({
  event: 'user_signup',
  userId: user.id,
  email: user.email,
  source: 'web',
});

// Bad - string interpolation
logger.info(\`User \${user.id} signed up from web\`);
\`\`\`
`,
  },

  // ============ Health Checks ============
  {
    projectSlug: 'all',
    name: 'health-checks',
    type: SkillType.CODE_TEMPLATE,
    description: 'Application health check endpoints',
    tags: ['devops', 'monitoring', 'health'],
    content: `# Health Check Endpoints

## Express Implementation
\`\`\`typescript
import { Router } from 'express';
import { prisma } from './lib/prisma';
import { redis } from './lib/redis';

const router = Router();

// Liveness - is the app running?
router.get('/health/live', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Readiness - is the app ready to receive traffic?
router.get('/health/ready', async (req, res) => {
  const checks = {
    database: false,
    redis: false,
  };

  try {
    await prisma.$queryRaw\`SELECT 1\`;
    checks.database = true;
  } catch (error) {
    console.error('Database health check failed:', error);
  }

  try {
    await redis.ping();
    checks.redis = true;
  } catch (error) {
    console.error('Redis health check failed:', error);
  }

  const allHealthy = Object.values(checks).every(Boolean);

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'ok' : 'degraded',
    checks,
    timestamp: new Date().toISOString(),
  });
});

// Detailed health (internal only)
router.get('/health/details', async (req, res) => {
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version,
    nodeVersion: process.version,
  });
});

export default router;
\`\`\`

## Kubernetes Probes Config
\`\`\`yaml
# deployment.yaml
spec:
  containers:
    - name: app
      livenessProbe:
        httpGet:
          path: /health/live
          port: 3000
        initialDelaySeconds: 10
        periodSeconds: 15
        timeoutSeconds: 5
        failureThreshold: 3

      readinessProbe:
        httpGet:
          path: /health/ready
          port: 3000
        initialDelaySeconds: 5
        periodSeconds: 10
        timeoutSeconds: 5
        failureThreshold: 3
\`\`\`
`,
  },
];
