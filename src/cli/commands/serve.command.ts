import { Command } from 'commander';
import { connectDatabase, config } from '../../config/index.js';
import { startApiServer } from '../../api/index.js';
import { startMcpServer } from '../../mcp/index.js';
import { formatSuccess, formatInfo, formatError } from '../utils/formatters.js';

export function createServeCommand(): Command {
  const cmd = new Command('serve');

  cmd.description('Start servers');

  // Start MCP server
  cmd
    .command('mcp')
    .description('Start MCP server')
    .option('-t, --transport <transport>', 'Transport: stdio, http', 'stdio')
    .option('-p, --port <port>', 'HTTP port (for http transport)', '3001')
    .action(async (options) => {
      try {
        await connectDatabase();
        console.log(formatInfo(`Starting MCP server with ${options.transport} transport...`));
        await startMcpServer(options.transport, parseInt(options.port, 10));
      } catch (error) {
        console.error(formatError((error as Error).message));
        process.exit(1);
      }
    });

  // Start REST API server
  cmd
    .command('api')
    .description('Start REST API server')
    .option('-p, --port <port>', 'Port number', String(config.API_PORT))
    .option('-h, --host <host>', 'Host address', config.API_HOST)
    .action(async (options) => {
      try {
        await connectDatabase();
        console.log(formatInfo('Starting REST API server...'));
        await startApiServer(parseInt(options.port, 10), options.host);
        console.log(formatSuccess(`REST API server running at http://${options.host}:${options.port}`));
      } catch (error) {
        console.error(formatError((error as Error).message));
        process.exit(1);
      }
    });

  // Start all servers
  cmd
    .option('--all', 'Start both MCP and API servers')
    .option('--api-port <port>', 'API server port', String(config.API_PORT))
    .option('--mcp-port <port>', 'MCP HTTP server port', String(config.MCP_HTTP_PORT))
    .option('--mcp-transport <transport>', 'MCP transport: stdio, http', 'stdio')
    .action(async (options) => {
      if (options.all) {
        try {
          await connectDatabase();

          console.log(formatInfo('Starting servers...'));

          // Start API server
          await startApiServer(parseInt(options.apiPort, 10), config.API_HOST);
          console.log(formatSuccess(`REST API server running at http://${config.API_HOST}:${options.apiPort}`));

          // Start MCP server
          if (options.mcpTransport === 'http') {
            await startMcpServer('http', parseInt(options.mcpPort, 10));
            console.log(formatSuccess(`MCP HTTP server running on port ${options.mcpPort}`));
          } else {
            console.log(formatInfo('MCP stdio transport is not available when running multiple servers'));
            console.log(formatInfo('Use --mcp-transport http for multi-server mode'));
          }
        } catch (error) {
          console.error(formatError((error as Error).message));
          process.exit(1);
        }
      }
    });

  return cmd;
}

export default createServeCommand;
