import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, CheckCircle, ShieldCheck, Clock } from 'lucide-react';
import { focusStyles } from '../lib/a11y';

export default function Home() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                        <span className="block">{t('home.title', 'Calidad de datos')}</span>
                        <span className="block text-primary-600">con esteroides IA</span>
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        {t('home.subtitle', 'Sube, detecta, corrige y exporta. La plataforma definitiva para Data Stewards.')}
                    </p>
                    <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center gap-4">
                        <Link
                            to="/usuario"
                            className={`flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 ${focusStyles}`}
                        >
                            {t('home.cta_user', 'Soy Usuario de Negocio')}
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                        <Link
                            to="/ingenieria"
                            className={`flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10 ${focusStyles}`}
                        >
                            {t('home.cta_eng', 'Soy Ingeniero de Datos')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* KPI Cards */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6 text-center">
                        <dt className="text-sm font-medium text-gray-500 truncate flex justify-center items-center gap-2">
                            <Clock className="w-5 h-5 text-green-500" />
                            Tiempo por archivo
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">3 min</dd>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6 text-center">
                        <dt className="text-sm font-medium text-gray-500 truncate flex justify-center items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-blue-500" />
                            Errores corregidos
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">+90%</dd>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6 text-center">
                        <dt className="text-sm font-medium text-gray-500 truncate flex justify-center items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-purple-500" />
                            Privacidad
                        </dt>
                        <dd className="mt-1 text-2xl font-semibold text-gray-900">RGPD Default</dd>
                    </div>
                </div>
            </section>
        </div>
    );
}
