import { z } from 'zod';
import { projectService } from '../../services/index.js';

// Input schema for browsing catalog
export const BrowseCatalogInputSchema = z.object({
  category: z
    .enum(['all', 'backend', 'frontend', 'fullstack', 'database', 'devops', 'mobile'])
    .optional()
    .default('all')
    .describe('Filter by category'),
  search: z
    .string()
    .optional()
    .describe('Search term to filter projects by name or tags'),
});

export type BrowseCatalogInput = z.infer<typeof BrowseCatalogInputSchema>;

interface CatalogProject {
  slug: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  counts: {
    documents: number;
    skills: number;
    snippets: number;
    prompts: number;
  };
}

interface CatalogResult {
  projects: CatalogProject[];
  totalCount: number;
  categories: { name: string; count: number }[];
}

// Categorize project based on tags
function categorizeProject(tags: string[]): string {
  const tagSet = new Set(tags.map(t => t.toLowerCase()));

  if (tagSet.has('mobile') || tagSet.has('react-native')) return 'mobile';
  if (tagSet.has('fullstack') || tagSet.has('mern') || tagSet.has('mean')) return 'fullstack';
  if (tagSet.has('backend') || tagSet.has('api')) return 'backend';
  if (tagSet.has('frontend') || tagSet.has('spa')) return 'frontend';
  if (tagSet.has('database') || tagSet.has('orm') || tagSet.has('sql') || tagSet.has('nosql')) return 'database';
  if (tagSet.has('devops') || tagSet.has('deployment') || tagSet.has('cicd')) return 'devops';

  return 'other';
}

export async function browseCatalog(input: BrowseCatalogInput): Promise<CatalogResult> {
  // Use findAllWithCounts to get projects with their content counts
  const projectsWithCounts = await projectService.findAllWithCounts();

  // Transform to our catalog format
  const projectsWithDetails: CatalogProject[] = projectsWithCounts.map((project) => {
    const category = categorizeProject(project.tags || []);

    return {
      slug: project.slug,
      name: project.name,
      description: project.description || '',
      category,
      tags: project.tags || [],
      counts: {
        documents: project.documentCount,
        skills: project.skillCount,
        snippets: project.snippetCount,
        prompts: project.promptCount,
      },
    };
  });

  // Filter by category
  let filtered = projectsWithDetails;
  if (input.category && input.category !== 'all') {
    filtered = filtered.filter(p => p.category === input.category);
  }

  // Filter by search term
  if (input.search) {
    const searchLower = input.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.tags.some(t => t.toLowerCase().includes(searchLower))
    );
  }

  // Calculate category counts
  const categoryCounts = new Map<string, number>();
  projectsWithDetails.forEach(p => {
    categoryCounts.set(p.category, (categoryCounts.get(p.category) || 0) + 1);
  });

  const categories = Array.from(categoryCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    projects: filtered.sort((a, b) => a.name.localeCompare(b.name)),
    totalCount: filtered.length,
    categories,
  };
}

// Tool definition for MCP
export const browseCatalogTool = {
  name: 'browse_catalog',
  description: `Browse available project templates and techstacks in the catalog.

Use this tool to:
- Show users what project templates are available
- Filter by category (backend, frontend, fullstack, database, devops, mobile)
- Search for specific technologies or frameworks
- Help users choose a starting point for their project

Returns a list of projects with their names, descriptions, categories, and tags.`,
  inputSchema: {
    type: 'object' as const,
    properties: {
      category: {
        type: 'string',
        enum: ['all', 'backend', 'frontend', 'fullstack', 'database', 'devops', 'mobile'],
        description: 'Filter by category',
        default: 'all',
      },
      search: {
        type: 'string',
        description: 'Search term to filter projects by name or tags (e.g., "react", "typescript", "prisma")',
      },
    },
  },
};
