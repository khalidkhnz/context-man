import { Router } from 'express';
import { codeSnippetController } from '../controllers/code-snippet.controller.js';
import { validateBody } from '../middleware/validate-request.js';
import {
  CreateCodeSnippetSchema,
  UpdateCodeSnippetSchema,
} from '../../types/code-snippet.types.js';

const router = Router({ mergeParams: true });

// POST /api/projects/:slug/snippets - Create a snippet
router.post('/', validateBody(CreateCodeSnippetSchema), (req, res, next) =>
  codeSnippetController.create(req, res, next)
);

// GET /api/projects/:slug/snippets - List all snippets
router.get('/', (req, res, next) => codeSnippetController.list(req, res, next));

// GET /api/projects/:slug/snippets/:name - Get snippet by name
router.get('/:name', (req, res, next) => codeSnippetController.getByName(req, res, next));

// PUT /api/projects/:slug/snippets/:name - Update snippet
router.put('/:name', validateBody(UpdateCodeSnippetSchema), (req, res, next) =>
  codeSnippetController.update(req, res, next)
);

// DELETE /api/projects/:slug/snippets/:name - Delete snippet
router.delete('/:name', (req, res, next) => codeSnippetController.delete(req, res, next));

// GET /api/projects/:slug/snippets/:name/versions - Get version history
router.get('/:name/versions', (req, res, next) =>
  codeSnippetController.getVersions(req, res, next)
);

export default router;
