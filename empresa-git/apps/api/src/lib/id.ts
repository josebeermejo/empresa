import { nanoid } from 'nanoid';

/**
 * Generate a unique ID for datasets, rules, etc.
 * Uses nanoid for URL-friendly, collision-resistant IDs
 */
export function generateId(prefix = ''): string {
    const id = nanoid(12); // 12 chars = ~100 years to have 1% collision at 1000 IDs/hour
    return prefix ? `${prefix}_${id}` : id;
}

/**
 * Generate a dataset ID
 */
export function generateDatasetId(): string {
    return generateId('ds');
}

/**
 * Generate a rule ID
 */
export function generateRuleId(): string {
    return generateId('rule');
}
