import fp from 'fastify-plugin';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import env from '../config/env';

/**
 * Security plugins configuration:
 * - Helmet for HTTP headers (CSP, HSTS, etc.)
 * - CORS for Cross-Origin Resource Sharing
 * - Rate Limit for DDoS protection
 */
export default fp(async (fastify) => {
    // 1. Helmet & CSP
    await fastify.register(helmet, {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", 'blob:'], // 'unsafe-inline' needed for Vite/some tools in dev
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:'],
                connectSrc: ["'self'", env.corsOrigin, 'http://localhost:5173'], // Allow connection to Web URL
                fontSrc: ["'self'", 'https:', 'data:'],
                objectSrc: ["'none'"],
                baseUri: ["'self'"],
                frameAncestors: ["'none'"],
                upgradeInsecureRequests: env.nodeEnv === 'production' ? [] : null,
            },
            reportOnly: env.cspReportOnly,
        },
        global: true,
    });

    // 2. CORS
    await fastify.register(cors, {
        origin: (origin, cb) => {
            // Allow requests with no origin (like mobile apps/curl requests)
            if (!origin) return cb(null, true);

            const allowedOrigins = [env.corsOrigin];
            if (env.nodeEnv === 'development') {
                allowedOrigins.push('http://localhost:5173');
                allowedOrigins.push('http://127.0.0.1:5173');
            }

            if (allowedOrigins.includes(origin)) {
                cb(null, true);
                return;
            }

            // Simple check for dev environment loose CORS if needed, but strictly it's better to list them.
            // For now, if it matches, good.
            cb(new Error("Not allowed by CORS"), false);
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true, // Only if frontend needs to send cookies/auth headers
        maxAge: 86400, // 24 hours cache for preflight
    });

    // 3. Rate Limiting
    await fastify.register(rateLimit, {
        max: env.rateLimitMax,
        timeWindow: '1 minute',
        allowList: ['127.0.0.1', 'localhost'], // Whitelist local for dev joy
        errorResponseBuilder: (request, context) => {
            return {
                statusCode: 429,
                code: 'TOO_MANY_REQUESTS',
                message: `Rate limit exceeded, retry in ${context.after} seconds`,
                date: Date.now(),
                expiresIn: context.after,
            };
        },
    });

    fastify.log.info('Security plugins registered (Helmet, CORS, RateLimit)');
});
