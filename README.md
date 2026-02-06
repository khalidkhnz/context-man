# Context Manager - MCP Server

An MCP (Model Context Protocol) server for managing project context. Provides AI assistants with structured access to project documentation, coding guidelines, skills, code snippets, prompt templates, and a catalog of techstacks and patterns.

## Features

- **Project Context Management**: Store and organize PLAN, TODO, SCOPE, TECHSTACK, UI/UX Standards, and Coding Guidelines per project
- **Skills Library**: Define reusable instructions, code templates, and tool definitions
- **Code Snippets**: Store reusable code patterns organized by language
- **Prompt Templates**: Create templates with variable substitution
- **Todo System**: Track todos with Q&A history for AI-user interactions
- **Catalog System**: Browse 40+ techstack templates and 29 coding patterns
- **Version History**: Automatic versioning for all content types
- **Full-Text Search**: Search across all project content
- **Multiple Interfaces**: CLI, REST API, and MCP tools

## Prerequisites

- Node.js 18+
- MongoDB 6+ (local or Atlas)

## Quick Start with Docker

```bash
# Clone and start
git clone <repository-url>
cd context-man
docker-compose up -d

# Seed the database with techstacks and skills
npm install
npm run seed

# The API is now available at http://localhost:7777
```

## Manual Installation

```bash
# Clone the repository
git clone <repository-url>
cd context-man

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start MongoDB (if not using Docker)
mongod --dbpath /data/db

# Seed the database (optional - adds 42 techstack templates and skills)
npm run seed

# Build the project
npm run build
```

## Usage

### Start Servers

```bash
# Start REST API (port 7777)
npm run serve:api

# Start MCP server for Claude Desktop (stdio)
npm run serve:mcp

# Start MCP server with HTTP/SSE transport
npm run cli -- serve mcp --transport http

# Start all servers
npm run cli -- serve --all
```

### Browse the Catalog

The catalog contains 42 project templates and 29 reusable skills:

```bash
# List all project templates
curl http://localhost:7777/api/catalog/projects

# Filter by category (backend, frontend, fullstack, database, devops, mobile)
curl "http://localhost:7777/api/catalog/projects?category=backend"

# Search for specific tech
curl "http://localhost:7777/api/catalog/projects?search=react"

# List all skills
curl http://localhost:7777/api/catalog/skills

# Filter skills by category
curl "http://localhost:7777/api/catalog/skills?category=security"

# Get full skill content
curl http://localhost:7777/api/catalog/skills/jwt-authentication

# Get techstack details
curl http://localhost:7777/api/catalog/techstacks/t3-stack
```

### Create a Project

```bash
# Initialize a new project
npm run cli -- init my-app --name "My Application" --description "My awesome project"

# Or initialize from an existing techstack template
# (Use MCP tool: init_project_from_techstack)
```

### Manage Documents

```bash
# Add a document
npm run cli -- add document my-app PLAN --file ./PLAN.md --title "Project Plan"

# List documents
npm run cli -- list documents my-app

# Get document
npm run cli -- get document my-app PLAN
```

### Manage Todos

```bash
# Add a todo
npm run cli -- add-todo my-app "Implement authentication"

# List todos
npm run cli -- list-todos my-app

# Mark as in progress
npm run cli -- start-todo <todo-id>

# Add Q&A (track decisions made during implementation)
npm run cli -- add-qa <todo-id> --question "Which auth method?" --answer "JWT with refresh tokens"

# Mark as completed
npm run cli -- complete-todo <todo-id>

# Get todo stats
npm run cli -- todo-stats my-app
```

### Search

```bash
# Search within project
npm run cli -- search "authentication" --project my-app

# Global search
npm run cli -- search "react hooks"
```

## Available Techstack Templates

### Backend (13)
- Node.js Express (MongoDB, PostgreSQL, Drizzle)
- NestJS, Fastify
- Bun + Elysia, Bun + Hono
- Java Spring Boot, Spring WebFlux
- Python FastAPI, Django
- Go Gin
- Rust Axum

### Frontend (9)
- React + Vite, React + TanStack
- Next.js App Router
- Vue 3, Nuxt 3
- Angular
- SvelteKit, SolidStart
- React Native

### Fullstack (8)
- T3 Stack
- TanStack Start
- Laravel, Rails
- MERN, MEAN
- Remix, Astro

### Database (6)
- PostgreSQL + Prisma/Drizzle
- MySQL + Prisma
- MongoDB + Mongoose
- SQLite + Drizzle
- Redis

### DevOps (6)
- Docker
- GitHub Actions
- Vercel, Fly.io, Railway
- AWS

## Available Skills (29)

