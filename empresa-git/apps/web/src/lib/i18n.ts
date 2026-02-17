import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Simple dictionary for now, can move to JSON files later
const resources = {
    es: {
        translation: {
            app: {
                name: 'AI Data Steward',
                loading: 'Cargando...',
            },
            nav: {
                home: 'Inicio',
                user: 'Modo Usuario',
                engineering: 'Modo Ingeniería',
                rules: 'Reglas',
                dashboard: 'Dashboard',
            },
            home: {
                title: 'Calidad de datos con esteroides IA',
                subtitle: 'Sube, detecta, corrige y exporta. La plataforma definitiva para Data Stewards.',
                cta_user: 'Soy Usuario de Negocio',
                cta_eng: 'Soy Ingeniero de Datos',
            },
            // ... more keys as we build components
        },
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'es', // default language
        fallbackLng: 'es',
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;
