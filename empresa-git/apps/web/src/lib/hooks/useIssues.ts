import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { Issue, FixPreview } from '../../types';

export function useIssues(datasetId: string) {
    return useQuery({
        queryKey: ['issues', datasetId],
        queryFn: async () => {
            const { data } = await api.get<Issue[]>(`/datasets/${datasetId}/issues`);
            return data;
        },
        enabled: !!datasetId,
    });
}

export function useFixes(datasetId: string) {
    const queryClient = useQueryClient();

    const previewMutation = useMutation({
        mutationFn: async (issueIds: string[]) => {
            const { data } = await api.post<FixPreview[]>(`/datasets/${datasetId}/fixes/preview`, { issueIds });
            return data;
        },
    });

    const applyMutation = useMutation({
        mutationFn: async (issueIds: string[]) => {
            await api.post(`/datasets/${datasetId}/fixes/apply`, { issueIds });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['issues', datasetId] });
            queryClient.invalidateQueries({ queryKey: ['datasets', datasetId] });
        },
    });

    return {
        previewLegacy: previewMutation.mutateAsync, // Renamed to avoid confusion if we have multiple preview types
        isPreviewing: previewMutation.isPending,
        applyFixes: applyMutation.mutateAsync,
        isApplying: applyMutation.isPending,
    };
}
