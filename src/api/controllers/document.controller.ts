import { Request, Response, NextFunction } from 'express';
import { documentService } from '../../services/index.js';
import { DocumentType } from '../../types/document.types.js';
import { ApiError } from '../middleware/error-handler.js';

export class DocumentController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const existing = await documentService.findByProjectAndType(slug, req.body.type);
      if (existing) {
        throw ApiError.conflict(
          `Document of type "${req.body.type}" already exists for this project`
        );
      }

      const doc = await documentService.create(slug, req.body);
      if (!doc) {
        throw ApiError.notFound(`Project "${slug}" not found`);
      }
      res.status(201).json(doc);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const documents = await documentService.findAllByProject(slug);
      res.json({ documents });
    } catch (error) {
      next(error);
    }
  }

  async getByType(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const typeParam = req.params.type as string;
      const type = typeParam.toUpperCase() as DocumentType;
      if (!Object.values(DocumentType).includes(type)) {
        throw ApiError.badRequest(`Invalid document type: ${typeParam}`);
      }

      const doc = await documentService.findByProjectAndType(slug, type);
      if (!doc) {
        throw ApiError.notFound(`Document of type "${type}" not found for project "${slug}"`);
      }
      res.json(doc);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const typeParam = req.params.type as string;
      const type = typeParam.toUpperCase() as DocumentType;
      if (!Object.values(DocumentType).includes(type)) {
        throw ApiError.badRequest(`Invalid document type: ${typeParam}`);
      }

      const doc = await documentService.update(slug, type, req.body);
      if (!doc) {
        throw ApiError.notFound(`Document of type "${type}" not found for project "${slug}"`);
      }
      res.json(doc);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const typeParam = req.params.type as string;
      const type = typeParam.toUpperCase() as DocumentType;
      if (!Object.values(DocumentType).includes(type)) {
        throw ApiError.badRequest(`Invalid document type: ${typeParam}`);
      }

      const deleted = await documentService.delete(slug, type);
      if (!deleted) {
        throw ApiError.notFound(`Document of type "${type}" not found for project "${slug}"`);
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getVersions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const typeParam = req.params.type as string;
      const type = typeParam.toUpperCase() as DocumentType;
      if (!Object.values(DocumentType).includes(type)) {
        throw ApiError.badRequest(`Invalid document type: ${typeParam}`);
      }

      const versions = await documentService.getVersionHistory(slug, type);
      if (versions.length === 0) {
        throw ApiError.notFound(`Document of type "${type}" not found for project "${slug}"`);
      }
      res.json({ versions });
    } catch (error) {
      next(error);
    }
  }

  async getVersion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const typeParam = req.params.type as string;
      const type = typeParam.toUpperCase() as DocumentType;
      if (!Object.values(DocumentType).includes(type)) {
        throw ApiError.badRequest(`Invalid document type: ${typeParam}`);
      }

      const version = parseInt(req.params.version as string, 10);
      if (isNaN(version) || version < 1) {
        throw ApiError.badRequest('Invalid version number');
      }

      const versionData = await documentService.getVersion(slug, type, version);
      if (!versionData) {
        throw ApiError.notFound(`Version ${version} not found`);
      }
      res.json(versionData);
    } catch (error) {
      next(error);
    }
  }
}

export const documentController = new DocumentController();
export default documentController;
