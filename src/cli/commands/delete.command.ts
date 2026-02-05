import { Command } from 'commander';
import { connectDatabase } from '../../config/index.js';
import {
  projectService,
  documentService,
  skillService,
  codeSnippetService,
  promptTemplateService,
} from '../../services/index.js';
import { DocumentType } from '../../types/document.types.js';
import { formatSuccess, formatError, formatWarning } from '../utils/formatters.js';

export function createDeleteCommand(): Command {
  const cmd = new Command('delete');

  cmd.description('Delete a resource');

  // Delete project
  cmd
    .command('project <slug>')
    .description('Delete a project and all its contents')
    .option('--force', 'Skip confirmation')
    .action(async (slug: string, options) => {
      try {
        await connectDatabase();

        if (!options.force) {
          console.log(formatWarning(`This will delete project "${slug}" and ALL its contents.`));
          console.log('Use --force to confirm deletion.');
          process.exit(0);
        }

        const deleted = await projectService.delete(slug);
        if (!deleted) {
          console.error(formatError(`Project "${slug}" not found`));
          process.exit(1);
        }

        console.log(formatSuccess(`Project "${slug}" and all its contents deleted`));
      } catch (error) {
        console.error(formatError((error as Error).message));
        process.exit(1);
      }
    });

  // Delete document
  cmd
    .command('document <project-slug> <type>')
    .description('Delete a document')
    .action(async (projectSlug: string, type: string) => {
      try {
        await connectDatabase();

        const docType = type.toUpperCase() as DocumentType;
        if (!Object.values(DocumentType).includes(docType)) {
          console.error(formatError(`Invalid document type: ${type}`));
          process.exit(1);
        }

        const deleted = await documentService.delete(projectSlug, docType);
        if (!deleted) {
          console.error(formatError(`Document "${docType}" not found for project "${projectSlug}"`));
          process.exit(1);
        }

        console.log(formatSuccess(`Document "${docType}" deleted from project "${projectSlug}"`));
      } catch (error) {
        console.error(formatError((error as Error).message));
        process.exit(1);
      }
    });

  // Delete skill
  cmd
    .command('skill <project-slug> <name>')
    .description('Delete a skill')
    .action(async (projectSlug: string, name: string) => {
      try {
        await connectDatabase();

        const deleted = await skillService.delete(projectSlug, name);
        if (!deleted) {
          console.error(formatError(`Skill "${name}" not found for project "${projectSlug}"`));
          process.exit(1);
        }

        console.log(formatSuccess(`Skill "${name}" deleted from project "${projectSlug}"`));
      } catch (error) {
        console.error(formatError((error as Error).message));
        process.exit(1);
      }
    });

  // Delete snippet
  cmd
    .command('snippet <project-slug> <name>')
    .description('Delete a code snippet')
    .action(async (projectSlug: string, name: string) => {
      try {
        await connectDatabase();

        const deleted = await codeSnippetService.delete(projectSlug, name);
        if (!deleted) {
          console.error(formatError(`Snippet "${name}" not found for project "${projectSlug}"`));
          process.exit(1);
        }

        console.log(formatSuccess(`Snippet "${name}" deleted from project "${projectSlug}"`));
      } catch (error) {
        console.error(formatError((error as Error).message));
        process.exit(1);
      }
    });

  // Delete prompt
  cmd
    .command('prompt <project-slug> <name>')
    .description('Delete a prompt template')
    .action(async (projectSlug: string, name: string) => {
      try {
        await connectDatabase();

        const deleted = await promptTemplateService.delete(projectSlug, name);
        if (!deleted) {
          console.error(formatError(`Prompt "${name}" not found for project "${projectSlug}"`));
          process.exit(1);
        }

        console.log(formatSuccess(`Prompt template "${name}" deleted from project "${projectSlug}"`));
      } catch (error) {
        console.error(formatError((error as Error).message));
        process.exit(1);
      }
    });

  return cmd;
}

export default createDeleteCommand;
