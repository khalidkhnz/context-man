export const frontendTechstacks = [
  // ============ React Ecosystem ============
  {
    slug: 'react-vite',
    name: 'React + Vite',
    description: 'Modern React SPA with Vite bundler',
    tags: ['frontend', 'react', 'vite', 'spa', 'typescript'],
    techstack: `# React + Vite Stack

## Build & Runtime
- **Vite** 5.x - Next-gen bundler
- **React** 18.x - UI library
- **TypeScript** 5.x - Type safety
- **Package Manager**: pnpm

## Routing
- **React Router** 6.x - Client-side routing
- **TanStack Router** (alternative) - Type-safe routing

## State Management
- **TanStack Query** (React Query) - Server state
- **Zustand** - Client state (lightweight)
- **Jotai** (alternative) - Atomic state

## Styling
- **Tailwind CSS** 3.x - Utility-first CSS
- **shadcn/ui** - Component library
- **Radix UI** - Headless components

## Forms
- **React Hook Form** - Form handling
- **Zod** - Schema validation

## Key Libraries
- **axios** or **ky** - HTTP client
- **date-fns** - Date utilities
- **lucide-react** - Icons

## Project Structure
\`\`\`
src/
├── components/
│   ├── ui/           # Reusable UI components
│   └── features/     # Feature-specific components
├── hooks/            # Custom hooks
├── lib/              # Utilities
├── pages/            # Route pages
├── services/         # API services
├── stores/           # State stores
├── types/            # TypeScript types
├── App.tsx
└── main.tsx
\`\`\`
`,
    codingGuidelines: `# React Coding Guidelines

## Component Structure
\`\`\`tsx
// Named export, function declaration
export function UserCard({ user }: UserCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card>
      <CardHeader>{user.name}</CardHeader>
      <CardContent>{user.email}</CardContent>
    </Card>
  );
}
\`\`\`

## Custom Hooks
- Prefix with "use"
- Keep hooks focused on one concern
- Return tuple or object

## State Management
- URL state for navigation/filters
- Server state with TanStack Query
- Local UI state with useState
- Global UI state with Zustand

## Performance
- Use React.memo sparingly
- Virtualize long lists
- Lazy load routes and heavy components
`,
  },

  {
    slug: 'react-vite-tanstack',
    name: 'React + Vite + TanStack',
    description: 'React SPA with TanStack Query and Router',
    tags: ['frontend', 'react', 'vite', 'tanstack', 'typescript'],
    techstack: `# React + TanStack Stack

## Core
- **Vite** 5.x + **React** 18.x
- **TypeScript** 5.x

## TanStack Ecosystem
- **TanStack Query** 5.x - Server state management
- **TanStack Router** - Type-safe file-based routing
- **TanStack Table** - Headless table
- **TanStack Form** - Form handling
- **TanStack Virtual** - List virtualization

## Benefits of TanStack Query
\`\`\`tsx
function Users() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Automatic caching, refetching, error handling
}
\`\`\`

## Benefits of TanStack Router
- Full type safety (params, search, loaders)
- File-based routing
- Built-in data loading
- Search param state management
`,
  },

  // ============ Next.js ============
  {
    slug: 'nextjs-app-router',
    name: 'Next.js App Router',
    description: 'Full-stack React with Next.js 14+ App Router',
    tags: ['frontend', 'fullstack', 'nextjs', 'react', 'typescript', 'ssr'],
    techstack: `# Next.js App Router Stack

## Core
- **Next.js** 14.x - React framework
- **React** 18.x with Server Components
- **TypeScript** 5.x

## Key Features
- App Router (app/ directory)
- Server Components (default)
- Server Actions
- Streaming and Suspense
- Built-in image/font optimization

## Database
- **Prisma** or **Drizzle** for database
- **Vercel Postgres** or external DB

## Authentication
- **NextAuth.js** v5 (Auth.js)
- **Clerk** or **Lucia**

## Styling
- **Tailwind CSS**
- **shadcn/ui** - Pre-built components

## Deployment
- **Vercel** (recommended)
- Docker self-hosted

## Project Structure
\`\`\`
app/
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── (dashboard)/
│   ├── layout.tsx
│   └── page.tsx
├── api/
│   └── [...route]/route.ts
├── layout.tsx
└── page.tsx
components/
lib/
├── db.ts
└── auth.ts
\`\`\`
`,
    codingGuidelines: `# Next.js App Router Guidelines

## Server vs Client Components
\`\`\`tsx
// Server Component (default) - app/users/page.tsx
import { db } from '@/lib/db';

export default async function UsersPage() {
  const users = await db.user.findMany();
  return <UserList users={users} />;
}

// Client Component - components/user-form.tsx
'use client';

import { useState } from 'react';

export function UserForm() {
  const [name, setName] = useState('');
  // Interactive component
}
\`\`\`

## Server Actions
\`\`\`tsx
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createUser(formData: FormData) {
  const name = formData.get('name');
  await db.user.create({ data: { name } });
  revalidatePath('/users');
}
\`\`\`

## Data Fetching
- Fetch in Server Components
- Use cache() and revalidatePath()
- Parallel data fetching with Promise.all
`,
  },

  // ============ Vue Ecosystem ============
  {
    slug: 'vue-vite',
    name: 'Vue 3 + Vite',
    description: 'Modern Vue 3 SPA with Composition API',
    tags: ['frontend', 'vue', 'vite', 'typescript'],
    techstack: `# Vue 3 + Vite Stack

## Core
- **Vue** 3.x - Progressive framework
- **Vite** 5.x - Build tool
- **TypeScript** 5.x

## Composition API
- script setup syntax
- Composables for reusable logic
- ref, reactive, computed

## State Management
- **Pinia** - Official state management
- VueUse - Collection of composables

## Routing
- **Vue Router** 4.x

## Styling
- **Tailwind CSS**
- **Radix Vue** - Headless components
- **PrimeVue** or **Vuetify** (alternative)

## Forms
- **VeeValidate** + **Zod**
- FormKit (alternative)

## Project Structure
\`\`\`
src/
├── components/
├── composables/      # Reusable logic
├── stores/           # Pinia stores
├── views/            # Route pages
├── router/
├── services/
├── types/
├── App.vue
└── main.ts
\`\`\`

## Example
\`\`\`vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const search = ref('');

const filteredUsers = computed(() =>
  userStore.users.filter(u => u.name.includes(search.value))
);
</script>

<template>
  <input v-model="search" placeholder="Search..." />
  <UserList :users="filteredUsers" />
</template>
\`\`\`
`,
  },

  {
    slug: 'nuxt',
    name: 'Nuxt 3',
    description: 'Full-stack Vue framework with Nuxt 3',
    tags: ['frontend', 'fullstack', 'nuxt', 'vue', 'typescript', 'ssr'],
    techstack: `# Nuxt 3 Stack

## Core
- **Nuxt** 3.x - Vue meta-framework
- **Vue** 3.x
- **TypeScript** (auto-configured)
- **Nitro** - Server engine

## Key Features
- File-based routing
- Auto-imports (components, composables)
- Server routes (API endpoints)
- Hybrid rendering (SSR, SSG, SPA)
- Built-in state management (useState)

## Database
- **Prisma** with Nuxt module
- **Drizzle ORM**
- **Supabase** module

## Authentication
- **Nuxt Auth Utils**
- **Sidebase Auth**

## Styling
- **@nuxtjs/tailwindcss**
- **Nuxt UI** - Component library

## Project Structure
\`\`\`
app/
├── components/      # Auto-imported
├── composables/     # Auto-imported
├── pages/           # File-based routing
├── layouts/
├── middleware/
├── plugins/
├── server/
│   ├── api/         # API routes
│   └── utils/
├── app.vue
└── nuxt.config.ts
\`\`\`
`,
  },

  // ============ Angular ============
  {
    slug: 'angular',
    name: 'Angular',
    description: 'Enterprise frontend with Angular',
    tags: ['frontend', 'angular', 'typescript', 'enterprise'],
    techstack: `# Angular Stack

## Core
- **Angular** 17+ - Full framework
- **TypeScript** (required)
- **RxJS** - Reactive programming
- **Angular CLI** - Development tooling

## Key Features (v17+)
- Standalone components (default)
- Signals for reactivity
- Deferrable views
- Built-in control flow (@if, @for)

## State Management
- **NgRx** - Redux-style (complex apps)
- **Angular Signals** - Built-in reactivity
- **RxJS BehaviorSubject** - Simple cases

## Styling
- **Angular Material** - Material Design
- **PrimeNG** - Rich components
- **Tailwind CSS** - Utility CSS

## HTTP
- **HttpClient** - Built-in HTTP client
- Interceptors for auth/logging

## Forms
- Reactive Forms (recommended)
- Template-driven forms (simple cases)

## Project Structure
\`\`\`
src/app/
├── core/
│   ├── services/
│   ├── guards/
│   └── interceptors/
├── features/
│   └── users/
│       ├── users.component.ts
│       ├── users.service.ts
│       └── users.routes.ts
├── shared/
│   ├── components/
│   └── pipes/
└── app.routes.ts
\`\`\`
`,
  },

  // ============ Svelte Ecosystem ============
  {
    slug: 'svelte-kit',
    name: 'SvelteKit',
    description: 'Full-stack Svelte with SvelteKit',
    tags: ['frontend', 'fullstack', 'svelte', 'sveltekit', 'typescript'],
    techstack: `# SvelteKit Stack

## Core
- **SvelteKit** 2.x - Full-stack framework
- **Svelte** 4.x (or Svelte 5 with runes)
- **TypeScript**
- **Vite** - Bundler

## Key Features
- File-based routing
- SSR, SSG, SPA modes
- Server endpoints (+server.ts)
- Form actions
- Load functions

## Database
- **Prisma** or **Drizzle**
- **Supabase**

## Styling
- **Tailwind CSS**
- **Skeleton UI** - Svelte components
- Scoped styles (built-in)

## Project Structure
\`\`\`
src/
├── lib/
│   ├── components/
│   ├── server/      # Server-only code
│   └── utils/
├── routes/
│   ├── +layout.svelte
│   ├── +page.svelte
│   ├── users/
│   │   ├── +page.svelte
│   │   ├── +page.server.ts
│   │   └── +server.ts
│   └── api/
├── app.html
└── app.d.ts
\`\`\`

## Example
\`\`\`svelte
<!-- +page.svelte -->
<script lang="ts">
  export let data;  // From +page.server.ts
</script>

<h1>Users</h1>
{#each data.users as user}
  <div>{user.name}</div>
{/each}
\`\`\`
`,
  },

  // ============ Solid ============
  {
    slug: 'solid-start',
    name: 'SolidStart',
    description: 'Full-stack Solid.js with SolidStart',
    tags: ['frontend', 'fullstack', 'solid', 'typescript', 'performance'],
    techstack: `# SolidStart Stack

## Core
- **SolidStart** 1.x - Meta-framework
- **Solid.js** - Reactive UI library
- **TypeScript**
- **Vinxi** - Build system

## Key Features
- Fine-grained reactivity (no Virtual DOM)
- File-based routing
- Server functions
- SSR/SSG/SPA

## Why Solid?
- Smaller bundle size than React
- True reactivity (signals)
- No re-renders, surgical updates
- Similar JSX syntax to React

## Example
\`\`\`tsx
import { createSignal, For } from 'solid-js';

function Counter() {
  const [count, setCount] = createSignal(0);

  return (
    <button onClick={() => setCount(count() + 1)}>
      Count: {count()}
    </button>
  );
}
\`\`\`

## Styling
- Tailwind CSS
- Solid UI libraries emerging
`,
  },

  // ============ Mobile/Cross-Platform ============
  {
    slug: 'react-native',
    name: 'React Native',
    description: 'Cross-platform mobile apps with React Native',
    tags: ['mobile', 'react-native', 'react', 'typescript', 'ios', 'android'],
    techstack: `# React Native Stack

## Core
- **React Native** 0.73+
- **Expo** 50+ (recommended) or bare React Native
- **TypeScript**

## Navigation
- **Expo Router** - File-based routing
- **React Navigation** (alternative)

## State Management
- **TanStack Query** - Server state
- **Zustand** or **Jotai** - Client state
- **MMKV** - Fast storage

## Styling
- **NativeWind** - Tailwind for RN
- **Tamagui** - Universal design system
- StyleSheet (built-in)

## UI Libraries
- **React Native Paper** - Material Design
- **NativeBase**
- **Gluestack UI**

## Development
- **Expo Go** - Quick testing
- **EAS Build** - Cloud builds
- **Flipper** - Debugging

## Project Structure (Expo Router)
\`\`\`
app/
├── (tabs)/
│   ├── index.tsx
│   └── settings.tsx
├── _layout.tsx
└── [id].tsx
components/
lib/
\`\`\`
`,
  },
];
