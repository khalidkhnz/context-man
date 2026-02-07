import { Types } from 'mongoose';
import { Project, IProjectDocument } from '../models/project.model.js';
import { ProjectDocument } from '../models/document.model.js';
import { Skill } from '../models/skill.model.js';
import { CodeSnippet } from '../models/code-snippet.model.js';
import { PromptTemplate } from '../models/prompt-template.model.js';
import { Todo } from '../models/todo.model.js';
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
      isTemplate: input.isTemplate ?? false,
      authors: input.username ? [input.username] : [],
      lastAuthor: input.username || '',
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
    isTemplate?: boolean;
  }): Promise<IProjectDocument[]> {
    const query: Record<string, unknown> = {};

    if (options?.tags?.length) {
      query.tags = { $in: options.tags };
    }

    if (options?.isTemplate !== undefined) {
      query.isTemplate = options.isTemplate ? true : { $ne: true };
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
    isTemplate?: boolean;
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

        const result: ProjectWithCounts = {
          _id: project._id.toString(),
          slug: project.slug,
          name: project.name,
          description: project.description,
          tags: project.tags,
          metadata: project.metadata,
          isTemplate: project.isTemplate,
          authors: project.authors || [],
          lastAuthor: project.lastAuthor || '',
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          documentCount,
          skillCount,
          snippetCount,
          promptCount,
        };

        // For user projects, include todo stats and document presence
        if (!project.isTemplate) {
          const docs = await ProjectDocument.find({ projectId: project._id }).select('type');
          const docTypes = new Set<string>(docs.map(d => d.type));
          result.documents = {
            PLAN: docTypes.has('PLAN'),
            SCOPE: docTypes.has('SCOPE'),
            TECHSTACK: docTypes.has('TECHSTACK'),
            TODO: docTypes.has('TODO'),
            CODING_GUIDELINES: docTypes.has('CODING_GUIDELINES'),
            UI_UX_STANDARDS: docTypes.has('UI_UX_STANDARDS'),
          };

          const todoAgg = await Todo.aggregate([
            { $match: { projectId: project._id } },
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
                completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
              },
            },
          ]);

          const stats = todoAgg[0] || { total: 0, pending: 0, inProgress: 0, completed: 0 };
          result.todoStats = {
            total: stats.total,
            pending: stats.pending,
            inProgress: stats.inProgress,
            completed: stats.completed,
            completionRate: stats.total > 0
              ? `${Math.round((stats.completed / stats.total) * 100)}%`
              : '0%',
          };
        }

        return result;
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
    if (input.isTemplate !== undefined) updateData.isTemplate = input.isTemplate;

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

  async count(tags?: string[], isTemplate?: boolean): Promise<number> {
    const query: Record<string, unknown> = {};
    if (tags?.length) {
      query.tags = { $in: tags };
    }
    if (isTemplate !== undefined) {
      query.isTemplate = isTemplate ? true : { $ne: true };
    }
    return Project.countDocuments(query);
  }

  async trackAuthor(slug: string, username: string): Promise<void> {
    if (!username) return;
    await Project.findOneAndUpdate(
      { slug: slug.toLowerCase() },
      { $addToSet: { authors: username }, $set: { lastAuthor: username } }
    );
  }

  async exists(slug: string): Promise<boolean> {
    const count = await Project.countDocuments({ slug: slug.toLowerCase() });
    return count > 0;
  }
}

export const projectService = new ProjectService();
export default projectService;
