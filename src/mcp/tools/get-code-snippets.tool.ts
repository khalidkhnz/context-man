import { z } from 'zod';
import { codeSnippetService } from '../../services/index.js';

export const getCodeSnippetsSchema = z.object({
  project: z.string().describe('Project slug'),
  name: z.string().optional().describe('Get specific snippet by name'),
  language: z.string().optional().describe('Filter by programming language'),
  tags: z.array(z.string()).optional().describe('Filter by tags'),
});

export type GetCodeSnippetsInput = z.infer<typeof getCodeSnippetsSchema>;

export async function getCodeSnippets(input: GetCodeSnippetsInput) {
  // Get specific snippet by name
  if (input.name) {
    const snippet = await codeSnippetService.findByProjectAndName(input.project, input.name);
    if (!snippet) {
      throw new Error(`Snippet "${input.name}" not found for project "${input.project}"`);
    }

    return {
      snippets: [
        {
          name: snippet.name,
          language: snippet.language,
          description: snippet.description,
          code: snippet.code,
          tags: snippet.tags,
          version: snippet.currentVersion,
          updatedAt: snippet.updatedAt.toISOString(),
        },
      ],
    };
  }

  // List snippets with optional filters
  const snippets = await codeSnippetService.findAllByProject(input.project, {
    language: input.language,
    tags: input.tags,
  });

  return {
    snippets: snippets.map((s) => ({
      name: s.name,
      language: s.language,
      description: s.description,
      code: s.code,
      tags: s.tags,
      version: s.currentVersion,
      updatedAt: s.updatedAt.toISOString(),
    })),
  };
}

export const getCodeSnippetsTool = {
  name: 'get_code_snippets',
  description: 'Get code snippets from a project',
  inputSchema: {
    type: 'object' as const,
    properties: {
      project: {
        type: 'string',
        description: 'Project slug',
      },
      name: {
        type: 'string',
        description: 'Get specific snippet by name',
      },
      language: {
        type: 'string',
        description: 'Filter by programming language',
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Filter by tags',
      },
    },
    required: ['project'],
  },
  handler: getCodeSnippets,
};

export default getCodeSnippetsTool;
