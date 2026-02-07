import { Command } from 'commander';
import { connectDatabase } from '../../config/index.js';
import {
  projectService,
  documentService,
  skillService,
  codeSnippetService,
  promptTemplateService,
} from '../../services/index.js';
import { formatTable, formatJson, formatError, truncate, formatDate } from '../utils/formatters.js';

export function createListCommand(): Command {
  const cmd = new Command('list');

  cmd
    .description('List resources')
    .argument('<type>', 'Resource type: projects, documents, skills, snippets, prompts')
    .argument('[project-slug]', 'Project slug (required for non-project types)')
    .option('-f, --format <format>', 'Output format: table, json', 'table')
    .option('--type <skillType>', 'Filter skills by type')
    .option('--language <lang>', 'Filter snippets by language')
    .option('--category <category>', 'Filter prompts by category')
    .option('--tags <tags>', 'Filter by tags (comma-separated)')
    .option('--templates', 'Show templates instead of user projects')
    .action(async (type: string, projectSlug: string | undefined, options) => {
      try {
        await connectDatabase();

        const format = options.format;
        const tags = options.tags?.split(',').map((t: string) => t.trim());

        switch (type) {
          case 'projects':
            await listProjects(format, tags, !!options.templates);
            break;
          case 'documents':
            if (!projectSlug) {
              console.error(formatError('Project slug is required for listing documents'));
              process.exit(1);
            }
            await listDocuments(projectSlug, format);
            break;
          case 'skills':
            if (!projectSlug) {
              console.error(formatError('Project slug is required for listing skills'));
              process.exit(1);
            }
            await listSkills(projectSlug, format, options.type, tags);
            break;
          case 'snippets':
            if (!projectSlug) {
              console.error(formatError('Project slug is required for listing snippets'));
              process.exit(1);
            }
            await listSnippets(projectSlug, format, options.language, tags);
            break;
          case 'prompts':
            if (!projectSlug) {
              console.error(formatError('Project slug is required for listing prompts'));
              process.exit(1);
            }
            await listPrompts(projectSlug, format, options.category, tags);
            break;
          default:
            console.error(formatError(`Unknown resource type: ${type}`));
            process.exit(1);
        }
      } catch (error) {
        console.error(formatError((error as Error).message));
        process.exit(1);
      }
    });

  return cmd;
}

async function listProjects(format: string, tags?: string[], showTemplates?: boolean): Promise<void> {
  const isTemplate = showTemplates ? true : false;
  const projects = await projectService.findAllWithCounts({ tags, isTemplate });

  if (format === 'json') {
    console.log(formatJson(projects));
    return;
  }

  if (projects.length === 0) {
    console.log('No projects found');
    return;
  }

  const rows = projects.map((p) => [
    p.slug,
    p.name,
    truncate(p.description, 40),
    p.tags.join(', '),
    `${p.documentCount}/${p.skillCount}/${p.snippetCount}/${p.promptCount}`,
    formatDate(p.updatedAt),
  ]);

  console.log(formatTable(
    ['Slug', 'Name', 'Description', 'Tags', 'D/S/Sn/P', 'Updated'],
    rows
  ));
}

async function listDocuments(projectSlug: string, format: string): Promise<void> {
  const documents = await documentService.findAllByProject(projectSlug);

  if (format === 'json') {
    console.log(formatJson(documents));
    return;
  }

  if (documents.length === 0) {
    console.log('No documents found');
    return;
  }

  const rows = documents.map((d) => [
    d.type,
    d.title,
    `v${d.currentVersion}`,
    d.tags.join(', '),
    formatDate(d.updatedAt),
  ]);

  console.log(formatTable(['Type', 'Title', 'Version', 'Tags', 'Updated'], rows));
}

async function listSkills(
  projectSlug: string,
  format: string,
  type?: string,
  tags?: string[]
): Promise<void> {
  const skills = await skillService.findAllByProject(projectSlug, {
    type: type as import('../../types/skill.types.js').SkillType,
    tags,
  });

  if (format === 'json') {
    console.log(formatJson(skills));
    return;
  }

  if (skills.length === 0) {
    console.log('No skills found');
    return;
  }

  const rows = skills.map((s) => [
    s.name,
    s.type,
    truncate(s.description, 40),
    `v${s.currentVersion}`,
    s.isActive ? 'Yes' : 'No',
    formatDate(s.updatedAt),
  ]);

  console.log(formatTable(['Name', 'Type', 'Description', 'Version', 'Active', 'Updated'], rows));
}

async function listSnippets(
  projectSlug: string,
  format: string,
  language?: string,
  tags?: string[]
): Promise<void> {
  const snippets = await codeSnippetService.findAllByProject(projectSlug, { language, tags });

  if (format === 'json') {
    console.log(formatJson(snippets));
    return;
  }

  if (snippets.length === 0) {
    console.log('No snippets found');
    return;
  }

  const rows = snippets.map((s) => [
    s.name,
    s.language,
    truncate(s.description, 40),
    `v${s.currentVersion}`,
    formatDate(s.updatedAt),
  ]);

  console.log(formatTable(['Name', 'Language', 'Description', 'Version', 'Updated'], rows));
}

async function listPrompts(
  projectSlug: string,
  format: string,
  category?: string,
  tags?: string[]
): Promise<void> {
  const prompts = await promptTemplateService.findAllByProject(projectSlug, { category, tags });

  if (format === 'json') {
    console.log(formatJson(prompts));
    return;
  }

  if (prompts.length === 0) {
    console.log('No prompt templates found');
    return;
  }

  const rows = prompts.map((p) => [
    p.name,
    p.category || '-',
    truncate(p.description, 40),
    p.variables.length.toString(),
    `v${p.currentVersion}`,
    formatDate(p.updatedAt),
  ]);

  console.log(formatTable(['Name', 'Category', 'Description', 'Vars', 'Version', 'Updated'], rows));
}

export default createListCommand;
