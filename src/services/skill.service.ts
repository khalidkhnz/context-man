import { Types } from 'mongoose';
import { Skill, ISkillModel } from '../models/skill.model.js';
import { Project } from '../models/project.model.js';
import {
  SkillType,
  CreateSkillInput,
  UpdateSkillInput,
  ISkillVersion,
} from '../types/skill.types.js';

export class SkillService {
  async create(projectSlug: string, input: CreateSkillInput): Promise<ISkillModel | null> {
    const project = await Project.findOne({ slug: projectSlug.toLowerCase() });
    if (!project) return null;

    const skill = new Skill({
      projectId: project._id,
      name: input.name,
      type: input.type,
      description: input.description || '',
      content: input.content,
      tags: input.tags || [],
      isActive: input.isActive ?? true,
      currentVersion: 1,
      versions: [
        {
          version: 1,
          content: input.content,
          changedAt: new Date(),
          changeNote: input.changeNote || 'Initial version',
        },
      ],
    });

    return skill.save();
  }

  async findByProjectAndName(projectSlug: string, name: string): Promise<ISkillModel | null> {
    const project = await Project.findOne({ slug: projectSlug.toLowerCase() });
    if (!project) return null;

    return Skill.findOne({ projectId: project._id, name });
  }

  async findAllByProject(
    projectSlug: string,
    options?: {
      type?: SkillType;
      tags?: string[];
      activeOnly?: boolean;
    }
  ): Promise<ISkillModel[]> {
    const project = await Project.findOne({ slug: projectSlug.toLowerCase() });
    if (!project) return [];

    const query: Record<string, unknown> = { projectId: project._id };

    if (options?.type) query.type = options.type;
    if (options?.tags?.length) query.tags = { $in: options.tags };
    if (options?.activeOnly) query.isActive = true;

    return Skill.find(query).sort({ name: 1 });
  }

  async findByProjectId(
    projectId: string | Types.ObjectId,
    options?: {
      type?: SkillType;
      activeOnly?: boolean;
    }
  ): Promise<ISkillModel[]> {
    const query: Record<string, unknown> = { projectId };

    if (options?.type) query.type = options.type;
    if (options?.activeOnly) query.isActive = true;

    return Skill.find(query).sort({ name: 1 });
  }

  async update(
    projectSlug: string,
    name: string,
    input: UpdateSkillInput
  ): Promise<ISkillModel | null> {
    const project = await Project.findOne({ slug: projectSlug.toLowerCase() });
    if (!project) return null;

    const skill = await Skill.findOne({ projectId: project._id, name });
    if (!skill) return null;

    // Save current version to history if content is changing
    if (input.content && input.content !== skill.content) {
      skill.versions.push({
        version: skill.currentVersion,
        content: skill.content,
        changedAt: new Date(),
        changeNote: input.changeNote,
      });
      skill.currentVersion += 1;
      skill.content = input.content;
    }

    if (input.description !== undefined) skill.description = input.description;
    if (input.tags !== undefined) skill.tags = input.tags;
    if (input.isActive !== undefined) skill.isActive = input.isActive;

    return skill.save();
  }

  async delete(projectSlug: string, name: string): Promise<boolean> {
    const project = await Project.findOne({ slug: projectSlug.toLowerCase() });
    if (!project) return false;

    const result = await Skill.deleteOne({ projectId: project._id, name });
    return result.deletedCount > 0;
  }

  async getVersion(
    projectSlug: string,
    name: string,
    version: number
  ): Promise<ISkillVersion | null> {
    const skill = await this.findByProjectAndName(projectSlug, name);
    if (!skill) return null;

    if (version === skill.currentVersion) {
      return {
        version: skill.currentVersion,
        content: skill.content,
        changedAt: skill.updatedAt,
      };
    }

    return skill.versions.find((v) => v.version === version) || null;
  }

  async getVersionHistory(
    projectSlug: string,
    name: string
  ): Promise<Array<{ version: number; changedAt: Date; changeNote?: string }>> {
    const skill = await this.findByProjectAndName(projectSlug, name);
    if (!skill) return [];

    const history = skill.versions.map((v) => ({
      version: v.version,
      changedAt: v.changedAt,
      changeNote: v.changeNote,
    }));

    history.push({
      version: skill.currentVersion,
      changedAt: skill.updatedAt,
      changeNote: 'Current version',
    });

    return history.sort((a, b) => b.version - a.version);
  }
}

export const skillService = new SkillService();
export default skillService;
