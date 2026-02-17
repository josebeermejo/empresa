import { z } from 'zod';

const envSchema = z.object({
    VITE_API_URL: z.string().url(),
    VITE_APP_NAME: z.string().default('AI Data Steward'),
    VITE_FEATURE_EXPORT_SHEETS: z.string().transform(v => v === 'true').default('false'),
    VITE_SEND_TO_LLM: z.string().optional().transform((v) => v === 'true').default('false'),
    VITE_PRIVACY_BANNER: z.string().optional().transform((v) => v === 'true').default('true'),
    DEV: z.boolean().default(false),
});

const _env = envSchema.safeParse(import.meta.env);

if (!_env.success) {
    console.error('❌ Invalid environment variables:', _env.error.format());
    throw new Error('Invalid environment variables');
}

export const env = _env.data;

export const API_URL = env.VITE_API_URL;
export const APP_NAME = env.VITE_APP_NAME;
export const FEATURE_EXPORT_SHEETS = env.VITE_FEATURE_EXPORT_SHEETS;
export const SEND_TO_LLM = env.VITE_SEND_TO_LLM;
export const PRIVACY_BANNER = env.VITE_PRIVACY_BANNER;
