import { Router } from 'express';
import { projectController } from '../controllers/project.controller.js';
import { validateBody } from '../middleware/validate-request.js';
import { CreateProjectSchema, UpdateProjectSchema } from '../../types/project.types.js';

const router = Router();

// POST /api/projects - Create a new project
router.post('/', validateBody(CreateProjectSchema), (req, res, next) =>
  projectController.create(req, res, next)
);

// GET /api/projects - List all projects
router.get('/', (req, res, next) => projectController.list(req, res, next));

// GET /api/projects/:slug - Get project by slug
router.get('/:slug', (req, res, next) => projectController.getBySlug(req, res, next));

// PUT /api/projects/:slug - Update project
router.put('/:slug', validateBody(UpdateProjectSchema), (req, res, next) =>
  projectController.update(req, res, next)
);

// DELETE /api/projects/:slug - Delete project
router.delete('/:slug', (req, res, next) => projectController.delete(req, res, next));

// GET /api/projects/:slug/context - Get full project context
router.get('/:slug/context', (req, res, next) => projectController.getContext(req, res, next));

export default router;
