import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Dataset } from '../../types';
import { Download, FileSpreadsheet, Trash2 } from 'lucide-react';
import { api } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function ExportTab() {
    const { t } = useTranslation();
    const { dataset } = useOutletContext<{ dataset: Dataset }>();
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmText, setConfirmText] = useState('');

    const handleDownload = async (format: 'csv' | 'xlsx' | 'json') => {
        try {
            // Assuming backend has an export endpoint that returns a file
            // We need to handle blob response
            const response = await api.get(`/datasets/${dataset.id}/export?format=${format}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${dataset.name}_clean.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Export failed:', error);
        }
    };

    const handleDelete = async () => {
        if (confirmText !== 'BORRAR') return;

        try {
            setIsDeleting(true);
            await api.delete(`/datasets/${dataset.id}`);
            navigate('/dashboard'); // or /ingenieria
        } catch (error) {
            console.error('Delete failed:', error);
            setIsDeleting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
                <h3 className="text-2xl leading-6 font-medium text-gray-900">
                    {t('export.title', 'Exportar Datos Limpios')}
                </h3>
                <p className="mt-2 text-base text-gray-500">
                    {t('export.subtitle', 'Descarga tu dataset procesado en el formato que necesites.')}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <button
                    onClick={() => handleDownload('csv')}
                    className="relative bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 text-left group"
                >
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-100 rounded-md p-3 group-hover:bg-green-200 transition-colors">
                            <FileSpreadsheet className="h-6 w-6 text-green-700" />
                        </div>
                        <div className="ml-4">
                            <p className="text-lg font-medium text-gray-900">CSV</p>
                            <p className="text-sm text-gray-500">Comma Separated Values</p>
                        </div>
                        <Download className="ml-auto w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    </div>
                </button>

                <button
                    onClick={() => handleDownload('xlsx')}
                    className="relative bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 text-left group"
                >
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-100 rounded-md p-3 group-hover:bg-blue-200 transition-colors">
                            <FileSpreadsheet className="h-6 w-6 text-blue-700" />
                        </div>
                        <div className="ml-4">
                            <p className="text-lg font-medium text-gray-900">Excel</p>
                            <p className="text-sm text-gray-500">Microsoft Excel (.xlsx)</p>
                        </div>
                        <Download className="ml-auto w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    </div>
                </button>
            </div>

            <div className="mt-12 border-t pt-8">
                <h4 className="text-lg font-medium text-red-600 mb-4">{t('export.danger_zone', 'Zona de Peligro')}</h4>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <p className="text-sm text-gray-700 mb-4">
                        {t('export.delete_desc', 'Esta acción eliminará permanentemente el dataset y todos sus datos asociados. No se puede deshacer.')}
                    </p>
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            placeholder='Escribe "BORRAR" para confirmar'
                            className="bg-white border border-red-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                        />
                        <button
                            onClick={handleDelete}
                            disabled={confirmText !== 'BORRAR' || isDeleting}
                            className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {isDeleting ? t('common.deleting', 'Eliminando...') : t('common.delete', 'Eliminar Dataset')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
