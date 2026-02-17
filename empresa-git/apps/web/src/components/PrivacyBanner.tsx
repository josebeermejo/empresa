import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { privacyCopy } from '../copy/privacy.es';

export function PrivacyBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const consent = localStorage.getItem('consent.acceptedAt');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = async () => {
        const acceptedAt = new Date().toISOString();
        localStorage.setItem('consent.acceptedAt', acceptedAt);
        setIsVisible(false);

        try {
            await api.post('/consent', {
                acceptedAt,
                userAgent: navigator.userAgent,
            });
        } catch (error) {
            console.error('Failed to log consent:', error);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-50 md:flex md:items-center md:justify-between">
            <div className="mb-4 md:mb-0 md:mr-4">
                <p className="text-sm text-gray-700">
                    {t('privacy.banner', privacyCopy.banner.text)}
                </p>
            </div>
            <div className="flex space-x-4">
                <Link
                    to="/privacidad"
                    className="text-sm text-gray-500 hover:text-gray-900 px-4 py-2"
                >
                    {t('privacy.configure', privacyCopy.banner.configure)}
                </Link>
                <button
                    onClick={handleAccept}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    {t('privacy.accept', privacyCopy.banner.accept)}
                </button>
            </div>
        </div>
    );
}
