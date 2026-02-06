import { z } from 'zod';
import { documentService, projectService } from '../../services/index.js';
import { DocumentType } from '../../types/document.types.js';

export const browseTechstacksSchema = z.object({
  tags: z.array(z.string()).optional().describe('Filter projects by tags'),
  detailed: z.boolean().optional().default(false).describe('Include full techstack content'),
});

export type BrowseTechstacksInput = z.infer<typeof browseTechstacksSchema>;

export async function browseTechstacks(input: BrowseTechstacksInput) {
  // Get all projects that have a TECHSTACK document
  const projects = await projectService.findAll({
    tags: input.tags,
  });

  const techstacks = [];

  for (const project of projects) {
    const techstackDoc = await documentService.findByProjectAndType(
      project.slug,
      DocumentType.TECHSTACK
    );

    if (techstackDoc) {
      techstacks.push({
        projectSlug: project.slug,
        projectName: project.name,
        projectDescription: project.description,
        projectTags: project.tags,
        techstack: input.detailed
          ? {
              content: techstackDoc.content,
              version: techstackDoc.currentVersion,
              updatedAt: techstackDoc.updatedAt,
            }
          : {
              preview: techstackDoc.content.slice(0, 500) + (techstackDoc.content.length > 500 ? '...' : ''),
              version: techstackDoc.currentVersion,
              updatedAt: techstackDoc.updatedAt,
            },
      });
    }
  }

  return {
    techstacks,
    count: techstacks.length,
    message: techstacks.length > 0
      ? `Found ${techstacks.length} project(s) with techstack definitions`
      : 'No projects with techstack definitions found',
  };
}

export const browseTechstacksTool = {
  name: 'browse_techstacks',
  description: 'Browse available techstacks from existing projects in context-man - useful for initializing new projects with similar tech',
  inputSchema: browseTechstacksSchema,
  handler: browseTechstacks,
};

export default browseTechstacksTool;
