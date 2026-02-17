import { useOutletContext, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useIssues } from '../../lib/hooks/useIssues';
import { IssuesTable } from '../../components/IssuesTable';
import { Dataset } from '../../types';
import { AlertCircle, ArrowRight } from 'lucide-react';

export default function IssuesTab() {
    const { t } = useTranslation();
    const { dataset } = useOutletContext<{ dataset: Dataset }>();
    const { data: issues, isLoading } = useIssues(dataset.id);

    const issueCount = issues?.length || 0;
    const criticalCount = issues?.filter(i => i.severity === 'CRITICAL').length || 0;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {t('issues.title', 'Problemas Detectados')}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {t('issues.subtitle', 'Revisa y corrige los problemas de calidad encontrados en tu dataset.')}
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1.5" />
                        {criticalCount} Críticos
                    </div>
                    <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                        {issueCount} Total
                    </div>
                </div>
            </div>

            <div className="mb-6 flex justify-end">
                <Link
                    to={`/datasets/${dataset.id}/preview`}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    {t('issues.preview_fixes', 'Previsualizar Arreglos')}
                    <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
                </Link>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <IssuesTable issues={issues || []} isLoading={isLoading} />
            </div>
        </div>
    );
}
