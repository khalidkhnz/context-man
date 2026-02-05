import { z } from 'zod';

export interface ICodeSnippetVersion {
  version: number;
  code: string;
  changedAt: Date;
  changeNote?: string;
}

export const CreateCodeSnippetSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-zA-Z0-9_-]+$/, 'Name must be alphanumeric with underscores or hyphens'),
  language: z.string().min(1).max(50).toLowerCase(),
  code: z.string().min(1),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  changeNote: z.string().optional(),
});

export const UpdateCodeSnippetSchema = z.object({
  code: z.string().min(1).optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  changeNote: z.string().optional(),
});

export type CreateCodeSnippetInput = z.infer<typeof CreateCodeSnippetSchema>;
export type UpdateCodeSnippetInput = z.infer<typeof UpdateCodeSnippetSchema>;

export interface ICodeSnippet {
  _id: string;
  projectId: string;
  name: string;
  language: string;
  code: string;
  description: string;
  currentVersion: number;
  versions: ICodeSnippetVersion[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
