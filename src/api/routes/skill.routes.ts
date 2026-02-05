import { Router } from 'express';
import { skillController } from '../controllers/skill.controller.js';
import { validateBody } from '../middleware/validate-request.js';
import { CreateSkillSchema, UpdateSkillSchema } from '../../types/skill.types.js';

const router = Router({ mergeParams: true });

// POST /api/projects/:slug/skills - Create a skill
router.post('/', validateBody(CreateSkillSchema), (req, res, next) =>
  skillController.create(req, res, next)
);

// GET /api/projects/:slug/skills - List all skills
router.get('/', (req, res, next) => skillController.list(req, res, next));

// GET /api/projects/:slug/skills/:name - Get skill by name
router.get('/:name', (req, res, next) => skillController.getByName(req, res, next));

// PUT /api/projects/:slug/skills/:name - Update skill
router.put('/:name', validateBody(UpdateSkillSchema), (req, res, next) =>
  skillController.update(req, res, next)
);

// DELETE /api/projects/:slug/skills/:name - Delete skill
router.delete('/:name', (req, res, next) => skillController.delete(req, res, next));

// GET /api/projects/:slug/skills/:name/versions - Get version history
router.get('/:name/versions', (req, res, next) => skillController.getVersions(req, res, next));

export default router;
