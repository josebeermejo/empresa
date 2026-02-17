import prisma from '../client';
import { Prisma } from '@prisma/client';

export type IssueCreateInput = Omit<Prisma.IssueCreateManyInput, 'datasetId'>;

export const IssuesRepo = {
    async bulkInsert(datasetId: string, issues: IssueCreateInput[]) {
        // Prisma createMany is efficient for bulk inserts
        return prisma.issue.createMany({
            data: issues.map(issue => ({
                ...issue,
                datasetId,
            })),
        });
    },

    async listByDataset(datasetId: string, filter?: { kind?: string; severity?: string }) {
        const where: Prisma.IssueWhereInput = { datasetId };
        if (filter?.kind) where.kind = filter.kind;
        if (filter?.severity) where.severity = filter.severity;

        return prisma.issue.findMany({
            where,
            orderBy: { createdAt: 'desc' }, // or by rowNo
        });
    },

    async deleteByDataset(datasetId: string) {
        return prisma.issue.deleteMany({
            where: { datasetId },
        });
    },

    async countByDataset(datasetId: string) {
        return prisma.issue.count({ where: { datasetId } });
    }
};
