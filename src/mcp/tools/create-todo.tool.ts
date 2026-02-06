import { z } from 'zod';
import { todoService } from '../../services/index.js';

export const createTodoSchema = z.object({
  projectSlug: z.string().describe('The project slug'),
  title: z.string().describe('The todo title'),
  description: z.string().optional().describe('Detailed description'),
  priority: z
    .enum(['low', 'medium', 'high', 'critical'])
    .optional()
    .default('medium')
    .describe('Priority level'),
  tags: z.array(z.string()).optional().describe('Tags for categorization'),
  dueDate: z.string().optional().describe('Due date in ISO format'),
  parentId: z.string().optional().describe('Parent todo ID for subtasks'),
  questionsAnswers: z
    .array(
      z.object({
        question: z.string().describe('Question that was asked'),
        answer: z.string().describe('Answer that was given'),
        context: z.string().optional().describe('Context about when/why asked'),
      })
    )
    .optional()
    .describe('Initial Q&A from requirements gathering'),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;

export async function createTodo(input: CreateTodoInput) {
  const todo = await todoService.create(input.projectSlug, {
    title: input.title,
    description: input.description,
    priority: input.priority,
    tags: input.tags,
    dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
    parentId: input.parentId,
    questionsAnswers: input.questionsAnswers?.map((qa) => ({
      ...qa,
      askedAt: new Date(),
    })),
  });

  if (!todo) {
    return { error: `Project "${input.projectSlug}" not found` };
  }

  return {
    message: 'Todo created successfully',
    todo: {
      id: todo._id.toString(),
      title: todo.title,
      status: todo.status,
      priority: todo.priority,
    },
  };
}

export const createTodoTool = {
  name: 'create_todo',
  description: 'Create a new todo item with optional initial Q&A from requirements gathering',
  inputSchema: createTodoSchema,
  handler: createTodo,
};

export default createTodoTool;
