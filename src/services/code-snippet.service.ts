import { Types } from 'mongoose';
import { CodeSnippet, ICodeSnippetModel } from '../models/code-snippet.model.js';
import { Project } from '../models/project.model.js';
import {
  CreateCodeSnippetInput,
  UpdateCodeSnippetInput,
  ICodeSnippetVersion,
} from '../types/code-snippet.types.js';

export class CodeSnippetService {
  async create(
    projectSlug: string,
    input: CreateCodeSnippetInput
  ): Promise<ICodeSnippetModel | null> {
    const project = await Project.findOne({ slug: projectSlug.toLowerCase() });
    if (!project) return null;

    const snippet = new CodeSnippet({
      projectId: project._id,
      name: input.name,
      language: input.language.toLowerCase(),
      code: input.code,
      description: input.description || '',
      tags: input.tags || [],
      currentVersion: 1,
      versions: [
        {
          version: 1,
          code: input.code,
          changedAt: new Date(),
          changeNote: input.changeNote || 'Initial version',
        },
      ],
    });

    return snippet.save();
  }

  async findByProjectAndName(
    projectSlug: string,
    name: string
  ): Promise<ICodeSnippetModel | null> {
    const project = await Project.findOne({ slug: projectSlug.toLowerCase() });
    if (!project) return null;

    return CodeSnippet.findOne({ projectId: project._id, name });
  }

  async findAllByProject(
    projectSlug: string,
    options?: {
      language?: string;
      tags?: string[];
    }
  ): Promise<ICodeSnippetModel[]> {
    const project = await Project.findOne({ slug: projectSlug.toLowerCase() });
    if (!project) return [];

    const query: Record<string, unknown> = { projectId: project._id };

    if (options?.language) query.language = options.language.toLowerCase();
    if (options?.tags?.length) query.tags = { $in: options.tags };

    return CodeSnippet.find(query).sort({ name: 1 });
  }

  async findByProjectId(
    projectId: string | Types.ObjectId,
    options?: {
      language?: string;
    }
  ): Promise<ICodeSnippetModel[]> {
    const query: Record<string, unknown> = { projectId };

    if (options?.language) query.language = options.language.toLowerCase();

    return CodeSnippet.find(query).sort({ name: 1 });
  }

  async update(
    projectSlug: string,
    name: string,
    input: UpdateCodeSnippetInput
  ): Promise<ICodeSnippetModel | null> {
    const project = await Project.findOne({ slug: projectSlug.toLowerCase() });
    if (!project) return null;

    const snippet = await CodeSnippet.findOne({ projectId: project._id, name });
    if (!snippet) return null;

    // Save current version to history if code is changing
    if (input.code && input.code !== snippet.code) {
      snippet.versions.push({
        version: snippet.currentVersion,
        code: snippet.code,
        changedAt: new Date(),
        changeNote: input.changeNote,
      });
      snippet.currentVersion += 1;
      snippet.code = input.code;
    }

    if (input.description !== undefined) snippet.description = input.description;
    if (input.tags !== undefined) snippet.tags = input.tags;

    return snippet.save();
  }

  async delete(projectSlug: string, name: string): Promise<boolean> {
    const project = await Project.findOne({ slug: projectSlug.toLowerCase() });
    if (!project) return false;

    const result = await CodeSnippet.deleteOne({ projectId: project._id, name });
    return result.deletedCount > 0;
  }

  async getVersion(
    projectSlug: string,
    name: string,
    version: number
  ): Promise<ICodeSnippetVersion | null> {
    const snippet = await this.findByProjectAndName(projectSlug, name);
    if (!snippet) return null;

    if (version === snippet.currentVersion) {
      return {
        version: snippet.currentVersion,
        code: snippet.code,
        changedAt: snippet.updatedAt,
      };
    }

    return snippet.versions.find((v) => v.version === version) || null;
  }

  async getVersionHistory(
    projectSlug: string,
    name: string
  ): Promise<Array<{ version: number; changedAt: Date; changeNote?: string }>> {
    const snippet = await this.findByProjectAndName(projectSlug, name);
    if (!snippet) return [];

    const history = snippet.versions.map((v) => ({
      version: v.version,
      changedAt: v.changedAt,
      changeNote: v.changeNote,
    }));

    history.push({
      version: snippet.currentVersion,
      changedAt: snippet.updatedAt,
      changeNote: 'Current version',
    });

    return history.sort((a, b) => b.version - a.version);
  }
}

export const codeSnippetService = new CodeSnippetService();
export default codeSnippetService;
