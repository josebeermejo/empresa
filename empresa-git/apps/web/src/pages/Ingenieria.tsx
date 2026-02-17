import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDatasets } from '../lib/hooks/useDatasets';
import { DataTable } from '../components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Dataset } from '../types';
import { useMemo } from 'react';
import { FileSpreadsheet, Trash2, Eye, Calendar, HardDrive } from 'lucide-react';
import { formatDate } from '../lib/format';
import { Uploader } from '../components/Uploader';

export default function Ingenieria() {
    const { t } = useTranslation();
    const { datasets, isLoading, remove, isDeleting, upload, isUploading } = useDatasets();

    const columns = useMemo<ColumnDef<Dataset>[]>(
        () => [
            {
                accessorKey: 'name',
                header: t('datasets.name', 'Nombre'),
                cell: ({ row }) => (
                    <div className="flex items-center">
                        <FileSpreadsheet className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">{row.original.name}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'status',
                header: t('datasets.status', 'Estado'),
                cell: ({ row }) => (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>
                        {row.original.status}
                    </span>
                ),
            },
            {
                accessorKey: 'rowCount',
                header: t('datasets.rows', 'Filas'),
            },
            {
                accessorKey: 'createdAt',
                header: t('datasets.date', 'Fecha'),
                cell: ({ row }) => (
                    <div className="flex items-center text-gray-500">
                        <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0" />
                        {formatDate(row.original.createdAt)}
                    </div>
                ),
            },
            {
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex items-center space-x-3 text-sm">
                        <Link
                            to={`/datasets/${row.original.id}`}
                            className="text-primary-600 hover:text-primary-900 flex items-center"
                        >
                            <Eye className="w-4 h-4 mr-1" />
                            {t('common.view', 'Ver')}
                        </Link>
                        <button
                            onClick={() => remove(row.original.id)}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-900 flex items-center disabled:opacity-50"
                        >
                            <Trash2 className="w-4 h-4 mr-1" />
                            {t('common.delete', 'Eliminar')}
                        </button>
                    </div>
                ),
            },
        ],
        [t, remove, isDeleting]
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        {t('engineering.title', 'Panel de Ingeniería')}
                    </h2>
                </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white shadow sm:rounded-lg mb-8">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        {t('engineering.upload_new', 'Cargar nuevo dataset')}
                    </h3>
                    <div className="max-w-xl">
                        <Uploader onUpload={async (file) => { await upload(file); }} isUploading={isUploading} />
                    </div>
                </div>
            </div>

            {/* Datasets List */}
            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
                        <HardDrive className="w-5 h-5 mr-2 text-gray-500" />
                        {t('engineering.datasets_list', 'Datasets Disponibles')}
                    </h3>
                    {isLoading ? (
                        <div className="text-center py-4">{t('common.loading', 'Cargando...')}</div>
                    ) : (
                        <DataTable columns={columns} data={datasets} />
                    )}
                </div>
            </div>
        </div>
    );
}
