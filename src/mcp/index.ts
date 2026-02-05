import { createMcpServer } from './server.js';
import { startStdioTransport } from './transports/stdio.transport.js';
import { startHttpSseTransport } from './transports/http-sse.transport.js';

export { createMcpServer } from './server.js';
export { startStdioTransport } from './transports/stdio.transport.js';
export { startHttpSseTransport } from './transports/http-sse.transport.js';

export async function startMcpServer(
  transport: 'stdio' | 'http' = 'stdio',
  port: number = 3001
): Promise<void> {
  const server = createMcpServer();

  if (transport === 'stdio') {
    console.log('Starting MCP server with stdio transport...');
    await startStdioTransport(server);
  } else {
    console.log(`Starting MCP server with HTTP/SSE transport on port ${port}...`);
    await startHttpSseTransport(server, port);
  }
}

export default startMcpServer;
