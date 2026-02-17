import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { Dataset } from '../../types';

export function useDatasets() {
    const queryClient = useQueryClient();

    const datasetsQuery = useQuery({
        queryKey: ['datasets'],
        queryFn: async () => {
            const { data } = await api.get<Dataset[]>('/datasets');
            return data;
        },
    });

    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append('file', file);
            const { data } = await api.post<Dataset>('/datasets/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['datasets'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/datasets/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['datasets'] });
        },
    });

    return {
        datasets: datasetsQuery.data ?? [],
        isLoading: datasetsQuery.isLoading,
        error: datasetsQuery.error,
        upload: uploadMutation.mutateAsync,
        isUploading: uploadMutation.isPending,
        remove: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
}

export function useDataset(id: string) {
    return useQuery({
        queryKey: ['datasets', id],
        queryFn: async () => {
            const { data } = await api.get<Dataset>(`/datasets/${id}`);
            return data;
        },
        enabled: !!id,
    });
}
