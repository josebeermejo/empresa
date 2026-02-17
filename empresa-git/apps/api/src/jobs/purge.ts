import { CronJob } from 'cron';
import { prisma } from '../db/client';
import * as storage from '../lib/storage';
import { audit } from '../lib/audit';
import logger from '../lib/logger';
import env from '../config/env';

export class PurgeJob {
    private job: CronJob;

    constructor() {
        // Run at 03:00 AM every day
        this.job = new CronJob('0 3 * * *', this.run.bind(this));
    }

    start() {
        if (env.enablePurgeCron) {
            this.job.start();
            logger.info('Purge job scheduled for 03:00 AM daily');
        } else {
            logger.info('Purge cron disabled');
        }
    }

    async run() {
        logger.info('Starting daily dataset purge...');
        const retentionDate = new Date();
        retentionDate.setDate(retentionDate.getDate() - env.retentionDays);

        try {
            // Find expired datasets
            const expiredDatasets = await prisma.dataset.findMany({
                where: {
                    createdAt: {
                        lt: retentionDate,
                    },
                },
                select: { id: true },
            });

            if (expiredDatasets.length === 0) {
                logger.info('No expired datasets found');
                return;
            }

            logger.info({ count: expiredDatasets.length }, 'Found expired datasets to purge');

            for (const ds of expiredDatasets) {
                try {
                    // Delete from DB (Cascade should handle relations if configured, 
                    // but usually safer to use a service method or rely on DB constraints)
                    // We'll trust Prisma cascade or manual cleanup if needed.
                    // Ideally we should use the service method if it contains logic, 
                    // but importing service might cycle. We'll verify DB cascade.

                    // Actually, let's just delete from DB and storage.
                    await prisma.dataset.delete({ where: { id: ds.id } });

                    // Delete storage
                    await storage.deleteDatasetDir(ds.id);

                    // Audit
                    await audit('purge_dataset', ds.id, { reason: 'retention_policy', retentionDays: env.retentionDays });

                    logger.info({ datasetId: ds.id }, 'Purged dataset');
                } catch (err) {
                    logger.error({ datasetId: ds.id, err }, 'Failed to purge dataset');
                }
            }
        } catch (error) {
            logger.error({ error }, 'Error during purge job');
        }
    }
}

export const purgeJob = new PurgeJob();
