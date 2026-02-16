import { buildApp } from '../app';
import type { FastifyInstance } from 'fastify';
import { promises as fs } from 'fs';
import FormData from 'form-data';
import { Readable } from 'stream';

describe('Upload & Datasets Routes (E2E)', () => {
    let app: FastifyInstance;
    let datasetId: string;

    beforeAll(async () => {
        app = await buildApp();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /api/upload', () => {
        it('should upload a CSV file and return dataset ID', async () => {
            const csvContent = 'name,email\nJohn,john@example.com\nJane,jane@example.com';

            const form = new FormData();
            form.append('file', Buffer.from(csvContent), {
                filename: 'test.csv',
                contentType: 'text/csv',
            });

            const response = await app.inject({
                method: 'POST',
                url: '/api/upload',
                payload: form,
                headers: form.getHeaders(),
            });

            expect(response.statusCode).toBe(201);
            const body = JSON.parse(response.body);
            expect(body).toHaveProperty('datasetId');
            expect(body.datasetId).toMatch(/^ds_/);

            datasetId = body.datasetId;
        });

        it('should reject non-CSV/XLSX files', async () => {
            const form = new FormData();
            form.append('file', Buffer.from('test'), {
                filename: 'test.txt',
                contentType: 'text/plain',
            });

            const response = await app.inject({
                method: 'POST',
                url: '/api/upload',
                payload: form,
                headers: form.getHeaders(),
            });

            expect(response.statusCode).toBe(415);
        });

        it('should reject request without file', async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/api/upload',
            });

            expect(response.statusCode).toBe(400);
        });
    });

    describe('GET /api/datasets/:id', () => {
        it('should return dataset metadata', async () => {
            // Wait a bit for processing
            await new Promise((resolve) => setTimeout(resolve, 500));

            const response = await app.inject({
                method: 'GET',
                url: `/api/datasets/${datasetId}`,
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body).toHaveProperty('id', datasetId);
            expect(body).toHaveProperty('filename');
            expect(body).toHaveProperty('size');
            expect(body).toHaveProperty('status');
            expect(['new', 'processing', 'ready']).toContain(body.status);
        });

        it('should return 404 for non-existent dataset', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/api/datasets/ds_nonexistent',
            });

            expect(response.statusCode).toBe(404);
        });
    });

    describe('GET /api/datasets/:id/issues', () => {
        it('should return array of issues', async () => {
            const response = await app.inject({
                method: 'GET',
                url: `/api/datasets/${datasetId}/issues`,
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body).toHaveProperty('issues');
            expect(Array.isArray(body.issues)).toBe(true);
        });
    });

    describe('DELETE /api/datasets/:id', () => {
        it('should delete the dataset', async () => {
            const response = await app.inject({
                method: 'DELETE',
                url: `/api/datasets/${datasetId}`,
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body).toHaveProperty('deleted', true);
        });

        it('should return 404 for already deleted dataset', async () => {
            const response = await app.inject({
                method: 'DELETE',
                url: `/api/datasets/${datasetId}`,
            });

            expect(response.statusCode).toBe(404);
        });
    });
});
