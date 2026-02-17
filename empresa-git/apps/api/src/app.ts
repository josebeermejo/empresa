import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import env from './config/env.js';
import logger from './lib/logger.js';
import { errorHandler } from './lib/errors.js';

// Routes
import healthRoutes from './routes/health.js';
import securityPlugin from './plugins/security.js';
import datasetsRoutes from './routes/datasets.js';
import issuesRoutes from './routes/issues.js';
import fixesRoutes from './routes/fixes.js';
import rulesRoutes from './routes/rules.js';
import { assistRoutes } from './routes/assist.js';
import { privacyRoutes } from './routes/privacy.js'; // This one was a named export in my previous step

export async function buildApp() {
    const app = Fastify({
        logger: logger as any, // Cast to any to avoid strict type mismatch with FastifyLogger
        requestIdLogLabel: 'reqId',
        disableRequestLogging: false,
    });

    // Security plugins
    await app.register(helmet, {
        contentSecurityPolicy: env.nodeEnv === 'development' ? false : undefined,
    });

    await app.register(cors, {
        origin: env.corsOrigin,
        credentials: true,
    });

    // Rate limiting
    await app.register(rateLimit, {
        max: env.rateLimitMax,
        timeWindow: '1 minute',
        errorResponseBuilder: () => ({
            error: {
                message: 'Rate limit exceeded. Please slow down your requests.',
                code: 'RATE_LIMIT_EXCEEDED',
                statusCode: 429,
            },
        }),
    });

    // Multipart for file uploads
    await app.register(multipart, {
        limits: {
            fileSize: env.maxUploadSize,
            files: 1,
        },
    });

    // Error handler
    app.setErrorHandler(errorHandler);

    // Register plugins
    await app.register(securityPlugin);

    // Register routes
    await app.register(healthRoutes);
    await app.register(datasetsRoutes, { prefix: '/api/datasets' });
    await app.register(issuesRoutes, { prefix: '/api/datasets' }); // Nested under dataset
    await app.register(fixesRoutes, { prefix: '/api/datasets' }); // Nested under dataset
    await app.register(rulesRoutes, { prefix: '/api/rules' });
    await app.register(assistRoutes, { prefix: '/api/assist' });
    await app.register(privacyRoutes, { prefix: '/api' });

    return app;
}
