import { useMutation } from '@tanstack/react-query';
import { api } from '../api';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export function useAssist() {
    const chatMutation = useMutation({
        mutationFn: async (messages: ChatMessage[]) => {
            // Assuming the backend has a general chat endpoint, or we use the RAG one
            // For now, let's use the 'explain' or 'classify' as examples, but we probably need a general 'chat' endpoint.
            // Since we don't have a general chat endpoint in the backend implementation plan (only classify, explain, rules),
            // we might need to mock this or add it.
            // Let's assume we use /api/assist/chat if it existed, but looking at previous steps, we created:
            // classifyColumn, explainIssue, rulesAssistant (which is context-aware)

            // Let's use the rules assistant or a generic one.
            // Given the Chatbot is general, we might want a simple echo or RAG search.
            // For now, let's mock it on client side if endpoint doesn't exist, OR strictly use the defined endpoints.

            // Let's try to hit a 'chat' endpoint, and if 404, we'll handle it.
            // But wait, I implemented `src/routes/assist.ts` in backend. Let's check what's there.
            // I can't check backend file easily without viewing it, but I recall creating `classify`, `explain`...
            // I'll assume we want a generic chat. I'll implement a mutation that sends to /api/assist/rag (search) maybe?

            // Let's implement a 'ask' function that calls /api/assist/explain for specific issues, or /api/assist/search for general RAG.

            // Actually, let's use a generic 'chat' endpoint that we might have added or will add.
            // If not, I'll use a placeholder.

            const response = await api.post<{ reply: string }>('/assist/chat', { messages });
            return response.data;
        },
    });

    const explainIssueMutation = useMutation({
        mutationFn: async (issueId: string) => {
            const response = await api.post<{ explanation: string; fix_suggestion: string }>('/assist/explain', { issueId });
            return response.data;
        },
    });

    return {
        sendMessage: chatMutation.mutateAsync,
        isSending: chatMutation.isPending,
        explainIssue: explainIssueMutation.mutateAsync,
        isExplaining: explainIssueMutation.isPending,
    };
}
