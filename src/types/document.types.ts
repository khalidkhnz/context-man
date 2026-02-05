import { z } from 'zod';

export enum DocumentType {
  PLAN = 'PLAN',
  TODO = 'TODO',
  SCOPE = 'SCOPE',
  TECHSTACK = 'TECHSTACK',
  UI_UX_STANDARDS = 'UI_UX_STANDARDS',
  CODING_GUIDELINES = 'CODING_GUIDELINES',
}

export const DocumentTypeSchema = z.nativeEnum(DocumentType);

export interface IDocumentVersion {
  version: number;
  content: string;
  changedAt: Date;
  changeNote?: string;
}

export const CreateDocumentSchema = z.object({
  type: DocumentTypeSchema,
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  tags: z.array(z.string()).default([]),
  changeNote: z.string().optional(),
});

export const UpdateDocumentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  changeNote: z.string().optional(),
});

export type CreateDocumentInput = z.infer<typeof CreateDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof UpdateDocumentSchema>;

export interface IProjectDocument {
  _id: string;
  projectId: string;
  type: DocumentType;
  title: string;
  content: string;
  currentVersion: number;
  versions: IDocumentVersion[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
