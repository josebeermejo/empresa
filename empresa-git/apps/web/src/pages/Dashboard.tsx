import { useTranslation } from 'react-i18next';
import { useHealth } from '../lib/hooks/useHealth';
import { useDatasets } from '../lib/hooks/useDatasets';
import { KpiGrid, KpiCard } from '../components/KpiCards';
import { Activity, Database, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
    const { t } = useTranslation();
    const { data: health } = useHealth();
    const { datasets } = useDatasets();

    // Calculate some basic stats from datasets
    const totalRows = datasets.reduce((acc, d) => acc + (d.rowCount || 0), 0);
    const totalDatasets = datasets.length;
    // Assuming we had error count in dataset list, but we might not have it in the list view depending on the type
    // The type 'Dataset' has 'errorCount'.
    const totalErrors = datasets.reduce((acc, d) => acc + (d.errorCount || 0), 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mb-8">
                {t('dashboard.title', 'Dashboard Operativo')}
            </h2>

            <KpiGrid className="mb-8">
                <KpiCard
                    title={t('dashboard.system_status', 'Estado del Sistema')}
                    value={health?.status === 'ok' ? 'Online' : 'Check'}
                    icon={<Activity />}
                    trend={{ value: '100% uptime', direction: 'up' }}
                />
                <KpiCard
                    title={t('dashboard.total_datasets', 'Datasets Procesados')}
                    value={totalDatasets}
                    icon={<Database />}
                />
                <KpiCard
                    title={t('dashboard.total_rows', 'Filas Analizadas')}
                    value={totalRows.toLocaleString()}
                    icon={<CheckCircle />}
                />
                <KpiCard
                    title={t('dashboard.total_errors', 'Errores Detectados')}
                    value={totalErrors.toLocaleString()}
                    icon={<AlertTriangle />}
                    trend={{ value: 'avg 5%', direction: 'neutral' }}
                />
            </KpiGrid>

            {/* Add charts or recent activity here */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('dashboard.activity', 'Actividad Reciente')}</h3>
                <p className="text-gray-500 text-sm">Próximamente: Gráficos de tendencias y logs de actividad.</p>
            </div>
        </div>
    );
}
