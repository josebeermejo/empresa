import prisma from '../client';
import { Prisma } from '@prisma/client';

export const RulesRepo = {
    async listByOrg(orgId: string) {
        return prisma.rule.findMany({
            where: { orgId },
            orderBy: { kind: 'asc' },
        });
    },

    async create(orgId: string, data: { name: string; kind: string; severity: string; spec: any }) {
        return prisma.rule.create({
            data: {
                orgId,
                ...data,
            },
        });
    },

    async update(id: string, data: Prisma.RuleUpdateInput) {
        return prisma.rule.update({
            where: { id },
            data,
        });
    },

    async delete(id: string) {
        return prisma.rule.delete({
            where: { id },
        });
    },

    async getById(id: string) {
        return prisma.rule.findUnique({ where: { id } });
    }
};
