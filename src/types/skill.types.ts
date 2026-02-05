import { z } from 'zod';

export enum SkillType {
  INSTRUCTIONS = 'instructions',
  CODE_TEMPLATE = 'code_template',
  TOOL_DEFINITION = 'tool_definition',
}

export const SkillTypeSchema = z.nativeEnum(SkillType);

export interface ISkillVersion {
  version: number;
  content: string;
  changedAt: Date;
  changeNote?: string;
}

export const CreateSkillSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-zA-Z0-9_-]+$/, 'Name must be alphanumeric with underscores or hyphens'),
  type: SkillTypeSchema,
  description: z.string().optional(),
  content: z.string().min(1),
  tags: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional().default(true),
  changeNote: z.string().optional(),
});

export const UpdateSkillSchema = z.object({
  description: z.string().optional(),
  content: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  changeNote: z.string().optional(),
});

export type CreateSkillInput = {
  name: string;
  type: SkillType;
  content: string;
  description?: string;
  tags?: string[];
  isActive?: boolean;
  changeNote?: string;
};
export type UpdateSkillInput = z.infer<typeof UpdateSkillSchema>;

export interface ISkill {
  _id: string;
  projectId: string;
  name: string;
  type: SkillType;
  description: string;
  content: string;
  currentVersion: number;
  versions: ISkillVersion[];
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
