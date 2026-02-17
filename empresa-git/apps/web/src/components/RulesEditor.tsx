import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useTranslation } from 'react-i18next';
import { Rule } from '../types';
import { Save, X, AlertTriangle } from 'lucide-react';

interface RulesEditorProps {
    initialRule?: Rule;
    onSave: (rule: Omit<Rule, 'id'> | Rule) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export function RulesEditor({ initialRule, onSave, onCancel, isLoading }: RulesEditorProps) {
    const { t } = useTranslation();
    const [jsonValue, setJsonValue] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialRule) {
            // Remove id for display/editing logic if needed, or keep it
            const { id, ...rest } = initialRule;
            setJsonValue(JSON.stringify(rest, null, 2));
        } else {
            setJsonValue(JSON.stringify({
                name: "",
                description: "",
                field: "",
                operator: "equals",
                value: "",
                severity: "WARNING",
                enabled: true
            }, null, 2));
        }
    }, [initialRule]);

    const handleEditorChange = (value: string | undefined) => {
        setJsonValue(value || '');
        setError(null);
    };

    const handleSave = async () => {
        try {
            const parsed = JSON.parse(jsonValue);
            // Basic validation
            if (!parsed.name || !parsed.field || !parsed.operator) {
                throw new Error(t('rules.validation_error', 'Requerido: name, field, operator'));
            }

            await onSave(initialRule ? { ...parsed, id: initialRule.id } : parsed);
        } catch (e: any) {
            setError(e.message || 'Invalid JSON');
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                    {initialRule ? t('rules.edit', 'Editar Regla') : t('rules.create', 'Nueva Regla')}
                </h3>
                <button onClick={onCancel} className="text-gray-400 hover:text-gray-500">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="border rounded-md overflow-hidden h-96 mb-4">
                <Editor
                    height="100%"
                    defaultLanguage="json"
                    value={jsonValue}
                    onChange={handleEditorChange}
                    options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                    }}
                />
            </div>

            {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-end space-x-3">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                    {t('common.cancel', 'Cancelar')}
                </button>
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {t('common.save', 'Guardar')}
                </button>
            </div>
        </div>
    );
}
