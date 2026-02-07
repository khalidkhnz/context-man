import { z } from 'zod';
import { projectService, documentService } from '../../services/index.js';
import { DocumentType } from '../../types/document.types.js';

export const addDocumentSchema = z.object({
  projectSlug: z.string().describe('The project slug to add the document to'),
  username: z.string().describe('Username of the person adding this document'),
  type: z
    .enum(['PLAN', 'TODO', 'SCOPE', 'TECHSTACK', 'UI_UX_STANDARDS', 'CODING_GUIDELINES'])
    .describe('Document type'),
  title: z.string().describe('Document title'),
  content: z.string().describe('Document content (markdown)'),
  tags: z.array(z.string()).optional().describe('Tags for categorization'),
  changeNote: z.string().optional().describe('Note about this document creation'),
});

export type AddDocumentInput = z.infer<typeof addDocumentSchema>;

export async function addDocument(input: AddDocumentInput) {
  // Verify project exists
  const project = await projectService.findBySlug(input.projectSlug);
  if (!project) {
    return { error: `Project "${input.projectSlug}" not found. Use list_projects to see available projects.` };
  }

  // Check if document already exists
  const docType = DocumentType[input.type as keyof typeof DocumentType];
  const existing = await documentService.findByProjectAndType(input.projectSlug, docType);
  if (existing) {
    return {
      error: `Document of type "${input.type}" already exists for project "${input.projectSlug}". Use update_document to modify it.`,
    };
  }

  // Create the document
  const doc = await documentService.create(input.projectSlug, {
    type: docType,
    title: input.title,
    content: input.content,
    tags: input.tags || [],
    changeNote: input.changeNote || 'Initial version',
    username: input.username,
  });

  if (!doc) {
    return { error: 'Failed to create document' };
  }

  return {
    message: 'Document added successfully',
    document: {
      type: input.type,
      title: doc.title,
      version: doc.currentVersion,
      author: input.username,
    },
    project: {
      slug: project.slug,
      name: project.name,
    },
  };
}

export const addDocumentTool = {
  name: 'add_document',
  description: `Add a new document to an existing project.

Use this tool to:
- Add a PLAN, SCOPE, TECHSTACK, TODO, CODING_GUIDELINES, or UI_UX_STANDARDS document
- Requires a username to track who added the document

Fails if the document type already exists — use update_document to modify existing documents.`,
  inputSchema: {
    type: 'object' as const,
    properties: {
      projectSlug: {
        type: 'string',
        description: 'The project slug to add the document to',
      },
      username: {
        type: 'string',
        description: 'Username of the person adding this document',
      },
      type: {
        type: 'string',
        enum: ['PLAN', 'TODO', 'SCOPE', 'TECHSTACK', 'UI_UX_STANDARDS', 'CODING_GUIDELINES'],
        description: 'Document type',
      },
      title: {
        type: 'string',
        description: 'Document title',
      },
      content: {
        type: 'string',
        description: 'Document content (markdown)',
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Tags for categorization',
      },
      changeNote: {
        type: 'string',
        description: 'Note about this document creation',
      },
    },
    required: ['projectSlug', 'username', 'type', 'title', 'content'],
  },
  handler: addDocument,
};

export default addDocumentTool;
