import { z } from 'zod';
import { skillService } from '../../services/index.js';
import { SkillType } from '../../types/skill.types.js';

export const getSkillsSchema = z.object({
  project: z.string().describe('Project slug'),
  type: z
    .enum(['instructions', 'code_template', 'tool_definition'])
    .optional()
    .describe('Filter by skill type'),
  name: z.string().optional().describe('Get specific skill by name'),
  tags: z.array(z.string()).optional().describe('Filter by tags'),
});

export type GetSkillsInput = z.infer<typeof getSkillsSchema>;

export async function getSkills(input: GetSkillsInput) {
  // Get specific skill by name
  if (input.name) {
    const skill = await skillService.findByProjectAndName(input.project, input.name);
    if (!skill) {
      throw new Error(`Skill "${input.name}" not found for project "${input.project}"`);
    }

    return {
      skills: [
        {
          name: skill.name,
          type: skill.type,
          description: skill.description,
          content: skill.content,
          tags: skill.tags,
          version: skill.currentVersion,
          updatedAt: skill.updatedAt.toISOString(),
        },
      ],
    };
  }

  // List skills with optional filters
  const skills = await skillService.findAllByProject(input.project, {
    type: input.type as SkillType | undefined,
    tags: input.tags,
    activeOnly: true,
  });

  return {
    skills: skills.map((s) => ({
      name: s.name,
      type: s.type,
      description: s.description,
      content: s.content,
      tags: s.tags,
      version: s.currentVersion,
      updatedAt: s.updatedAt.toISOString(),
    })),
  };
}

export const getSkillsTool = {
  name: 'get_skills',
  description: 'Get skills from a project, optionally filtered by type or name',
  inputSchema: {
    type: 'object' as const,
    properties: {
      project: {
        type: 'string',
        description: 'Project slug',
      },
      type: {
        type: 'string',
        enum: ['instructions', 'code_template', 'tool_definition'],
        description: 'Filter by skill type',
      },
      name: {
        type: 'string',
        description: 'Get specific skill by name',
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Filter by tags',
      },
    },
    required: ['project'],
  },
  handler: getSkills,
};

export default getSkillsTool;
