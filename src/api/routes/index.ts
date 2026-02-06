import { Router } from 'express';
import projectRoutes from './project.routes.js';
import documentRoutes from './document.routes.js';
import skillRoutes from './skill.routes.js';
import codeSnippetRoutes from './code-snippet.routes.js';
import promptTemplateRoutes from './prompt-template.routes.js';
import searchRoutes, { projectSearchRouter } from './search.routes.js';
import todoRoutes from './todo.routes.js';
import catalogRoutes from './catalog.routes.js';

const router = Router();

// Catalog browsing (techstacks, skills)
router.use('/catalog', catalogRoutes);

// Global search
router.use('/search', searchRoutes);

// Project routes
router.use('/projects', projectRoutes);

// Nested project routes
router.use('/projects/:slug/documents', documentRoutes);
router.use('/projects/:slug/skills', skillRoutes);
router.use('/projects/:slug/snippets', codeSnippetRoutes);
router.use('/projects/:slug/prompts', promptTemplateRoutes);
router.use('/projects/:slug/search', projectSearchRouter);

// Todo routes (has both project-scoped and individual routes)
router.use('/', todoRoutes);

export default router;
