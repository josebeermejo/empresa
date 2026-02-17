import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

export function useHealth() {
    return useQuery({
        queryKey: ['health'],
        queryFn: async () => {
            const { data } = await api.get<{ status: string }>('/health');
            return data;
        },
        retry: false, // Don't retry if health check fails
        refetchInterval: 60000, // Check every minute
    });
}
