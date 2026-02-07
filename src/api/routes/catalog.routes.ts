import { Router } from 'express';
import {
  listTemplatesHandler,
  browseSkillsHandler,
  getSkillContentHandler,
  getTechstackContentHandler,
} from '../controllers/catalog.controller.js';

const router = Router();

/**
 * GET /api/catalog/projects
 * Browse all project templates with optional filtering
 * Query params:
 *   - category: 'all' | 'backend' | 'frontend' | 'fullstack' | 'database' | 'devops' | 'mobile'
 *   - search: string to filter by name, description, or tags
 */
router.get('/projects', listTemplatesHandler);

/**
 * GET /api/catalog/skills
 * Browse all unique skills with optional filtering
 * Query params:
 *   - category: 'all' | 'backend' | 'frontend' | 'database' | 'devops' | 'general' | 'testing' | 'security'
 *   - type: 'all' | 'instructions' | 'code_template' | 'tool_definition'
 *   - search: string to filter by name, description, or tags
 */
router.get('/skills', browseSkillsHandler);

/**
 * GET /api/catalog/skills/:skillName
 * Get full content of a specific skill
 * Query params:
 *   - project: optional project slug to get skill from
 */
router.get('/skills/:skillName', getSkillContentHandler);

/**
 * GET /api/catalog/techstacks/:projectSlug
 * Get full techstack documentation for a project
 */
router.get('/techstacks/:projectSlug', getTechstackContentHandler);

export default router;
