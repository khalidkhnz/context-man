import { Router } from 'express';
import { todoController } from '../controllers/todo.controller.js';

const router = Router();

// Project-scoped todo routes
router.post('/projects/:slug/todos', (req, res, next) =>
  todoController.create(req, res, next)
);

router.get('/projects/:slug/todos', (req, res, next) =>
  todoController.list(req, res, next)
);

router.get('/projects/:slug/todos/pending', (req, res, next) =>
  todoController.getPending(req, res, next)
);

router.get('/projects/:slug/todos/completed', (req, res, next) =>
  todoController.getCompleted(req, res, next)
);

router.get('/projects/:slug/todos/stats', (req, res, next) =>
  todoController.getStats(req, res, next)
);

// Individual todo routes (by ID since todos have ObjectId)
router.get('/todos/:id', (req, res, next) =>
  todoController.getById(req, res, next)
);

router.put('/todos/:id', (req, res, next) =>
  todoController.update(req, res, next)
);

router.delete('/todos/:id', (req, res, next) =>
  todoController.delete(req, res, next)
);

router.post('/todos/:id/complete', (req, res, next) =>
  todoController.markComplete(req, res, next)
);

router.post('/todos/:id/start', (req, res, next) =>
  todoController.markInProgress(req, res, next)
);

router.post('/todos/:id/qa', (req, res, next) =>
  todoController.addQA(req, res, next)
);

router.get('/todos/:id/qa', (req, res, next) =>
  todoController.getQAs(req, res, next)
);

router.get('/todos/:id/subtasks', (req, res, next) =>
  todoController.getSubtasks(req, res, next)
);

export default router;
