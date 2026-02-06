import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // MongoDB
  MONGODB_URI: z.string().default('mongodb://localhost:27017/context-man'),

  // API Server
  API_PORT: z.coerce.number().default(7777),
  API_HOST: z.string().default('localhost'),

  // MCP Server
  MCP_HTTP_PORT: z.coerce.number().default(7778),
  MCP_TRANSPORT: z.enum(['stdio', 'http', 'both']).default('stdio'),

  // Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

export type Environment = z.infer<typeof envSchema>;

export const config = envSchema.parse(process.env);

export default config;
