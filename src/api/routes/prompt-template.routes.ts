import { Router } from 'express';
import { promptTemplateController } from '../controllers/prompt-template.controller.js';
import { validateBody } from '../middleware/validate-request.js';
import {
  CreatePromptTemplateSchema,
  UpdatePromptTemplateSchema,
  RenderPromptSchema,
} from '../../types/prompt-template.types.js';

const router = Router({ mergeParams: true });

// POST /api/projects/:slug/prompts - Create a prompt template
router.post('/', validateBody(CreatePromptTemplateSchema), (req, res, next) =>
  promptTemplateController.create(req, res, next)
);

// GET /api/projects/:slug/prompts - List all prompt templates
router.get('/', (req, res, next) => promptTemplateController.list(req, res, next));

// GET /api/projects/:slug/prompts/:name - Get prompt template by name
router.get('/:name', (req, res, next) => promptTemplateController.getByName(req, res, next));

// PUT /api/projects/:slug/prompts/:name - Update prompt template
router.put('/:name', validateBody(UpdatePromptTemplateSchema), (req, res, next) =>
  promptTemplateController.update(req, res, next)
);

// DELETE /api/projects/:slug/prompts/:name - Delete prompt template
router.delete('/:name', (req, res, next) => promptTemplateController.delete(req, res, next));

// POST /api/projects/:slug/prompts/:name/render - Render template with variables
router.post('/:name/render', validateBody(RenderPromptSchema), (req, res, next) =>
  promptTemplateController.render(req, res, next)
);

// GET /api/projects/:slug/prompts/:name/versions - Get version history
router.get('/:name/versions', (req, res, next) =>
  promptTemplateController.getVersions(req, res, next)
);

export default router;
