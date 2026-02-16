import { useState, useEffect } from 'react';

interface HealthResponse {
    status: string;
    time: string;
    name?: string;
}

export default function Health() {
    const [health, setHealth] = useState<HealthResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    const checkHealth = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${apiUrl}/health`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            setHealth(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido al conectar con la API');
            setHealth(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkHealth();
    }, []);

    return (
        <div className="health-container">
            <h2>Estado del Sistema</h2>

            <div className="health-card">
                <div className="health-status">
                    <div className={`status-indicator ${health ? 'healthy' : 'error'}`}></div>
                    <h3>{health ? 'Sistema Operativo' : 'Sistema No Disponible'}</h3>
                </div>

                {loading && <p>Verificando estado...</p>}

                {error && (
                    <div className="error-message">
                        <strong>Error:</strong> {error}
                        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                            Verifica que la API esté ejecutándose en {apiUrl}
                        </p>
                    </div>
                )}

                {health && (
                    <div>
                        <h4>Detalles de Estado</h4>
                        <pre>
                            <code>{JSON.stringify(health, null, 2)}</code>
                        </pre>
                    </div>
                )}

                <button onClick={checkHealth} disabled={loading} style={{ marginTop: '1rem' }}>
                    {loading ? 'Verificando...' : 'Verificar Nuevamente'}
                </button>

                <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#999' }}>
                    <p>URL de API: {apiUrl}</p>
                    <p>Endpoint: {apiUrl}/health</p>
                </div>
            </div>
        </div>
    );
}
