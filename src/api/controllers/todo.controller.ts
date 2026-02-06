import { Request, Response, NextFunction } from 'express';
import { todoService } from '../../services/index.js';
import { ApiError } from '../middleware/error-handler.js';
import { TodoStatus, TodoPriority } from '../../types/todo.types.js';

export class TodoController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const todo = await todoService.create(slug, req.body);
      if (!todo) {
        throw ApiError.notFound(`Project "${slug}" not found`);
      }
      res.status(201).json(todo);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const status = req.query.status as TodoStatus | TodoStatus[] | undefined;
      const priority = req.query.priority as TodoPriority | TodoPriority[] | undefined;
      const tags = req.query.tags
        ? (req.query.tags as string).split(',').map((t) => t.trim())
        : undefined;
      const includeCompleted = req.query.includeCompleted === 'true';
      const parentId = req.query.parentId as string | undefined;

      const todos = await todoService.findByProject(slug, {
        status,
        priority,
        tags,
        includeCompleted,
        parentId: parentId === 'null' ? null : parentId,
      });
      res.json({ todos, count: todos.length });
    } catch (error) {
      next(error);
    }
  }

  async getPending(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const todos = await todoService.findPending(slug);
      res.json({ todos, count: todos.length });
    } catch (error) {
      next(error);
    }
  }

  async getCompleted(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const todos = await todoService.findCompleted(slug);
      res.json({ todos, count: todos.length });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const todo = await todoService.findById(id);
      if (!todo) {
        throw ApiError.notFound(`Todo "${id}" not found`);
      }
      res.json(todo);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const todo = await todoService.update(id, req.body);
      if (!todo) {
        throw ApiError.notFound(`Todo "${id}" not found`);
      }
      res.json(todo);
    } catch (error) {
      next(error);
    }
  }

  async markComplete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const changeNote = req.body.changeNote as string | undefined;
      const todo = await todoService.markComplete(id, changeNote);
      if (!todo) {
        throw ApiError.notFound(`Todo "${id}" not found`);
      }
      res.json(todo);
    } catch (error) {
      next(error);
    }
  }

  async markInProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const changeNote = req.body.changeNote as string | undefined;
      const todo = await todoService.markInProgress(id, changeNote);
      if (!todo) {
        throw ApiError.notFound(`Todo "${id}" not found`);
      }
      res.json(todo);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const deleted = await todoService.delete(id);
      if (!deleted) {
        throw ApiError.notFound(`Todo "${id}" not found`);
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async addQA(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const todo = await todoService.addQA(id, req.body);
      if (!todo) {
        throw ApiError.notFound(`Todo "${id}" not found`);
      }
      res.json(todo);
    } catch (error) {
      next(error);
    }
  }

  async getQAs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const qas = await todoService.getQAs(id);
      if (qas === null) {
        throw ApiError.notFound(`Todo "${id}" not found`);
      }
      res.json({ questionsAnswers: qas });
    } catch (error) {
      next(error);
    }
  }

  async getSubtasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const subtasks = await todoService.getSubtasks(id);
      res.json({ subtasks, count: subtasks.length });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slug = req.params.slug as string;
      const stats = await todoService.getStats(slug);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

export const todoController = new TodoController();
export default todoController;
