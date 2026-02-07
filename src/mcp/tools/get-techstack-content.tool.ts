import { z } from 'zod';
import { projectService, documentService } from '../../services/index.js';
import { DocumentType } from '../../types/document.types.js';

// Input schema for getting techstack content
export const GetTechstackContentInputSchema = z.object({
  projectSlug: z
    .string()
    .min(1)
    .describe('The project slug to get the techstack from (e.g., "t3-stack", "bun-elysia", "nextjs-app-router")'),
});

export type GetTechstackContentInput = z.infer<typeof GetTechstackContentInputSchema>;

interface TechstackContent {
  projectName: string;
  projectSlug: string;
  description: string;
  techstack: string;
  codingGuidelines?: string;
  tags: string[];
}

interface GetTechstackResult {
  techstack: TechstackContent | null;
  error?: string;
}

export async function getTechstackContent(input: GetTechstackContentInput): Promise<GetTechstackResult> {
  const project = await projectService.findBySlug(input.projectSlug);

  if (!project) {
    return {
      techstack: null,
      error: `Project "${input.projectSlug}" not found. Use 'list_templates' to see available projects.`,
    };
  }

  const techstackDoc = await documentService.findByProjectAndType(input.projectSlug, DocumentType.TECHSTACK);
  const guidelinesDoc = await documentService.findByProjectAndType(input.projectSlug, DocumentType.CODING_GUIDELINES);

  if (!techstackDoc) {
    return {
      techstack: null,
      error: `No techstack document found for project "${input.projectSlug}"`,
    };
  }

  return {
    techstack: {
      projectName: project.name,
      projectSlug: project.slug,
      description: project.description || '',
      techstack: techstackDoc.content,
      codingGuidelines: guidelinesDoc?.content,
      tags: project.tags || [],
    },
  };
}

// Tool definition for MCP
export const getTechstackContentTool = {
  name: 'get_techstack_content',
  description: `Get the full techstack documentation for a specific project.

Use this tool to:
- Show users the complete techstack details for a project template
- Display technology choices, configurations, and setup instructions
- Provide coding guidelines when available

First use 'list_templates' to see available projects, then use this tool to get the full techstack content.`,
  inputSchema: {
    type: 'object' as const,
    properties: {
      projectSlug: {
        type: 'string',
        description: 'The project slug (e.g., "t3-stack", "bun-elysia", "nextjs-app-router", "postgresql-prisma")',
      },
    },
    required: ['projectSlug'],
  },
};
