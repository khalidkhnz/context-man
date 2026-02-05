import { Project } from '../models/project.model.js';
import { ProjectDocument } from '../models/document.model.js';
import { Skill } from '../models/skill.model.js';
import { CodeSnippet } from '../models/code-snippet.model.js';
import { PromptTemplate } from '../models/prompt-template.model.js';
import { SearchQueryInput, SearchResult, SearchResponse } from '../types/search.types.js';

export class SearchService {
  async search(options: SearchQueryInput): Promise<SearchResponse> {
    const { query, projectSlug, types, tags, limit = 20, offset = 0 } = options;

    // Get project ID if specified
    let projectId: string | undefined;
    if (projectSlug) {
      const project = await Project.findOne({ slug: projectSlug.toLowerCase() });
      if (!project) {
        return { results: [], total: 0, query };
      }
      projectId = project._id.toString();
    }

    const targetTypes = types || ['document', 'skill', 'snippet', 'prompt'];
    const searchPromises: Promise<SearchResult[]>[] = [];

    if (targetTypes.includes('document')) {
      searchPromises.push(this.searchDocuments(query, projectId, tags));
    }

    if (targetTypes.includes('skill')) {
      searchPromises.push(this.searchSkills(query, projectId, tags));
    }

    if (targetTypes.includes('snippet')) {
      searchPromises.push(this.searchSnippets(query, projectId, tags));
    }

    if (targetTypes.includes('prompt')) {
      searchPromises.push(this.searchPrompts(query, projectId, tags));
    }

    const resultsArrays = await Promise.all(searchPromises);
    const allResults = resultsArrays.flat();

    // Sort by score descending
    allResults.sort((a, b) => b.score - a.score);

    const total = allResults.length;
    const paginatedResults = allResults.slice(offset, offset + limit);

    return {
      results: paginatedResults,
      total,
      query,
    };
  }

  private async searchDocuments(
    query: string,
    projectId?: string,
    tags?: string[]
  ): Promise<SearchResult[]> {
    const match: Record<string, unknown> = {
      $text: { $search: query },
    };

    if (projectId) match.projectId = projectId;
    if (tags?.length) match.tags = { $in: tags };

    const results = await ProjectDocument.aggregate([
      { $match: match },
      { $addFields: { score: { $meta: 'textScore' } } },
      {
        $lookup: {
          from: 'projects',
          localField: 'projectId',
          foreignField: '_id',
          as: 'project',
        },
      },
      { $unwind: '$project' },
      {
        $project: {
          type: { $literal: 'document' },
          projectSlug: '$project.slug',
          name: '$type',
          title: '$title',
          content: 1,
          score: 1,
          tags: 1,
          updatedAt: 1,
        },
      },
      { $sort: { score: -1 } },
      { $limit: 100 },
    ]);

    return results.map((r) => ({
      type: 'document' as const,
      projectSlug: r.projectSlug,
      name: r.name,
      title: r.title,
      excerpt: this.generateExcerpt(r.content, query),
      score: r.score,
      tags: r.tags || [],
      updatedAt: r.updatedAt,
    }));
  }

  private async searchSkills(
    query: string,
    projectId?: string,
    tags?: string[]
  ): Promise<SearchResult[]> {
    const match: Record<string, unknown> = {
      $text: { $search: query },
      isActive: true,
    };

    if (projectId) match.projectId = projectId;
    if (tags?.length) match.tags = { $in: tags };

    const results = await Skill.aggregate([
      { $match: match },
      { $addFields: { score: { $meta: 'textScore' } } },
      {
        $lookup: {
          from: 'projects',
          localField: 'projectId',
          foreignField: '_id',
          as: 'project',
        },
      },
      { $unwind: '$project' },
      {
        $project: {
          type: { $literal: 'skill' },
          projectSlug: '$project.slug',
          name: 1,
          description: 1,
          content: 1,
          score: 1,
          tags: 1,
          updatedAt: 1,
        },
      },
      { $sort: { score: -1 } },
      { $limit: 100 },
    ]);

    return results.map((r) => ({
      type: 'skill' as const,
      projectSlug: r.projectSlug,
      name: r.name,
      excerpt: this.generateExcerpt(r.description || r.content, query),
      score: r.score,
      tags: r.tags || [],
      updatedAt: r.updatedAt,
    }));
  }

