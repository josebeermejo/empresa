import { FastifyInstance } from 'fastify';
import { validateParams, validateBody } from '../lib/validation.js';
import * as fixesService from '../domain/services/fixes.service.js';
import { FixPreviewRequest, FixApplyRequest } from '../domain/dto.js';
import { z } from 'zod';

const DatasetIdParams = z.object({
    id: z.string(),
});

export default async function fixesRoutes(fastify: FastifyInstance) {
    /**
     * Preview fixes for a dataset
     */
    fastify.post<{ Params: { id: string } }>(
        '/api/datasets/:id/fixes/preview',
        async (request, reply) => {
            const { id } = validateParams(DatasetIdParams, request.params);
            const body = validateBody(FixPreviewRequest, request.body);

            const previews = await fixesService.previewFixes(
                id,
                body.ruleIds,
                body.limit
            );

            return { previews };
        }
    );

    /**
     * Apply fixes to a dataset
     */
    fastify.post<{ Params: { id: string } }>(
        '/api/datasets/:id/fixes/apply',
        async (request, reply) => {
            const { id } = validateParams(DatasetIdParams, request.params);
            const body = validateBody(FixApplyRequest, request.body);

            const result = await fixesService.applyFixes(
                id,
                body.ruleIds,
                body.autoApply
            );

            return result;
        }
    );
}
