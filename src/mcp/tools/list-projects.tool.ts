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
  });

  return {
    projects: projects.map((p) => ({
      slug: p.slug,
      name: p.name,
      description: p.description,
      tags: p.tags,
      documentCount: p.documentCount,
      skillCount: p.skillCount,
      snippetCount: p.snippetCount,
      promptCount: p.promptCount,
      updatedAt: p.updatedAt.toISOString(),
    })),
    total: projects.length,
  };
}

export const listProjectsTool = {
  name: 'list_projects',
  description: 'List all available projects in the context management system',
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
