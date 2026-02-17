import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { Rule } from '../../types';

export function useRules() {
    const queryClient = useQueryClient();

    const rulesQuery = useQuery({
        queryKey: ['rules'],
        queryFn: async () => {
            const { data } = await api.get<Rule[]>('/rules');
            return data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (rule: Omit<Rule, 'id'>) => {
            const { data } = await api.post<Rule>('/rules', rule);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rules'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<Rule> }) => {
            const response = await api.put<Rule>(`/rules/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rules'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/rules/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rules'] });
        },
    });

    return {
        rules: rulesQuery.data ?? [],
        isLoading: rulesQuery.isLoading,
        createRule: createMutation.mutateAsync,
        updateRule: updateMutation.mutateAsync,
        deleteRule: deleteMutation.mutateAsync,
    };
}
