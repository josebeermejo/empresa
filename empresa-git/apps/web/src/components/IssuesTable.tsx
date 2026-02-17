import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Issue } from '../types';
import { DataTable } from './DataTable';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface IssuesTableProps {
    issues: Issue[];
    isLoading?: boolean;
}

export function IssuesTable({ issues, isLoading }: IssuesTableProps) {
    const { t } = useTranslation();

    const columns = useMemo<ColumnDef<Issue>[]>(
        () => [
            {
                accessorKey: 'severity',
                header: t('issues.severity', 'Gravedad'),
                cell: ({ row }) => {
                    const severity = row.getValue('severity') as string;
                    return (
                        <div className="flex items-center">
                            {severity === 'CRITICAL' && <AlertCircle className="w-5 h-5 text-red-500 mr-2" />}
                            {severity === 'WARNING' && <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />}
                            {severity === 'INFO' && <Info className="w-5 h-5 text-blue-500 mr-2" />}
                            <span
                                className={cn(
                                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                    severity === 'CRITICAL' && 'bg-red-100 text-red-800',
                                    severity === 'WARNING' && 'bg-yellow-100 text-yellow-800',
                                    severity === 'INFO' && 'bg-blue-100 text-blue-800'
                                )}
                            >
                                {severity}
                            </span>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'issueType',
                header: t('issues.type', 'Tipo'),
            },
            {
                accessorKey: 'message',
                header: t('issues.message', 'Mensaje'),
                cell: ({ row }) => <span className="text-gray-900">{row.getValue('message')}</span>,
            },
            {
                accessorKey: 'row',
                header: t('issues.row', 'Fila'),
            },
            {
                accessorKey: 'column',
                header: t('issues.column', 'Columna'),
            },
            {
                accessorKey: 'status',
                header: t('issues.status', 'Estado'),
                cell: ({ row }) => {
                    const status = row.getValue('status') as string;
                    return (
                        <div className="flex items-center">
                            {status === 'FIXED' && <CheckCircle className="w-4 h-4 text-green-500 mr-1" />}
                            {status === 'IGNORED' && <XCircle className="w-4 h-4 text-gray-400 mr-1" />}
                            <span>{status}</span>
                        </div>
                    );
                },
            },
        ],
        [t] // Access to 't' is stable, but good practice
    );

    if (isLoading) {
        return <div className="p-4 text-center">{t('common.loading', 'Cargando...')}</div>;
    }

    return <DataTable columns={columns} data={issues} />;
}
