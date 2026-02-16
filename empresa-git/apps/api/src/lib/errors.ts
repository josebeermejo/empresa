import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import logger from './logger.js';

export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public code?: string,
        public details?: any
    ) {
        super(message);
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}

export function errorHandler(
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
) {
    logger.error(
        {
            err: error,
            req: {
                method: request.method,
                url: request.url,
            },
        },
        'Request error'
    );

    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    const code = error.code || 'INTERNAL_ERROR';

    // Don't expose stack trace in production
    const isDev = process.env.NODE_ENV === 'development';

    reply.status(statusCode).send({
        error: {
            message,
            code,
            statusCode,
            ...(isDev && error.stack ? { stack: error.stack } : {}),
            ...((error as any).details ? { details: (error as any).details } : {}),
        },
    });
}
