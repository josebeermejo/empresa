import { llmProvider } from '../lib/llm';
import { localRAG } from '../lib/rag';
import type { Issue } from '../domain/dto';

describe('Assist Features (Unit)', () => {
    describe('LLM Mock Provider', () => {
        describe('classify', () => {
            it('should classify email column correctly', async () => {
                const result = await llmProvider.classify('email');

                expect(result.type).toBe('email');
                expect(result.confidence).toBeGreaterThan(0.8);
                expect(result.rationaleShort).toBeTruthy();
            });

            it('should classify phone column correctly', async () => {
                const result = await llmProvider.classify('telefono');

                expect(result.type).toBe('phone_es');
                expect(result.confidence).toBeGreaterThan(0.8);
            });

            it('should classify date column correctly', async () => {
                const result = await llmProvider.classify('fecha');

                expect(result.type).toBe('date');
                expect(result.confidence).toBeGreaterThan(0.8);
            });

            it('should classify price column correctly', async () => {
                const result = await llmProvider.classify('precio');

                expect(result.type).toBe('numeric');
                expect(result.confidence).toBeGreaterThan(0.8);
            });

            it('should handle unknown columns', async () => {
                const result = await llmProvider.classify('random_column');

                expect(result.type).toBe('text');
                expect(result.confidence).toBeLessThanOrEqual(0.5);
            });

            it('should be deterministic for same input', async () => {
                const result1 = await llmProvider.classify('email');
                const result2 = await llmProvider.classify('email');

                expect(result1).toEqual(result2);
            });
        });

        describe('explain', () => {
            it('should explain email_invalid issue', async () => {
                const issue: Issue = {
                    kind: 'email_invalid',
                    severity: 'error',
                    row: 1,
                    col: 'email',
                    details: {},
                };

                const result = await llmProvider.explain(issue);

                expect(result.explanation).toContain('email');
                expect(result.recommendation).toBeTruthy();
            });

            it('should explain phone_invalid issue', async () => {
                const issue: Issue = {
                    kind: 'phone_invalid',
                    severity: 'warn',
                    row: 1,
                    col: 'phone',
                    details: {},
                };

                const result = await llmProvider.explain(issue);

                expect(result.explanation).toContain('phone');
                expect(result.recommendation).toBeTruthy();
            });

            it('should explain duplicate issue', async () => {
                const issue: Issue = {
                    kind: 'duplicate',
                    severity: 'warn',
                    row: 2,
                    col: null,
                    details: {},
                };

                const result = await llmProvider.explain(issue);

                expect(result.explanation).toContain('duplicate');
                expect(result.recommendation).toBeTruthy();
            });

            it('should provide default explanation for unknown issue types', async () => {
                const issue: Issue = {
                    kind: 'special_chars' as any,
                    severity: 'info',
                    row: 1,
                    col: 'name',
                    details: {},
                };

                const result = await llmProvider.explain(issue);

                expect(result.explanation).toBeTruthy();
                expect(result.recommendation).toBeTruthy();
            });
        });
    });

    describe('Local RAG', () => {
        it('should initialize and query documentation', async () => {
            const result = await localRAG.query('architecture');

            expect(result).toHaveProperty('answer');
            expect(result).toHaveProperty('sources');
            expect(Array.isArray(result.sources)).toBe(true);
        });

        it('should return no sources for irrelevant query', async () => {
            const result = await localRAG.query('xyznonexistent123');

            expect(result.sources).toHaveLength(0);
            expect(result.answer).toContain('No specific documentation');
        });

        it('should find relevant documentation', async () => {
            const result = await localRAG.query('API endpoint security');

            expect(result.sources.length).toBeGreaterThan(0);
            expect(result.answer).toBeTruthy();
        });

        it('should be case-insensitive', async () => {
            const result1 = await localRAG.query('ARCHITECTURE');
            const result2 = await local RAG.query('architecture');

            expect(result1.sources).toEqual(result2.sources);
        });
    });
});
