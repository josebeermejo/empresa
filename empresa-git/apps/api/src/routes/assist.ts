import { FastifyInstance } from 'fastify';
import { validateBody } from '../lib/validation.js';
import * as assistService from '../domain/services/assist.service.js';
import {
    AssistClassifyRequest,
    AssistExplainRequest,
    AssistRagRequest,
} from '../domain/dto.js';
import env from '../config/env.js';

export default async function assistRoutes(fastify: FastifyInstance) {
    /**
     * Classify a column header
     */
    fastify.post('/api/assist/classify', async (request, reply) => {
        if (env.llmProvider !== 'mock') {
            return reply.status(501).send({
                error: {
                    message: `LLM provider '${env.llmProvider}' not configured in this environment`,
                    code: 'LLM_NOT_CONFIGURED',
                    statusCode: 501,
                },
            });
        }

        const body = validateBody(AssistClassifyRequest, request.body);
        const result = await assistService.classifyColumn(
            body.headerName,
            body.examples
        );

        return result;
    });

    /**
     * Explain an issue
     */
    fastify.post('/api/assist/explain', async (request, reply) => {
        if (env.llmProvider !== 'mock') {
            return reply.status(501).send({
                error: {
                    message: `LLM provider '${env.llmProvider}' not configured in this environment`,
                    code: 'LLM_NOT_CONFIGURED',
                    statusCode: 501,
                },
            });
        }

        const body = validateBody(AssistExplainRequest, request.body);
        const result = await assistService.explainIssue(body.issue);

        return result;
    });

    /**
     * Query documentation (RAG)
     */
    fastify.post('/api/assist/rag', async (request, reply) => {
        const body = validateBody(AssistRagRequest, request.body);
        const result = await assistService.queryDocs(body.query);

        return result;
    });
}
