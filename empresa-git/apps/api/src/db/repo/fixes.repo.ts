import prisma from '../client';
import { Prisma } from '@prisma/client';

export type FixCreateInput = Omit<Prisma.FixCreateManyInput, 'datasetId'>;

export const FixesRepo = {
    async bulkInsert(datasetId: string, fixes: FixCreateInput[]) {
        return prisma.fix.createMany({
            data: fixes.map(fix => ({
                ...fix,
                datasetId,
            })),
        });
    },

    async listByDataset(datasetId: string) {
        return prisma.fix.findMany({
            where: { datasetId },
            orderBy: { createdAt: 'desc' },
        });
    }
};