| Category | Skills |
|----------|--------|
| **Backend** | REST API design, error handling, JWT auth, Zod validation, repository pattern, rate limiting |
| **Frontend** | React patterns, Zustand, TanStack Query, React Hook Form, Tailwind |
| **Database** | Prisma, Drizzle, Mongoose, SQL patterns |
| **DevOps** | Dockerfile best practices, env management, logging, health checks |
| **General** | Git conventions, code review, TypeScript best practices, testing, documentation, security, performance, error handling, project structure, naming conventions |

## MCP Tools

When connected via MCP, the following tools are available:

### Core Tools
| Tool | Description |
|------|-------------|
| `list_projects` | List all projects with counts |
| `get_project_context` | Get full project context |
| `get_document` | Get a specific document |
| `get_skills` | List/get skills by type |
| `get_code_snippets` | List/get code snippets |
| `get_prompt_template` | Get/render prompt templates |
| `search_content` | Full-text search |

### Catalog Tools
| Tool | Description |
|------|-------------|
| `browse_catalog` | Browse project templates with filtering |
| `browse_all_skills` | Browse skills with filtering |
| `get_skill_content` | Get full skill content by name |
| `get_techstack_content` | Get techstack docs for a project |

### Project Init Tools
| Tool | Description |
|------|-------------|
| `browse_techstacks` | Browse available techstacks |
| `init_project_from_techstack` | Create project from template |
| `init_existing_project` | Import existing project |

### Todo Tools
| Tool | Description |
|------|-------------|
| `list_todos` | List todos with filters |
| `get_todo` | Get todo with Q&A history |
| `create_todo` | Create todo with optional Q&A |
| `update_todo` | Update todo status/details |
| `add_todo_qa` | Add Q&A to track decisions |
| `get_todo_stats` | Get completion stats |

## IDE & Tool Integration

### Claude Code (CLI)

Add to your Claude Code MCP settings file (`~/.claude/claude_desktop_config.json` or via `claude mcp add`):

```bash
# Using the claude CLI to add the MCP server
claude mcp add context-man -- node /path/to/context-man/dist/bin/context-man.js serve mcp

# Or with environment variable
claude mcp add context-man -e MONGODB_URI=mongodb://localhost:27017/context-man -- node /path/to/context-man/dist/bin/context-man.js serve mcp
```

Or manually edit `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "context-man": {
      "command": "node",
      "args": ["/path/to/context-man/dist/bin/context-man.js", "serve", "mcp"],
      "env": {
        "MONGODB_URI": "mongodb://localhost:27017/context-man"
      }
    }
  }
}
```

For development (without building):

```json
{
  "mcpServers": {
    "context-man": {
      "command": "npx",
      "args": ["tsx", "/path/to/context-man/src/bin/context-man.ts", "serve", "mcp"],
      "env": {
        "MONGODB_URI": "mongodb://localhost:27017/context-man"
      }
    }
  }
}
```

### Claude Desktop

Same configuration as Claude Code. Add to `claude_desktop_config.json`:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "context-man": {
      "command": "node",
      "args": ["/path/to/context-man/dist/bin/context-man.js", "serve", "mcp"],
      "env": {
        "MONGODB_URI": "mongodb://localhost:27017/context-man"
      }
    }
  }
}
```

### Cursor

Cursor supports MCP servers. Add to your Cursor settings:

1. Open Cursor Settings (`Cmd/Ctrl + ,`)
2. Search for "MCP" or navigate to Features > MCP Servers
3. Add a new MCP server with:

```json
{
  "context-man": {
    "command": "node",
    "args": ["/path/to/context-man/dist/bin/context-man.js", "serve", "mcp"],
    "env": {
      "MONGODB_URI": "mongodb://localhost:27017/context-man"
    }
  }
}
```

Or edit `~/.cursor/mcp.json` directly:

```json
{
  "mcpServers": {
    "context-man": {
      "command": "node",
      "args": ["/path/to/context-man/dist/bin/context-man.js", "serve", "mcp"],
      "env": {
        "MONGODB_URI": "mongodb://localhost:27017/context-man"
      }
    }
  }
}
```

### Windsurf (Codeium)

Windsurf supports MCP via its configuration. Add to your Windsurf MCP config:

**macOS**: `~/.codeium/windsurf/mcp_config.json`
**Windows**: `%USERPROFILE%\.codeium\windsurf\mcp_config.json`
**Linux**: `~/.codeium/windsurf/mcp_config.json`

```json
{
  "mcpServers": {
    "context-man": {
      "command": "node",
      "args": ["/path/to/context-man/dist/bin/context-man.js", "serve", "mcp"],
      "env": {
        "MONGODB_URI": "mongodb://localhost:27017/context-man"
      }
    }
  }
}
```

### Continue (VS Code / JetBrains)

Continue supports MCP servers. Add to your Continue config:

**Config location**: `~/.continue/config.json`

```json
{
  "experimental": {
    "modelContextProtocolServers": [
      {
        "transport": {
          "type": "stdio",
          "command": "node",
          "args": ["/path/to/context-man/dist/bin/context-man.js", "serve", "mcp"],
          "env": {
            "MONGODB_URI": "mongodb://localhost:27017/context-man"
          }
        }
      }
    ]
  }
}
```

### Zed Editor

Zed has native MCP support. Add to your Zed settings (`~/.config/zed/settings.json`):

```json
{
  "language_models": {
    "mcp_servers": {
      "context-man": {
        "command": "node",
        "args": ["/path/to/context-man/dist/bin/context-man.js", "serve", "mcp"],
        "env": {
          "MONGODB_URI": "mongodb://localhost:27017/context-man"
        }
      }
    }
  }
}
```

### HTTP/SSE Transport (Universal)

For tools that support HTTP-based MCP or for custom integrations:

```bash
# Start the MCP server with HTTP transport
npm run cli -- serve mcp --transport http --port 7778

