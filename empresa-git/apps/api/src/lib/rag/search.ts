
import { Chunk } from './loader';

export const RAGSearch = {
    search(query: string, chunks: Chunk[], topK = 3): Chunk[] {
        if (!chunks.length) return [];

        const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 3);

        // Naive scoring: count matches
        const scored = chunks.map(chunk => {
            let score = 0;
            const contentLower = chunk.content.toLowerCase();
            queryTerms.forEach(term => {
                if (contentLower.includes(term)) score += 1;
                if (chunk.title.toLowerCase().includes(term)) score += 2; // Title bonus
            });
            return { chunk, score };
        });

        // Determine results
        const results = scored
            .sort((a, b) => b.score - a.score)
            .filter(s => s.score > 0)
            .slice(0, topK)
            .map(s => s.chunk);

        // If no direct matches, return general docs or empty?
        // For now, return top chunks even if score is low, or nothing.
        // Let's stick to score > 0
        return results;
    },
};
