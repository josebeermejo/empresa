import { promises as fs } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import type { RagResult } from '../domain/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to docs directory (relative to API)
const DOCS_DIR = join(__dirname, '../../../../docs');

/**
 * Simple RAG implementation that searches local documentation
 */
export class LocalRAG {
    private docsIndex: Map<string, string> = new Map();
    private initialized = false;

    /**
     * Initialize the RAG by indexing documentation files
     */
    async initialize() {
        if (this.initialized) return;

        try {
            const files = await fs.readdir(DOCS_DIR);
            const mdFiles = files.filter((f) => f.endsWith('.md'));

            for (const file of mdFiles) {
                const content = await fs.readFile(join(DOCS_DIR, file), 'utf-8');
                this.docsIndex.set(file, content);
            }

            this.initialized = true;
        } catch (error) {
            console.warn('Failed to initialize RAG index:', error);
        }
    }

    /**
     * Query the documentation
     */
    async query(query: string): Promise<RagResult> {
        await this.initialize();

        const queryLower = query.toLowerCase();
        const results: string[] = [];

        // Simple keyword search in documentation
        for (const [filename, content] of this.docsIndex.entries()) {
            const contentLower = content.toLowerCase();

            // Check if query terms are in the document
            const queryTerms = queryLower.split(/\s+/).filter((t) => t.length > 3);
            const matches = queryTerms.filter((term) => contentLower.includes(term));

            if (matches.length > 0) {
                results.push(filename);
            }
        }

        // Generate answer based on found documents
        let answer: string;
        if (results.length === 0) {
            answer =
                'No specific documentation found for your query. Please refer to the main README or check /docs for available documentation.';
        } else {
            const topDoc = results[0];
            const content = this.docsIndex.get(topDoc)!;

            // Extract a relevant snippet (first paragraph after a match)
            const lines = content.split('\n');
            const relevantLines: string[] = [];

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].toLowerCase();
                if (queryTerms.some((term) => line.includes(term))) {
                    // Found a match, collect surrounding context
                    for (let j = i; j < Math.min(i + 5, lines.length); j++) {
                        if (lines[j].trim()) {
                            relevantLines.push(lines[j]);
                        }
                        if (relevantLines.length >= 3) break;
                    }
                    break;
                }
            }

            answer = relevantLines.length > 0
                ? relevantLines.join(' ').slice(0, 500) + '...'
                : 'Information found in documentation. Please check the referenced files for details.';
        }

        return {
            answer,
            sources: results.slice(0, 3), // Return top 3 sources
            confidence: results.length > 0 ? 0.7 : 0.3,
        };
    }
}

export const localRAG = new LocalRAG();
