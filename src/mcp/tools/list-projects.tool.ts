import { z } from 'zod';
import { projectService } from '../../services/index.js';

export const listProjectsSchema = z.object({
  tags: z.array(z.string()).optional().describe('Filter by tags'),
  limit: z.number().default(50).describe('Maximum number of projects to return'),
});

export type ListProjectsInput = z.infer<typeof listProjectsSchema>;

export async function listProjects(input: ListProjectsInput) {
  const projects = await projectService.findAllWithCounts({
    tags: input.tags,
    limit: input.limit,
    isTemplate: false,
  });

  return {
    projects: projects.map((p) => ({
      slug: p.slug,
      name: p.name,
      description: p.description,
      tags: p.tags,
      documents: p.documents,
      documentCount: p.documentCount,
      skillCount: p.skillCount,
      snippetCount: p.snippetCount,
      promptCount: p.promptCount,
      todoStats: p.todoStats,
      updatedAt: p.updatedAt.toISOString(),
    })),
    total: projects.length,
    hint: projects.length === 0
      ? 'No user projects found. Use list_templates to see available templates, then init_project_from_techstack to create a project.'
      : undefined,
  };
}

export const listProjectsTool = {
  name: 'list_projects',
  description: 'List your projects with progress, todos, and document status. Use list_templates for available project templates.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Filter by tags',
      },
      limit: {
        type: 'number',
        default: 50,
        description: 'Maximum number of projects to return',
      },
    },
  },
  handler: listProjects,
};

export default listProjectsTool;
