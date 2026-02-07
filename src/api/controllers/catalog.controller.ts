import { Request, Response, NextFunction } from 'express';
import {
  listTemplates,
  browseAllSkills,
  getSkillContent,
  getTechstackContent,
} from '../../mcp/tools/index.js';

/**
 * List templates - list all project templates with filtering
 */
export async function listTemplatesHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const category = (req.query.category as string) || 'all';
    const search = req.query.search as string | undefined;

    const result = await listTemplates({
      category: category as 'all' | 'backend' | 'frontend' | 'fullstack' | 'database' | 'devops' | 'mobile',
      search,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Browse all skills - list unique skills with filtering
 */
export async function browseSkillsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const category = (req.query.category as string) || 'all';
    const type = (req.query.type as string) || 'all';
    const search = req.query.search as string | undefined;

    const result = await browseAllSkills({
      category: category as 'all' | 'backend' | 'frontend' | 'database' | 'devops' | 'general' | 'testing' | 'security',
      type: type as 'all' | 'instructions' | 'code_template' | 'tool_definition',
      search,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Get skill content by name
 */
export async function getSkillContentHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const skillName = req.params.skillName as string;
    const projectSlug = typeof req.query.project === 'string' ? req.query.project : undefined;

    const result = await getSkillContent({
      skillName,
      projectSlug,
    });

    if (result.error) {
      res.status(404).json({ error: result.error });
      return;
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Get techstack content for a project
 */
export async function getTechstackContentHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const projectSlug = req.params.projectSlug as string;

    const result = await getTechstackContent({
      projectSlug,
    });

    if (result.error) {
      res.status(404).json({ error: result.error });
      return;
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
}
