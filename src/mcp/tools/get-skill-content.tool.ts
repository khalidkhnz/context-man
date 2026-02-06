import { z } from 'zod';
import { skillService, projectService } from '../../services/index.js';

// Input schema for getting skill content
export const GetSkillContentInputSchema = z.object({
  skillName: z
    .string()
    .min(1)
    .describe('The name of the skill to retrieve (e.g., "jwt-authentication", "prisma-patterns")'),
  projectSlug: z
    .string()
    .optional()
    .describe('Optional: specific project to get the skill from (defaults to first available)'),
});

export type GetSkillContentInput = z.infer<typeof GetSkillContentInputSchema>;

interface SkillContent {
  name: string;
  type: string;
  description: string;
  content: string;
  tags: string[];
  version: number;
}

interface GetSkillResult {
  skill: SkillContent | null;
  error?: string;
}

export async function getSkillContent(input: GetSkillContentInput): Promise<GetSkillResult> {
  let projectSlug = input.projectSlug;

  // If no project specified, find any project that has this skill
  if (!projectSlug) {
    const projects = await projectService.findAll();
    for (const project of projects) {
      const skill = await skillService.findByProjectAndName(project.slug, input.skillName);
      if (skill) {
        projectSlug = project.slug;
        break;
      }
    }
  }

  if (!projectSlug) {
    return {
      skill: null,
      error: `Skill "${input.skillName}" not found in any project`,
    };
  }

  const skill = await skillService.findByProjectAndName(projectSlug, input.skillName);

  if (!skill) {
    return {
      skill: null,
      error: `Skill "${input.skillName}" not found in project "${projectSlug}"`,
    };
  }

  return {
    skill: {
      name: skill.name,
      type: skill.type,
      description: skill.description || '',
      content: skill.content,
      tags: skill.tags || [],
      version: skill.currentVersion,
    },
  };
}

// Tool definition for MCP
export const getSkillContentTool = {
  name: 'get_skill_content',
  description: `Get the full content of a specific skill by name.

Use this tool to:
- Retrieve detailed instructions, code templates, or patterns
- Show users the full content of a skill they're interested in
- Get code examples and best practices for specific technologies

First use 'browse_all_skills' to see available skills, then use this tool to get the full content.`,
  inputSchema: {
    type: 'object' as const,
    properties: {
      skillName: {
        type: 'string',
        description: 'The name of the skill to retrieve (e.g., "jwt-authentication", "prisma-patterns", "react-component-patterns")',
      },
      projectSlug: {
        type: 'string',
        description: 'Optional: specific project to get the skill from',
      },
    },
    required: ['skillName'],
  },
};
