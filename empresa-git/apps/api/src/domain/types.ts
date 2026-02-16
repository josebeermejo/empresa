// Shared TypeScript types

export interface DatasetMetadata {
    id: string;
    filename: string;
    originalPath: string;
    size: number;
    createdAt: string;
    status: 'new' | 'processing' | 'ready' | 'error';
    summary?: {
        rows?: number;
        columns?: number;
        issues?: number;
    };
    error?: string;
}

export interface StorageIndex {
    datasets: Record<string, DatasetMetadata>;
    lastUpdated: string;
}

export interface QueueJob {
    datasetId: string;
    action: 'ingest' | 'analyze' | 'clean';
    metadata?: Record<string, any>;
}

export interface LLMProvider {
    name: string;
    classify(headerName: string, examples?: string[]): Promise<{
        type: string;
        confidence: number;
        rationaleShort: string;
    }>;
    explain(issue: any): Promise<{
        explanation: string;
        recommendation: string;
    }>;
}

export interface RagResult {
    answer: string;
    sources: string[];
    confidence?: number;
}
