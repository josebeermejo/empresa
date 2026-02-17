
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
} from '@tanstack/react-table';
import { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    className?: string;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    className,
}: DataTableProps<TData, TValue>) {
    const { t } = useTranslation();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            rowSelection,
        },
    });

    return (
        <div className={cn('space-y-4', className)}>
            <div className="rounded-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <th
                                                key={header.id}
                                                className="px-6 py-3 font-medium cursor-pointer hover:bg-gray-100"
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                    {{
                                                        asc: <ArrowUp className="w-4 h-4 ml-1" />,
                                                        desc: <ArrowDown className="w-4 h-4 ml-1" />,
                                                    }[header.column.getIsSorted() as string] ?? (
                                                            header.column.getCanSort() ? <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" /> : null
                                                        )}
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        data-state={row.getIsSelected() && 'selected'}
                                        className="bg-white border-b hover:bg-gray-50"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="px-6 py-4">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        {t('common.no_results', 'No hay resultados.')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-gray-500">
                    {t('common.pagination_count', {
                        count: table.getFilteredSelectedRowModel().rows.length,
                        total: table.getFilteredRowModel().rows.length,
                        defaultValue: '{{count}} de {{total}} fila(s) seleccionada(s).'
                    })}
                </div>
                <div className="space-x-2">
                    <button
                        className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
