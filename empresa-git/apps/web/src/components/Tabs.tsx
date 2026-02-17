import { ReactNode } from 'react';
import { clsx } from 'clsx';


interface Tab {
    id: string;
    label: string;
    icon?: ReactNode;
    content?: ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (id: string) => void;
    className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
    return (
        <div className={clsx('w-full', className)}>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onChange(tab.id)}
                                className={clsx(
                                    isActive
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                    'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-t-md'
                                )}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {tab.icon && (
                                    <span
                                        className={clsx(
                                            isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500',
                                            '-ml-0.5 mr-2 h-5 w-5'
                                        )}
                                    >
                                        {tab.icon}
                                    </span>
                                )}
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>
            <div className="mt-4">
                {tabs.find((t) => t.id === activeTab)?.content}
            </div>
        </div>
    );
}
