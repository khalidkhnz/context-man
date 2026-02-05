import { z } from 'zod';
import { documentService } from '../../services/index.js';
import { DocumentType } from '../../types/document.types.js';

export const getDocumentSchema = z.object({
  project: z.string().describe('Project slug'),
  type: z
    .enum(['PLAN', 'TODO', 'SCOPE', 'TECHSTACK', 'UI_UX_STANDARDS', 'CODING_GUIDELINES'])
    .describe('Document type'),
  version: z.number().optional().describe('Specific version number (latest if omitted)'),
});

export type GetDocumentInput = z.infer<typeof getDocumentSchema>;

export async function getDocument(input: GetDocumentInput) {
  const type = input.type as DocumentType;

  if (input.version) {
    const versionData = await documentService.getVersion(input.project, type, input.version);
    if (!versionData) {
      throw new Error(`Version ${input.version} not found for document "${type}"`);
    }
    return {
      type,
      content: versionData.content,
      version: versionData.version,
      changedAt: versionData.changedAt.toISOString(),
    };
  }

  const doc = await documentService.findByProjectAndType(input.project, type);
  if (!doc) {
    throw new Error(`Document "${type}" not found for project "${input.project}"`);
  }

  const versions = await documentService.getVersionHistory(input.project, type);

  return {
    type: doc.type,
    title: doc.title,
    content: doc.content,
    version: doc.currentVersion,
    tags: doc.tags,
    updatedAt: doc.updatedAt.toISOString(),
    versions: versions.map((v) => ({
      version: v.version,
      changedAt: v.changedAt.toISOString(),
      changeNote: v.changeNote,
    })),
  };
}

export const getDocumentTool = {
  name: 'get_document',
  description: 'Get a specific document from a project',
  inputSchema: {
    type: 'object' as const,
    properties: {
      project: {
        type: 'string',
        description: 'Project slug',
      },
      type: {
        type: 'string',
        enum: ['PLAN', 'TODO', 'SCOPE', 'TECHSTACK', 'UI_UX_STANDARDS', 'CODING_GUIDELINES'],
        description: 'Document type',
      },
      version: {
        type: 'number',
        description: 'Specific version number (latest if omitted)',
      },
    },
    required: ['project', 'type'],
  },
  handler: getDocument,
};

export default getDocumentTool;
