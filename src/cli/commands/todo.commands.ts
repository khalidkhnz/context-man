import { Command } from 'commander';
import chalk from 'chalk';
import Table from 'cli-table3';
import { todoService } from '../../services/index.js';
import { TodoStatus, TodoPriority } from '../../types/todo.types.js';

export function registerTodoCommands(program: Command): void {
  // Add todo command
  program
    .command('add-todo <projectSlug> <title>')
    .description('Add a new todo to a project')
    .option('-d, --description <desc>', 'Todo description')
    .option('-p, --priority <priority>', 'Priority: low, medium, high, critical', 'medium')
    .option('-t, --tags <tags>', 'Comma-separated tags')
    .option('--due <date>', 'Due date (ISO format)')
    .option('--parent <id>', 'Parent todo ID for subtasks')
    .action(async (projectSlug: string, title: string, options) => {
      try {
        const todo = await todoService.create(projectSlug, {
          title,
          description: options.description,
          priority: options.priority as TodoPriority,
          tags: options.tags ? options.tags.split(',').map((t: string) => t.trim()) : undefined,
          dueDate: options.due ? new Date(options.due) : undefined,
          parentId: options.parent,
        });

        if (!todo) {
          console.error(chalk.red(`✗ Project "${projectSlug}" not found`));
          process.exit(1);
        }

        console.log(chalk.green(`✓ Todo created: ${todo.title}`));
        console.log(chalk.dim(`  ID: ${todo._id}`));
        console.log(chalk.dim(`  Priority: ${todo.priority}`));
      } catch (error) {
        console.error(chalk.red('✗'), (error as Error).message);
        process.exit(1);
      }
    });

  // List todos command
  program
    .command('list-todos <projectSlug>')
    .description('List todos for a project')
    .option('-s, --status <status>', 'Filter by status: pending, in_progress, completed, cancelled')
    .option('-p, --priority <priority>', 'Filter by priority: low, medium, high, critical')
    .option('-a, --all', 'Include completed and cancelled todos')
    .option('-f, --format <format>', 'Output format: table, json', 'table')
    .action(async (projectSlug: string, options) => {
      try {
        const todos = await todoService.findByProject(projectSlug, {
          status: options.status as TodoStatus | undefined,
          priority: options.priority as TodoPriority | undefined,
          includeCompleted: options.all,
        });

        if (options.format === 'json') {
          console.log(JSON.stringify(todos, null, 2));
          return;
        }

        if (todos.length === 0) {
          console.log(chalk.yellow('No todos found'));
          return;
        }

        const table = new Table({
          head: ['ID', 'Title', 'Status', 'Priority', 'Tags', 'Q&A', 'Created'],
          colWidths: [26, 30, 12, 10, 20, 5, 20],
        });

        const statusColors: Record<TodoStatus, typeof chalk> = {
          pending: chalk.yellow,
          in_progress: chalk.blue,
          completed: chalk.green,
          cancelled: chalk.gray,
        };

        const priorityColors: Record<TodoPriority, typeof chalk> = {
          low: chalk.gray,
          medium: chalk.white,
          high: chalk.yellow,
          critical: chalk.red,
        };

        for (const todo of todos) {
          table.push([
            todo._id.toString(),
            todo.title.slice(0, 28),
            statusColors[todo.status](todo.status),
            priorityColors[todo.priority](todo.priority),
            todo.tags.slice(0, 3).join(', '),
            todo.questionsAnswers.length.toString(),
            todo.createdAt.toLocaleDateString(),
          ]);
        }

        console.log(table.toString());
        console.log(chalk.dim(`Total: ${todos.length} todos`));
      } catch (error) {
        console.error(chalk.red('✗'), (error as Error).message);
        process.exit(1);
      }
    });

  // Complete todo command
  program
    .command('complete-todo <todoId>')
    .description('Mark a todo as completed')
    .option('-n, --note <note>', 'Change note')
    .action(async (todoId: string, options) => {
      try {
        const todo = await todoService.markComplete(todoId, options.note);

        if (!todo) {
          console.error(chalk.red(`✗ Todo "${todoId}" not found`));
          process.exit(1);
        }

        console.log(chalk.green(`✓ Todo completed: ${todo.title}`));
      } catch (error) {
        console.error(chalk.red('✗'), (error as Error).message);
        process.exit(1);
      }
    });

  // Start todo command
  program
    .command('start-todo <todoId>')
    .description('Mark a todo as in progress')
    .option('-n, --note <note>', 'Change note')
    .action(async (todoId: string, options) => {
      try {
        const todo = await todoService.markInProgress(todoId, options.note);

        if (!todo) {
          console.error(chalk.red(`✗ Todo "${todoId}" not found`));
          process.exit(1);
        }

        console.log(chalk.blue(`▶ Todo started: ${todo.title}`));
      } catch (error) {
        console.error(chalk.red('✗'), (error as Error).message);
        process.exit(1);
      }
    });

  // Add Q&A to todo command
  program
    .command('add-qa <todoId>')
    .description('Add a question and answer to a todo')
    .requiredOption('-q, --question <question>', 'The question that was asked')
    .requiredOption('-a, --answer <answer>', 'The answer that was given')
    .option('-c, --context <context>', 'Context about when/why this was asked')
    .action(async (todoId: string, options) => {
      try {
        const todo = await todoService.addQA(todoId, {
          question: options.question,
          answer: options.answer,
          context: options.context,
        });

        if (!todo) {
          console.error(chalk.red(`✗ Todo "${todoId}" not found`));
          process.exit(1);
        }

        console.log(chalk.green(`✓ Q&A added to: ${todo.title}`));
        console.log(chalk.dim(`  Total Q&As: ${todo.questionsAnswers.length}`));
      } catch (error) {
        console.error(chalk.red('✗'), (error as Error).message);
        process.exit(1);
      }
    });

  // Get todo details command
  program
    .command('get-todo <todoId>')
    .description('Get todo details including Q&A history')
    .option('-f, --format <format>', 'Output format: table, json', 'table')
    .action(async (todoId: string, options) => {
      try {
        const todo = await todoService.findById(todoId);

        if (!todo) {
          console.error(chalk.red(`✗ Todo "${todoId}" not found`));
          process.exit(1);
        }

        if (options.format === 'json') {
          console.log(JSON.stringify(todo, null, 2));
          return;
        }

        console.log(chalk.bold(todo.title));
        console.log(chalk.dim('─'.repeat(50)));
        console.log(`${chalk.dim('ID:')} ${todo._id}`);
        console.log(`${chalk.dim('Status:')} ${todo.status}`);
        console.log(`${chalk.dim('Priority:')} ${todo.priority}`);
        console.log(`${chalk.dim('Tags:')} ${todo.tags.join(', ') || 'none'}`);
        console.log(`${chalk.dim('Created:')} ${todo.createdAt.toLocaleString()}`);
        if (todo.completedAt) {
          console.log(`${chalk.dim('Completed:')} ${todo.completedAt.toLocaleString()}`);
        }
        if (todo.description) {
          console.log(`\n${chalk.dim('Description:')}`);
          console.log(todo.description);
        }

        if (todo.questionsAnswers.length > 0) {
          console.log(`\n${chalk.bold('Questions & Answers:')}`);
          for (const qa of todo.questionsAnswers) {
            console.log(chalk.dim('─'.repeat(50)));
            console.log(`${chalk.cyan('Q:')} ${qa.question}`);
            console.log(`${chalk.green('A:')} ${qa.answer}`);
            if (qa.context) {
              console.log(`${chalk.dim('Context:')} ${qa.context}`);
            }
            console.log(`${chalk.dim('Asked:')} ${qa.askedAt.toLocaleString()}`);
          }
        }
      } catch (error) {
        console.error(chalk.red('✗'), (error as Error).message);
        process.exit(1);
      }
    });

  // Todo stats command
  program
    .command('todo-stats <projectSlug>')
    .description('Get todo statistics for a project')
    .action(async (projectSlug: string) => {
      try {
        const stats = await todoService.getStats(projectSlug);

        console.log(chalk.bold(`Todo Statistics for ${projectSlug}`));
        console.log(chalk.dim('─'.repeat(40)));
        console.log(`${chalk.dim('Total:')} ${stats.total}`);
        console.log(`${chalk.yellow('Pending:')} ${stats.pending}`);
        console.log(`${chalk.blue('In Progress:')} ${stats.inProgress}`);
        console.log(`${chalk.green('Completed:')} ${stats.completed}`);
        console.log(`${chalk.gray('Cancelled:')} ${stats.cancelled}`);
        console.log(chalk.dim('─'.repeat(40)));
        console.log(`${chalk.dim('Remaining:')} ${stats.pending + stats.inProgress}`);
        const rate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
        console.log(`${chalk.dim('Completion Rate:')} ${rate}%`);

        if (Object.keys(stats.byPriority).length > 0) {
          console.log(`\n${chalk.bold('By Priority:')}`);
          for (const [priority, count] of Object.entries(stats.byPriority)) {
            console.log(`  ${priority}: ${count}`);
          }
        }
      } catch (error) {
        console.error(chalk.red('✗'), (error as Error).message);
        process.exit(1);
      }
    });
}
