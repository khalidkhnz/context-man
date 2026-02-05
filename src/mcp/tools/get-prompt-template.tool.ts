import { z } from 'zod';
import { promptTemplateService } from '../../services/index.js';

export const getPromptTemplateSchema = z.object({
  project: z.string().describe('Project slug'),
  name: z.string().optional().describe('Get specific template by name'),
  category: z.string().optional().describe('Filter by category'),
  variables: z.record(z.string()).optional().describe('Variables to substitute in the template'),
});

export type GetPromptTemplateInput = z.infer<typeof getPromptTemplateSchema>;

export async function getPromptTemplate(input: GetPromptTemplateInput) {
  // Get specific template by name
  if (input.name) {
    const template = await promptTemplateService.findByProjectAndName(input.project, input.name);
    if (!template) {
      throw new Error(`Prompt template "${input.name}" not found for project "${input.project}"`);
    }

    let rendered: string | undefined;
    if (input.variables) {
      const result = await promptTemplateService.render(input.project, input.name, input.variables);
      rendered = result ?? undefined;
    }

    return {
      templates: [
        {
          name: template.name,
          description: template.description,
          content: template.content,
          rendered,
          variables: template.variables,
          category: template.category,
          tags: template.tags,
        },
      ],
    };
  }

  // List templates with optional filters
  const templates = await promptTemplateService.findAllByProject(input.project, {
    category: input.category,
  });

  return {
    templates: templates.map((t) => ({
      name: t.name,
      description: t.description,
      content: t.content,
      variables: t.variables,
      category: t.category,
      tags: t.tags,
    })),
  };
}

export const getPromptTemplateTool = {
  name: 'get_prompt_template',
  description: 'Get prompt templates from a project, with optional variable substitution',
  inputSchema: {
    type: 'object' as const,
    properties: {
      project: {
        type: 'string',
        description: 'Project slug',
      },
      name: {
        type: 'string',
        description: 'Get specific template by name',
      },
      category: {
        type: 'string',
        description: 'Filter by category',
      },
      variables: {
        type: 'object',
        additionalProperties: { type: 'string' },
        description: 'Variables to substitute in the template',
      },
    },
    required: ['project'],
  },
  handler: getPromptTemplate,
};

export default getPromptTemplateTool;
