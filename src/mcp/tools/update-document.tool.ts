import { z } from 'zod';
import { projectService, documentService } from '../../services/index.js';
import { DocumentType } from '../../types/document.types.js';

export const updateDocumentSchema = z.object({
  projectSlug: z.string().describe('The project slug'),
  username: z.string().describe('Username of the person updating this document'),
  type: z
    .enum(['PLAN', 'TODO', 'SCOPE', 'TECHSTACK', 'UI_UX_STANDARDS', 'CODING_GUIDELINES'])
    .describe('Document type to update'),
  title: z.string().optional().describe('New document title'),
  content: z.string().optional().describe('New document content (markdown)'),
  tags: z.array(z.string()).optional().describe('New tags'),
  changeNote: z.string().optional().describe('Note about what changed in this update'),
});

export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;

export async function updateDocument(input: UpdateDocumentInput) {
  // Verify project exists
  const project = await projectService.findBySlug(input.projectSlug);
  if (!project) {
    return { error: `Project "${input.projectSlug}" not found. Use list_projects to see available projects.` };
  }

  // Verify document exists
  const docType = DocumentType[input.type as keyof typeof DocumentType];
  const existing = await documentService.findByProjectAndType(input.projectSlug, docType);
  if (!existing) {
    return {
      error: `Document of type "${input.type}" not found for project "${input.projectSlug}". Use add_document to create it first.`,
    };
  }

  // Update the document
  const doc = await documentService.update(input.projectSlug, docType, {
    title: input.title,
    content: input.content,
    tags: input.tags,
    changeNote: input.changeNote,
    username: input.username,
  });

  if (!doc) {
    return { error: 'Failed to update document' };
  }

  return {
    message: 'Document updated successfully',
    document: {
      type: input.type,
      title: doc.title,
      version: doc.currentVersion,
      author: input.username,
      authors: doc.authors,
    },
    project: {
      slug: project.slug,
      name: project.name,
    },
  };
}

export const updateDocumentTool = {
  name: 'update_document',
  description: `Update an existing document in a project.

Use this tool to:
- Update the content, title, or tags of an existing document
- Creates a new version in the document's history
- Requires a username to track who made the update

Fails if the document doesn't exist — use add_document to create it first.`,
  inputSchema: {
    type: 'object' as const,
    properties: {
      projectSlug: {
        type: 'string',
        description: 'The project slug',
      },
      username: {
        type: 'string',
        description: 'Username of the person updating this document',
      },
      type: {
        type: 'string',
        enum: ['PLAN', 'TODO', 'SCOPE', 'TECHSTACK', 'UI_UX_STANDARDS', 'CODING_GUIDELINES'],
        description: 'Document type to update',
      },
      title: {
        type: 'string',
        description: 'New document title',
      },
      content: {
        type: 'string',
        description: 'New document content (markdown)',
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'New tags',
      },
      changeNote: {
        type: 'string',
        description: 'Note about what changed in this update',
      },
    },
    required: ['projectSlug', 'username', 'type'],
  },
  handler: updateDocument,
};

export default updateDocumentTool;
