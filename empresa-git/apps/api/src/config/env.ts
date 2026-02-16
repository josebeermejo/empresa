import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config();

export interface EnvConfig {
    nodeEnv: string;
    port: number;
    appName: string;
    lang: string;
    region: string;
    storageDir: string;
    redisUrl: string;
    retentionDays: number;
    llmProvider: string;
    llmApiKey?: string;
    llmModel?: string;
    featureExportSheets: boolean;
    corsOrigin: string;
    logLevel: string;
    maxUploadSize: number;
    rateLimitMax: number;
}

const env: EnvConfig = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || process.env.PORT_API || '8080', 10),
    appName: process.env.APP_NAME || 'ai-data-steward',
    lang: process.env.LANG || 'es-ES',
    region: process.env.REGION || 'EU',
    storageDir: resolve(process.cwd(), process.env.STORAGE_DIR || '../../storage'),
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    retentionDays: parseInt(process.env.RETENTION_DAYS || '30', 10),
    llmProvider: process.env.LLM_PROVIDER || 'mock',
    llmApiKey: process.env.LLM_API_KEY,
    llmModel: process.env.LLM_MODEL,
    featureExportSheets: process.env.FEATURE_EXPORT_SHEETS === 'true',
    corsOrigin: process.env.API_CORS_ORIGIN || 'http://localhost:5173',
    logLevel: process.env.LOG_LEVEL || 'info',
    maxUploadSize: parseInt(process.env.MAX_UPLOAD_SIZE || '52428800', 10), // 50MB default
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
};

export default env;
