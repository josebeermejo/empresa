import { Queue, Worker, Job } from 'bullmq';
import env from '../config/env.js';
import logger from './logger.js';
import type { QueueJob } from '../domain/types.js';
import * as storage from './storage.js';

const connection = {
    host: env.redisUrl.includes('://')
        ? new URL(env.redisUrl).hostname
        : env.redisUrl.split(':')[0],
    port: env.redisUrl.includes('://')
        ? parseInt(new URL(env.redisUrl).port || '6379')
        : parseInt(env.redisUrl.split(':')[1] || '6379'),
};

/**
 * Dataset ingest queue
 */
export const ingestQueue = new Queue('dataset-ingest', { connection });

/**
 * Initialize queue workers
 */
export function startWorkers() {
    // Dataset ingest worker
    const ingestWorker = new Worker(
        'dataset-ingest',
        async (job: Job<QueueJob>) => {
            const { datasetId } = job.data;
            logger.info({ datasetId, jobId: job.id }, 'Processing dataset ingest job');

            try {
                // Update status to processing
                const meta = await storage.getDatasetMeta(datasetId);
                if (!meta) {
                    throw new Error(`Dataset ${datasetId} not found`);
                }

                meta.status = 'processing';
                await storage.saveDatasetMeta(meta);

                // Simulate processing (stub for now)
                await new Promise((resolve) => setTimeout(resolve, 2000));

                // Parse CSV/XLSX and extract basic summary (stub)
                meta.summary = {
                    rows: Math.floor(Math.random() * 1000) + 100,
                    columns: Math.floor(Math.random() * 20) + 5,
                    issues: Math.floor(Math.random() * 50),
                };

                meta.status = 'ready';
                await storage.saveDatasetMeta(meta);

                logger.info({ datasetId }, 'Dataset ingest completed');
                return { success: true };
            } catch (error: any) {
                logger.error({ datasetId, error }, 'Dataset ingest failed');

                // Update status to error
                const meta = await storage.getDatasetMeta(datasetId);
                if (meta) {
                    meta.status = 'error';
                    meta.error = error.message;
                    await storage.saveDatasetMeta(meta);
                }

                throw error;
            }
        },
        {
            connection,
            concurrency: 2,
        }
    );

    ingestWorker.on('completed', (job) => {
        logger.debug({ jobId: job.id }, 'Job completed');
    });

    ingestWorker.on('failed', (job, err) => {
        logger.error({ jobId: job?.id, error: err }, 'Job failed');
    });

    logger.info('Queue workers started');

    return { ingestWorker };
}

/**
 * Enqueue dataset for processing
 */
export async function enqueueDatasetIngest(datasetId: string) {
    const job = await ingestQueue.add(
        'ingest',
        { datasetId, action: 'ingest' },
        {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000,
            },
        }
    );

    logger.info({ datasetId, jobId: job.id }, 'Enqueued dataset ingest job');
    return job;
}
