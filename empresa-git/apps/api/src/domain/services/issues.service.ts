import type { Issue } from '../dto.js';
import { getDataset } from './datasets.service.js';

/**
 * Generate deterministic issues based on dataset ID
 * This is a stub - real implementation will call py-quality service
 */
export async function detectIssues(datasetId: string): Promise<Issue[]> {
    // Verify dataset exists
    await getDataset(datasetId);

    // Generate deterministic issues based on hash of ID
    const hash = simpleHash(datasetId);
    const issueCount = 3 + (hash % 6); // 3-8 issues

    const issues: Issue[] = [];

    // Email issues
    if (hash % 3 === 0) {
        issues.push({
            kind: 'email_invalid',
            severity: 'error',
            row: 2,
            col: 'email',
            details: {
                value: 'maria.garcia@',
                reason: 'Incomplete email domain',
            },
        });
    }

    // Phone issues
    if (hash % 3 === 1) {
        issues.push({
            kind: 'phone_invalid',
            severity: 'warn',
            row: 6,
            col: 'telefono',
            details: {
                value: '600234567',
                reason: 'Missing country code',
            },
        });
    }

    // Duplicate
    if (hash % 2 === 0) {
        issues.push({
            kind: 'duplicate',
            severity: 'warn',
            row: 5,
            col: null,
            details: {
                duplicateOf: 1,
                matchFields: ['nombre', 'email'],
            },
        });
    }

    // Date format
    if (hash % 5 === 0) {
        issues.push({
            kind: 'date_format',
            severity: 'error',
            row: 2,
            col: 'fecha',
            details: {
                value: '15/02/2024',
                expected: 'ISO 8601 (YYYY-MM-DD)',
            },
        });
    }

    // Price issues
    if (hash % 4 === 0) {
        issues.push({
            kind: 'price_zero',
            severity: 'warn',
            row: 4,
            col: 'precio',
            details: {
                value: 0,
                reason: 'Zero price may indicate missing data',
            },
        });
    }

    // Negative price
    if (hash % 7 === 0) {
        issues.push({
            kind: 'price_negative',
            severity: 'error',
            row: 8,
            col: 'precio',
            details: {
                value: -5.5,
                reason: 'Negative prices are invalid',
            },
        });
    }

    // Missing values
    if (hash % 3 === 2) {
        issues.push({
            kind: 'missing_value',
            severity: 'error',
            row: 3,
            col: 'telefono',
            details: {
                reason: 'Required field is empty',
            },
        });
    }

    // Inconsistent case
    if (hash % 6 === 0) {
        issues.push({
            kind: 'inconsistent_case',
            severity: 'info',
            row: 6,
            col: 'email',
            details: {
                value: 'LUIS@EXAMPLE.COM',
                suggestion: 'luis@example.com',
            },
        });
    }

    return issues.slice(0, issueCount);
}

/**
 * Simple hash function for deterministic results
 */
function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}
