import { Types } from 'mongoose';
import { Project, IProjectDocument } from '../models/project.model.js';
import { ProjectDocument } from '../models/document.model.js';
import { Skill } from '../models/skill.model.js';
import { CodeSnippet } from '../models/code-snippet.model.js';
import { PromptTemplate } from '../models/prompt-template.model.js';
import {
  CreateProjectInput,
  UpdateProjectInput,
  ProjectWithCounts,
} from '../types/project.types.js';

export class ProjectService {
  async create(input: CreateProjectInput): Promise<IProjectDocument> {
    const project = new Project({
      slug: input.slug.toLowerCase(),
      name: input.name,
      description: input.description || '',
      tags: input.tags || [],
      metadata: input.metadata || {},
    });

    return project.save();
  }

  async findBySlug(slug: string): Promise<IProjectDocument | null> {
    return Project.findOne({ slug: slug.toLowerCase() });
  }

  async findById(id: string | Types.ObjectId): Promise<IProjectDocument | null> {
    return Project.findById(id);
  }

  async findAll(options?: {
    tags?: string[];
    limit?: number;
    offset?: number;
  }): Promise<IProjectDocument[]> {
    const query: Record<string, unknown> = {};

    if (options?.tags?.length) {
      query.tags = { $in: options.tags };
    }

    return Project.find(query)
      .sort({ updatedAt: -1 })
      .skip(options?.offset || 0)
      .limit(options?.limit || 50);
  }

  async findAllWithCounts(options?: {
    tags?: string[];
    limit?: number;
    offset?: number;
  }): Promise<ProjectWithCounts[]> {
    const projects = await this.findAll(options);

    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const [documentCount, skillCount, snippetCount, promptCount] = await Promise.all([
          ProjectDocument.countDocuments({ projectId: project._id }),
          Skill.countDocuments({ projectId: project._id }),
          CodeSnippet.countDocuments({ projectId: project._id }),
          PromptTemplate.countDocuments({ projectId: project._id }),
        ]);

        return {
          _id: project._id.toString(),
          slug: project.slug,
          name: project.name,
          description: project.description,
          tags: project.tags,
          metadata: project.metadata,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          documentCount,
          skillCount,
          snippetCount,
          promptCount,
        };
      })
    );

    return projectsWithCounts;
  }

  async update(slug: string, input: UpdateProjectInput): Promise<IProjectDocument | null> {
    const updateData: Record<string, unknown> = {};

    if (input.name !== undefined) updateData.name = input.name;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.tags !== undefined) updateData.tags = input.tags;
    if (input.metadata !== undefined) updateData.metadata = input.metadata;

    return Project.findOneAndUpdate({ slug: slug.toLowerCase() }, updateData, { new: true });
  }

  async delete(slug: string): Promise<boolean> {
    const project = await this.findBySlug(slug);
    if (!project) return false;

    // Delete all related documents
    await Promise.all([
      ProjectDocument.deleteMany({ projectId: project._id }),
      Skill.deleteMany({ projectId: project._id }),
      CodeSnippet.deleteMany({ projectId: project._id }),
      PromptTemplate.deleteMany({ projectId: project._id }),
    ]);

    await Project.deleteOne({ _id: project._id });
    return true;
  }

  async count(tags?: string[]): Promise<number> {
    const query: Record<string, unknown> = {};
    if (tags?.length) {
      query.tags = { $in: tags };
    }
    return Project.countDocuments(query);
  }

  async exists(slug: string): Promise<boolean> {
    const count = await Project.countDocuments({ slug: slug.toLowerCase() });
    return count > 0;
  }
}

export const projectService = new ProjectService();
export default projectService;
