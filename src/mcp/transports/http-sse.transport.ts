import express from 'express';
import cors from 'cors';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

export async function startHttpSseTransport(server: McpServer, port: number): Promise<void> {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Store transport for cleanup
  let transport: SSEServerTransport | null = null;

  // SSE endpoint for MCP
  app.get('/sse', async (_req, res) => {
    console.log('SSE connection established');

    transport = new SSEServerTransport('/message', res);
    await server.connect(transport);
  });

  // Message endpoint for client-to-server messages
  app.post('/message', async (req, res) => {
    if (!transport) {
      res.status(400).json({ error: 'No active SSE connection' });
      return;
    }

    try {
      await transport.handlePostMessage(req, res);
    } catch (error) {
      console.error('Error handling message:', error);
      res.status(500).json({ error: 'Failed to process message' });
    }
  });

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', transport: 'http-sse' });
  });

  return new Promise((resolve) => {
    app.listen(port, () => {
      console.log(`MCP HTTP/SSE server running on port ${port}`);
      resolve();
    });
  });
}

export default startHttpSseTransport;
