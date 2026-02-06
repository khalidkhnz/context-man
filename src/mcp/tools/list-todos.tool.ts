import { z } from 'zod';
import { todoService } from '../../services/index.js';

export const listTodosSchema = z.object({
  projectSlug: z.string().describe('The project slug'),
  status: z
    .enum(['pending', 'in_progress', 'completed', 'cancelled'])
    .optional()
    .describe('Filter by status'),
  priority: z
    .enum(['low', 'medium', 'high', 'critical'])
    .optional()
    .describe('Filter by priority'),
  includeCompleted: z
    .boolean()
    .optional()
    .default(false)
    .describe('Include completed todos'),
  tags: z
    .array(z.string())
    .optional()
    .describe('Filter by tags'),
});

export type ListTodosInput = z.infer<typeof listTodosSchema>;

export async function listTodos(input: ListTodosInput) {
  const todos = await todoService.findByProject(input.projectSlug, {
    status: input.status,
    priority: input.priority,
    includeCompleted: input.includeCompleted,
    tags: input.tags,
  });

  return {
    todos: todos.map((t) => ({
      id: t._id.toString(),
      title: t.title,
      status: t.status,
      priority: t.priority,
      tags: t.tags,
      hasQA: t.questionsAnswers.length > 0,
      dueDate: t.dueDate,
      createdAt: t.createdAt,
    })),
    count: todos.length,
  };
}

export const listTodosTool = {
  name: 'list_todos',
  description: 'List todos for a project with optional filters',
  inputSchema: listTodosSchema,
  handler: listTodos,
};

export default listTodosTool;