# Or
node dist/bin/context-man.js serve mcp --transport http --port 7778
```

Then connect to `http://localhost:7778` using SSE (Server-Sent Events).

### Verifying the Integration

After configuring, verify the MCP server is working:

1. **Check available tools**: The AI should have access to tools like `browse_catalog`, `get_project_context`, `list_todos`, etc.

2. **Test a simple command**: Ask the AI to "browse the catalog" or "list all projects"

3. **Check logs**: If something isn't working, check the MCP server logs for errors

### Troubleshooting

**"Command not found" errors:**
- Make sure Node.js is in your PATH
- Use absolute paths for the context-man directory
- Build the project first: `npm run build`

**"MongoDB connection failed" errors:**
- Ensure MongoDB is running: `docker-compose up -d` or start MongoDB manually
- Check the MONGODB_URI environment variable is correct

**"Permission denied" errors:**
- On Unix systems, you may need to make the script executable:
  ```bash
  chmod +x /path/to/context-man/dist/bin/context-man.js
  ```

**Tools not appearing:**
- Restart the IDE/tool after adding MCP configuration
- Check the MCP server is starting without errors
- Verify the config file syntax (valid JSON)

## REST API Endpoints

The REST API runs on port 7777 by default.

### Catalog (New)
```
GET /api/catalog/projects              - Browse project templates
GET /api/catalog/projects?category=X   - Filter by category
GET /api/catalog/projects?search=X     - Search templates
GET /api/catalog/skills                - Browse all skills
GET /api/catalog/skills?category=X     - Filter by category
GET /api/catalog/skills/:name          - Get skill content
GET /api/catalog/techstacks/:slug      - Get techstack content
```

### Projects
```
POST   /api/projects              - Create project
GET    /api/projects              - List projects
GET    /api/projects/:slug        - Get project
PUT    /api/projects/:slug        - Update project
DELETE /api/projects/:slug        - Delete project
```

### Documents
```
POST   /api/projects/:slug/documents           - Create document
GET    /api/projects/:slug/documents           - List documents
GET    /api/projects/:slug/documents/:type     - Get document
PUT    /api/projects/:slug/documents/:type     - Update document
DELETE /api/projects/:slug/documents/:type     - Delete document
```

### Skills, Snippets, Prompts
```
POST/GET/PUT/DELETE /api/projects/:slug/skills/:name
POST/GET/PUT/DELETE /api/projects/:slug/snippets/:name
POST/GET/PUT/DELETE /api/projects/:slug/prompts/:name
POST /api/projects/:slug/prompts/:name/render
```

### Todos
```
POST   /api/projects/:slug/todos     - Create todo
GET    /api/projects/:slug/todos     - List todos
GET    /api/todos/:id                - Get todo
PUT    /api/todos/:id                - Update todo
POST   /api/todos/:id/qa             - Add Q&A
GET    /api/projects/:slug/todos/stats - Get stats
```

### Search
```
GET /api/search                    - Global search
GET /api/projects/:slug/search     - Project search
```

## Environment Variables

```bash
# Environment
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/context-man

# REST API
API_PORT=7777
API_HOST=localhost

# MCP Server
MCP_HTTP_PORT=7778
MCP_TRANSPORT=stdio  # stdio | http | both

# Logging
LOG_LEVEL=info  # debug | info | warn | error
```

## Development

```bash
# Run CLI in development
npm run cli -- <command>

# Run with watch mode
npm run dev

# Type check
npm run typecheck

# Run seed
npm run seed

# Build
npm run build
```

## Scripts

```bash
npm run build        # Build TypeScript
npm run dev          # Development with watch
npm run cli          # Run CLI commands
npm run serve:api    # Start REST API
npm run serve:mcp    # Start MCP server (stdio)
npm run seed         # Seed database with templates
npm run typecheck    # Run TypeScript checks
```

## License

MIT
