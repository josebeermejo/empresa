import { FastifyInstance } from 'fastify';
import env from '../config/env.js';
import { ingestQueue } from '../lib/queue.js';

export default async function healthRoutes(fastify: FastifyInstance) {
    fastify.get('/', async () => {
        return { message: `${env.appName} API v1` };
    });

    fastify.get('/health', async () => {
        return {
            status: 'ok',
            time: new Date().toISOString(),
            name: env.appName,
        };
    });

    fastify.get('/ready', async (request, reply) => {
        const checks: Record<string, string> = {};

        // Check Redis connection
        try {
            await ingestQueue.client.ping();
            checks.redis = 'ok';
        } catch (error) {
            checks.redis = 'down';
        }

        const ready = Object.values(checks).every((v) => v === 'ok');

        // In production, return 503 if not ready
        if (!ready && env.nodeEnv === 'production') {
            reply.status(503);
        }

        return {
            ready,
            deps: checks,
        };
    });
}
