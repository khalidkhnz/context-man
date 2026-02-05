import { z } from 'zod';

export type SearchResultType = 'document' | 'skill' | 'snippet' | 'prompt';

export const SearchQuerySchema = z.object({
  query: z.string().min(1),
  projectSlug: z.string().optional(),
  types: z.array(z.enum(['document', 'skill', 'snippet', 'prompt'])).optional(),
  tags: z.array(z.string()).optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

export type SearchQueryInput = {
  query: string;
  projectSlug?: string;
  types?: ('document' | 'skill' | 'snippet' | 'prompt')[];
  tags?: string[];
  limit?: number;
  offset?: number;
};

export interface SearchResult {
  type: SearchResultType;
  projectSlug: string;
  name: string;
  title?: string;
  excerpt: string;
  score: number;
  tags: string[];
  updatedAt: Date;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
}
