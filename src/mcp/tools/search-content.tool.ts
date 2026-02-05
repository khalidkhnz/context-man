import { z } from 'zod';
import { searchService } from '../../services/index.js';

export const searchContentSchema = z.object({
  query: z.string().describe('Search query'),
  project: z.string().optional().describe('Limit to specific project'),
  types: z
    .array(z.enum(['document', 'skill', 'snippet', 'prompt']))
    .optional()
    .describe('Filter by content types'),
  tags: z.array(z.string()).optional().describe('Filter by tags'),
  limit: z.number().default(20).describe('Maximum results'),
});

export type SearchContentInput = z.infer<typeof searchContentSchema>;

export async function searchContent(input: SearchContentInput) {
  const results = await searchService.search({
    query: input.query,
    projectSlug: input.project,
    types: input.types,
    tags: input.tags,
    limit: input.limit,
  });

  return {
    results: results.results.map((r) => ({
      type: r.type,
      project: r.projectSlug,
      name: r.name,
      title: r.title,
      excerpt: r.excerpt,
      score: r.score,
      tags: r.tags,
      updatedAt: r.updatedAt.toISOString(),
    })),
    total: results.total,
    query: results.query,
  };
}

export const searchContentTool = {
  name: 'search_content',
  description: 'Full-text search across project content',
  inputSchema: {
    type: 'object' as const,
    properties: {
      query: {
        type: 'string',
        description: 'Search query',
      },
      project: {
        type: 'string',
        description: 'Limit to specific project',
      },
      types: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['document', 'skill', 'snippet', 'prompt'],
        },
        description: 'Filter by content types',
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Filter by tags',
      },
      limit: {
        type: 'number',
        default: 20,
        description: 'Maximum results',
      },
    },
    required: ['query'],
  },
  handler: searchContent,
};

export default searchContentTool;
