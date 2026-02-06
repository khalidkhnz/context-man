import { z } from 'zod';
import { todoService } from '../../services/index.js';

export const getTodoStatsSchema = z.object({
  projectSlug: z.string().describe('The project slug'),
});

export type GetTodoStatsInput = z.infer<typeof getTodoStatsSchema>;

export async function getTodoStats(input: GetTodoStatsInput) {
  const stats = await todoService.getStats(input.projectSlug);

  return {
    project: input.projectSlug,
    stats: {
      total: stats.total,
      pending: stats.pending,
      inProgress: stats.inProgress,
      completed: stats.completed,
      cancelled: stats.cancelled,
      remaining: stats.pending + stats.inProgress,
      completionRate:
        stats.total > 0
          ? `${Math.round((stats.completed / stats.total) * 100)}%`
          : '0%',
      byPriority: stats.byPriority,
    },
  };
}

export const getTodoStatsTool = {
  name: 'get_todo_stats',
  description: 'Get todo statistics for a project - counts by status and priority',
  inputSchema: getTodoStatsSchema,
  handler: getTodoStats,
};

export default getTodoStatsTool;
