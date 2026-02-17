import { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface KpiCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;
    trend?: {
        value: string;
        direction: 'up' | 'down' | 'neutral';
    };
    className?: string;
}

export function KpiCard({ title, value, icon, trend, className }: KpiCardProps) {
    return (
        <div className={cn('bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6', className)}>
            <div className="flex items-center">
                {icon && (
                    <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                        <span className="text-primary-600 h-6 w-6">{icon}</span>
                    </div>
                )}
                <div className={cn('ml-5 w-0 flex-1', !icon && 'ml-0')}>
                    <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                    <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{value}</div>
                        {trend && (
                            <div
                                className={cn(
                                    'ml-2 flex items-baseline text-sm font-semibold',
                                    trend.direction === 'up' ? 'text-green-600' : trend.direction === 'down' ? 'text-red-600' : 'text-gray-500'
                                )}
                            >
                                {trend.value}
                            </div>
                        )}
                    </dd>
                </div>
            </div>
        </div>
    );
}

interface KpiGridProps {
    children: ReactNode;
    className?: string;
}

export function KpiGrid({ children, className }: KpiGridProps) {
    return (
        <div className={cn('grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3', className)}>
            {children}
        </div>
    );
}
