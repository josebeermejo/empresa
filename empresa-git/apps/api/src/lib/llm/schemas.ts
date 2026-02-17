import { z } from 'zod';

export const ClassifyOutSchema = z.object({
    type: z.string(),
    confidence: z.number().min(0).max(1),
    rationaleShort: z.string().max(240),
});

export const ExplainOutSchema = z.object({
    explanation: z.string().max(360),
    recommendation: z.string().max(360),
});

// For future rules assistant
export const RuleSpecOutSchema = z.object({
    rule: z.record(z.any()), // Placeholder for now
    tests: z.array(z.object({ input: z.any(), expect: z.any() })).min(3),
});

export type ClassifyOut = z.infer<typeof ClassifyOutSchema>;
export type ExplainOut = z.infer<typeof ExplainOutSchema>;
export type RuleSpecOut = z.infer<typeof RuleSpecOutSchema>;
