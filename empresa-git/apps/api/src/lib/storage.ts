import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import env from '../config/env.js';
import type { DatasetMetadata, StorageIndex } from '../domain/types.js';
import logger from './logger.js';

const STORAGE_DIR = env.storageDir;
const INDEX_FILE = join(STORAGE_DIR, 'index.json');
const RULES_FILE = join(STORAGE_DIR, 'rules.json');

/**
 * Ensure storage directory exists
 */
export async function ensureStorageDir(): Promise<void> {
    try {
        await fs.access(STORAGE_DIR);
    } catch {
        await fs.mkdir(STORAGE_DIR, { recursive: true });
        logger.info({ dir: STORAGE_DIR }, 'Created storage directory');
    }
}

/**
 * Read storage index (metadata of all datasets)
 */
export async function readIndex(): Promise<StorageIndex> {
    try {
        const data = await fs.readFile(INDEX_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            // File doesn't exist, create empty index
            const emptyIndex: StorageIndex = {
                datasets: {},
                lastUpdated: new Date().toISOString(),
            };
            await writeIndex(emptyIndex);
            return emptyIndex;
        }
        throw error;
    }
}

/**
 * Write storage index
 */
export async function writeIndex(index: StorageIndex): Promise<void> {
    await ensureStorageDir();
    index.lastUpdated = new Date().toISOString();
    await fs.writeFile(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');
}

/**
 * Get dataset metadata by ID
 */
export async function getDatasetMeta(id: string): Promise<DatasetMetadata | null> {
    const index = await readIndex();
    return index.datasets[id] || null;
}

/**
 * Save dataset metadata
 */
export async function saveDatasetMeta(meta: DatasetMetadata): Promise<void> {
    const index = await readIndex();
    index.datasets[meta.id] = meta;
    await writeIndex(index);
}

/**
 * Delete dataset metadata and files
 */
export async function deleteDataset(id: string): Promise<boolean> {
    const index = await readIndex();
    const meta = index.datasets[id];

    if (!meta) {
        return false;
    }

    // Delete dataset directory
    const datasetDir = join(STORAGE_DIR, 'datasets', id);
    try {
        await fs.rm(datasetDir, { recursive: true, force: true });
    } catch (error) {
        logger.warn({ id, error }, 'Failed to delete dataset directory');
    }

    // Remove from index
    delete index.datasets[id];
    await writeIndex(index);

    return true;
}

/**
 * Get dataset file path
 */
export function getDatasetPath(id: string, subpath = ''): string {
    return join(STORAGE_DIR, 'datasets', id, subpath);
}

/**
 * Ensure dataset directory exists
 */
export async function ensureDatasetDir(id: string): Promise<string> {
    const dir = getDatasetPath(id, 'raw');
    await fs.mkdir(dir, { recursive: true });
    return dir;
}

/**
 * Read rules from JSON file
 */
export async function readRules(): Promise<any[]> {
    try {
        const data = await fs.readFile(RULES_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            // Create default rules file
            const defaultRules: any[] = [];
            await writeRules(defaultRules);
            return defaultRules;
        }
        throw error;
    }
}

/**
 * Write rules to JSON file
 */
export async function writeRules(rules: any[]): Promise<void> {
    await ensureStorageDir();
    await fs.writeFile(RULES_FILE, JSON.stringify(rules, null, 2), 'utf-8');
}

/**
 * Read a dataset file
 */
export async function readDatasetFile(id: string, filename: string): Promise<Buffer> {
    const filePath = getDatasetPath(id, `raw/${filename}`);
    return await fs.readFile(filePath);
}

/**
 * Write a dataset file
 */
export async function writeDatasetFile(
    id: string,
    filename: string,
    content: Buffer | string
): Promise<void> {
    const dir = await ensureDatasetDir(id);
    const filePath = join(dir, filename);
    await fs.writeFile(filePath, content);
}

/**
 * Delete dataset directory and all its contents
 */
export async function deleteDatasetDir(datasetId: string): Promise<void> {
    const dir = join(STORAGE_DIR, 'datasets', datasetId);
    try {
        await fs.rm(dir, { recursive: true, force: true });
    } catch (error) {
        logger.warn({ datasetId, error }, 'Failed to delete dataset directory');
    }
}
