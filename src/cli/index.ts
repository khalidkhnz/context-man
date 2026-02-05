import { Command } from 'commander';
import { createInitCommand } from './commands/init.command.js';
import { createListCommand } from './commands/list.command.js';
import { createAddCommand } from './commands/add.command.js';
import { createGetCommand } from './commands/get.command.js';
import { createDeleteCommand } from './commands/delete.command.js';
import { createSearchCommand } from './commands/search.command.js';
import { createServeCommand } from './commands/serve.command.js';

export function createCli(): Command {
  const program = new Command();

  program
    .name('context-man')
    .description('MCP server for project context management')
    .version('1.0.0');

  // Add commands
  program.addCommand(createInitCommand());
  program.addCommand(createListCommand());
  program.addCommand(createAddCommand());
  program.addCommand(createGetCommand());
  program.addCommand(createDeleteCommand());
  program.addCommand(createSearchCommand());
  program.addCommand(createServeCommand());

  return program;
}

export default createCli;
