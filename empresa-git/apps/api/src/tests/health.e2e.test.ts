import { buildApp } from '../app';
import type { FastifyInstance } from 'fastify';

describe('Health Routes (E2E)', () => {
    let app: FastifyInstance;

    beforeAll(async () => {
        app = await buildApp();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /health', () => {
        it('should return 200 and health status', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/health',
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body).toHaveProperty('status', 'ok');
            expect(body).toHaveProperty('time');
            expect(body).toHaveProperty('name');
        });
    });

    describe('GET /ready', () => {
        it('should return readiness status with dependency checks', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/ready',
            });

            expect([200, 503]).toContain(response.statusCode);
            const body = JSON.parse(response.body);
            expect(body).toHaveProperty('ready');
            expect(body).toHaveProperty('deps');
            expect(body.deps).toHaveProperty('redis');
        });
    });

    describe('GET /', () => {
        it('should return API info', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/',
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body).toHaveProperty('message');
        });
    });
});
