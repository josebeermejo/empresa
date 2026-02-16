import { FastifyInstance } from 'fastify';
import { validateParams, validateBody } from '../lib/validation.js';
import * as rulesService from '../domain/services/rules.service.js';
import { RuleSpec } from '../domain/dto.js';
import { z } from 'zod';

const RuleIdParams = z.object({
    id: z.string(),
});

export default async function rulesRoutes(fastify: FastifyInstance) {
    /**
     * List all rules
     */
    fastify.get('/api/rules', async (request, reply) => {
        const rules = await rulesService.getRules();
        return { rules };
    });

    /**
     * Get single rule
     */
    fastify.get<{ Params: { id: string } }>(
        '/api/rules/:id',
        async (request, reply) => {
            const { id } = validateParams(RuleIdParams, request.params);
            const rule = await rulesService.getRule(id);
            return rule;
        }
    );

    /**
     * Create a new rule
     */
    fastify.post('/api/rules', async (request, reply) => {
        const input = validateBody(
            RuleSpec.omit({ id: true, createdAt: true, updatedAt: true }),
            request.body
        );

        const rule = await rulesService.createRule(input);
        return reply.status(201).send(rule);
    });

    /**
     * Update a rule
     */
    fastify.put<{ Params: { id: string } }>(
        '/api/rules/:id',
        async (request, reply) => {
            const { id } = validateParams(RuleIdParams, request.params);
            const updates = validateBody(
                RuleSpec.partial().omit({ id: true, createdAt: true }),
                request.body
            );

            const rule = await rulesService.updateRule(id, updates);
            return rule;
        }
    );

    /**
     * Delete a rule
     */
    fastify.delete<{ Params: { id: string } }>(
        '/api/rules/:id',
        async (request, reply) => {
            const { id } = validateParams(RuleIdParams, request.params);
            await rulesService.deleteRule(id);
            return { deleted: true };
        }
    );
}
