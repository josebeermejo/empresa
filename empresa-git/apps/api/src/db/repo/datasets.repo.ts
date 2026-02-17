import prisma from '../client';
import { Prisma } from '@prisma/client';

export const DatasetsRepo = {
    async create(projectId: string, filename: string, meta: Record<string, any> = {}) {
        return prisma.dataset.create({
            data: {
                projectId,
                filename,
                status: 'new',
                meta,
            },
        });
    },

    async getById(id: string) {
        return prisma.dataset.findUnique({
            where: { id },
            include: {
                columns: true,
                projectRel: true,
            },
        });
    },

    async updateStatus(id: string, status: string, meta?: Record<string, any>) {
        const data: Prisma.DatasetUpdateInput = { status };
        if (meta) {
            data.meta = meta;
        }
        return prisma.dataset.update({
            where: { id },
            data,
        });
    },

    async delete(id: string) {
        return prisma.dataset.delete({
            where: { id },
        });
    },

    async listByProject(projectId: string) {
        return prisma.dataset.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' }
        });
    }
};
