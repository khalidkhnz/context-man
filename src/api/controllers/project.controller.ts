import { Request, Response, NextFunction } from 'express';
import { projectService, documentService, skillService, codeSnippetService, promptTemplateService } from '../../services/index.js';
import { ApiError } from '../middleware/error-handler.js';

export class ProjectController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const exists = await projectService.exists(req.body.slug);
      if (exists) {
        throw ApiError.conflict(`Project with slug "${req.body.slug}" already exists`);
      }

      const project = await projectService.create(req.body);
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tags = req.query.tags
        ? (req.query.tags as string).split(',').map((t) => t.trim())
        : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;
      const isTemplate = req.query.isTemplate !== undefined
        ? req.query.isTemplate === 'true'
        : undefined;

      const projects = await projectService.findAllWithCounts({ tags, limit, offset, isTemplate });
      const total = await projectService.count(tags, isTemplate);

      res.json({
        projects,
        total,
        limit,
        offset,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const project = await projectService.findBySlug(slug);
      if (!project) {
        throw ApiError.notFound(`Project "${slug}" not found`);
      }
      res.json(project);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const project = await projectService.update(slug, req.body);
      if (!project) {
        throw ApiError.notFound(`Project "${slug}" not found`);
      }
      res.json(project);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const deleted = await projectService.delete(slug);
      if (!deleted) {
        throw ApiError.notFound(`Project "${slug}" not found`);
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getContext(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const project = await projectService.findBySlug(slug);
      if (!project) {
        throw ApiError.notFound(`Project "${slug}" not found`);
      }

      const includeDocuments = req.query.includeDocuments !== 'false';
      const includeSkills = req.query.includeSkills !== 'false';
      const includeSnippets = req.query.includeSnippets === 'true';
      const includePrompts = req.query.includePrompts === 'true';

      const context: Record<string, unknown> = {
        project: {
          slug: project.slug,
          name: project.name,
          description: project.description,
          tags: project.tags,
        },
      };

      const promises: Promise<unknown>[] = [];

      if (includeDocuments) {
        promises.push(
          documentService.findByProjectId(project._id).then((docs) => {
            context.documents = docs.map((d) => ({
              type: d.type,
              title: d.title,
              content: d.content,
              version: d.currentVersion,
              updatedAt: d.updatedAt,
            }));
          })
        );
      }

      if (includeSkills) {
        promises.push(
          skillService.findByProjectId(project._id, { activeOnly: true }).then((skills) => {
            context.skills = skills.map((s) => ({
              name: s.name,
              type: s.type,
              description: s.description,
              content: s.content,
            }));
          })
        );
      }

      if (includeSnippets) {
        promises.push(
          codeSnippetService.findByProjectId(project._id).then((snippets) => {
            context.snippets = snippets.map((s) => ({
              name: s.name,
              language: s.language,
              description: s.description,
              code: s.code,
            }));
          })
        );
      }

      if (includePrompts) {
        promises.push(
          promptTemplateService.findByProjectId(project._id).then((prompts) => {
            context.prompts = prompts.map((p) => ({
              name: p.name,
              description: p.description,
              content: p.content,
              variables: p.variables,
            }));
          })
        );
      }

      await Promise.all(promises);

      res.json(context);
    } catch (error) {
      next(error);
    }
  }
}

export const projectController = new ProjectController();
export default projectController;
