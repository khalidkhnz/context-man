import { z } from 'zod';
import {
  projectService,
  documentService,
  skillService,
  codeSnippetService,
  promptTemplateService,
} from '../../services/index.js';

export const getProjectContextSchema = z.object({
  project: z.string().describe('Project slug or name'),
  includeDocuments: z.boolean().default(true).describe('Include full document content'),
  includeSkills: z.boolean().default(true).describe('Include skills'),
  includeSnippets: z.boolean().default(false).describe('Include code snippets'),
  includePrompts: z.boolean().default(false).describe('Include prompt templates'),
});

export type GetProjectContextInput = z.infer<typeof getProjectContextSchema>;

export async function getProjectContext(input: GetProjectContextInput) {
  const project = await projectService.findBySlug(input.project);
  if (!project) {
    throw new Error(`Project "${input.project}" not found`);
  }

  const context: Record<string, unknown> = {
    project: {
      slug: project.slug,
      name: project.name,
      description: project.description,
      tags: project.tags,
    },
  };

  const promises: Promise<void>[] = [];

  if (input.includeDocuments) {
    promises.push(
      documentService.findByProjectId(project._id).then((docs) => {
        context.documents = docs.map((d) => ({
          type: d.type,
          title: d.title,
          content: d.content,
          version: d.currentVersion,
          updatedAt: d.updatedAt.toISOString(),
        }));
      })
    );
  }

  if (input.includeSkills) {
    promises.push(
      skillService.findByProjectId(project._id, { activeOnly: true }).then((skills) => {
        context.skills = skills.map((s) => ({
          name: s.name,
          type: s.type,
          description: s.description,
          content: s.content,
        }));
      })
    );
  }

  if (input.includeSnippets) {
    promises.push(
      codeSnippetService.findByProjectId(project._id).then((snippets) => {
        context.snippets = snippets.map((s) => ({
          name: s.name,
          language: s.language,
          description: s.description,
          code: s.code,
        }));
      })
    );
  }

  if (input.includePrompts) {
    promises.push(
      promptTemplateService.findByProjectId(project._id).then((prompts) => {
        context.prompts = prompts.map((p) => ({
          name: p.name,
          description: p.description,
          content: p.content,
          variables: p.variables,
        }));
      })
    );
  }

  await Promise.all(promises);

  return context;
}

export const getProjectContextTool = {
  name: 'get_project_context',
  description:
    'Get complete context for a project including all documents, skills summary, and metadata',
  inputSchema: {
    type: 'object' as const,
    properties: {
      project: {
        type: 'string',
        description: 'Project slug or name',
      },
      includeDocuments: {
        type: 'boolean',
        default: true,
        description: 'Include full document content',
      },
      includeSkills: {
        type: 'boolean',
        default: true,
        description: 'Include skills',
      },
      includeSnippets: {
        type: 'boolean',
        default: false,
        description: 'Include code snippets',
      },
      includePrompts: {
        type: 'boolean',
        default: false,
        description: 'Include prompt templates',
      },
    },
    required: ['project'],
  },
  handler: getProjectContext,
};

export default getProjectContextTool;
