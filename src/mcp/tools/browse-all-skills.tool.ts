import { z } from 'zod';
import { skillService, projectService } from '../../services/index.js';

// Input schema for browsing skills
export const BrowseAllSkillsInputSchema = z.object({
  category: z
    .enum(['all', 'backend', 'frontend', 'database', 'devops', 'general', 'testing', 'security'])
    .optional()
    .default('all')
    .describe('Filter by skill category'),
  type: z
    .enum(['all', 'instructions', 'code_template', 'tool_definition'])
    .optional()
    .default('all')
    .describe('Filter by skill type'),
  search: z
    .string()
    .optional()
    .describe('Search term to filter skills by name, description, or tags'),
});

export type BrowseAllSkillsInput = z.infer<typeof BrowseAllSkillsInputSchema>;

interface SkillInfo {
  name: string;
  type: string;
  description: string;
  category: string;
  tags: string[];
}

interface SkillsResult {
  skills: SkillInfo[];
  totalCount: number;
  categories: { name: string; count: number }[];
  types: { name: string; count: number }[];
}

// Categorize skill based on tags
function categorizeSkill(tags: string[], name: string): string {
  const tagSet = new Set(tags.map(t => t.toLowerCase()));
  const nameLower = name.toLowerCase();

  if (tagSet.has('testing') || tagSet.has('test') || nameLower.includes('test')) return 'testing';
  if (tagSet.has('security') || tagSet.has('auth') || nameLower.includes('security') || nameLower.includes('auth')) return 'security';
  if (tagSet.has('database') || tagSet.has('orm') || tagSet.has('sql') || tagSet.has('prisma') || tagSet.has('drizzle') || tagSet.has('mongoose')) return 'database';
  if (tagSet.has('devops') || tagSet.has('docker') || tagSet.has('deployment') || tagSet.has('logging') || tagSet.has('monitoring')) return 'devops';
  if (tagSet.has('react') || tagSet.has('vue') || tagSet.has('frontend') || tagSet.has('css') || tagSet.has('tailwind') || tagSet.has('state')) return 'frontend';
  if (tagSet.has('api') || tagSet.has('backend') || tagSet.has('express') || tagSet.has('validation')) return 'backend';
  if (tagSet.has('git') || tagSet.has('conventions') || tagSet.has('best-practices') || tagSet.has('documentation') || tagSet.has('architecture')) return 'general';

  return 'general';
}

export async function browseAllSkills(input: BrowseAllSkillsInput): Promise<SkillsResult> {
  // Get skills from a reference project (they're all the same across seeded projects)
  // First try to get from a seeded project, fall back to listing unique skills
  const projects = await projectService.findAll();

  // Use a map to deduplicate skills by name
  const skillsMap = new Map<string, SkillInfo>();

  // Get skills from first few projects to ensure we capture all unique skills
  const sampleProjects = projects.slice(0, 5);

  for (const project of sampleProjects) {
    const projectSkills = await skillService.findByProjectId(project._id, {});

    for (const skill of projectSkills) {
      if (!skillsMap.has(skill.name)) {
        const category = categorizeSkill(skill.tags || [], skill.name);
        skillsMap.set(skill.name, {
          name: skill.name,
          type: skill.type,
          description: skill.description || '',
          category,
          tags: skill.tags || [],
        });
      }
    }
  }

  let skills = Array.from(skillsMap.values());

  // Filter by category
  if (input.category && input.category !== 'all') {
    skills = skills.filter(s => s.category === input.category);
  }

  // Filter by type
  if (input.type && input.type !== 'all') {
    skills = skills.filter(s => s.type === input.type);
  }

  // Filter by search term
  if (input.search) {
    const searchLower = input.search.toLowerCase();
    skills = skills.filter(s =>
      s.name.toLowerCase().includes(searchLower) ||
      s.description.toLowerCase().includes(searchLower) ||
      s.tags.some(t => t.toLowerCase().includes(searchLower))
    );
  }

  // Calculate category counts from all skills (before filtering)
  const allSkills = Array.from(skillsMap.values());
  const categoryCounts = new Map<string, number>();
  const typeCounts = new Map<string, number>();

  allSkills.forEach(s => {
    categoryCounts.set(s.category, (categoryCounts.get(s.category) || 0) + 1);
    typeCounts.set(s.type, (typeCounts.get(s.type) || 0) + 1);
  });

  const categories = Array.from(categoryCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const types = Array.from(typeCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    skills: skills.sort((a, b) => a.name.localeCompare(b.name)),
    totalCount: skills.length,
    categories,
    types,
  };
}

// Tool definition for MCP
export const browseAllSkillsTool = {
  name: 'browse_all_skills',
  description: `Browse all available skills (code templates, instructions, patterns) in the catalog.

Use this tool to:
- Show users what skills and patterns are available
- Filter by category (backend, frontend, database, devops, general, testing, security)
- Filter by type (instructions, code_template, tool_definition)
- Search for specific patterns or technologies
- Help users discover useful coding patterns and best practices

Returns a list of unique skills with their names, types, descriptions, and tags.`,
  inputSchema: {
    type: 'object' as const,
    properties: {
      category: {
        type: 'string',
        enum: ['all', 'backend', 'frontend', 'database', 'devops', 'general', 'testing', 'security'],
        description: 'Filter by skill category',
        default: 'all',
      },
      type: {
        type: 'string',
        enum: ['all', 'instructions', 'code_template', 'tool_definition'],
        description: 'Filter by skill type',
        default: 'all',
      },
      search: {
        type: 'string',
        description: 'Search term to filter skills by name, description, or tags',
      },
    },
  },
};
