import type { Issue, AssistClassifyResponse, AssistExplainResponse, AssistRagResponse } from '../dto.js';
import { llmProvider } from '../lib/llm.js';
import { localRAG } from '../lib/rag.js';

/**
 * Classify a column header to determine its data type
 */
export async function classifyColumn(
    headerName: string,
    examples?: string[]
): Promise<AssistClassifyResponse> {
    const result = await llmProvider.classify(headerName, examples);

    return {
        type: result.type,
        confidence: result.confidence,
        rationaleShort: result.rationaleShort,
    };
}

/**
 * Explain an issue and provide recommendations
 */
export async function explainIssue(issue: Issue): Promise<AssistExplainResponse> {
    const result = await llmProvider.explain(issue);

    return {
        explanation: result.explanation,
        recommendation: result.recommendation,
    };
}

/**
 * Query documentation using RAG
 */
export async function queryDocs(query: string): Promise<AssistRagResponse> {
    const result = await localRAG.query(query);

    return {
        answer: result.answer,
        sources: result.sources,
    };
}
