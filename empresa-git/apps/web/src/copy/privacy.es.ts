export const privacyCopy = {
    banner: {
        text: "Usamos cookies y tecnologías similares para mejorar tu experiencia y asegurar el cumplimiento normativo. Por defecto, NO enviamos datos a IAs externas.",
        accept: "Aceptar y continuar",
        configure: "Configurar",
    },
    page: {
        title: "Política de Privacidad y Seguridad",
        intro: "En AI Data Steward, nos tomamos la seguridad de tus datos muy en serio. A continuación detallamos cómo tratamos, almacenamos y procesamos la información.",
        sections: [
            {
                title: "1. Tratamiento de Datos",
                content: "Solo procesamos los archivos que subes explícitamente para las tareas de limpieza y validación. Los datos se almacenan temporalmente en servidores ubicados en la UE.",
            },
            {
                title: "2. Uso de Inteligencia Artificial",
                content: "Nuestras funciones de IA (detección de anomalías, explicaciones) utilizan modelos locales o proveedores externos seguros. Si activas el uso de IA externa, aplicamos técnicas de minimización de datos y enmascaramiento de PII antes del envío.",
            },
            {
                title: "3. Retención de Datos",
                content: "Los datasets se mantienen por un periodo máximo de 30 días para permitirte trabajar con ellos. Pasado este tiempo, o si lo solicitas antes, se eliminan permanentemente de nuestros sistemas.",
            },
            {
                title: "Rights (Derechos ARCO)",
                content: "Tienes derecho a acceder, rectificar, cancelar y oponerte al tratamiento de tus datos. Puedes eliminar tus datasets en cualquier momento desde la interfaz de la aplicación.",
            }
        ],
        settings: {
            title: "Configuración de Privacidad",
            aiToggle: {
                label: "Permitir análisis con IA estena",
                description: "Si se activa, se enviarán metadatos y muestras anonimizadas a proveedores de IA (ej. OpenAI/Google) para mejorar la detección de errores. Nunca se enviará PII directa sin enmascarar.",
            }
        }
    }
};
