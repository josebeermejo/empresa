import { RuleSpec, RuleKind } from '../domain/dto';
import * as rulesService from '../domain/services/rules.service';
import { writeRules } from '../lib/storage';

describe('Rules Service (Unit)', () => {
    beforeEach(async () => {
        // Reset rules to empty state
        await writeRules([]);
    });

    describe('RuleSpec validation', () => {
        it('should validate a correct rule spec', () => {
            const rule = {
                name: 'Email Validator',
                kind: 'email' as RuleKind,
                spec: {
                    pattern: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$',
                },
            };

            const result = RuleSpec.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(rule);
            expect(result.success).toBe(true);
        });

        it('should reject rule with invalid kind', () => {
            const rule = {
                name: 'Invalid Rule',
                kind: 'invalid_type',
                spec: {},
            };

            const result = RuleSpec.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(rule);
            expect(result.success).toBe(false);
        });

        it('should reject rule without required fields', () => {
            const rule = {
                kind: 'email' as RuleKind,
                spec: {},
            };

            const result = RuleSpec.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(rule);
            expect(result.success).toBe(false);
        });
    });

    describe('CRUD operations', () => {
        it('should create a new rule', async () => {
            const input = {
                name: 'Spanish Phone',
                kind: 'phone_es' as RuleKind,
                spec: {
                    countryCode: '+34',
                    length: 9,
                },
            };

            const rule = await rulesService.createRule(input);

            expect(rule).toHaveProperty('id');
            expect(rule.id).toMatch(/^rule_/);
            expect(rule).toHaveProperty('createdAt');
            expect(rule.name).toBe(input.name);
            expect(rule.kind).toBe(input.kind);
        });

        it('should get all rules', async () => {
            await rulesService.createRule({
                name: 'Rule 1',
                kind: 'email' as RuleKind,
                spec: {},
            });

            await rulesService.createRule({
                name: 'Rule 2',
                kind: 'numeric' as RuleKind,
                spec: {},
            });

            const rules = await rulesService.getRules();
            expect(rules).toHaveLength(2);
        });

        it('should get single rule by ID', async () => {
            const created = await rulesService.createRule({
                name: 'Test Rule',
                kind: 'regex' as RuleKind,
                spec: { pattern: '.*' },
            });

            const rule = await rulesService.getRule(created.id!);
            expect(rule.id).toBe(created.id);
            expect(rule.name).toBe('Test Rule');
        });

        it('should update a rule', async () => {
            const created = await rulesService.createRule({
                name: 'Original Name',
                kind: 'email' as RuleKind,
                spec: {},
            });

            const updated = await rulesService.updateRule(created.id!, {
                name: 'Updated Name',
            });

            expect(updated.name).toBe('Updated Name');
            expect(updated).toHaveProperty('updatedAt');
        });

        it('should delete a rule', async () => {
            const created = await rulesService.createRule({
                name: 'To Delete',
                kind: 'email' as RuleKind,
                spec: {},
            });

            const deleted = await rulesService.deleteRule(created.id!);
            expect(deleted).toBe(true);

            await expect(rulesService.getRule(created.id!)).rejects.toThrow();
        });

        it('should throw error when getting non-existent rule', async () => {
            await expect(rulesService.getRule('rule_nonexistent')).rejects.toThrow('not found');
        });

        it('should throw error when deleting non-existent rule', async () => {
            await expect(rulesService.deleteRule('rule_nonexistent')).rejects.toThrow('not found');
        });
    });
});
