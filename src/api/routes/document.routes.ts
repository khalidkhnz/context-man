import { Router } from 'express';
import { documentController } from '../controllers/document.controller.js';
import { validateBody } from '../middleware/validate-request.js';
import { CreateDocumentSchema, UpdateDocumentSchema } from '../../types/document.types.js';

const router = Router({ mergeParams: true });

// POST /api/projects/:slug/documents - Create a document
router.post('/', validateBody(CreateDocumentSchema), (req, res, next) =>
  documentController.create(req, res, next)
);

// GET /api/projects/:slug/documents - List all documents
router.get('/', (req, res, next) => documentController.list(req, res, next));

// GET /api/projects/:slug/documents/:type - Get document by type
router.get('/:type', (req, res, next) => documentController.getByType(req, res, next));

// PUT /api/projects/:slug/documents/:type - Update document
router.put('/:type', validateBody(UpdateDocumentSchema), (req, res, next) =>
  documentController.update(req, res, next)
);

// DELETE /api/projects/:slug/documents/:type - Delete document
router.delete('/:type', (req, res, next) => documentController.delete(req, res, next));

// GET /api/projects/:slug/documents/:type/versions - Get version history
router.get('/:type/versions', (req, res, next) => documentController.getVersions(req, res, next));

// GET /api/projects/:slug/documents/:type/versions/:version - Get specific version
router.get('/:type/versions/:version', (req, res, next) =>
  documentController.getVersion(req, res, next)
);

export default router;
