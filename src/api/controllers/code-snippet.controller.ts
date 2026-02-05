import { Request, Response, NextFunction } from 'express';
import { codeSnippetService } from '../../services/index.js';
import { ApiError } from '../middleware/error-handler.js';

export class CodeSnippetController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const existing = await codeSnippetService.findByProjectAndName(slug, req.body.name);
      if (existing) {
        throw ApiError.conflict(`Snippet "${req.body.name}" already exists for this project`);
      }

      const snippet = await codeSnippetService.create(slug, req.body);
      if (!snippet) {
        throw ApiError.notFound(`Project "${slug}" not found`);
      }
      res.status(201).json(snippet);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const language = req.query.language as string | undefined;
      const tags = req.query.tags
        ? (req.query.tags as string).split(',').map((t) => t.trim())
        : undefined;

      const snippets = await codeSnippetService.findAllByProject(slug, {
        language,
        tags,
      });
      res.json({ snippets });
    } catch (error) {
      next(error);
    }
  }

  async getByName(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const name = req.params.name as string;
      const snippet = await codeSnippetService.findByProjectAndName(slug, name);
      if (!snippet) {
        throw ApiError.notFound(`Snippet "${name}" not found for project "${slug}"`);
      }
      res.json(snippet);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const name = req.params.name as string;
      const snippet = await codeSnippetService.update(slug, name, req.body);
      if (!snippet) {
        throw ApiError.notFound(`Snippet "${name}" not found for project "${slug}"`);
      }
      res.json(snippet);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const name = req.params.name as string;
      const deleted = await codeSnippetService.delete(slug, name);
      if (!deleted) {
        throw ApiError.notFound(`Snippet "${name}" not found for project "${slug}"`);
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
      const versions = await codeSnippetService.getVersionHistory(slug, name);
      if (versions.length === 0) {
        throw ApiError.notFound(`Snippet "${name}" not found for project "${slug}"`);
      }
      res.json({ versions });
    } catch (error) {
      next(error);
    }
  }
}

export const codeSnippetController = new CodeSnippetController();
export default codeSnippetController;
