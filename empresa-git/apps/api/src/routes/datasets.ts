import { FastifyInstance } from 'fastify';
import { validateBody, validateParams } from '../lib/validation.js';
import * as datasetsService from '../domain/services/datasets.service.js';
import * as storage from '../lib/storage.js';
import { DatasetMeta, UploadResponse } from '../domain/dto.js';
import { z } from 'zod';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import { join } from 'path';

const DatasetIdParams = z.object({
    id: z.string(),
});

export default async function datasetsRoutes(fastify: FastifyInstance) {
    /**
     * Upload a new dataset file
     */
    fastify.post('/api/upload', async (request, reply) => {
        const data = await request.file();

        if (!data) {
            return reply.status(400).send({
                error: {
                    message: 'No file provided',
                    code: 'NO_FILE',
                    statusCode: 400,
                },
            });
        }

        // Validate file type
        const filename = data.filename;
        const ext = filename.split('.').pop()?.toLowerCase();

        if (!ext || !['csv', 'xlsx', 'xls'].includes(ext)) {
            return reply.status(415).send({
                error: {
                    message: 'Unsupported file type. Only CSV and XLSX files are accepted.',
                    code: 'UNSUPPORTED_FILE_TYPE',
                    statusCode: 415,
                },
            });
        }

        // Create dataset entry
        const meta = await datasetsService.createDataset(
            filename,
            0, // Will be updated after file write
            ''
        );

        // Save file to storage
        const dir = await storage.ensureDatasetDir(meta.id);
        const filepath = join(dir, filename);

        try {
            await pipeline(data.file, createWriteStream(filepath));

            // Get file stats
            const stats = await import('fs/promises').then(fs => fs.stat(filepath));

            // Update metadata with actual size
            await datasetsService.updateDatasetMeta(meta.id, {
                size: stats.size,
                originalPath: filepath,
            });

            const response: UploadResponse = {
                datasetId: meta.id,
            };

            return reply.status(201).send(response);
        } catch (error: any) {
            // Clean up on error
            await datasetsService.deleteDataset(meta.id).catch(() => { });

            throw error;
        }
    });

    /**
     * Get dataset metadata
     */
    fastify.get<{ Params: { id: string } }>(
        '/api/datasets/:id',
        async (request, reply) => {
            const { id } = validateParams(DatasetIdParams, request.params);
            const meta = await datasetsService.getDataset(id);

            const response: DatasetMeta = {
                id: meta.id,
                filename: meta.filename,
                size: meta.size,
                createdAt: meta.createdAt,
                status: meta.status,
                summary: meta.summary,
            };

            return response;
        }
    );

    /**
     * Delete dataset
     */
    fastify.delete<{ Params: { id: string } }>(
        '/api/datasets/:id',
        async (request, reply) => {
            const { id } = validateParams(DatasetIdParams, request.params);
            await datasetsService.deleteDataset(id);

            return { deleted: true };
        }
    );

    /**
     * List all datasets
     */
    fastify.get('/api/datasets', async (request, reply) => {
        const datasets = await datasetsService.listDatasets();

        return {
            datasets: datasets.map((meta) => ({
                id: meta.id,
                filename: meta.filename,
                size: meta.size,
                createdAt: meta.createdAt,
                status: meta.status,
                summary: meta.summary,
            })),
        };
    });
}
