import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="page-container">
            <div className="hero">
                <h1>AI Data Steward</h1>
                <p>
                    Plataforma inteligente para la gestión de calidad y gobernanza de datos empresariales
                </p>
                <Link to="/health">
                    <button>Verificar Estado del Sistema</button>
                </Link>
            </div>

            <div className="features">
                <div className="feature-card">
                    <h3>🔍 Detección Automática</h3>
                    <p>
                        Identifica automáticamente problemas de calidad en tus datos utilizando reglas
                        configurables y análisis impulsado por IA.
                    </p>
                </div>

                <div className="feature-card">
                    <h3>🤖 Corrección Inteligente</h3>
                    <p>
                        Aplica correcciones sugeridas o automáticas a los datos problemáticos, manteniendo
                        siempre trazabilidad completa.
                    </p>
                </div>

                <div className="feature-card">
                    <h3>📊 Monitoreo en Tiempo Real</h3>
                    <p>
                        Visualiza el estado de calidad de tus datos con dashboards interactivos y alertas
                        configurables.
                    </p>
                </div>

                <div className="feature-card">
                    <h3>🔒 RGPD & Seguridad</h3>
                    <p>
                        Cumplimiento nativo con RGPD, incluyendo minimización de datos, retención configurable
                        y auditoría completa.
                    </p>
                </div>

                <div className="feature-card">
                    <h3>🔌 Integración Flexible</h3>
                    <p>
                        Conecta con múltiples fuentes de datos: CSV, bases de datos, APIs y servicios en la
                        nube.
                    </p>
                </div>

                <div className="feature-card">
                    <h3>📝 Reglas No-Code</h3>
                    <p>
                        Define reglas de validación y corrección sin programar, usando un sistema declarativo
                        intuitivo.
                    </p>
                </div>
            </div>
        </div>
    );
}
