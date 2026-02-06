import { z } from 'zod';
import { todoService } from '../../services/index.js';

export const updateTodoSchema = z.object({
  todoId: z.string().describe('The todo ID'),
  title: z.string().optional().describe('New title'),
  description: z.string().optional().describe('New description'),
  status: z
    .enum(['pending', 'in_progress', 'completed', 'cancelled'])
    .optional()
    .describe('New status'),
  priority: z
    .enum(['low', 'medium', 'high', 'critical'])
    .optional()
    .describe('New priority'),
  tags: z.array(z.string()).optional().describe('New tags'),
  changeNote: z.string().optional().describe('Note explaining the change'),
});

export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;

export async function updateTodo(input: UpdateTodoInput) {
  const { todoId, ...updateInput } = input;

  const todo = await todoService.update(todoId, updateInput);

  if (!todo) {
    return { error: `Todo "${todoId}" not found` };
  }

  return {
    message: 'Todo updated successfully',
    todo: {
      id: todo._id.toString(),
      title: todo.title,
      status: todo.status,
      priority: todo.priority,
      completedAt: todo.completedAt,
      currentVersion: todo.currentVersion,
    },
  };
}

export const updateTodoTool = {
  name: 'update_todo',
  description: 'Update a todo item - can change status, priority, title, description, or mark as completed',
  inputSchema: updateTodoSchema,
  handler: updateTodo,
};

export default updateTodoTool;
