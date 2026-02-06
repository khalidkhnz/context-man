import { z } from 'zod';
import { todoService } from '../../services/index.js';

export const getTodoSchema = z.object({
  todoId: z.string().describe('The todo ID'),
  includeSubtasks: z.boolean().optional().default(false).describe('Include subtasks'),
});

export type GetTodoInput = z.infer<typeof getTodoSchema>;

export async function getTodo(input: GetTodoInput) {
  const todo = await todoService.findById(input.todoId);

  if (!todo) {
    return { error: `Todo "${input.todoId}" not found` };
  }

  const result: Record<string, unknown> = {
    id: todo._id.toString(),
    title: todo.title,
    description: todo.description,
    status: todo.status,
    priority: todo.priority,
    tags: todo.tags,
    dueDate: todo.dueDate,
    completedAt: todo.completedAt,
    questionsAnswers: todo.questionsAnswers,
    currentVersion: todo.currentVersion,
    createdAt: todo.createdAt,
    updatedAt: todo.updatedAt,
  };

  if (input.includeSubtasks) {
    const subtasks = await todoService.getSubtasks(input.todoId);
    result.subtasks = subtasks.map((s) => ({
      id: s._id.toString(),
      title: s.title,
      status: s.status,
      priority: s.priority,
    }));
  }

  return result;
}

export const getTodoTool = {
  name: 'get_todo',
  description: 'Get a specific todo by ID with full details including Q&A history',
  inputSchema: getTodoSchema,
  handler: getTodo,
};

export default getTodoTool;
