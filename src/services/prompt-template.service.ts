import { Types } from 'mongoose';
import Handlebars from 'handlebars';
import { PromptTemplate, IPromptTemplateModel } from '../models/prompt-template.model.js';
import { Project } from '../models/project.model.js';
import {
  CreatePromptTemplateInput,
  UpdatePromptTemplateInput,
  IPromptTemplateVersion,
  IPromptVariable,
} from '../types/prompt-template.types.js';

export class PromptTemplateService {
  async create(
    projectSlug: string,
    input: CreatePromptTemplateInput
  ): Promise<IPromptTemplateModel | null> {
    const project = await Project.findOne({ slug: projectSlug.toLowerCase() });
    if (!project) return null;

    // Auto-detect variables from content if not provided
    const variables = input.variables?.length
      ? input.variables
      : this.extractVariables(input.content);

    const template = new PromptTemplate({
      projectId: project._id,
      name: input.name,
      description: input.description || '',
      content: input.content,
      variables,
      tags: input.tags || [],
      category: input.category,
      currentVersion: 1,
      versions: [
        {
          version: 1,
          content: input.content,
          variables,
          changedAt: new Date(),
          changeNote: input.changeNote || 'Initial version',
        },
      ],
    });

    return template.save();
  }

  async findByProjectAndName(
    projectSlug: string,
    name: string
  ): Promise<IPromptTemplateModel | null> {
    const project = await Project.findOne({ slug: projectSlug.toLowerCase() });
    if (!project) return null;

    return PromptTemplate.findOne({ projectId: project._id, name });
  }

  async findAllByProject(
    projectSlug: string,
    options?: {
      category?: string;
      tags?: string[];
    }
  ): Promise<IPromptTemplateModel[]> {
    const project = await Project.findOne({ slug: projectSlug.toLowerCase() });
    if (!project) return [];

    const query: Record<string, unknown> = { projectId: project._id };

    if (options?.category) query.category = options.category;
    if (options?.tags?.length) query.tags = { $in: options.tags };

    return PromptTemplate.find(query).sort({ name: 1 });
  }

  async findByProjectId(
    projectId: string | Types.ObjectId,
    options?: {
      category?: string;
    }
  ): Promise<IPromptTemplateModel[]> {
    const query: Record<string, unknown> = { projectId };

    if (options?.category) query.category = options.category;

    return PromptTemplate.find(query).sort({ name: 1 });
  }

  async update(
    projectSlug: string,
    name: string,
    input: UpdatePromptTemplateInput
  ): Promise<IPromptTemplateModel | null> {
    const project = await Project.findOne({ slug: projectSlug.toLowerCase() });
    if (!project) return null;

    const template = await PromptTemplate.findOne({ projectId: project._id, name });
    if (!template) return null;

    // Save current version to history if content is changing
    if (input.content && input.content !== template.content) {
      template.versions.push({
        version: template.currentVersion,
        content: template.content,
        variables: template.variables,
        changedAt: new Date(),
        changeNote: input.changeNote,
      });
      template.currentVersion += 1;
      template.content = input.content;

      // Update variables if content changed but variables not explicitly provided
      if (!input.variables) {
        template.variables = this.extractVariables(input.content);
      }
    }

    if (input.description !== undefined) template.description = input.description;
    if (input.variables !== undefined) template.variables = input.variables;
    if (input.tags !== undefined) template.tags = input.tags;
    if (input.category !== undefined) template.category = input.category;

    return template.save();
  }

  async delete(projectSlug: string, name: string): Promise<boolean> {
    const project = await Project.findOne({ slug: projectSlug.toLowerCase() });
    if (!project) return false;

    const result = await PromptTemplate.deleteOne({ projectId: project._id, name });
    return result.deletedCount > 0;
  }

  async render(
    projectSlug: string,
    name: string,
    variables: Record<string, string>
  ): Promise<string | null> {
    const template = await this.findByProjectAndName(projectSlug, name);
    if (!template) return null;

    // Apply default values for missing variables
    const context: Record<string, string> = { ...variables };
    for (const v of template.variables) {
      if (context[v.name] === undefined && v.defaultValue !== undefined) {
        context[v.name] = v.defaultValue;
      }
    }

    // Validate required variables
    for (const v of template.variables) {
      if (v.required && context[v.name] === undefined) {
        throw new Error(`Missing required variable: ${v.name}`);
      }
    }

    const compiled = Handlebars.compile(template.content);
    return compiled(context);
  }

  async getVersion(
    projectSlug: string,
    name: string,
    version: number
  ): Promise<IPromptTemplateVersion | null> {
    const template = await this.findByProjectAndName(projectSlug, name);
    if (!template) return null;

    if (version === template.currentVersion) {
      return {
        version: template.currentVersion,
        content: template.content,
        variables: template.variables,
        changedAt: template.updatedAt,
      };
    }

    return template.versions.find((v) => v.version === version) || null;
  }

  async getVersionHistory(
    projectSlug: string,
    name: string
  ): Promise<Array<{ version: number; changedAt: Date; changeNote?: string }>> {
    const template = await this.findByProjectAndName(projectSlug, name);
    if (!template) return [];

    const history = template.versions.map((v) => ({
      version: v.version,
      changedAt: v.changedAt,
      changeNote: v.changeNote,
    }));

    history.push({
      version: template.currentVersion,
      changedAt: template.updatedAt,
      changeNote: 'Current version',
    });

    return history.sort((a, b) => b.version - a.version);
  }

  private extractVariables(content: string): IPromptVariable[] {
    // Match {{variableName}} patterns
    const regex = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;
    const matches = new Set<string>();

    let match;
    while ((match = regex.exec(content)) !== null) {
      matches.add(match[1]);
    }

    return Array.from(matches).map((name) => ({
      name,
      required: false,
    }));
  }
}

export const promptTemplateService = new PromptTemplateService();
export default promptTemplateService;
