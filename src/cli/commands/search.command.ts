import { Command } from 'commander';
import { connectDatabase } from '../../config/index.js';
import { searchService } from '../../services/index.js';
import { formatTable, formatJson, formatError, truncate } from '../utils/formatters.js';

export function createSearchCommand(): Command {
  const cmd = new Command('search');

  cmd
    .description('Search across project content')
    .argument('<query>', 'Search query')
    .option('-p, --project <slug>', 'Limit to specific project')
    .option('--types <types>', 'Filter by types: document,skill,snippet,prompt')
    .option('--tags <tags>', 'Filter by tags (comma-separated)')
    .option('-l, --limit <limit>', 'Maximum results', '20')
    .option('-f, --format <format>', 'Output format: table, json', 'table')
    .action(async (query: string, options) => {
      try {
        await connectDatabase();

        const results = await searchService.search({
          query,
          projectSlug: options.project,
          types: options.types?.split(','),
          tags: options.tags?.split(',').map((t: string) => t.trim()),
          limit: parseInt(options.limit, 10),
        });

        if (options.format === 'json') {
          console.log(formatJson(results));
          return;
        }

        if (results.results.length === 0) {
          console.log('No results found');
          return;
        }

        console.log(`Found ${results.total} results for "${results.query}":\n`);

        const rows = results.results.map((r) => [
          r.type,
          r.projectSlug,
          r.name,
          truncate(r.excerpt, 50),
          r.score.toFixed(2),
        ]);

        console.log(formatTable(['Type', 'Project', 'Name', 'Excerpt', 'Score'], rows));
      } catch (error) {
        console.error(formatError((error as Error).message));
        process.exit(1);
      }
    });

  return cmd;
}

export default createSearchCommand;
