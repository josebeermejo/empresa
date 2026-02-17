import { useOutletContext, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFixes, useIssues } from '../../lib/hooks/useIssues';
import { DiffViewer } from '../../components/DiffViewer';
import { Dataset, FixPreview } from '../../types';
import { useState, useEffect } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function PreviewTab() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { dataset } = useOutletContext<{ dataset: Dataset }>();
    const { data: issues } = useIssues(dataset.id);
    const { previewLegacy, isPreviewing, applyFixes, isApplying } = useFixes(dataset.id);
    const [previews, setPreviews] = useState<FixPreview[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Automatically generate preview for all issues when component mounts/issues load
        const generatePreview = async () => {
            if (issues && issues.length > 0) {
                try {
                    // For MVP, we send ALL issue IDs to be fixed
                    const issueIds = issues.map(i => i.id);
                    const data = await previewLegacy(issueIds);
                    setPreviews(data);
                } catch (e: any) {
                    setError(e.message || 'Error generating preview');
                }
            }
        };

        generatePreview();
    }, [issues, previewLegacy]);

    const handleApply = async () => {
        if (issues && issues.length > 0) {
            try {
                const issueIds = issues.map(i => i.id);
                await applyFixes(issueIds);
                // Navigate to export or show success
                navigate(`/datasets/${dataset.id}/export`);
            } catch (e: any) {
                setError(e.message || 'Error applying fixes');
            }
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {t('preview.title', 'Previsualización de Cambios')}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {t('preview.subtitle', 'Verifica cómo quedarán tus datos antes de aplicar los cambios.')}
                    </p>
                </div>
                <div>
                    <button
                        onClick={handleApply}
                        disabled={isApplying || isPreviewing || previews.length === 0}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isApplying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="ml-[-0.25rem] mr-2 h-4 w-4" />}
                        {t('preview.apply', 'Aplicar Correcciones')}
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {isPreviewing ? (
                <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-600" />
                    <p className="mt-2 text-sm text-gray-500">{t('preview.generating', 'Generando previsualización...')}</p>
                </div>
            ) : previews.length > 0 ? (
                <div className="space-y-8">
                    {previews.map((preview, idx) => (
                        <div key={idx} className="bg-white shadow rounded-lg p-6">
                            <h4 className="text-base font-medium text-gray-900 mb-4">
                                {t('preview.change_group', 'Cambio')} #{idx + 1}
                            </h4>
                            <DiffViewer preview={preview} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">{t('preview.no_changes', 'No hay cambios pendientes')}</h3>
                    <p className="mt-1 text-sm text-gray-500">{t('preview.no_changes_desc', 'Tus datos parecen estar limpios o no se han seleccionado reglas.')}</p>
                </div>
            )}
        </div>
    );
}
