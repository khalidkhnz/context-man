export const databaseTechstacks = [
  // ============ PostgreSQL ============
  {
    slug: 'postgresql-prisma',
    name: 'PostgreSQL + Prisma',
    description: 'PostgreSQL database with Prisma ORM',
    tags: ['database', 'postgresql', 'prisma', 'typescript', 'sql'],
    techstack: `# PostgreSQL + Prisma Stack

## Database
- **PostgreSQL** 16.x - Relational database
- Supports JSON, full-text search, arrays
- Extensions: pg_trgm, uuid-ossp, pgvector

## ORM
- **Prisma** 5.x - Type-safe ORM
- Prisma Client - Type-safe queries
- Prisma Migrate - Database migrations
- Prisma Studio - GUI for data

## Key Features
- Auto-generated TypeScript types
- Relation handling
- Transactions
- Raw SQL when needed

## Schema Example
\`\`\`prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String

  @@index([authorId])
}
\`\`\`

## Query Examples
\`\`\`typescript
// Find with relations
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
  include: { posts: true },
});

// Create with nested data
const user = await prisma.user.create({
  data: {
    email: 'new@example.com',
    posts: {
      create: { title: 'First Post' },
    },
  },
});

// Transaction
const [user, post] = await prisma.$transaction([
  prisma.user.create({ data: { email: 'a@b.com' } }),
  prisma.post.create({ data: { title: 'Hi', authorId: '...' } }),
]);
\`\`\`
`,
  },

  {
    slug: 'postgresql-drizzle',
    name: 'PostgreSQL + Drizzle',
    description: 'PostgreSQL database with Drizzle ORM',
    tags: ['database', 'postgresql', 'drizzle', 'typescript', 'sql'],
    techstack: `# PostgreSQL + Drizzle Stack

## Database
- **PostgreSQL** 16.x

## ORM
- **Drizzle ORM** - SQL-like TypeScript ORM
- **drizzle-kit** - CLI for migrations
- Zero runtime overhead
- Serverless-ready

## Why Drizzle?
- SQL-like syntax (not abstracted away)
- Full TypeScript inference
- Lightweight (no code generation)
- Supports edge/serverless

## Schema Definition
\`\`\`typescript
// db/schema.ts
import { pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  published: boolean('published').default(false),
  authorId: integer('author_id').references(() => users.id),
});
\`\`\`

## Query Examples
\`\`\`typescript
import { eq, and, like } from 'drizzle-orm';

// Select with where
const user = await db.select()
  .from(users)
  .where(eq(users.email, 'user@example.com'));

// Join
const postsWithAuthor = await db.select()
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
  .where(eq(posts.published, true));

// Insert
await db.insert(users).values({ email: 'new@example.com' });

// Update
await db.update(users)
  .set({ name: 'John' })
  .where(eq(users.id, 1));
\`\`\`
`,
  },

  // ============ MySQL ============
  {
    slug: 'mysql-prisma',
    name: 'MySQL + Prisma',
    description: 'MySQL database with Prisma ORM',
    tags: ['database', 'mysql', 'prisma', 'typescript', 'sql'],
    techstack: `# MySQL + Prisma Stack

## Database
- **MySQL** 8.x or **PlanetScale** (serverless MySQL)
- **MariaDB** also supported

## ORM
- **Prisma** 5.x
- Works the same as PostgreSQL
- Some MySQL-specific features

## PlanetScale Integration
\`\`\`prisma
datasource db {
  provider     = "mysql"
  url          = env("DATABASE_URL")
  relationMode = "prisma" // For PlanetScale
}
\`\`\`

## MySQL-Specific Types
\`\`\`prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String   @db.VarChar(255)
  description String?  @db.Text
  price       Decimal  @db.Decimal(10, 2)
  createdAt   DateTime @default(now()) @db.Timestamp(0)
}
\`\`\`
`,
  },

  // ============ MongoDB ============
  {
    slug: 'mongodb-mongoose',
    name: 'MongoDB + Mongoose',
    description: 'MongoDB with Mongoose ODM',
    tags: ['database', 'mongodb', 'mongoose', 'nosql', 'typescript'],
    techstack: `# MongoDB + Mongoose Stack

## Database
- **MongoDB** 7.x - Document database
- **MongoDB Atlas** - Cloud hosting

## ODM
- **Mongoose** 8.x - Object Document Mapper
- Schema validation
- Middleware hooks
- Virtual fields

## Schema Example
\`\`\`typescript
import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  email: string;
  name?: string;
  posts: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: String,
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
}, {
  timestamps: true,
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ name: 'text' }); // Text search

// Virtual
userSchema.virtual('postCount').get(function() {
  return this.posts.length;
});

export const User = mongoose.model<IUser>('User', userSchema);
\`\`\`

## Query Examples
\`\`\`typescript
// Find with population
const user = await User.findById(id).populate('posts');

// Aggregation
const stats = await User.aggregate([
  { $match: { createdAt: { $gte: startDate } } },
  { $group: { _id: null, count: { $sum: 1 } } },
]);

// Text search
const results = await User.find({ $text: { $search: 'john' } });
\`\`\`

## Best Practices
- Use lean() for read-only queries
- Add indexes for query patterns
- Use embedded docs for 1:few relations
- Use references for 1:many relations
`,
  },

  // ============ SQLite ============
  {
    slug: 'sqlite-drizzle',
    name: 'SQLite + Drizzle',
    description: 'SQLite database with Drizzle ORM',
    tags: ['database', 'sqlite', 'drizzle', 'typescript', 'serverless'],
    techstack: `# SQLite + Drizzle Stack

## Database
- **SQLite** - Embedded database
- **Turso** - Distributed SQLite (edge)
- **libSQL** - SQLite fork

## ORM
- **Drizzle ORM**
- Zero latency (no network)
- Perfect for serverless/edge

## When to Use SQLite
- Single-server applications
- Development/testing
- Edge deployments
- Read-heavy workloads
- Embedded applications

## Drizzle + Turso
\`\`\`typescript
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client);
\`\`\`

## Drizzle + Better-sqlite3
\`\`\`typescript
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite);
\`\`\`
`,
  },

  // ============ Redis ============
  {
    slug: 'redis',
    name: 'Redis',
    description: 'Redis for caching and real-time data',
    tags: ['database', 'redis', 'cache', 'realtime', 'nosql'],
    techstack: `# Redis Stack

## Core
- **Redis** 7.x - In-memory data store
- **Redis Stack** - Extended with JSON, Search, Graph

## Use Cases
- Caching
- Session storage
- Rate limiting
- Pub/Sub messaging
- Leaderboards
- Real-time analytics

## Node.js Clients
- **ioredis** - Full-featured client
- **redis** - Official client

## Example with ioredis
\`\`\`typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// String
await redis.set('user:1', JSON.stringify(user), 'EX', 3600);
const user = JSON.parse(await redis.get('user:1'));

// Hash
await redis.hset('user:1', { name: 'John', email: 'john@example.com' });
const user = await redis.hgetall('user:1');

// Sorted Set (leaderboard)
await redis.zadd('leaderboard', score, 'player1');
const top10 = await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES');

// Pub/Sub
redis.subscribe('notifications');
redis.on('message', (channel, message) => {
  console.log(channel, message);
});
\`\`\`

## Caching Pattern
\`\`\`typescript
async function getCachedUser(id: string) {
  const cached = await redis.get(\`user:\${id}\`);
  if (cached) return JSON.parse(cached);

  const user = await db.user.findUnique({ where: { id } });
  await redis.set(\`user:\${id}\`, JSON.stringify(user), 'EX', 3600);
  return user;
}
\`\`\`
`,
  },
];
