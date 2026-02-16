import type { RuleSpec } from '../dto.js';
import * as storage from '../lib/storage.js';
import { generateRuleId } from '../lib/id.js';
import { AppError } from '../lib/errors.js';

/**
 * Get all rules
 */
export async function getRules(): Promise<RuleSpec[]> {
    return await storage.readRules();
}

/**
 * Get single rule by ID
 */
export async function getRule(id: string): Promise<RuleSpec> {
    const rules = await storage.readRules();
    const rule = rules.find((r) => r.id === id);

    if (!rule) {
        throw new AppError(404, `Rule ${id} not found`, 'RULE_NOT_FOUND');
    }

    return rule;
}

/**
 * Create a new rule
 */
export async function createRule(
    input: Omit<RuleSpec, 'id' | 'createdAt' | 'updatedAt'>
): Promise<RuleSpec> {
    const rules = await storage.readRules();

    const rule: RuleSpec = {
        ...input,
        id: generateRuleId(),
        createdAt: new Date().toISOString(),
    };

    rules.push(rule);
    await storage.writeRules(rules);

    return rule;
}

/**
 * Update an existing rule
 */
export async function updateRule(
    id: string,
    updates: Partial<Omit<RuleSpec, 'id' | 'createdAt'>>
): Promise<RuleSpec> {
    const rules = await storage.readRules();
    const index = rules.findIndex((r) => r.id === id);

    if (index === -1) {
        throw new AppError(404, `Rule ${id} not found`, 'RULE_NOT_FOUND');
    }

    const updated: RuleSpec = {
        ...rules[index],
        ...updates,
        updatedAt: new Date().toISOString(),
    };

    rules[index] = updated;
    await storage.writeRules(rules);

    return updated;
}

/**
 * Delete a rule
 */
export async function deleteRule(id: string): Promise<boolean> {
    const rules = await storage.readRules();
    const initialLength = rules.length;
    const filtered = rules.filter((r) => r.id !== id);

    if (filtered.length === initialLength) {
        throw new AppError(404, `Rule ${id} not found`, 'RULE_NOT_FOUND');
    }

    await storage.writeRules(filtered);
    return true;
}
