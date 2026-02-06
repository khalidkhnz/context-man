import { z } from 'zod';
import { todoService } from '../../services/index.js';

export const addTodoQASchema = z.object({
  todoId: z.string().describe('The todo ID'),
  question: z.string().describe('The question that was asked'),
  answer: z.string().describe('The answer that was given'),
  context: z
    .string()
    .optional()
    .describe('Context about when/why this question was asked'),
});

export type AddTodoQAInput = z.infer<typeof addTodoQASchema>;

export async function addTodoQA(input: AddTodoQAInput) {
  const todo = await todoService.addQA(input.todoId, {
    question: input.question,
    answer: input.answer,
    context: input.context,
  });

  if (!todo) {
    return { error: `Todo "${input.todoId}" not found` };
  }

  return {
    message: 'Q&A added successfully',
    todo: {
      id: todo._id.toString(),
      title: todo.title,
      qaCount: todo.questionsAnswers.length,
      latestQA: todo.questionsAnswers[todo.questionsAnswers.length - 1],
    },
  };
}

export const addTodoQATool = {
  name: 'add_todo_qa',
  description: 'Add a question and answer pair to a todo - useful for tracking decisions made during implementation',
  inputSchema: addTodoQASchema,
  handler: addTodoQA,
};

export default addTodoQATool;
