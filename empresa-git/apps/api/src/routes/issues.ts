import { FastifyInstance } from 'fastify';
import { validateParams } from '../lib/validation.js';
import * as issuesService from '../domain/services/issues.service.js';
import { z } from 'zod';

const DatasetIdParams = z.object({
    id: z.string(),
});

export default async function issuesRoutes(fastify: FastifyInstance) {
    /**
     * Get issues for a dataset
     */
    fastify.get<{ Params: { id: string } }>(
        '/api/datasets/:id/issues',
        async (request, reply) => {
            const { id } = validateParams(DatasetIdParams, request.params);
            const issues = await issuesService.detectIssues(id);

            return { issues };
        }
    );
}
