import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
  listProjects,
  getProjectContext,
  getDocument,
  getSkills,
  getCodeSnippets,
  getPromptTemplate,
  searchContent,
} from './tools/index.js';

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: 'context-man',
    version: '1.0.0',
  });

  // Register list_projects tool
  server.tool(
    'list_projects',
    'List all available projects in the context management system',
    {
      tags: z.array(z.string()).optional().describe('Filter by tags'),
      limit: z.number().default(50).describe('Maximum number of projects to return'),
    },
    async (args) => {
      try {
        const result = await listProjects({
          tags: args.tags,
          limit: args.limit ?? 50,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
          isError: true,
        };
      }
    }
  );

  // Register get_project_context tool
  server.tool(
    'get_project_context',
    'Get complete context for a project including all documents, skills summary, and metadata',
    {
      project: z.string().describe('Project slug or name'),
      includeDocuments: z.boolean().default(true).describe('Include full document content'),
      includeSkills: z.boolean().default(true).describe('Include skills'),
      includeSnippets: z.boolean().default(false).describe('Include code snippets'),
      includePrompts: z.boolean().default(false).describe('Include prompt templates'),
    },
    async (args) => {
      try {
        const result = await getProjectContext({
          project: args.project,
          includeDocuments: args.includeDocuments ?? true,
          includeSkills: args.includeSkills ?? true,
          includeSnippets: args.includeSnippets ?? false,
          includePrompts: args.includePrompts ?? false,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
          isError: true,
        };
      }
    }
  );

  // Register get_document tool
  server.tool(
    'get_document',
    'Get a specific document from a project',
    {
      project: z.string().describe('Project slug'),
      type: z
        .enum(['PLAN', 'TODO', 'SCOPE', 'TECHSTACK', 'UI_UX_STANDARDS', 'CODING_GUIDELINES'])
        .describe('Document type'),
      version: z.number().optional().describe('Specific version number (latest if omitted)'),
    },
    async (args) => {
      try {
        const result = await getDocument({
          project: args.project,
          type: args.type,
          version: args.version,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
          isError: true,
        };
      }
    }
  );

  // Register get_skills tool
  server.tool(
    'get_skills',
    'Get skills from a project, optionally filtered by type or name',
    {
      project: z.string().describe('Project slug'),
      type: z
        .enum(['instructions', 'code_template', 'tool_definition'])
        .optional()
        .describe('Filter by skill type'),
      name: z.string().optional().describe('Get specific skill by name'),
      tags: z.array(z.string()).optional().describe('Filter by tags'),
    },
    async (args) => {
      try {
        const result = await getSkills({
          project: args.project,
          type: args.type,
          name: args.name,
          tags: args.tags,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
          isError: true,
        };
      }
    }
  );

  // Register get_code_snippets tool
  server.tool(
    'get_code_snippets',
    'Get code snippets from a project',
    {
      project: z.string().describe('Project slug'),
      name: z.string().optional().describe('Get specific snippet by name'),
      language: z.string().optional().describe('Filter by programming language'),
      tags: z.array(z.string()).optional().describe('Filter by tags'),
    },
    async (args) => {
      try {
        const result = await getCodeSnippets({
          project: args.project,
          name: args.name,
          language: args.language,
          tags: args.tags,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
          isError: true,
        };
      }
    }
  );

  // Register get_prompt_template tool
  server.tool(
    'get_prompt_template',
    'Get prompt templates from a project, with optional variable substitution',
    {
      project: z.string().describe('Project slug'),
      name: z.string().optional().describe('Get specific template by name'),
      category: z.string().optional().describe('Filter by category'),
      variables: z
        .record(z.string())
        .optional()
        .describe('Variables to substitute in the template'),
    },
    async (args) => {
      try {
        const result = await getPromptTemplate({
          project: args.project,
          name: args.name,
          category: args.category,
          variables: args.variables,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
          isError: true,
        };
      }
    }
  );

  // Register search_content tool
  server.tool(
    'search_content',
    'Full-text search across project content',
    {
      query: z.string().describe('Search query'),
      project: z.string().optional().describe('Limit to specific project'),
      types: z
        .array(z.enum(['document', 'skill', 'snippet', 'prompt']))
        .optional()
        .describe('Filter by content types'),
      tags: z.array(z.string()).optional().describe('Filter by tags'),
      limit: z.number().default(20).describe('Maximum results'),
    },
    async (args) => {
      try {
        const result = await searchContent({
          query: args.query,
          project: args.project,
          types: args.types,
          tags: args.tags,
          limit: args.limit ?? 20,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
          isError: true,
        };
      }
    }
  );

  return server;
}

export default createMcpServer;
