# Context Manager - MCP Server

An MCP (Model Context Protocol) server for managing project context. Provides AI assistants with structured access to project documentation, coding guidelines, skills, code snippets, and prompt templates.

## Features

- **Project Context Management**: Store and organize PLAN, TODO, SCOPE, TECHSTACK, UI/UX Standards, and Coding Guidelines per project
- **Skills Library**: Define reusable instructions, code templates, and tool definitions
- **Code Snippets**: Store reusable code patterns organized by language
- **Prompt Templates**: Create templates with variable substitution
- **Version History**: Automatic versioning for all content types
- **Full-Text Search**: Search across all project content
- **Multiple Interfaces**: CLI, REST API, and MCP tools

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd context-man

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Build the project
npm run build
```

## Quick Start

### 1. Start MongoDB

Make sure MongoDB is running locally on the default port (27017), or update `MONGODB_URI` in `.env`.

### 2. Create Your First Project

```bash
# Initialize a new project
npm run cli -- init my-app --name "My Application" --description "My awesome project"

# Verify it was created
npm run cli -- list projects
```

### 3. Add Project Documents

```bash
# Add a PLAN document
npm run cli -- add document my-app PLAN --title "Project Plan" --content "# My Project Plan

## Goals
- Build feature X
- Implement feature Y

## Timeline
- Phase 1: Setup
- Phase 2: Development"

# Add coding guidelines
npm run cli -- add document my-app CODING_GUIDELINES --title "Coding Guidelines" --content "# Coding Guidelines

## Style
- Use TypeScript strict mode
- Prefer const over let
- Use meaningful variable names"

# Add from a file
npm run cli -- add document my-app TECHSTACK --file ./TECHSTACK.md --title "Tech Stack"
```

### 4. Add Skills

```bash
# Add an instruction skill
npm run cli -- add skill my-app commit-format --type instructions --content "# Commit Message Format

Use conventional commits:
- feat: new feature
- fix: bug fix
- docs: documentation
- refactor: code refactoring"

# Add a code template skill
npm run cli -- add skill my-app react-component --type code_template --content "import React from 'react';

interface {{ComponentName}}Props {
  // props
}

export function {{ComponentName}}({ }: {{ComponentName}}Props) {
  return (
    <div>
      {/* content */}
    </div>
  );
}"
```

### 5. Add Code Snippets

```bash
npm run cli -- add snippet my-app api-handler --language typescript --content "export async function handler(req: Request): Promise<Response> {
  try {
    const data = await processRequest(req);
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}"
```

### 6. Add Prompt Templates

```bash
npm run cli -- add prompt my-app code-review --content "Review the following {{language}} code for:
- Security vulnerabilities
- Performance issues
- Best practices violations

Code:
{{code}}"
```

### 7. Start the MCP Server

```bash
# For Claude Desktop (stdio transport)
npm run serve:mcp

# For HTTP clients (SSE transport)
npm run cli -- serve mcp --transport http --port 3001

# Start REST API
npm run serve:api
```

## CLI Commands

### Project Management

```bash
# Create project
context-man init <slug> [--name <name>] [--description <desc>] [--tags <tags>]

# List projects
context-man list projects [--format json|table]

# Get project details
context-man get project <slug>

# Delete project (and all contents)
context-man delete project <slug> --force
```

### Document Management

```bash
# Add document
context-man add document <project> <TYPE> --file <path> [--title <title>]
# Types: PLAN, TODO, SCOPE, TECHSTACK, UI_UX_STANDARDS, CODING_GUIDELINES

# List documents
context-man list documents <project>

# Get document
context-man get document <project> <TYPE> [--version <n>] [--format json|text|content]

# Update document
context-man update document <project> <TYPE> --file <path> [--note "change note"]

# Delete document
context-man delete document <project> <TYPE>
```

### Skill Management

```bash
# Add skill
context-man add skill <project> <name> --type <type> --file <path>
# Types: instructions, code_template, tool_definition

# List skills
context-man list skills <project> [--type <type>]

# Get skill
context-man get skill <project> <name>

# Delete skill
context-man delete skill <project> <name>
```

### Code Snippet Management

```bash
# Add snippet
context-man add snippet <project> <name> --language <lang> --file <path>

# List snippets
context-man list snippets <project> [--language <lang>]

