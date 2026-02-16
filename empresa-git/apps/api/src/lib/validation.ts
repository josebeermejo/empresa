import { z, ZodSchema } from 'zod';
import { AppError } from './errors.js';

/**
 * Parse and validate data against a Zod schema
 * Throws AppError with 400 status on validation failure
 */
export function validateData<T>(schema: ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data);

    if (!result.success) {
        const errors = result.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
        }));

        throw new AppError(
            400,
            'Validation failed',
            'VALIDATION_ERROR',
            { errors }
        );
    }

    return result.data;
}

/**
 * Validate query parameters
 */
export function validateQuery<T>(schema: ZodSchema<T>, query: unknown): T {
    return validateData(schema, query);
}

/**
 * Validate request body
 */
export function validateBody<T>(schema: ZodSchema<T>, body: unknown): T {
    return validateData(schema, body);
}

/**
 * Validate URL params
 */
export function validateParams<T>(schema: ZodSchema<T>, params: unknown): T {
    return validateData(schema, params);
}
