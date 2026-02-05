import { Command } from 'commander';
import { readFileSync, existsSync } from 'fs';
import { connectDatabase } from '../../config/index.js';
import {
  documentService,
  skillService,
  codeSnippetService,
  promptTemplateService,
} from '../../services/index.js';
import { DocumentType } from '../../types/document.types.js';
import { SkillType } from '../../types/skill.types.js';
import { formatSuccess, formatError } from '../utils/formatters.js';

export function createAddCommand(): Command {
  const cmd = new Command('add');

  cmd.description('Add a resource to a project');

  // Add document
  cmd
    .command('document <project-slug> <type>')
    .description('Add a document (PLAN, TODO, SCOPE, TECHSTACK, UI_UX_STANDARDS, CODING_GUIDELINES)')
    .option('-f, --file <path>', 'Read content from file')
    .option('-t, --title <title>', 'Document title')
    .option('--tags <tags>', 'Comma-separated tags')
    .option('--content <content>', 'Document content (if not using file)')
    .action(async (projectSlug: string, type: string, options) => {
      try {
        await connectDatabase();

        const docType = type.toUpperCase() as DocumentType;
        if (!Object.values(DocumentType).includes(docType)) {
          console.error(formatError(`Invalid document type: ${type}`));
          console.error('Valid types: PLAN, TODO, SCOPE, TECHSTACK, UI_UX_STANDARDS, CODING_GUIDELINES');
          process.exit(1);
        }

        let content = options.content || '';
        if (options.file) {
          if (!existsSync(options.file)) {
            console.error(formatError(`File not found: ${options.file}`));
            process.exit(1);
          }
          content = readFileSync(options.file, 'utf-8');
        }

        if (!content) {
          console.error(formatError('Content is required. Use --file or --content'));
          process.exit(1);
        }

        const doc = await documentService.create(projectSlug, {
          type: docType,
          title: options.title || type,
          content,
          tags: options.tags ? options.tags.split(',').map((t: string) => t.trim()) : [],
        });

        if (!doc) {
          console.error(formatError(`Project "${projectSlug}" not found`));
          process.exit(1);
        }

        console.log(formatSuccess(`Document "${docType}" added to project "${projectSlug}"`));
      } catch (error) {
        console.error(formatError((error as Error).message));
        process.exit(1);
      }
    });

  // Add skill
  cmd
    .command('skill <project-slug> <name>')
    .description('Add a skill')
    .requiredOption('--type <type>', 'Skill type: instructions, code_template, tool_definition')
    .option('-f, --file <path>', 'Read content from file')
    .option('-d, --description <description>', 'Skill description')
    .option('--tags <tags>', 'Comma-separated tags')
    .option('--content <content>', 'Skill content (if not using file)')
    .action(async (projectSlug: string, name: string, options) => {
      try {
        await connectDatabase();

        const skillType = options.type as SkillType;
        if (!Object.values(SkillType).includes(skillType)) {
          console.error(formatError(`Invalid skill type: ${options.type}`));
          console.error('Valid types: instructions, code_template, tool_definition');
          process.exit(1);
        }

        let content = options.content || '';
        if (options.file) {
          if (!existsSync(options.file)) {
            console.error(formatError(`File not found: ${options.file}`));
            process.exit(1);
          }
          content = readFileSync(options.file, 'utf-8');
        }

        if (!content) {
          console.error(formatError('Content is required. Use --file or --content'));
          process.exit(1);
        }

        const skill = await skillService.create(projectSlug, {
          name,
          type: skillType,
          description: options.description,
          content,
          tags: options.tags ? options.tags.split(',').map((t: string) => t.trim()) : [],
        });

        if (!skill) {
          console.error(formatError(`Project "${projectSlug}" not found`));
          process.exit(1);
        }

        console.log(formatSuccess(`Skill "${name}" added to project "${projectSlug}"`));
      } catch (error) {
        console.error(formatError((error as Error).message));
        process.exit(1);
      }
    });

  // Add snippet
  cmd
    .command('snippet <project-slug> <name>')
    .description('Add a code snippet')
    .requiredOption('-l, --language <language>', 'Programming language')
    .option('-f, --file <path>', 'Read code from file')
    .option('-d, --description <description>', 'Snippet description')
    .option('--tags <tags>', 'Comma-separated tags')
    .option('--code <code>', 'Code content (if not using file)')
    .action(async (projectSlug: string, name: string, options) => {
      try {
        await connectDatabase();

        let code = options.code || '';
        if (options.file) {
          if (!existsSync(options.file)) {
            console.error(formatError(`File not found: ${options.file}`));
            process.exit(1);
          }
          code = readFileSync(options.file, 'utf-8');
        }

        if (!code) {
          console.error(formatError('Code is required. Use --file or --code'));
          process.exit(1);
        }

        const snippet = await codeSnippetService.create(projectSlug, {
          name,
          language: options.language,
          code,
          description: options.description,
          tags: options.tags ? options.tags.split(',').map((t: string) => t.trim()) : [],
        });

        if (!snippet) {
          console.error(formatError(`Project "${projectSlug}" not found`));
          process.exit(1);
        }

        console.log(formatSuccess(`Snippet "${name}" added to project "${projectSlug}"`));
      } catch (error) {
        console.error(formatError((error as Error).message));
        process.exit(1);
      }
    });

  // Add prompt template
  cmd
    .command('prompt <project-slug> <name>')
    .description('Add a prompt template')
    .option('-f, --file <path>', 'Read template from file')
    .option('-d, --description <description>', 'Template description')
    .option('--category <category>', 'Template category')
    .option('--tags <tags>', 'Comma-separated tags')
    .option('--content <content>', 'Template content (if not using file)')
    .action(async (projectSlug: string, name: string, options) => {
      try {
        await connectDatabase();

        let content = options.content || '';
        if (options.file) {
          if (!existsSync(options.file)) {
            console.error(formatError(`File not found: ${options.file}`));
            process.exit(1);
          }
          content = readFileSync(options.file, 'utf-8');
        }

        if (!content) {
          console.error(formatError('Content is required. Use --file or --content'));
          process.exit(1);
        }

        const prompt = await promptTemplateService.create(projectSlug, {
          name,
          content,
          description: options.description,
          category: options.category,
          tags: options.tags ? options.tags.split(',').map((t: string) => t.trim()) : [],
        });

        if (!prompt) {
          console.error(formatError(`Project "${projectSlug}" not found`));
          process.exit(1);
        }

        console.log(formatSuccess(`Prompt template "${name}" added to project "${projectSlug}"`));
      } catch (error) {
        console.error(formatError((error as Error).message));
        process.exit(1);
      }
    });

  return cmd;
}

export default createAddCommand;
