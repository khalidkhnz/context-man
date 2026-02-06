import { SkillType } from '../../types/skill.types.js';

export const databaseSkills = [
  // ============ Prisma ============
  {
    projectSlug: 'all',
    name: 'prisma-patterns',
    type: SkillType.CODE_TEMPLATE,
    description: 'Prisma ORM patterns and best practices',
    tags: ['database', 'prisma', 'orm'],
    content: `# Prisma Patterns

## Singleton Client
\`\`\`typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
\`\`\`

## Common Queries
\`\`\`typescript
// Find with relations
const user = await prisma.user.findUnique({
  where: { id },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    },
    _count: { select: { posts: true } },
  },
});

// Pagination
const [users, total] = await prisma.$transaction([
  prisma.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
  }),
  prisma.user.count(),
]);

// Upsert
const user = await prisma.user.upsert({
  where: { email },
  update: { name },
  create: { email, name },
});

// Nested writes
const user = await prisma.user.create({
  data: {
    email: 'alice@example.com',
    profile: {
      create: { bio: 'Hello!' },
    },
    posts: {
      createMany: {
        data: [
          { title: 'Post 1' },
          { title: 'Post 2' },
        ],
      },
    },
  },
});
\`\`\`

## Transactions
\`\`\`typescript
// Sequential transaction
const [user, post] = await prisma.$transaction([
  prisma.user.create({ data: { email: 'a@b.com' } }),
  prisma.post.create({ data: { title: 'Hi', authorId: '...' } }),
]);

// Interactive transaction
await prisma.$transaction(async (tx) => {
  const user = await tx.user.findUnique({ where: { id } });
  if (!user) throw new Error('User not found');

  await tx.account.update({
    where: { userId: id },
    data: { balance: { decrement: amount } },
  });

  await tx.transaction.create({
    data: { userId: id, amount, type: 'DEBIT' },
  });
});
\`\`\`

## Soft Delete Middleware
\`\`\`typescript
prisma.$use(async (params, next) => {
  if (params.model === 'Post') {
    if (params.action === 'delete') {
      params.action = 'update';
      params.args.data = { deletedAt: new Date() };
    }
    if (params.action === 'findMany' || params.action === 'findFirst') {
      params.args.where = { ...params.args.where, deletedAt: null };
    }
  }
  return next(params);
});
\`\`\`
`,
  },

  // ============ Drizzle ============
  {
    projectSlug: 'all',
    name: 'drizzle-patterns',
    type: SkillType.CODE_TEMPLATE,
    description: 'Drizzle ORM patterns and best practices',
    tags: ['database', 'drizzle', 'orm'],
    content: `# Drizzle ORM Patterns

## Schema Definition
\`\`\`typescript
// db/schema.ts
import { pgTable, serial, text, boolean, timestamp, integer, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('email_idx').on(table.email),
}));

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  published: boolean('published').default(false),
  authorId: integer('author_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));
\`\`\`

## Database Connection
\`\`\`typescript
// db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
\`\`\`

## Common Queries
\`\`\`typescript
import { eq, and, like, desc, asc, sql } from 'drizzle-orm';

// Select with where
const user = await db.select().from(users).where(eq(users.id, 1));

// Select specific columns
const emails = await db.select({ email: users.email }).from(users);

// Join
const postsWithAuthor = await db
  .select({
    post: posts,
    author: users,
  })
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id));

// Using relations (query API)
const usersWithPosts = await db.query.users.findMany({
  with: {
    posts: {
      where: eq(posts.published, true),
      limit: 10,
    },
  },
});

// Pagination
const result = await db.select()
  .from(users)
  .orderBy(desc(users.createdAt))
  .limit(limit)
  .offset((page - 1) * limit);

// Count
const [{ count }] = await db
  .select({ count: sql<number>\`count(*)\` })
  .from(users);

// Insert
const [newUser] = await db.insert(users).values({ email: 'a@b.com' }).returning();

// Update
await db.update(users).set({ name: 'John' }).where(eq(users.id, 1));

// Delete
await db.delete(users).where(eq(users.id, 1));
\`\`\`

## Transactions
\`\`\`typescript
await db.transaction(async (tx) => {
  const [user] = await tx.insert(users).values({ email: 'a@b.com' }).returning();
  await tx.insert(posts).values({ title: 'First Post', authorId: user.id });
});
\`\`\`
`,
  },

  // ============ MongoDB/Mongoose ============
  {
    projectSlug: 'all',
    name: 'mongoose-patterns',
    type: SkillType.CODE_TEMPLATE,
    description: 'Mongoose ODM patterns for MongoDB',
    tags: ['database', 'mongodb', 'mongoose'],
    content: `# Mongoose Patterns

## Schema with TypeScript
\`\`\`typescript
import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface
interface IUser extends Document {
  email: string;
  name?: string;
  role: 'user' | 'admin';
  posts: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Schema
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post',
  }],
}, {
  timestamps: true,
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ name: 'text' }); // Text search

// Virtuals
userSchema.virtual('postCount').get(function() {
  return this.posts.length;
});

// Instance methods
userSchema.methods.toPublic = function() {
  return {
    id: this._id,
    email: this.email,
    name: this.name,
  };
};

// Static methods
userSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

// Pre-save hook
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

export const User = mongoose.model<IUser>('User', userSchema);
\`\`\`

## Query Patterns
\`\`\`typescript
// Find with population
const user = await User.findById(id)
  .populate('posts')
  .lean(); // Returns plain object, faster

// Pagination
const users = await User.find()
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();

const total = await User.countDocuments();

// Text search
const results = await User.find({
  $text: { $search: 'john' }
}).lean();

// Aggregation
const stats = await User.aggregate([
  { $match: { role: 'user' } },
  { $group: {
    _id: null,
    count: { $sum: 1 },
    avgPosts: { $avg: { $size: '$posts' } },
  }},
]);
\`\`\`

## Best Practices
- Use \`.lean()\` for read-only queries
- Create indexes for query patterns
- Use embedded documents for 1:few relationships
- Use references for 1:many relationships
- Use aggregation for complex queries
`,
  },

  // ============ SQL Queries ============
  {
    projectSlug: 'all',
    name: 'sql-query-patterns',
    type: SkillType.INSTRUCTIONS,
    description: 'Common SQL query patterns',
    tags: ['database', 'sql', 'queries'],
    content: `# SQL Query Patterns

## Basic CRUD
\`\`\`sql
-- Create
INSERT INTO users (email, name) VALUES ('a@b.com', 'John');

-- Read
SELECT * FROM users WHERE id = 1;
SELECT id, email FROM users WHERE role = 'admin';

-- Update
UPDATE users SET name = 'Jane' WHERE id = 1;

-- Delete
DELETE FROM users WHERE id = 1;
\`\`\`

## Joins
\`\`\`sql
-- Inner join
SELECT u.name, p.title
FROM users u
INNER JOIN posts p ON u.id = p.author_id;

-- Left join (include users without posts)
SELECT u.name, COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON u.id = p.author_id
GROUP BY u.id;
\`\`\`

## Pagination
\`\`\`sql
-- Offset pagination
SELECT * FROM users
ORDER BY created_at DESC
LIMIT 20 OFFSET 40;

-- Cursor pagination (more efficient)
SELECT * FROM users
WHERE created_at < :cursor
ORDER BY created_at DESC
LIMIT 20;
\`\`\`

## Aggregations
\`\`\`sql
-- Count by group
SELECT role, COUNT(*) as count
FROM users
GROUP BY role;

-- With having
SELECT author_id, COUNT(*) as post_count
FROM posts
GROUP BY author_id
HAVING COUNT(*) > 5;
\`\`\`

## Subqueries
\`\`\`sql
-- Users with more than average posts
SELECT * FROM users
WHERE id IN (
  SELECT author_id FROM posts
  GROUP BY author_id
  HAVING COUNT(*) > (SELECT AVG(cnt) FROM (
    SELECT COUNT(*) as cnt FROM posts GROUP BY author_id
  ) as avg_posts)
);
\`\`\`

## CTEs (Common Table Expressions)
\`\`\`sql
WITH active_users AS (
  SELECT * FROM users
  WHERE last_login > NOW() - INTERVAL '30 days'
)
SELECT au.name, COUNT(p.id) as recent_posts
FROM active_users au
LEFT JOIN posts p ON au.id = p.author_id
  AND p.created_at > NOW() - INTERVAL '30 days'
GROUP BY au.id;
\`\`\`

## Full-text Search (PostgreSQL)
\`\`\`sql
-- Create index
CREATE INDEX posts_search_idx ON posts
USING GIN (to_tsvector('english', title || ' ' || content));

-- Search
SELECT * FROM posts
WHERE to_tsvector('english', title || ' ' || content)
  @@ plainto_tsquery('english', 'search term');
\`\`\`
`,
  },
];
