import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { privacyCopy } from '../copy/privacy.es';
// import { Switch } from '@headlessui/react'; // Or use a simple checkbox if Headless UI is not installed
import { clsx } from 'clsx';
// import { useTranslation } from 'react-i18next'; // Assuming translation logic is set up, normally we'd allow language switching. For now, using hardcoded copy or t function.

export default function Privacidad() {
    // const { t } = useTranslation();
    // In a real app, AI toggle state might be persisted in backend user settings or local storage
    // Here we'll simulate local persistence for the prompt requirement
    const [enabledAI, setEnabledAI] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('settings.sendToLlm');
        if (stored) {
            setEnabledAI(stored === 'true');
        }
    }, []);

    const toggleAI = (checked: boolean) => {
        setEnabledAI(checked);
        localStorage.setItem('settings.sendToLlm', String(checked));
        // In a real implementation, we might call an API to sync this preference
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <NavBar />

            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">{privacyCopy.page.title}</h1>

                <div className="bg-white shadow rounded-lg p-6 mb-8">
                    <p className="text-gray-700 mb-4">{privacyCopy.page.intro}</p>

                    <div className="space-y-6">
                        {privacyCopy.page.sections.map((section, idx) => (
                            <div key={idx}>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">{section.title}</h2>
                                <p className="text-gray-600">{section.content}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">{privacyCopy.page.settings.title}</h2>

                    <div className="flex items-start space-x-4">
                        <div className="flex-1">
                            <h3 className="text-base font-medium text-gray-900">
                                {privacyCopy.page.settings.aiToggle.label}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {privacyCopy.page.settings.aiToggle.description}
                            </p>
                        </div>

                        {/* Simple Toggle Switch Implementation */}
                        <button
                            type="button"
                            className={clsx(
                                enabledAI ? 'bg-primary-600' : 'bg-gray-200',
                                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                            )}
                            role="switch"
                            aria-checked={enabledAI}
                            onClick={() => toggleAI(!enabledAI)}
                        >
                            <span
                                aria-hidden="true"
                                className={clsx(
                                    enabledAI ? 'translate-x-5' : 'translate-x-0',
                                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                )}
                            />
                        </button>
                    </div>
                    <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 text-sm rounded-md">
                        Nota: Al desactivar esta opción, las funciones de "Assist" y "Explicación" utilizarán un proveedor simulado (mock) local y no enviarán datos fuera de tu navegador/api.
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
