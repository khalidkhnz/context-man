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
import { formatJson, formatError, formatInfo } from '../utils/formatters.js';

export function createGetCommand(): Command {
  const cmd = new Command('get');

  cmd.description('Get a specific resource');

  // Get project
  cmd
    .command('project <slug>')
    .description('Get project details')
    .option('-f, --format <format>', 'Output format: json, text', 'text')
    .action(async (slug: string, options) => {
      try {
        await connectDatabase();

        const project = await projectService.findBySlug(slug);
        if (!project) {
          console.error(formatError(`Project "${slug}" not found`));
          process.exit(1);
        }

        if (options.format === 'json') {
          console.log(formatJson(project));
        } else {
          console.log(formatInfo(`Project: ${project.name}`));
          console.log(`Slug: ${project.slug}`);
          console.log(`Description: ${project.description || '(none)'}`);
          console.log(`Tags: ${project.tags.length ? project.tags.join(', ') : '(none)'}`);
          console.log(`Created: ${project.createdAt.toISOString()}`);
          console.log(`Updated: ${project.updatedAt.toISOString()}`);
        }
      } catch (error) {
        console.error(formatError((error as Error).message));
        process.exit(1);
      }
    });

  // Get document
  cmd
    .command('document <project-slug> <type>')
    .description('Get a document')
    .option('-v, --version <version>', 'Specific version number')
    .option('-f, --format <format>', 'Output format: json, text, content', 'text')
    .action(async (projectSlug: string, type: string, options) => {
      try {
        await connectDatabase();

        const docType = type.toUpperCase() as DocumentType;
        if (!Object.values(DocumentType).includes(docType)) {
          console.error(formatError(`Invalid document type: ${type}`));
          process.exit(1);
        }

        if (options.version) {
          const version = parseInt(options.version, 10);
          const versionData = await documentService.getVersion(projectSlug, docType, version);
          if (!versionData) {
            console.error(formatError(`Version ${version} not found`));
            process.exit(1);
          }
          if (options.format === 'content') {
            console.log(versionData.content);
          } else {
            console.log(formatJson(versionData));
          }
          return;
        }

        const doc = await documentService.findByProjectAndType(projectSlug, docType);
        if (!doc) {
          console.error(formatError(`Document "${docType}" not found for project "${projectSlug}"`));
          process.exit(1);
        }

        if (options.format === 'json') {
          console.log(formatJson(doc));
        } else if (options.format === 'content') {
          console.log(doc.content);
        } else {
          console.log(formatInfo(`Document: ${doc.title}`));
          console.log(`Type: ${doc.type}`);
          console.log(`Version: ${doc.currentVersion}`);
          console.log(`Tags: ${doc.tags.length ? doc.tags.join(', ') : '(none)'}`);
          console.log(`Updated: ${doc.updatedAt.toISOString()}`);
          console.log('\n--- Content ---\n');
          console.log(doc.content);
        }
      } catch (error) {
        console.error(formatError((error as Error).message));
        process.exit(1);
      }
    });

  // Get skill
  cmd
    .command('skill <project-slug> <name>')
    .description('Get a skill')
    .option('-f, --format <format>', 'Output format: json, text, content', 'text')
    .action(async (projectSlug: string, name: string, options) => {
      try {
        await connectDatabase();

        const skill = await skillService.findByProjectAndName(projectSlug, name);
        if (!skill) {
          console.error(formatError(`Skill "${name}" not found for project "${projectSlug}"`));
          process.exit(1);
        }

        if (options.format === 'json') {
          console.log(formatJson(skill));
        } else if (options.format === 'content') {
          console.log(skill.content);
        } else {
          console.log(formatInfo(`Skill: ${skill.name}`));
          console.log(`Type: ${skill.type}`);
          console.log(`Description: ${skill.description || '(none)'}`);
          console.log(`Version: ${skill.currentVersion}`);
          console.log(`Active: ${skill.isActive ? 'Yes' : 'No'}`);
          console.log(`Tags: ${skill.tags.length ? skill.tags.join(', ') : '(none)'}`);
          console.log('\n--- Content ---\n');
          console.log(skill.content);
        }
      } catch (error) {
        console.error(formatError((error as Error).message));
        process.exit(1);
      }
    });

  // Get snippet
  cmd
    .command('snippet <project-slug> <name>')
    .description('Get a code snippet')
    .option('-f, --format <format>', 'Output format: json, text, code', 'text')
    .action(async (projectSlug: string, name: string, options) => {
      try {
        await connectDatabase();

        const snippet = await codeSnippetService.findByProjectAndName(projectSlug, name);
        if (!snippet) {
          console.error(formatError(`Snippet "${name}" not found for project "${projectSlug}"`));
          process.exit(1);
        }

        if (options.format === 'json') {
          console.log(formatJson(snippet));
        } else if (options.format === 'code') {
          console.log(snippet.code);
        } else {
          console.log(formatInfo(`Snippet: ${snippet.name}`));
          console.log(`Language: ${snippet.language}`);
          console.log(`Description: ${snippet.description || '(none)'}`);
          console.log(`Version: ${snippet.currentVersion}`);
          console.log(`Tags: ${snippet.tags.length ? snippet.tags.join(', ') : '(none)'}`);
          console.log('\n--- Code ---\n');
          console.log(snippet.code);
        }
      } catch (error) {
        console.error(formatError((error as Error).message));
        process.exit(1);
      }
    });

  // Get prompt
  cmd
    .command('prompt <project-slug> <name>')
    .description('Get a prompt template')
    .option('-f, --format <format>', 'Output format: json, text, content', 'text')
    .action(async (projectSlug: string, name: string, options) => {
      try {
        await connectDatabase();

        const prompt = await promptTemplateService.findByProjectAndName(projectSlug, name);
        if (!prompt) {
          console.error(formatError(`Prompt "${name}" not found for project "${projectSlug}"`));
          process.exit(1);
        }

        if (options.format === 'json') {
          console.log(formatJson(prompt));
        } else if (options.format === 'content') {
          console.log(prompt.content);
        } else {
          console.log(formatInfo(`Prompt Template: ${prompt.name}`));
          console.log(`Description: ${prompt.description || '(none)'}`);
          console.log(`Category: ${prompt.category || '(none)'}`);
          console.log(`Version: ${prompt.currentVersion}`);
          console.log(`Variables: ${prompt.variables.map((v) => v.name).join(', ') || '(none)'}`);
          console.log(`Tags: ${prompt.tags.length ? prompt.tags.join(', ') : '(none)'}`);
          console.log('\n--- Template ---\n');
          console.log(prompt.content);
        }
      } catch (error) {
        console.error(formatError((error as Error).message));
        process.exit(1);
      }
    });

  return cmd;
}

export default createGetCommand;
