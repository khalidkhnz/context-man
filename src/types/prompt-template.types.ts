import { z } from 'zod';

export interface IPromptVariable {
  name: string;
  description?: string;
  required: boolean;
  defaultValue?: string;
}

export interface IPromptTemplateVersion {
  version: number;
  content: string;
  variables: IPromptVariable[];
  changedAt: Date;
  changeNote?: string;
}

export const PromptVariableSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  required: z.boolean().default(false),
  defaultValue: z.string().optional(),
});

export const CreatePromptTemplateSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-zA-Z0-9_-]+$/, 'Name must be alphanumeric with underscores or hyphens'),
  description: z.string().optional(),
  content: z.string().min(1),
  variables: z.array(PromptVariableSchema).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  category: z.string().optional(),
  changeNote: z.string().optional(),
});

export const UpdatePromptTemplateSchema = z.object({
  description: z.string().optional(),
  content: z.string().min(1).optional(),
  variables: z.array(PromptVariableSchema).optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  changeNote: z.string().optional(),
});

export const RenderPromptSchema = z.object({
  variables: z.record(z.string()),
});

export type CreatePromptTemplateInput = {
  name: string;
  content: string;
  description?: string;
  variables?: Array<{
    name: string;
    description?: string;
    required?: boolean;
    defaultValue?: string;
  }>;
  tags?: string[];
  category?: string;
  changeNote?: string;
};
export type UpdatePromptTemplateInput = z.infer<typeof UpdatePromptTemplateSchema>;
export type RenderPromptInput = z.infer<typeof RenderPromptSchema>;

export interface IPromptTemplate {
  _id: string;
  projectId: string;
  name: string;
  description: string;
  content: string;
  variables: IPromptVariable[];
  currentVersion: number;
  versions: IPromptTemplateVersion[];
  tags: string[];
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}
