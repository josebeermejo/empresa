import axios, { AxiosError } from 'axios';
import { API_URL } from './env';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface ApiError {
    status: number;
    code: string;
    message: string;
}

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<any>) => {
        const apiError: ApiError = {
            status: error.response?.status || 500,
            code: error.response?.data?.code || 'INTERNAL_ERROR',
            message: error.response?.data?.message || error.message || 'Unknown error occurred',
        };
        return Promise.reject(apiError);
    }
);
