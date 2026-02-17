import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import env from '../config/env.js';
import { MockProvider } from '../lib/llm/providers/mock.js';
import { RAGLoader } from '../lib/rag/loader';
import { RAGSearch } from '../lib/rag/search';
import path from 'path';

const llm = new MockProvider(); // Default to mock for now

const ClassifyBody = z.object({
    headerName: z.string(),
    examples: z.array(z.string()).optional(),
});

const ExplainBody = z.object({
    issue: z.any(),
});

const RagBody = z.object({
    query: z.string(),
});

export async function assistRoutes(fastify: FastifyInstance) {
    fastify.post('/assist/classify', async (req, reply) => {
        if (!env.sendToLlm) {
            return reply.status(501).send({
                code: 'AI_DISABLED',
                message: 'AI features are disabled by configuration (SEND_TO_LLM=false)',
            });
        }

        // Manual parsing/validation since we didn't setup fastify-zod yet
        const parse = ClassifyBody.safeParse(req.body);
        if (!parse.success) return reply.status(400).send(parse.error);

        const { headerName, examples } = parse.data;
        const result = await llm.classifyColumn({ headerName, examples });
        return result;
    });

    fastify.post('/assist/explain', async (req, reply) => {
        if (!env.sendToLlm) {
            return reply.status(501).send({
                code: 'AI_DISABLED',
                message: 'AI features are disabled by configuration (SEND_TO_LLM=false)',
            });
        }
        const parse = ExplainBody.safeParse(req.body);
        if (!parse.success) return reply.status(400).send(parse.error);

        const { issue } = parse.data;
        const result = await llm.explainIssue({ issue });
        return result;
    });

    fastify.post('/assist/rag', async (req, reply) => {
        const parse = RagBody.safeParse(req.body);
        if (!parse.success) return reply.status(400).send(parse.error);

        const { query } = parse.data;
        const docsPath = path.resolve(process.cwd(), '../../docs'); // Relative to apps/api
        const chunks = await RAGLoader.loadDocs(docsPath);
        const results = RAGSearch.search(query, chunks);

        return {
            answer: results.length
                ? `Based on documentation, here are some relevant sections:\n\n${results.map(r => r.content.slice(0, 150) + '...').join('\n\n')}`
                : "I couldn't find relevant information in the documentation.",
            sources: results.map(r => `/docs/${r.path}`),
        };
    });
}