# Get snippet
context-man get snippet <project> <name>
```

### Prompt Template Management

```bash
# Add prompt
context-man add prompt <project> <name> --file <path> [--category <cat>]

# List prompts
context-man list prompts <project>

# Render prompt with variables
context-man render prompt <project> <name> --vars '{"language": "TypeScript", "code": "..."}'
```

### Search

```bash
# Search within project
context-man search "query" --project my-app

# Global search
context-man search "query"

# Filter by type
context-man search "query" --types document,skill
```

### Server Management

```bash
# Start MCP server (stdio for Claude Desktop)
context-man serve mcp

# Start MCP server (HTTP/SSE)
context-man serve mcp --transport http --port 3001

# Start REST API
context-man serve api --port 3000

# Start both (HTTP mode)
context-man serve --all --api-port 3000 --mcp-port 3001 --mcp-transport http
```

## MCP Tools (for AI)

When connected via MCP, the following tools are available:

| Tool | Description |
|------|-------------|
| `list_projects` | List all projects with document/skill/snippet counts |
| `get_project_context` | Get full project context (docs, skills, snippets, prompts) |
| `get_document` | Get a specific document (PLAN, SCOPE, etc.) |
| `get_skills` | List/get skills, filter by type |
| `get_code_snippets` | List/get code snippets, filter by language |
| `get_prompt_template` | Get prompt templates, render with variables |
| `search_content` | Full-text search across project content |

## Claude Desktop Configuration

Add to your Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "context-man": {
      "command": "node",
      "args": ["E:/Files/context-man/dist/bin/context-man.js", "serve", "mcp"],
      "env": {
        "MONGODB_URI": "mongodb://localhost:27017/context-man"
      }
    }
  }
}
```

Or using npx with tsx for development:

```json
{
  "mcpServers": {
    "context-man": {
      "command": "npx",
      "args": ["tsx", "E:/Files/context-man/src/bin/context-man.ts", "serve", "mcp"],
      "env": {
        "MONGODB_URI": "mongodb://localhost:27017/context-man"
      }
    }
  }
}
```

## REST API

The REST API runs on port 3000 by default.

### Endpoints

```
# Projects
POST   /api/projects              - Create project
GET    /api/projects              - List projects
GET    /api/projects/:slug        - Get project
PUT    /api/projects/:slug        - Update project
DELETE /api/projects/:slug        - Delete project
GET    /api/projects/:slug/context - Get full context

# Documents
POST   /api/projects/:slug/documents           - Create document
GET    /api/projects/:slug/documents           - List documents
GET    /api/projects/:slug/documents/:type     - Get document
PUT    /api/projects/:slug/documents/:type     - Update document
DELETE /api/projects/:slug/documents/:type     - Delete document
GET    /api/projects/:slug/documents/:type/versions - Get version history

# Skills
POST   /api/projects/:slug/skills        - Create skill
GET    /api/projects/:slug/skills        - List skills
GET    /api/projects/:slug/skills/:name  - Get skill
PUT    /api/projects/:slug/skills/:name  - Update skill
DELETE /api/projects/:slug/skills/:name  - Delete skill

# Snippets
POST   /api/projects/:slug/snippets        - Create snippet
GET    /api/projects/:slug/snippets        - List snippets
GET    /api/projects/:slug/snippets/:name  - Get snippet
PUT    /api/projects/:slug/snippets/:name  - Update snippet
DELETE /api/projects/:slug/snippets/:name  - Delete snippet

# Prompt Templates
POST   /api/projects/:slug/prompts              - Create template
GET    /api/projects/:slug/prompts              - List templates
GET    /api/projects/:slug/prompts/:name        - Get template
PUT    /api/projects/:slug/prompts/:name        - Update template
DELETE /api/projects/:slug/prompts/:name        - Delete template
POST   /api/projects/:slug/prompts/:name/render - Render with variables

# Search
GET    /api/search                    - Global search
GET    /api/projects/:slug/search     - Project search
```

## Environment Variables

```bash
# Environment
NODE_ENV=development

# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/context-man

# REST API
API_PORT=3000
API_HOST=localhost

# MCP Server
MCP_HTTP_PORT=3001
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
npx tsc --noEmit

# Build
npm run build
```

## License

MIT
