import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Create Organization
    const org = await prisma.organization.create({
        data: {
            name: 'DemoLab',
            region: 'EU',
        },
    });
    console.log(`Created Org: ${org.name} (${org.id})`);

    // 2. Create User (Admin)
    const admin = await prisma.user.create({
        data: {
            items: {
                orgId: org.id,
                email: 'admin@demolab.com',
                role: 'admin',
            }
        },
    });
    console.log(`Created Admin: ${admin.email}`);

    // 3. Create Project
    const project = await prisma.project.create({
        data: {
            orgId: org.id,
            name: 'Demo Project',
        },
    });
    console.log(`Created Project: ${project.name}`);

    // 4. Create Rules
    await prisma.rule.createMany({
        data: [
            {
                orgId: org.id,
                name: 'Phone ES',
                kind: 'phone_es',
                severity: 'error',
                spec: { pattern: '^(\\+34|0034)?[6789]\\d{8}$' },
            },
            {
                orgId: org.id,
                name: 'Price > 0',
                kind: 'price_gt0',
                severity: 'warn',
                spec: { min: 0, exclusive: true },
            },
        ],
    });
    console.log('Created Rules');

    // 5. Create Dataset
    const dataset = await prisma.dataset.create({
        data: {
            projectId: project.id,
            filename: 'sales_q1.csv',
            status: 'new',
            meta: {
                rowCount: 0,
                sizeBytes: 1024,
            },
            columns: {
                create: [
                    { name: 'id', inferredType: 'id', confidence: 1.0 },
                    { name: 'date', inferredType: 'date', confidence: 0.95 },
                    { name: 'amount', inferredType: 'currency', confidence: 0.98 },
                ],
            },
        },
    });
    console.log(`Created Dataset: ${dataset.filename}`);

    console.log('✅ Seed completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
