import type { FixPreview } from '../dto.js';
import { getDataset, updateDatasetMeta } from './datasets.service.js';
import { detectIssues } from './issues.service.js';
import * as storage from '../lib/storage.js';
import { join } from 'path';

/**
 * Generate fix preview for a dataset
 * This is a stub - real implementation will use rules engine and py-quality
 */
export async function previewFixes(
    datasetId: string,
    ruleIds?: string[],
    limit = 50
): Promise<FixPreview[]> {
    // Verify dataset exists
    await getDataset(datasetId);

    // Get issues to generate fixes for
    const issues = await detectIssues(datasetId);

    const previews: FixPreview[] = [];

    for (const issue of issues) {
        if (previews.length >= limit) break;
        if (issue.row === null || issue.col === null) continue;

        let preview: FixPreview;

        switch (issue.kind) {
            case 'email_invalid':
                preview = {
                    row: issue.row,
                    col: issue.col,
                    before: issue.details.value,
                    after: issue.details.value + 'example.com',
                    ruleId: ruleIds?.[0] || null,
                    explanation: 'Complete email domain with example.com',
                };
                break;

            case 'phone_invalid':
                preview = {
                    row: issue.row,
                    col: issue.col,
                    before: issue.details.value,
                    after: '+34' + issue.details.value,
                    ruleId: ruleIds?.[0] || null,
                    explanation: 'Add Spanish country code +34',
                };
                break;

            case 'date_format':
                preview = {
                    row: issue.row,
                    col: issue.col,
                    before: issue.details.value,
                    after: convertToISO(issue.details.value),
                    ruleId: ruleIds?.[0] || null,
                    explanation: 'Convert to ISO 8601 format (YYYY-MM-DD)',
                };
                break;

            case 'inconsistent_case':
                preview = {
                    row: issue.row,
                    col: issue.col,
                    before: issue.details.value,
                    after: issue.details.suggestion,
                    ruleId: ruleIds?.[0] || null,
                    explanation: 'Normalize to lowercase',
                };
                break;

            case 'price_zero':
                preview = {
                    row: issue.row,
                    col: issue.col,
                    before: '0',
                    after: null,
                    ruleId: ruleIds?.[0] || null,
                    explanation: 'Zero price requires manual review - no automatic fix',
                };
                break;

            default:
                continue;
        }

        previews.push(preview);
    }

    return previews;
}

/**
 * Apply fixes to a dataset
 * This is a stub - creates a "clean" version in storage
 */
export async function applyFixes(
    datasetId: string,
    ruleIds?: string[],
    autoApply = false
): Promise<{ applied: number; rejected: number }> {
    const meta = await getDataset(datasetId);

    if (meta.status !== 'ready') {
        throw new Error('Dataset must be in ready state to apply fixes');
    }

    // Get fix previews
    const previews = await previewFixes(datasetId, ruleIds);

    // Count applicable vs rejected
    const applicable = previews.filter((p) => p.after !== null);
    const rejected = previews.filter((p) => p.after === null);

    // In stub mode, just create a marker file
    const cleanDir = storage.getDatasetPath(datasetId, 'clean');
    await storage.writeDatasetFile(datasetId, 'clean/applied.json', JSON.stringify({
        timestamp: new Date().toISOString(),
        applied: applicable.length,
        rejected: rejected.length,
        ruleIds,
    }, null, 2));

    // Update metadata
    await updateDatasetMeta(datasetId, {
        summary: {
            ...meta.summary,
            issues: (meta.summary?.issues || 0) - applicable.length,
        },
    });

    return {
        applied: applicable.length,
        rejected: rejected.length,
    };
}

/**
 * Helper: Convert date string to ISO format (stub)
 */
function convertToISO(dateStr: string): string {
    // Simple conversion for common formats
    // Real implementation would use a robust date parser
    const parts = dateStr.split(/[-\/]/);

    if (parts.length === 3) {
        // Assume DD/MM/YYYY if first part > 12
        if (parseInt(parts[0]) > 12) {
            return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
        // Otherwise assume MM/DD/YYYY
        return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
    }

    return dateStr;
}
