import { Types } from 'mongoose';
import { Todo, ITodoModel } from '../models/todo.model.js';
import { Project } from '../models/project.model.js';
import {
  CreateTodoInput,
  UpdateTodoInput,
  AddTodoQAInput,
  TodoFilterOptions,
} from '../types/todo.types.js';

export class TodoService {
  async create(
    projectSlug: string,
    input: CreateTodoInput
  ): Promise<ITodoModel | null> {
    const project = await Project.findOne({ slug: projectSlug.toLowerCase() });
    if (!project) return null;

    const todo = new Todo({
      projectId: project._id,
      title: input.title,
      description: input.description || '',
      status: input.status || 'pending',
      priority: input.priority || 'medium',
      tags: input.tags || [],
      dueDate: input.dueDate,
      parentId: input.parentId ? new Types.ObjectId(input.parentId) : undefined,
      questionsAnswers: input.questionsAnswers || [],
      currentVersion: 1,
      versions: [
        {
          version: 1,
          title: input.title,
          description: input.description || '',
          status: input.status || 'pending',
          changedAt: new Date(),
          changeNote: input.changeNote || 'Initial creation',
          author: input.username,
        },
      ],
      authors: input.username ? [input.username] : [],
      lastAuthor: input.username || '',
    });

    const saved = await todo.save();

    // Track author at project level
    if (input.username) {
      await Project.findOneAndUpdate(
        { _id: project._id },
        { $addToSet: { authors: input.username }, $set: { lastAuthor: input.username } }
      );
    }

    return saved;
  }

  async findById(id: string): Promise<ITodoModel | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return Todo.findById(id);
  }

  async findByProject(
    projectSlug: string,
    options?: TodoFilterOptions
  ): Promise<ITodoModel[]> {
    const project = await Project.findOne({ slug: projectSlug.toLowerCase() });
    if (!project) return [];

    const query: Record<string, unknown> = { projectId: project._id };

    // Status filter
    if (options?.status) {
      if (Array.isArray(options.status)) {
        query.status = { $in: options.status };
      } else {
        query.status = options.status;
      }
    } else if (!options?.includeCompleted) {
      // By default, exclude completed and cancelled
      query.status = { $nin: ['completed', 'cancelled'] };
    }

    // Priority filter
    if (options?.priority) {
      if (Array.isArray(options.priority)) {
        query.priority = { $in: options.priority };
      } else {
        query.priority = options.priority;
      }
    }

    // Tags filter
    if (options?.tags?.length) {
      query.tags = { $in: options.tags };
    }

    // Parent filter (null means root todos only)
    if (options?.parentId === null) {
      query.parentId = { $exists: false };
    } else if (options?.parentId) {
      query.parentId = new Types.ObjectId(options.parentId);
    }

    return Todo.find(query).sort({ priority: -1, createdAt: -1 });
  }

  async findPending(projectSlug: string): Promise<ITodoModel[]> {
    return this.findByProject(projectSlug, {
      status: ['pending', 'in_progress'],
    });
  }

  async findCompleted(projectSlug: string): Promise<ITodoModel[]> {
    return this.findByProject(projectSlug, {
      status: 'completed',
      includeCompleted: true,
    });
  }

  async update(
    id: string,
    input: UpdateTodoInput
  ): Promise<ITodoModel | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const todo = await Todo.findById(id);
    if (!todo) return null;

    // Check if we need to save version history
    const hasChanges =
      (input.title && input.title !== todo.title) ||
      (input.description !== undefined && input.description !== todo.description) ||
      (input.status && input.status !== todo.status);

    if (hasChanges) {
      todo.versions.push({
        version: todo.currentVersion,
        title: todo.title,
        description: todo.description,
        status: todo.status,
        changedAt: new Date(),
        changeNote: input.changeNote,
        author: input.username,
      });
      todo.currentVersion += 1;
    }

    // Apply updates
    if (input.title) todo.title = input.title;
    if (input.description !== undefined) todo.description = input.description;
    if (input.priority) todo.priority = input.priority;
    if (input.tags) todo.tags = input.tags;
    if (input.dueDate !== undefined) todo.dueDate = input.dueDate;

    // Handle status change
    if (input.status) {
      todo.status = input.status;
      if (input.status === 'completed') {
        todo.completedAt = new Date();
      } else {
        todo.completedAt = undefined;
      }
    }

    // Track author on todo
    if (input.username) {
      if (!todo.authors.includes(input.username)) {
        todo.authors.push(input.username);
      }
      todo.lastAuthor = input.username;
    }

    const saved = await todo.save();

    // Track author at project level
    if (input.username) {
      await Project.findOneAndUpdate(
        { _id: todo.projectId },
        { $addToSet: { authors: input.username }, $set: { lastAuthor: input.username } }
      );
    }

    return saved;
  }

  async markComplete(
    id: string,
    changeNote?: string
  ): Promise<ITodoModel | null> {
    return this.update(id, {
      status: 'completed',
      changeNote: changeNote || 'Marked as completed',
    });
  }

  async markInProgress(
    id: string,
    changeNote?: string
  ): Promise<ITodoModel | null> {
    return this.update(id, {
      status: 'in_progress',
      changeNote: changeNote || 'Started work',
    });
  }

  async addQA(
    id: string,
    qa: AddTodoQAInput
  ): Promise<ITodoModel | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const todo = await Todo.findById(id);
    if (!todo) return null;

    todo.questionsAnswers.push({
      question: qa.question,
      answer: qa.answer,
      askedAt: new Date(),
      context: qa.context,
    });

    // Track author on todo
    if (qa.username) {
      if (!todo.authors.includes(qa.username)) {
        todo.authors.push(qa.username);
      }
      todo.lastAuthor = qa.username;
    }

    const saved = await todo.save();

    // Track author at project level
    if (qa.username) {
      await Project.findOneAndUpdate(
        { _id: todo.projectId },
        { $addToSet: { authors: qa.username }, $set: { lastAuthor: qa.username } }
      );
    }

    return saved;
  }

  async getQAs(id: string): Promise<{ question: string; answer: string; askedAt: Date; context?: string }[] | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const todo = await Todo.findById(id);
    if (!todo) return null;

    return todo.questionsAnswers;
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;

    const result = await Todo.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async getSubtasks(parentId: string): Promise<ITodoModel[]> {
    if (!Types.ObjectId.isValid(parentId)) return [];
    return Todo.find({ parentId: new Types.ObjectId(parentId) }).sort({ priority: -1, createdAt: -1 });
  }

  async getStats(projectSlug: string): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    byPriority: Record<string, number>;
  }> {
    const project = await Project.findOne({ slug: projectSlug.toLowerCase() });
    if (!project) {
      return { total: 0, pending: 0, inProgress: 0, completed: 0, cancelled: 0, byPriority: {} };
    }

    const todos = await Todo.find({ projectId: project._id });

    const stats = {
      total: todos.length,
      pending: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
      byPriority: {} as Record<string, number>,
    };

    for (const todo of todos) {
      switch (todo.status) {
        case 'pending':
          stats.pending++;
          break;
        case 'in_progress':
          stats.inProgress++;
          break;
        case 'completed':
          stats.completed++;
          break;
        case 'cancelled':
          stats.cancelled++;
          break;
      }

      stats.byPriority[todo.priority] = (stats.byPriority[todo.priority] || 0) + 1;
    }

    return stats;
  }
}

export const todoService = new TodoService();
export default todoService;
