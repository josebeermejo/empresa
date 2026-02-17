import { http, HttpResponse } from 'msw';
import { API_URL } from '../lib/env';

export const handlers = [
    // Datasets
    http.get(`${API_URL}/datasets`, () => {
        return HttpResponse.json([
            {
                id: '1',
                name: 'Ventas_2023.csv',
                status: 'COMPLETED',
                rowCount: 15420,
                createdAt: new Date().toISOString(),
            },
            {
                id: '2',
                name: 'Clientes_Q1.xlsx',
                status: 'WAITING_REVIEW',
                rowCount: 500,
                createdAt: new Date().toISOString(),
            },
        ]);
    }),

    // Issues
    http.get(`${API_URL}/datasets/:id/issues`, () => {
        return HttpResponse.json([
            {
                id: '101',
                severity: 'CRITICAL',
                issueType: 'Format Error',
                message: 'Invalid email format',
                row: 2,
                column: 'email',
                status: 'OPEN',
            },
            {
                id: '102',
                severity: 'WARNING',
                issueType: 'Outlier',
                message: 'Value exceeds 3 sigma',
                row: 15,
                column: 'amount',
                status: 'IGNORED',
            },
        ]);
    }),

    // Rules
    http.get(`${API_URL}/rules`, () => {
        return HttpResponse.json([
            {
                id: 'r1',
                name: 'Email Validation',
                field: 'email',
                operator: 'regex',
                severity: 'CRITICAL',
            },
        ]);
    }),
];
