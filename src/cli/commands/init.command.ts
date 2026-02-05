import { Command } from 'commander';
import { connectDatabase } from '../../config/index.js';
import { projectService } from '../../services/index.js';
import { formatSuccess, formatError } from '../utils/formatters.js';

export function createInitCommand(): Command {
  const cmd = new Command('init');

  cmd
    .description('Initialize a new project')
    .argument('<slug>', 'Project slug (lowercase alphanumeric with hyphens)')
    .option('-n, --name <name>', 'Project display name')
    .option('-d, --description <description>', 'Project description')
    .option('-t, --tags <tags>', 'Comma-separated tags')
    .action(async (slug: string, options) => {
      try {
        await connectDatabase();

        const exists = await projectService.exists(slug);
        if (exists) {
          console.error(formatError(`Project "${slug}" already exists`));
          process.exit(1);
        }

        const project = await projectService.create({
          slug,
          name: options.name || slug,
          description: options.description,
          tags: options.tags ? options.tags.split(',').map((t: string) => t.trim()) : [],
        });

        console.log(formatSuccess(`Project "${project.name}" created with slug: ${project.slug}`));
      } catch (error) {
        console.error(formatError((error as Error).message));
        process.exit(1);
      }
    });

  return cmd;
}

export default createInitCommand;
