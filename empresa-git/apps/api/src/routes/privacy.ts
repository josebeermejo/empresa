import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { audit } from '../lib/audit';

const ConsentSchema = z.object({
    acceptedAt: z.string().datetime(),
    userAgent: z.string().optional(),
});

export const privacyRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.post('/consent', async (request, reply) => {
        const result = ConsentSchema.safeParse(request.body);

        if (!result.success) {
            return reply.status(400).send({
                code: 'VALIDATION_ERROR',
                message: 'Invalid consent data',
                details: result.error.flatten(),
            });
        }

        const { acceptedAt, userAgent } = result.data;
        const ip = request.ip;

        // Log consent acceptance audit
        await audit('consent_accept', 'user-consent', {
            acceptedAt,
            userAgent: userAgent || request.headers['user-agent'],
            ipHash: 'hashed-ip-placeholder', // In real app, hash IP for privacy
        });

        return { success: true };
    });
};
