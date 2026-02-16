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
import datasetsRoutes from './routes/datasets.js';
import issuesRoutes from './routes/issues.js';
import fixesRoutes from './routes/fixes.js';
import rulesRoutes from './routes/rules.js';
import assistRoutes from './routes/assist.js';

export async function buildApp() {
    const app = Fastify({
        logger,
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

    // Register routes
    await app.register(healthRoutes);
    await app.register(datasetsRoutes);
    await app.register(issuesRoutes);
    await app.register(fixesRoutes);
    await app.register(rulesRoutes);
    await app.register(assistRoutes);

    return app;
}
