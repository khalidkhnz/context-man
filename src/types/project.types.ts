import { z } from 'zod';

export const CreateProjectSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.unknown()).optional(),
  isTemplate: z.boolean().optional().default(false),
  username: z.string().optional(),
});

export const UpdateProjectSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.unknown()).optional(),
  isTemplate: z.boolean().optional(),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;

export interface IProject {
  _id: string;
  slug: string;
  name: string;
  description: string;
  tags: string[];
  metadata: Record<string, unknown>;
  isTemplate: boolean;
  authors: string[];
  lastAuthor: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectWithCounts extends IProject {
  documentCount: number;
  skillCount: number;
  snippetCount: number;
  promptCount: number;
  todoStats?: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    completionRate: string;
  };
  documents?: {
    PLAN: boolean;
    SCOPE: boolean;
    TECHSTACK: boolean;
    TODO: boolean;
    CODING_GUIDELINES: boolean;
    UI_UX_STANDARDS: boolean;
  };
}
