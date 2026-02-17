import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { FixPreview } from '../types';

interface DiffViewerProps {
    preview: FixPreview;
    className?: string;
}

export function DiffViewer({ preview, className }: DiffViewerProps) {
    const { t } = useTranslation();

    // We can render a JSON diff or a table view. 
    // For now, let's render a side-by-side view of the changes.

    return (
        <div className={cn('space-y-4', className)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original */}
                <div className="border border-red-200 rounded-lg overflow-hidden">
                    <div className="bg-red-50 px-4 py-2 border-b border-red-200 font-medium text-red-800 flex justify-between">
                        <span>{t('diff.original', 'Original')}</span>
                    </div>
                    <div className="p-4 bg-white overflow-auto max-h-96">
                        <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                            {JSON.stringify(preview.original, null, 2)}
                        </pre>
                    </div>
                </div>

                {/* Fixed */}
                <div className="border border-green-200 rounded-lg overflow-hidden">
                    <div className="bg-green-50 px-4 py-2 border-b border-green-200 font-medium text-green-800 flex justify-between">
                        <span>{t('diff.fixed', 'Corregido')}</span>
                    </div>
                    <div className="p-4 bg-white overflow-auto max-h-96">
                        <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                            {JSON.stringify(preview.fixed, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>

            {/* Changes Summary */}
            {preview.changes && preview.changes.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">{t('diff.changes', 'Cambios Detectados')}</h4>
                    <div className="bg-gray-50 rounded-md p-4 space-y-2">
                        {preview.changes.map((change, idx) => (
                            <div key={idx} className="flex items-center text-sm">
                                <span className="font-mono text-gray-500 mr-2">
                                    [{change.row}, {change.column}]:
                                </span>
                                <span className="line-through text-red-500 mr-2">
                                    {JSON.stringify(change.oldValue)}
                                </span>
                                <ArrowRight className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-green-600 font-medium">
                                    {JSON.stringify(change.newValue)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
