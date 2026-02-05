import { Router } from 'express';
import { searchController } from '../controllers/search.controller.js';

const router = Router();

// GET /api/search - Global search across all projects
router.get('/', (req, res, next) => searchController.globalSearch(req, res, next));

// GET /api/projects/:slug/search - Search within a project
export const projectSearchRouter = Router({ mergeParams: true });
projectSearchRouter.get('/', (req, res, next) => searchController.search(req, res, next));

export default router;
