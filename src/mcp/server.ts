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
  browseTechstacks,
  initProjectFromTechstack,
  initExistingProject,
  browseCatalog,
  browseAllSkills,
  getSkillContent,
  getTechstackContent,
} from './tools/index.js';
import { todoService } from '../services/index.js';

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

  // Register list_todos tool
  server.tool(
    'list_todos',
    'List todos for a project with optional filters',
    {
      projectSlug: z.string().describe('The project slug'),
      status: z
        .enum(['pending', 'in_progress', 'completed', 'cancelled'])
        .optional()
        .describe('Filter by status'),
      priority: z
        .enum(['low', 'medium', 'high', 'critical'])
        .optional()
        .describe('Filter by priority'),
      includeCompleted: z.boolean().default(false).describe('Include completed todos'),
      tags: z.array(z.string()).optional().describe('Filter by tags'),
    },
    async (args) => {
      try {
        const todos = await todoService.findByProject(args.projectSlug, {
          status: args.status,
          priority: args.priority,
          includeCompleted: args.includeCompleted ?? false,
          tags: args.tags,
        });
        const todoList = todos.map((t) => ({
          id: t._id.toString(),
          title: t.title,
          status: t.status,
          priority: t.priority,
          tags: t.tags,
          hasQA: t.questionsAnswers.length > 0,
          dueDate: t.dueDate,
          createdAt: t.createdAt,
        }));
        return {
          content: [{ type: 'text', text: JSON.stringify({ todos: todoList, count: todoList.length }, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
          isError: true,
        };
      }
    }
  );

  // Register get_todo tool
  server.tool(
    'get_todo',
    'Get a specific todo by ID with full details including Q&A history',
    {
      todoId: z.string().describe('The todo ID'),
      includeSubtasks: z.boolean().default(false).describe('Include subtasks'),
    },
    async (args) => {
      try {
        const todo = await todoService.findById(args.todoId);
        if (!todo) {
          return {
            content: [{ type: 'text', text: `Todo "${args.todoId}" not found` }],
            isError: true,
          };
        }
        const result: Record<string, unknown> = {
          id: todo._id.toString(),
          title: todo.title,
          description: todo.description,
          status: todo.status,
          priority: todo.priority,
          tags: todo.tags,
          dueDate: todo.dueDate,
          completedAt: todo.completedAt,
          questionsAnswers: todo.questionsAnswers,
          currentVersion: todo.currentVersion,
          createdAt: todo.createdAt,
          updatedAt: todo.updatedAt,
        };
        if (args.includeSubtasks) {
          const subtasks = await todoService.getSubtasks(args.todoId);
          result.subtasks = subtasks.map((s) => ({
            id: s._id.toString(),
            title: s.title,
            status: s.status,
            priority: s.priority,
          }));
        }
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

  // Register create_todo tool
  server.tool(
    'create_todo',
    'Create a new todo item with optional initial Q&A from requirements gathering',
    {
      projectSlug: z.string().describe('The project slug'),
      title: z.string().describe('The todo title'),
      description: z.string().optional().describe('Detailed description'),
      priority: z
        .enum(['low', 'medium', 'high', 'critical'])
        .default('medium')
        .describe('Priority level'),
      tags: z.array(z.string()).optional().describe('Tags for categorization'),
      dueDate: z.string().optional().describe('Due date in ISO format'),
      parentId: z.string().optional().describe('Parent todo ID for subtasks'),
      questionsAnswers: z
        .array(
          z.object({
            question: z.string().describe('Question that was asked'),
            answer: z.string().describe('Answer that was given'),
            context: z.string().optional().describe('Context about when/why asked'),
          })
        )
        .optional()
        .describe('Initial Q&A from requirements gathering'),
    },
    async (args) => {
      try {
        const todo = await todoService.create(args.projectSlug, {
          title: args.title,
          description: args.description,
          priority: args.priority,
          tags: args.tags,
          dueDate: args.dueDate ? new Date(args.dueDate) : undefined,
          parentId: args.parentId,
          questionsAnswers: args.questionsAnswers?.map((qa) => ({
            ...qa,
            askedAt: new Date(),
          })),
        });
        if (!todo) {
          return {
            content: [{ type: 'text', text: `Project "${args.projectSlug}" not found` }],
            isError: true,
          };
        }
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  message: 'Todo created successfully',
                  todo: {
                    id: todo._id.toString(),
                    title: todo.title,
                    status: todo.status,
                    priority: todo.priority,
                  },
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
          isError: true,
        };
      }
    }
  );

  // Register update_todo tool
  server.tool(
    'update_todo',
    'Update a todo item - can change status, priority, title, description, or mark as completed',
    {
      todoId: z.string().describe('The todo ID'),
      title: z.string().optional().describe('New title'),
      description: z.string().optional().describe('New description'),
      status: z
        .enum(['pending', 'in_progress', 'completed', 'cancelled'])
        .optional()
        .describe('New status'),
      priority: z
        .enum(['low', 'medium', 'high', 'critical'])
        .optional()
        .describe('New priority'),
      tags: z.array(z.string()).optional().describe('New tags'),
      changeNote: z.string().optional().describe('Note explaining the change'),
    },
    async (args) => {
      try {
        const { todoId, ...updateInput } = args;
        const todo = await todoService.update(todoId, updateInput);
        if (!todo) {
          return {
            content: [{ type: 'text', text: `Todo "${todoId}" not found` }],
            isError: true,
          };
        }
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  message: 'Todo updated successfully',
                  todo: {
                    id: todo._id.toString(),
                    title: todo.title,
                    status: todo.status,
                    priority: todo.priority,
                    completedAt: todo.completedAt,
                    currentVersion: todo.currentVersion,
                  },
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
          isError: true,
        };
      }
    }
  );

  // Register add_todo_qa tool
  server.tool(
    'add_todo_qa',
    'Add a question and answer pair to a todo - useful for tracking decisions made during implementation',
    {
      todoId: z.string().describe('The todo ID'),
      question: z.string().describe('The question that was asked'),
      answer: z.string().describe('The answer that was given'),
      context: z
        .string()
        .optional()
        .describe('Context about when/why this question was asked'),
    },
    async (args) => {
      try {
        const todo = await todoService.addQA(args.todoId, {
          question: args.question,
          answer: args.answer,
          context: args.context,
        });
        if (!todo) {
          return {
            content: [{ type: 'text', text: `Todo "${args.todoId}" not found` }],
            isError: true,
          };
        }
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  message: 'Q&A added successfully',
                  todo: {
                    id: todo._id.toString(),
                    title: todo.title,
                    qaCount: todo.questionsAnswers.length,
                    latestQA: todo.questionsAnswers[todo.questionsAnswers.length - 1],
                  },
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
          isError: true,
        };
      }
    }
  );

  // Register get_todo_stats tool
  server.tool(
    'get_todo_stats',
    'Get todo statistics for a project - counts by status and priority',
    {
      projectSlug: z.string().describe('The project slug'),
    },
    async (args) => {
      try {
        const stats = await todoService.getStats(args.projectSlug);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  project: args.projectSlug,
                  stats: {
                    total: stats.total,
                    pending: stats.pending,
                    inProgress: stats.inProgress,
                    completed: stats.completed,
                    cancelled: stats.cancelled,
                    remaining: stats.pending + stats.inProgress,
                    completionRate:
                      stats.total > 0
                        ? `${Math.round((stats.completed / stats.total) * 100)}%`
                        : '0%',
                    byPriority: stats.byPriority,
                  },
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${(error as Error).message}` }],
          isError: true,
        };
      }
    }
  );

  // Register browse_techstacks tool
  server.tool(
    'browse_techstacks',
    'Browse available techstacks from existing projects in context-man - useful for initializing new projects with similar tech',
    {
      tags: z.array(z.string()).optional().describe('Filter projects by tags'),
      detailed: z.boolean().default(false).describe('Include full techstack content'),
    },
    async (args) => {
      try {
        const result = await browseTechstacks({
          tags: args.tags,
          detailed: args.detailed ?? false,
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

  // Register init_project_from_techstack tool
  server.tool(
    'init_project_from_techstack',
    'Initialize a new project using techstack and optionally other documents/skills from an existing project',
    {
      newProjectSlug: z.string().describe('Slug for the new project'),
      newProjectName: z.string().describe('Name for the new project'),
      newProjectDescription: z.string().optional().describe('Description for the new project'),
      sourceProjectSlug: z.string().describe('Source project to copy techstack from'),
      copyDocuments: z
        .array(z.enum(['TECHSTACK', 'CODING_GUIDELINES', 'UI_UX_STANDARDS']))
        .default(['TECHSTACK'])
        .describe('Which documents to copy from source'),
      copySkills: z.boolean().default(false).describe('Copy skills from source project'),
      tags: z.array(z.string()).optional().describe('Tags for the new project'),
    },
    async (args) => {
      try {
        const result = await initProjectFromTechstack({
          newProjectSlug: args.newProjectSlug,
          newProjectName: args.newProjectName,
          newProjectDescription: args.newProjectDescription,
          sourceProjectSlug: args.sourceProjectSlug,
          copyDocuments: args.copyDocuments,
          copySkills: args.copySkills ?? false,
          tags: args.tags,
        });
        if ('error' in result && result.error) {
          return {
            content: [{ type: 'text', text: result.error }],
            isError: true,
          };
        }
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

  // Register init_existing_project tool
  server.tool(
    'init_existing_project',
    'Initialize an existing project into context-man by scanning for documentation files',
    {
      projectSlug: z.string().describe('Slug for the project in context-man'),
      projectName: z.string().describe('Display name for the project'),
      projectDescription: z.string().optional().describe('Description of the project'),
      projectPath: z.string().describe('Path to the existing project directory'),
      tags: z.array(z.string()).optional().describe('Tags for the project'),
      scanForDocs: z.boolean().default(true).describe('Scan for common documentation files'),
      customDocs: z
        .array(
          z.object({
            type: z.enum(['PLAN', 'TODO', 'SCOPE', 'TECHSTACK', 'CODING_GUIDELINES', 'UI_UX_STANDARDS']),
            filePath: z.string().describe('Relative path to the file'),
          })
        )
        .optional()
        .describe('Custom mapping of files to document types'),
    },
    async (args) => {
      try {
        const result = await initExistingProject({
          projectSlug: args.projectSlug,
          projectName: args.projectName,
          projectDescription: args.projectDescription,
          projectPath: args.projectPath,
          tags: args.tags,
          scanForDocs: args.scanForDocs ?? true,
          customDocs: args.customDocs,
        });
        if ('error' in result && result.error) {
          return {
            content: [{ type: 'text', text: result.error }],
            isError: true,
          };
        }
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

  // Register browse_catalog tool
  server.tool(
    'browse_catalog',
    'Browse available project templates and techstacks in the catalog. Use this to show users what templates are available and help them choose.',
    {
      category: z
        .enum(['all', 'backend', 'frontend', 'fullstack', 'database', 'devops', 'mobile'])
        .default('all')
        .describe('Filter by category'),
      search: z
        .string()
        .optional()
        .describe('Search term to filter by name, description, or tags (e.g., "react", "typescript", "prisma")'),
    },
    async (args) => {
      try {
        const result = await browseCatalog({
          category: args.category ?? 'all',
          search: args.search,
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

  // Register browse_all_skills tool
  server.tool(
    'browse_all_skills',
    'Browse all available skills (code templates, instructions, patterns) in the catalog. Use this to show users what skills and patterns are available.',
    {
      category: z
        .enum(['all', 'backend', 'frontend', 'database', 'devops', 'general', 'testing', 'security'])
        .default('all')
        .describe('Filter by skill category'),
      type: z
        .enum(['all', 'instructions', 'code_template', 'tool_definition'])
        .default('all')
        .describe('Filter by skill type'),
      search: z
        .string()
        .optional()
        .describe('Search term to filter by name, description, or tags'),
    },
    async (args) => {
      try {
        const result = await browseAllSkills({
          category: args.category ?? 'all',
          type: args.type ?? 'all',
          search: args.search,
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

  // Register get_skill_content tool
  server.tool(
    'get_skill_content',
    'Get the full content of a specific skill by name. Use browse_all_skills first to see available skills.',
    {
      skillName: z
        .string()
        .describe('The name of the skill (e.g., "jwt-authentication", "prisma-patterns", "react-component-patterns")'),
      projectSlug: z
        .string()
        .optional()
        .describe('Optional: specific project to get the skill from'),
    },
    async (args) => {
      try {
        const result = await getSkillContent({
          skillName: args.skillName,
          projectSlug: args.projectSlug,
        });
        if (result.error) {
          return {
            content: [{ type: 'text', text: result.error }],
            isError: true,
          };
        }
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

  // Register get_techstack_content tool
  server.tool(
    'get_techstack_content',
    'Get the full techstack documentation for a specific project. Use browse_catalog first to see available projects.',
    {
      projectSlug: z
        .string()
        .describe('The project slug (e.g., "t3-stack", "bun-elysia", "nextjs-app-router")'),
    },
    async (args) => {
      try {
        const result = await getTechstackContent({
          projectSlug: args.projectSlug,
        });
        if (result.error) {
          return {
            content: [{ type: 'text', text: result.error }],
            isError: true,
          };
        }
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