  private async searchSnippets(
    query: string,
    projectId?: string,
    tags?: string[]
  ): Promise<SearchResult[]> {
    const match: Record<string, unknown> = {
      $text: { $search: query },
    };

    if (projectId) match.projectId = projectId;
    if (tags?.length) match.tags = { $in: tags };

    const results = await CodeSnippet.aggregate([
      { $match: match },
      { $addFields: { score: { $meta: 'textScore' } } },
      {
        $lookup: {
          from: 'projects',
          localField: 'projectId',
          foreignField: '_id',
          as: 'project',
        },
      },
      { $unwind: '$project' },
      {
        $project: {
          type: { $literal: 'snippet' },
          projectSlug: '$project.slug',
          name: 1,
          description: 1,
          code: 1,
          language: 1,
          score: 1,
          tags: 1,
          updatedAt: 1,
        },
      },
      { $sort: { score: -1 } },
      { $limit: 100 },
    ]);

    return results.map((r) => ({
      type: 'snippet' as const,
      projectSlug: r.projectSlug,
      name: r.name,
      title: `${r.name} (${r.language})`,
      excerpt: this.generateExcerpt(r.description || r.code, query),
      score: r.score,
      tags: r.tags || [],
      updatedAt: r.updatedAt,
    }));
  }

  private async searchPrompts(
    query: string,
    projectId?: string,
    tags?: string[]
  ): Promise<SearchResult[]> {
    const match: Record<string, unknown> = {
      $text: { $search: query },
    };

    if (projectId) match.projectId = projectId;
    if (tags?.length) match.tags = { $in: tags };

    const results = await PromptTemplate.aggregate([
      { $match: match },
      { $addFields: { score: { $meta: 'textScore' } } },
      {
        $lookup: {
          from: 'projects',
          localField: 'projectId',
          foreignField: '_id',
          as: 'project',
        },
      },
      { $unwind: '$project' },
      {
        $project: {
          type: { $literal: 'prompt' },
          projectSlug: '$project.slug',
          name: 1,
          description: 1,
          content: 1,
          category: 1,
          score: 1,
          tags: 1,
          updatedAt: 1,
        },
      },
      { $sort: { score: -1 } },
      { $limit: 100 },
    ]);

    return results.map((r) => ({
      type: 'prompt' as const,
      projectSlug: r.projectSlug,
      name: r.name,
      title: r.category ? `${r.name} (${r.category})` : r.name,
      excerpt: this.generateExcerpt(r.description || r.content, query),
      score: r.score,
      tags: r.tags || [],
      updatedAt: r.updatedAt,
    }));
  }

  private generateExcerpt(content: string, query: string, maxLength: number = 200): string {
    if (!content) return '';

    const terms = query.toLowerCase().split(/\s+/);
    const contentLower = content.toLowerCase();

    // Find best position to start excerpt
    let bestPos = 0;
    for (const term of terms) {
      const pos = contentLower.indexOf(term);
      if (pos !== -1) {
        bestPos = Math.max(0, pos - 50);
        break;
      }
    }

    let excerpt = content.slice(bestPos, bestPos + maxLength);

    // Clean up excerpt boundaries
    if (bestPos > 0) {
      // Start at word boundary
      const firstSpace = excerpt.indexOf(' ');
      if (firstSpace > 0 && firstSpace < 20) {
        excerpt = excerpt.slice(firstSpace + 1);
      }
      excerpt = '...' + excerpt;
    }

    if (bestPos + maxLength < content.length) {
      // End at word boundary
      const lastSpace = excerpt.lastIndexOf(' ');
      if (lastSpace > excerpt.length - 30) {
        excerpt = excerpt.slice(0, lastSpace);
      }
      excerpt = excerpt + '...';
    }

    return excerpt.trim();
  }
}

export const searchService = new SearchService();
export default searchService;
