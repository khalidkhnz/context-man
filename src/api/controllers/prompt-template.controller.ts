import { Request, Response, NextFunction } from 'express';
import { promptTemplateService } from '../../services/index.js';
import { ApiError } from '../middleware/error-handler.js';

export class PromptTemplateController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const existing = await promptTemplateService.findByProjectAndName(slug, req.body.name);
      if (existing) {
        throw ApiError.conflict(
          `Prompt template "${req.body.name}" already exists for this project`
        );
      }

      const template = await promptTemplateService.create(slug, req.body);
      if (!template) {
        throw ApiError.notFound(`Project "${slug}" not found`);
      }
      res.status(201).json(template);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const category = req.query.category as string | undefined;
      const tags = req.query.tags
        ? (req.query.tags as string).split(',').map((t) => t.trim())
        : undefined;

      const prompts = await promptTemplateService.findAllByProject(slug, {
        category,
        tags,
      });
      res.json({ prompts });
    } catch (error) {
      next(error);
    }
  }

  async getByName(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const name = req.params.name as string;
      const template = await promptTemplateService.findByProjectAndName(slug, name);
      if (!template) {
        throw ApiError.notFound(`Prompt template "${name}" not found for project "${slug}"`);
      }
      res.json(template);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const name = req.params.name as string;
      const template = await promptTemplateService.update(slug, name, req.body);
      if (!template) {
        throw ApiError.notFound(`Prompt template "${name}" not found for project "${slug}"`);
      }
      res.json(template);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const name = req.params.name as string;
      const deleted = await promptTemplateService.delete(slug, name);
      if (!deleted) {
        throw ApiError.notFound(`Prompt template "${name}" not found for project "${slug}"`);
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async render(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const name = req.params.name as string;
      const rendered = await promptTemplateService.render(slug, name, req.body.variables || {});
      if (rendered === null) {
        throw ApiError.notFound(`Prompt template "${name}" not found for project "${slug}"`);
      }
      res.json({ rendered });
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('Missing required variable')) {
        next(ApiError.badRequest(error.message));
        return;
      }
      next(error);
    }
  }

  async getVersions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const name = req.params.name as string;
      const versions = await promptTemplateService.getVersionHistory(slug, name);
      if (versions.length === 0) {
        throw ApiError.notFound(`Prompt template "${name}" not found for project "${slug}"`);
      }
      res.json({ versions });
    } catch (error) {
      next(error);
    }
  }
}

export const promptTemplateController = new PromptTemplateController();
export default promptTemplateController;
