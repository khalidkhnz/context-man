import { z } from 'zod';
import { projectService, documentService, skillService } from '../../services/index.js';
import { DocumentType } from '../../types/document.types.js';

export const initProjectFromTechstackSchema = z.object({
  newProjectSlug: z.string().describe('Slug for the new project'),
  newProjectName: z.string().describe('Name for the new project'),
  newProjectDescription: z.string().optional().describe('Description for the new project'),
  sourceProjectSlug: z.string().describe('Source project to copy techstack from'),
  copyDocuments: z
    .array(z.enum(['TECHSTACK', 'CODING_GUIDELINES', 'UI_UX_STANDARDS']))
    .optional()
    .default(['TECHSTACK'])
    .describe('Which documents to copy from source'),
  copySkills: z.boolean().optional().default(false).describe('Copy skills from source project'),
  tags: z.array(z.string()).optional().describe('Tags for the new project'),
});

export type InitProjectFromTechstackInput = z.infer<typeof initProjectFromTechstackSchema>;

export async function initProjectFromTechstack(input: InitProjectFromTechstackInput) {
  // Check if source project exists
  const sourceProject = await projectService.findBySlug(input.sourceProjectSlug);
  if (!sourceProject) {
    return { error: `Source project "${input.sourceProjectSlug}" not found` };
  }

  // Check if new project slug is available
  const existingProject = await projectService.findBySlug(input.newProjectSlug);
  if (existingProject) {
    return { error: `Project "${input.newProjectSlug}" already exists` };
  }

  // Create the new project (user project, not a template)
  const newProject = await projectService.create({
    slug: input.newProjectSlug,
    name: input.newProjectName,
    description: input.newProjectDescription || `Initialized from ${sourceProject.name}`,
    tags: input.tags || sourceProject.tags,
    isTemplate: false,
  });

  if (!newProject) {
    return { error: 'Failed to create new project' };
  }

  const copiedItems = {
    documents: [] as string[],
    skills: [] as string[],
  };

  // Copy specified documents
  for (const docTypeStr of input.copyDocuments || ['TECHSTACK']) {
    const docType = DocumentType[docTypeStr as keyof typeof DocumentType];
    const sourceDoc = await documentService.findByProjectAndType(
      input.sourceProjectSlug,
      docType
    );

    if (sourceDoc) {
      await documentService.create(input.newProjectSlug, {
        type: docType,
        title: docTypeStr,
        content: sourceDoc.content,
        tags: sourceDoc.tags || [],
        changeNote: `Copied from ${input.sourceProjectSlug}`,
      });
      copiedItems.documents.push(docTypeStr);
    }
  }

  // Copy skills if requested
  if (input.copySkills) {
    const sourceSkills = await skillService.findAllByProject(input.sourceProjectSlug);

    for (const skill of sourceSkills) {
      await skillService.create(input.newProjectSlug, {
        name: skill.name,
        type: skill.type,
        content: skill.content,
        description: skill.description,
        tags: skill.tags,
        isActive: skill.isActive,
        changeNote: `Copied from ${input.sourceProjectSlug}`,
      });
      copiedItems.skills.push(skill.name);
    }
  }

  return {
    message: 'Project initialized successfully',
    project: {
      slug: newProject.slug,
      name: newProject.name,
      description: newProject.description,
      tags: newProject.tags,
    },
    copied: {
      documents: copiedItems.documents,
      skills: copiedItems.skills,
      documentsCount: copiedItems.documents.length,
      skillsCount: copiedItems.skills.length,
    },
    sourceProject: {
      slug: sourceProject.slug,
      name: sourceProject.name,
    },
  };
}

export const initProjectFromTechstackTool = {
  name: 'init_project_from_techstack',
  description: 'Initialize a new project using techstack and optionally other documents/skills from an existing project',
  inputSchema: initProjectFromTechstackSchema,
  handler: initProjectFromTechstack,
};

export default initProjectFromTechstackTool;
