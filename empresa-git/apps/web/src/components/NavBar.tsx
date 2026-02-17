import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { APP_NAME } from '../lib/env';
import { focusStyles } from '../lib/a11y';

export default function NavBar() {
    const { t } = useTranslation();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const linkClass = (path: string) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(path)
            ? 'bg-primary-50 text-primary-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        } ${focusStyles}`;

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className={`text-xl font-bold text-gray-900 ${focusStyles}`}>
                                {APP_NAME}
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-4 items-center">
                            <Link to="/" className={linkClass('/')}>
                                {t('nav.home')}
                            </Link>
                            <Link to="/usuario" className={linkClass('/usuario')}>
                                {t('nav.user')}
                            </Link>
                            <Link to="/ingenieria" className={linkClass('/ingenieria')}>
                                {t('nav.engineering')}
                            </Link>
                            <Link to="/reglas" className={linkClass('/reglas')}>
                                {t('nav.rules')}
                            </Link>
                            <Link to="/dashboard" className={linkClass('/dashboard')}>
                                {t('nav.dashboard')}
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        {/* User profile or settings could go here */}
                    </div>
                </div>
            </div>
        </nav>
    );
}
