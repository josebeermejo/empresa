import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRules } from '../lib/hooks/useRules';
import { DataTable } from '../components/DataTable';
import { RulesEditor } from '../components/RulesEditor';
import { ColumnDef } from '@tanstack/react-table';
import { Rule } from '../types';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Reglas() {
    const { t } = useTranslation();
    const { rules, isLoading, createRule, updateRule, deleteRule } = useRules();
    const [isEditing, setIsEditing] = useState(false);
    const [selectedRule, setSelectedRule] = useState<Rule | undefined>(undefined);

    const handleEdit = (rule: Rule) => {
        setSelectedRule(rule);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setSelectedRule(undefined);
        setIsEditing(true);
    };

    const handleSave = async (ruleData: Rule | Omit<Rule, 'id'>) => {
        if ('id' in ruleData) {
            await updateRule({ id: ruleData.id, data: ruleData });
        } else {
            await createRule(ruleData);
        }
        setIsEditing(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm(t('common.confirm_delete', '¿Estás seguro de eliminar esta regla?'))) {
            await deleteRule(id);
        }
    };

    const columns = useMemo<ColumnDef<Rule>[]>(
        () => [
            {
                accessorKey: 'name',
                header: t('rules.name', 'Nombre'),
                cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.name}</span>,
            },
            {
                accessorKey: 'field',
                header: t('rules.field', 'Campo'),
            },
            {
                accessorKey: 'operator',
                header: t('rules.operator', 'Operador'),
            },
            {
                accessorKey: 'severity',
                header: t('rules.severity', 'Gravedad'),
                cell: ({ row }) => {
                    const severity = row.original.severity;
                    return (
                        <span className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            severity === 'CRITICAL' && 'bg-red-100 text-red-800',
                            severity === 'WARNING' && 'bg-yellow-100 text-yellow-800',
                            severity === 'INFO' && 'bg-blue-100 text-blue-800'
                        )}>
                            {severity}
                        </span>
                    )
                }
            },
            {
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="text-primary-600 hover:text-primary-900"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-600 hover:text-red-900"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ),
            },
        ],
        [t]
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        {t('rules.title', 'Gestión de Reglas')}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        {t('rules.subtitle', 'Configura las reglas de calidad que se aplicarán a tus datasets.')}
                    </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        {t('rules.create', 'Nueva Regla')}
                    </button>
                </div>
            </div>

            {isEditing ? (
                <RulesEditor
                    initialRule={selectedRule}
                    onSave={handleSave}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {isLoading ? (
                        <div className="text-center py-8">{t('common.loading', 'Cargando...')}</div>
                    ) : (
                        <DataTable columns={columns} data={rules} />
                    )}
                </div>
            )}
        </div>
    );
}
