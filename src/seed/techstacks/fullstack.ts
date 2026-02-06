export const fullstackTechstacks = [
  // ============ T3 Stack ============
  {
    slug: 't3-stack',
    name: 'T3 Stack',
    description: 'Type-safe full-stack with Next.js, tRPC, Prisma, Tailwind',
    tags: ['fullstack', 'nextjs', 'trpc', 'prisma', 'tailwind', 'typescript'],
    techstack: `# T3 Stack

## Core Technologies
- **Next.js** 14 - React framework (App Router)
- **tRPC** - End-to-end type-safe APIs
- **Prisma** - Type-safe ORM
- **Tailwind CSS** - Utility styling
- **TypeScript** - Full type safety

## Authentication
- **NextAuth.js** (Auth.js) - Authentication

## Additional Libraries
- **Zod** - Schema validation
- **TanStack Query** - Integrated with tRPC

## Key Benefits
- No API layer to maintain manually
- Types flow from DB → API → Frontend
- Excellent DX with autocomplete

## Project Structure
\`\`\`
src/
├── app/
│   └── api/trpc/[trpc]/route.ts
├── server/
│   ├── api/
│   │   ├── routers/
│   │   │   └── user.ts
│   │   ├── trpc.ts
│   │   └── root.ts
│   └── db.ts
├── trpc/
│   ├── react.tsx
│   └── server.ts
└── env.js
\`\`\`

## Example tRPC Router
\`\`\`typescript
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany();
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.user.create({ data: input });
    }),
});
\`\`\`
`,
    codingGuidelines: `# T3 Stack Guidelines

## tRPC Best Practices
- Keep routers small and focused
- Use Zod for input validation
- Separate public and protected procedures
- Use React Query hooks (useQuery, useMutation)

## Prisma Tips
- Use \`prisma generate\` after schema changes
- Add indexes for frequently queried fields
- Use select/include to limit data fetching

## Type Safety
- Let types flow from Prisma → tRPC → React
- Avoid \`any\` types
- Use inferred types from tRPC
`,
  },

  // ============ TanStack Start ============
  {
    slug: 'tanstack-start',
    name: 'TanStack Start',
    description: 'Full-stack React with TanStack Start',
    tags: ['fullstack', 'react', 'tanstack', 'typescript', 'vinxi'],
    techstack: `# TanStack Start Stack

## Core
- **TanStack Start** - Full-stack React framework
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Server state
- **Vinxi** - Build system
- **TypeScript**

## Key Features
- Full-stack type safety
- File-based routing with full types
- Server functions
- SSR with streaming

## Database
- **Drizzle ORM** (recommended)
- **Prisma**

## Styling
- **Tailwind CSS**
- **shadcn/ui**

## Why TanStack Start?
- Best-in-class type safety
- Familiar TanStack ecosystem
- Modern React patterns
- Flexible deployment

## Example
\`\`\`typescript
// routes/users.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/users')({
  loader: async () => {
    return await fetchUsers();
  },
  component: UsersPage,
});

function UsersPage() {
  const users = Route.useLoaderData();
  return <UserList users={users} />;
}
\`\`\`
`,
  },

  // ============ Laravel ============
  {
    slug: 'laravel',
    name: 'Laravel Full Stack',
    description: 'PHP full-stack with Laravel',
    tags: ['fullstack', 'php', 'laravel', 'backend'],
    techstack: `# Laravel Stack

## Core
- **Laravel** 11.x - PHP framework
- **PHP** 8.2+
- **Composer** - Package manager

## Frontend Options
- **Livewire** 3 - Dynamic UI without JS framework
- **Inertia.js** - SPA with Vue/React/Svelte
- **Laravel + API** + separate frontend

## Database
- **Eloquent ORM** (built-in)
- MySQL, PostgreSQL, SQLite
- **Laravel Migrations**

## Authentication
- **Laravel Breeze** - Simple auth scaffolding
- **Laravel Jetstream** - Full-featured auth
- **Laravel Sanctum** - API tokens/SPA auth
- **Laravel Passport** - OAuth2

## Key Packages
- **Laravel Horizon** - Queue monitoring
- **Laravel Telescope** - Debug assistant
- **Laravel Scout** - Full-text search
- **Spatie packages** - Various utilities

## Frontend (Inertia)
\`\`\`
resources/js/
├── Pages/
│   ├── Users/
│   │   ├── Index.vue
│   │   └── Show.vue
├── Components/
└── app.ts
\`\`\`

## API Structure
\`\`\`
app/
├── Http/
│   ├── Controllers/
│   ├── Requests/
│   └── Resources/
├── Models/
├── Services/
routes/
├── api.php
└── web.php
\`\`\`
`,
    codingGuidelines: `# Laravel Coding Guidelines

## Controllers
\`\`\`php
class UserController extends Controller
{
    public function __construct(
        private UserService $userService
    ) {}

    public function store(CreateUserRequest $request): JsonResponse
    {
        $user = $this->userService->create($request->validated());

        return response()->json(
            new UserResource($user),
            Response::HTTP_CREATED
        );
    }
}
\`\`\`

## Form Requests
- Validate in Form Request classes
- Use $request->validated() for clean data

## Eloquent
- Use eager loading to prevent N+1
- Use API Resources for responses
- Add indexes for query patterns
`,
  },

  // ============ Ruby on Rails ============
  {
    slug: 'rails',
    name: 'Ruby on Rails',
    description: 'Full-stack Ruby with Rails',
    tags: ['fullstack', 'ruby', 'rails', 'backend'],
    techstack: `# Ruby on Rails Stack

## Core
- **Ruby** 3.2+
- **Rails** 7.1+
- **Bundler** - Dependency management

## Frontend Options
- **Hotwire** (Turbo + Stimulus) - Default
- **Importmaps** - No build step JS
- **React/Vue** via Inertia Rails

## Database
- **Active Record** (built-in ORM)
- PostgreSQL (recommended)
- Redis for caching/jobs

## Key Gems
- **devise** - Authentication
- **pundit** - Authorization
- **sidekiq** - Background jobs
- **pagy** - Pagination
- **ransack** - Search

## CSS
- **Tailwind CSS** via tailwindcss-rails
- **CSS Bundling**

## Project Structure
\`\`\`
app/
├── controllers/
├── models/
├── views/
├── helpers/
├── javascript/
│   └── controllers/  # Stimulus
├── jobs/
└── services/
config/
db/
├── migrate/
└── schema.rb
\`\`\`
`,
  },

  // ============ MERN Stack ============
  {
    slug: 'mern-stack',
    name: 'MERN Stack',
    description: 'MongoDB, Express, React, Node.js full-stack',
    tags: ['fullstack', 'mongodb', 'express', 'react', 'nodejs', 'javascript'],
    techstack: `# MERN Stack

## Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- JWT authentication

## Frontend
- **React** 18 + **Vite**
- **React Router** 6
- **TanStack Query**
- **Tailwind CSS**

## Project Structure
\`\`\`
project/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   └── package.json
├── server/              # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── app.ts
│   └── package.json
└── package.json         # Workspace root
\`\`\`

## Monorepo Setup
- Use pnpm workspaces
- Shared types package
- Concurrent development scripts
`,
  },

  // ============ MEAN Stack ============
  {
    slug: 'mean-stack',
    name: 'MEAN Stack',
    description: 'MongoDB, Express, Angular, Node.js full-stack',
    tags: ['fullstack', 'mongodb', 'express', 'angular', 'nodejs', 'typescript'],
    techstack: `# MEAN Stack

## Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- TypeScript

## Frontend
- **Angular** 17+
- **Angular Material** or **PrimeNG**
- **RxJS** for reactive programming

## Key Features
- TypeScript across full stack
- Strong typing end-to-end
- Enterprise-ready architecture

## Project Structure
\`\`\`
project/
├── apps/
│   ├── api/           # NestJS or Express
│   └── web/           # Angular app
├── libs/
│   └── shared/        # Shared types/utils
└── nx.json            # Nx monorepo
\`\`\`
`,
  },

  // ============ Remix ============
  {
    slug: 'remix',
    name: 'Remix',
    description: 'Full-stack React framework focused on web standards',
    tags: ['fullstack', 'remix', 'react', 'typescript', 'ssr'],
    techstack: `# Remix Stack

## Core
- **Remix** 2.x - Web framework
- **React** 18 - UI library
- **TypeScript**

## Key Concepts
- Nested routing
- Loaders for data fetching
- Actions for mutations
- Progressive enhancement
- Web standard forms

## Database
- **Prisma** or **Drizzle**
- Any SQL database

## Styling
- **Tailwind CSS**
- CSS modules (built-in)

## Deployment
- **Vercel**, **Fly.io**, **Railway**
- **Cloudflare Workers** (edge)

## Example
\`\`\`tsx
// app/routes/users.tsx
import { json } from '@remix-run/node';
import { useLoaderData, Form } from '@remix-run/react';

export async function loader() {
  const users = await db.user.findMany();
  return json({ users });
}

export async function action({ request }) {
  const formData = await request.formData();
  await db.user.create({
    data: { name: formData.get('name') }
  });
  return redirect('/users');
}

export default function Users() {
  const { users } = useLoaderData<typeof loader>();

  return (
    <>
      <ul>
        {users.map(user => <li key={user.id}>{user.name}</li>)}
      </ul>
      <Form method="post">
        <input name="name" required />
        <button type="submit">Add User</button>
      </Form>
    </>
  );
}
\`\`\`
`,
  },

  // ============ Astro ============
  {
    slug: 'astro',
    name: 'Astro',
    description: 'Content-focused web framework with island architecture',
    tags: ['fullstack', 'astro', 'static', 'content', 'typescript'],
    techstack: `# Astro Stack

## Core
- **Astro** 4.x - Content-focused framework
- **TypeScript**
- Ships zero JS by default

## Key Features
- Island architecture
- Use any UI framework (React, Vue, Svelte, etc.)
- Content collections
- SSG, SSR, or hybrid
- Built-in image optimization

## UI Integration
\`\`\`javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), tailwind()],
});
\`\`\`

## Content Collections
\`\`\`typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()),
  }),
});

export const collections = { blog };
\`\`\`

## Best For
- Marketing sites
- Blogs and documentation
- E-commerce with content
- Any content-heavy site
`,
  },
];
