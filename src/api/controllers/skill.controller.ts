import { Request, Response, NextFunction } from 'express';
import { skillService } from '../../services/index.js';
import { SkillType } from '../../types/skill.types.js';
import { ApiError } from '../middleware/error-handler.js';

export class SkillController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const existing = await skillService.findByProjectAndName(slug, req.body.name);
      if (existing) {
        throw ApiError.conflict(`Skill "${req.body.name}" already exists for this project`);
      }

      const skill = await skillService.create(slug, req.body);
      if (!skill) {
        throw ApiError.notFound(`Project "${slug}" not found`);
      }
      res.status(201).json(skill);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const type = req.query.type as SkillType | undefined;
      const tags = req.query.tags
        ? (req.query.tags as string).split(',').map((t) => t.trim())
        : undefined;
      const activeOnly = req.query.activeOnly === 'true';

      const skills = await skillService.findAllByProject(slug, {
        type,
        tags,
        activeOnly,
      });
      res.json({ skills });
    } catch (error) {
      next(error);
    }
  }

  async getByName(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const name = req.params.name as string;
      const skill = await skillService.findByProjectAndName(slug, name);
      if (!skill) {
        throw ApiError.notFound(`Skill "${name}" not found for project "${slug}"`);
      }
      res.json(skill);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const name = req.params.name as string;
      const skill = await skillService.update(slug, name, req.body);
      if (!skill) {
        throw ApiError.notFound(`Skill "${name}" not found for project "${slug}"`);
      }
      res.json(skill);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const name = req.params.name as string;
      const deleted = await skillService.delete(slug, name);
      if (!deleted) {
        throw ApiError.notFound(`Skill "${name}" not found for project "${slug}"`);
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getVersions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const name = req.params.name as string;
      const versions = await skillService.getVersionHistory(slug, name);
      if (versions.length === 0) {
        throw ApiError.notFound(`Skill "${name}" not found for project "${slug}"`);
      }
      res.json({ versions });
    } catch (error) {
      next(error);
    }
  }
}

export const skillController = new SkillController();
export default skillController;
