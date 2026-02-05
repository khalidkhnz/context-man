import { Request, Response, NextFunction } from 'express';
import { searchService } from '../../services/index.js';
import { SearchQueryInput } from '../../types/search.types.js';

export class SearchController {
  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query.q as string;
      if (!query) {
        res.status(400).json({
          error: {
            message: 'Query parameter "q" is required',
            statusCode: 400,
          },
        });
        return;
      }

      const slug = req.params.slug as string;
      const options: SearchQueryInput = {
        query,
        projectSlug: slug,
        types: req.query.types
          ? ((req.query.types as string).split(',') as SearchQueryInput['types'])
          : undefined,
        tags: req.query.tags
          ? (req.query.tags as string).split(',').map((t) => t.trim())
          : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
        offset: req.query.offset ? parseInt(req.query.offset as string, 10) : 0,
      };

      const results = await searchService.search(options);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }

  async globalSearch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query.q as string;
      if (!query) {
        res.status(400).json({
          error: {
            message: 'Query parameter "q" is required',
            statusCode: 400,
          },
        });
        return;
      }

      const options: SearchQueryInput = {
        query,
        types: req.query.types
          ? ((req.query.types as string).split(',') as SearchQueryInput['types'])
          : undefined,
        tags: req.query.tags
          ? (req.query.tags as string).split(',').map((t) => t.trim())
          : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
        offset: req.query.offset ? parseInt(req.query.offset as string, 10) : 0,
      };

      const results = await searchService.search(options);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }
}

export const searchController = new SearchController();
export default searchController;
