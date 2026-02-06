export const devopsTechstacks = [
  // ============ Docker ============
  {
    slug: 'docker',
    name: 'Docker',
    description: 'Containerization with Docker',
    tags: ['devops', 'docker', 'containers', 'deployment'],
    techstack: `# Docker Stack

## Core
- **Docker** - Container platform
- **Docker Compose** - Multi-container apps

## Node.js Dockerfile
\`\`\`dockerfile
# Multi-stage build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["node", "dist/index.js"]
\`\`\`

## Docker Compose
\`\`\`yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/app
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
\`\`\`

## Best Practices
- Use multi-stage builds
- Use .dockerignore
- Don't run as root
- Use specific image tags
- Minimize layers
`,
  },

  // ============ CI/CD ============
  {
    slug: 'github-actions',
    name: 'GitHub Actions CI/CD',
    description: 'CI/CD pipelines with GitHub Actions',
    tags: ['devops', 'cicd', 'github', 'automation'],
    techstack: `# GitHub Actions Stack

## Key Concepts
- Workflows, Jobs, Steps
- Triggers: push, pull_request, schedule
- Reusable workflows
- Matrix builds

## Node.js CI Workflow
\`\`\`yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
\`\`\`

## Deploy to Vercel
\`\`\`yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.ORG_ID }}
          vercel-project-id: \${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
\`\`\`
`,
  },

  // ============ Vercel ============
  {
    slug: 'vercel-deployment',
    name: 'Vercel Deployment',
    description: 'Deploying to Vercel',
    tags: ['devops', 'vercel', 'deployment', 'serverless'],
    techstack: `# Vercel Deployment

## Supported Frameworks
- Next.js (best support)
- React, Vue, Angular, Svelte
- Any static site or Node.js

## Key Features
- Git-based deployments
- Preview deployments for PRs
- Edge functions
- Analytics
- Serverless functions

## Configuration
\`\`\`json
// vercel.json
{
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "DATABASE_URL": "@database-url"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_API_URL": "@api-url"
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    }
  ]
}
\`\`\`

## Environment Variables
- Use Vercel dashboard for secrets
- Use @variable-name for linked values
- Different values per environment

## Serverless Functions
\`\`\`typescript
// api/hello.ts (or app/api/hello/route.ts for Next.js)
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.json({ message: 'Hello!' });
}
\`\`\`
`,
  },

  // ============ Fly.io ============
  {
    slug: 'fly-deployment',
    name: 'Fly.io Deployment',
    description: 'Deploying to Fly.io',
    tags: ['devops', 'fly', 'deployment', 'containers'],
    techstack: `# Fly.io Deployment

## Key Features
- Run Docker anywhere
- Global edge deployment
- Built-in Postgres & Redis
- Persistent volumes
- Auto-scaling

## Setup
\`\`\`bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch app
fly launch
\`\`\`

## Configuration
\`\`\`toml
# fly.toml
app = "my-app"
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  PORT = "3000"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

[[services]]
  internal_port = 3000
  protocol = "tcp"

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]
\`\`\`

## Database
\`\`\`bash
# Create Postgres
fly postgres create

# Attach to app
fly postgres attach --app my-app my-db
\`\`\`
`,
  },

  // ============ Railway ============
  {
    slug: 'railway-deployment',
    name: 'Railway Deployment',
    description: 'Deploying to Railway',
    tags: ['devops', 'railway', 'deployment', 'paas'],
    techstack: `# Railway Deployment

## Key Features
- GitHub integration
- Instant deploys
- Built-in databases (Postgres, MySQL, Redis, MongoDB)
- Auto-scaling
- Private networking

## Deploy Options
1. Connect GitHub repo
2. Deploy from CLI
3. Deploy Docker image

## CLI Deployment
\`\`\`bash
# Install
npm install -g @railway/cli

# Login
railway login

# Init project
railway init

# Deploy
railway up
\`\`\`

## Database Setup
- Click "New" → "Database"
- Select Postgres/MySQL/Redis/MongoDB
- Copy connection URL to variables

## Environment Variables
- Set in Railway dashboard
- Available at build and runtime
- Use \${{}} for referencing other vars
`,
  },

  // ============ AWS ============
  {
    slug: 'aws-deployment',
    name: 'AWS Deployment',
    description: 'Deploying to AWS services',
    tags: ['devops', 'aws', 'cloud', 'deployment'],
    techstack: `# AWS Deployment Stack

## Compute Options
- **EC2** - Virtual servers
- **ECS/Fargate** - Container orchestration
- **Lambda** - Serverless functions
- **App Runner** - Container-based apps

## Database
- **RDS** - Managed SQL (Postgres, MySQL)
- **DynamoDB** - NoSQL
- **ElastiCache** - Redis/Memcached
- **DocumentDB** - MongoDB-compatible

## Storage
- **S3** - Object storage
- **EBS** - Block storage
- **EFS** - File storage

## Networking
- **VPC** - Virtual network
- **ALB** - Load balancing
- **CloudFront** - CDN
- **Route 53** - DNS

## Infrastructure as Code
\`\`\`typescript
// CDK Example
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class MyStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const fn = new lambda.Function(this, 'Handler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('dist'),
      handler: 'index.handler',
    });

    new apigateway.LambdaRestApi(this, 'Api', {
      handler: fn,
    });
  }
}
\`\`\`

## SST (Serverless Stack)
\`\`\`typescript
// sst.config.ts
export default {
  config() {
    return { name: 'my-app', region: 'us-east-1' };
  },
  stacks(app) {
    app.stack(function API({ stack }) {
      const api = new Api(stack, 'api', {
        routes: {
          'GET /': 'packages/functions/src/lambda.handler',
        },
      });
      stack.addOutputs({ ApiEndpoint: api.url });
    });
  },
};
\`\`\`
`,
  },
];
