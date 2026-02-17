import fs from 'fs/promises';
import path from 'path';

export interface Chunk {
    docId: string;
    path: string;
    title: string;
    content: string;
}

let cache: Chunk[] | null = null;

// Simple chunk strategy: split by headers or just paragraphs
// For now, let's keep it simple: whole file or split by '##'
export const RAGLoader = {
    async loadDocs(docsPath: string): Promise<Chunk[]> {
        if (cache) return cache;

        const chunks: Chunk[] = [];
        try {
            const files = await fs.readdir(docsPath);
            for (const file of files) {
                if (!file.endsWith('.md')) continue;

                const filePath = path.join(docsPath, file);
                const content = await fs.readFile(filePath, 'utf-8');

                // Naive splitting by double newline to get paragraphs/sections
                // In a real implementation we might use a markdown parser
                const sections = content.split(/^## /m);

                sections.forEach((section, idx) => {
                    if (!section.trim()) return;
                    const lines = section.split('\n');
                    const title = idx === 0 ? lines[0].replace(/^# /, '') : lines[0].trim();
                    const body = idx === 0 ? section : '## ' + section;

                    chunks.push({
                        docId: `${file}-${idx}`,
                        path: file,
                        title,
                        content: body.slice(0, 1000), // Truncate for now 
                    });
                });
            }
            cache = chunks;
        } catch (e) {
            console.warn('RAG Loader: could not load docs from', docsPath, e);
        }
        return chunks;
    },
};
