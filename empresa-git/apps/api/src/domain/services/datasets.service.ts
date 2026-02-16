import { generateDatasetId } from '../lib/id.js';
import * as storage from '../lib/storage.js';
import { enqueueDatasetIngest } from '../lib/queue.js';
import type { DatasetMetadata } from '../types.js';
import { AppError } from '../lib/errors.js';

/**
 * Create a new dataset entry
 */
export async function createDataset(
    filename: string,
    size: number,
    originalPath: string
): Promise<DatasetMetadata> {
    const id = generateDatasetId();

    const meta: DatasetMetadata = {
        id,
        filename,
        originalPath,
        size,
        createdAt: new Date().toISOString(),
        status: 'new',
    };

    await storage.saveDatasetMeta(meta);

    // Enqueue for processing
    await enqueueDatasetIngest(id);

    return meta;
}

/**
 * Get dataset by ID
 */
export async function getDataset(id: string): Promise<DatasetMetadata> {
    const meta = await storage.getDatasetMeta(id);

    if (!meta) {
        throw new AppError(404, `Dataset ${id} not found`, 'DATASET_NOT_FOUND');
    }

    return meta;
}

/**
 * List all datasets
 */
export async function listDatasets(): Promise<DatasetMetadata[]> {
    const index = await storage.readIndex();
    return Object.values(index.datasets);
}

/**
 * Delete dataset
 */
export async function deleteDataset(id: string): Promise<boolean> {
    const deleted = await storage.deleteDataset(id);

    if (!deleted) {
        throw new AppError(404, `Dataset ${id} not found`, 'DATASET_NOT_FOUND');
    }

    return true;
}

/**
 * Update dataset metadata
 */
export async function updateDatasetMeta(
    id: string,
    updates: Partial<DatasetMetadata>
): Promise<DatasetMetadata> {
    const meta = await getDataset(id);

    const updated = {
        ...meta,
        ...updates,
    };

    await storage.saveDatasetMeta(updated);
    return updated;
}
