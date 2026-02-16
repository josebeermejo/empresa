import { z } from 'zod';

// ============================================
// Dataset Schemas
// ============================================

export const DatasetStatus = z.enum(['new', 'processing', 'ready', 'error']);

export const DatasetMeta = z.object({
    id: z.string(),
    filename: z.string(),
    size: z.number().positive(),
    createdAt: z.string().datetime(),
    status: DatasetStatus,
    summary: z
        .object({
            rows: z.number().optional(),
            columns: z.number().optional(),
            issues: z.number().optional(),
        })
        .optional(),
});

export type DatasetMeta = z.infer<typeof DatasetMeta>;
export type DatasetStatus = z.infer<typeof DatasetStatus>;

// ============================================
// Issue Schemas
// ============================================

export const IssueKind = z.enum([
    'email_invalid',
    'phone_invalid',
    'duplicate',
    'date_format',
    'currency',
    'price_zero',
    'price_negative',
    'id_missing',
    'missing_value',
    'inconsistent_case',
    'whitespace',
    'special_chars',
]);

export const IssueSeverity = z.enum(['info', 'warn', 'error']);

export const Issue = z.object({
    kind: IssueKind,
    severity: IssueSeverity,
    row: z.number().nullable(),
    col: z.string().nullable(),
    details: z.record(z.any()),
});

export type Issue = z.infer<typeof Issue>;
export type IssueKind = z.infer<typeof IssueKind>;
export type IssueSeverity = z.infer<typeof IssueSeverity>;

// ============================================
// Fix Schemas
// ============================================

export const FixPreview = z.object({
    row: z.number(),
    col: z.string(),
    before: z.string().nullable(),
    after: z.string().nullable(),
    ruleId: z.string().nullable(),
    explanation: z.string(),
});

export type FixPreview = z.infer<typeof FixPreview>;

export const FixPreviewRequest = z.object({
    ruleIds: z.array(z.string()).optional(),
    limit: z.number().positive().max(100).optional(),
});

export const FixApplyRequest = z.object({
    ruleIds: z.array(z.string()).optional(),
    autoApply: z.boolean().default(false),
});

export const FixApplyResponse = z.object({
    applied: z.number(),
    rejected: z.number(),
});

// ============================================
// Rule Schemas
// ============================================

export const RuleKind = z.enum([
    'regex',
    'numeric',
    'date',
    'map',
    'phone_es',
    'email',
    'enum',
    'required',
    'unique',
]);

export const RuleSpec = z.object({
    id: z.string().optional(), // Generated on creation
    name: z.string().min(1),
    kind: RuleKind,
    spec: z.record(z.any()), // Rule-specific configuration
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
});

export type RuleSpec = z.infer<typeof RuleSpec>;
export type RuleKind = z.infer<typeof RuleKind>;

// ============================================
// Assist Schemas
// ============================================

export const AssistClassifyRequest = z.object({
    headerName: z.string(),
    examples: z.array(z.string()).optional(),
});

export const AssistClassifyResponse = z.object({
    type: z.string(),
    confidence: z.number().min(0).max(1),
    rationaleShort: z.string(),
});

export const AssistExplainRequest = z.object({
    issue: Issue,
});

export const AssistExplainResponse = z.object({
    explanation: z.string(),
    recommendation: z.string(),
});

export const AssistRagRequest = z.object({
    query: z.string().min(1),
});

export const AssistRagResponse = z.object({
    answer: z.string(),
    sources: z.array(z.string()),
});

// ============================================
// Upload Schema
// ============================================

export const UploadResponse = z.object({
    datasetId: z.string(),
});
