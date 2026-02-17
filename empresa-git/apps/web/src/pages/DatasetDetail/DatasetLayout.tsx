import { Outlet, useParams, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDataset } from '../../lib/hooks/useDatasets';
import { ArrowLeft, FileText, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { formatDate } from '../../lib/format';

export default function DatasetLayout() {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    // Use non-null assertion or check for id, as it must exist in this route
    const { data: dataset, isLoading, error } = useDataset(id!);
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error || !dataset) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">{t('common.error', 'Error')}</h3>
                <p className="mt-1 text-sm text-gray-500">{t('dataset.not_found', 'No se encontró el dataset o hubo un error al cargarlo.')}</p>
                <div className="mt-6">
                    <Link to="/" className="text-primary-600 hover:text-primary-500 font-medium">
                        {t('common.go_home', 'Volver al inicio')}
                    </Link>
                </div>
            </div>
        );
    }

    // Define tabs based on current path to set active
    // Since we use nested routes, the Tabs component needs to handle navigation or be purely visual if Outlet handles content.
    // My custom Tabs component in src/components/Tabs.tsx takes `activeTab` and `onChange`.

    // Actually, standard Pattern for nested routes with Tabs:
    // Render Links looking like tabs, or use Tabs component that navigates.
    // My Tabs component renders `tabs.find(t => t.id === activeTab)?.content`. 
    // It is designed for client-side switching, not routing.
    // I should probably adapt it or use a different approach for routing-based tabs.
    // Or just simply render the navigation links here and Outlet below.

    const tabs = [
        { name: t('dataset.tab_issues', 'Problemas'), href: `/datasets/${id}/issues`, icon: AlertCircle, current: location.pathname.includes('/issues') },
        { name: t('dataset.tab_preview', 'Previsualizar'), href: `/datasets/${id}/preview`, icon: CheckCircle, current: location.pathname.includes('/preview') },
        { name: t('dataset.tab_export', 'Exportar'), href: `/datasets/${id}/export`, icon: Download, current: location.pathname.includes('/export') },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Link to="/ingenieria" className="hover:text-gray-900 flex items-center">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        {t('common.back', 'Volver')}
                    </Link>
                </div>
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate flex items-center">
                            <FileText className="w-8 h-8 mr-3 text-gray-400" />
                            {dataset.name}
                            <span className={`ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>
                                {dataset.status}
                            </span>
                        </h2>
                        <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                {t('datasets.uploaded', 'Subido el')}: {formatDate(dataset.createdAt)}
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                {dataset.rowCount} {t('datasets.rows', 'filas')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.name}
                            to={tab.href}
                            className={`
                ${tab.current
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
              `}
                            aria-current={tab.current ? 'page' : undefined}
                        >
                            <tab.icon
                                className={`
                  ${tab.current ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'}
                  -ml-0.5 mr-2 h-5 w-5
                `}
                                aria-hidden="true"
                            />
                            {tab.name}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <Outlet context={{ dataset }} />
        </div>
    );
}
