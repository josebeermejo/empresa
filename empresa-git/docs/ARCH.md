# Arquitectura del Sistema - AI Data Steward

## Visión General

AI Data Steward es una plataforma modular diseñada con arquitectura de microservicios para la gestión de calidad de datos empresariales con soporte de IA.

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                          USUARIO                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │       Web (React + Vite)        │
        │          Port: 5173             │
        │   ┌──────────────────────────┐  │
        │   │  • Home Page             │  │
        │   │  • Health Monitor        │  │
        │   │  • Data Upload (future)  │  │
        │   │  • Dashboard (future)    │  │
        │   └──────────────────────────┘  │
        └────────────┬───────────────────┘
                     │ HTTP/REST
                     ▼
        ┌────────────────────────────────┐
        │   API (Fastify + TypeScript)   │
        │          Port: 8080             │
        │   ┌──────────────────────────┐  │
        │   │  • /health, /ready       │  │
        │   │  • /upload (future)      │  │
        │   │  • /issues (future)      │  │
        │   │  • /fixes (future)       │  │
        │   └──────────────────────────┘  │
        └─────┬──────────────┬────────────┘
              │              │
              │              └──────────────┐
              ▼                             ▼
    ┌─────────────────┐           ┌──────────────────┐
    │   PostgreSQL    │           │   py-quality     │
    │   Port: 5432    │           │  (FastAPI)       │
    │   ┌──────────┐  │           │   Port: 8000     │
    │   │ uploads  │  │           │  ┌────────────┐  │
    │   │ issues   │  │           │  │ Analysis   │  │
    │   │ fixes    │  │           │  │ Rules      │  │
    │   │ audit    │  │           │  │ ML (fut.)  │  │
    │   └──────────┘  │           │  └────────────┘  │
    └─────────────────┘           └──────────────────┘
              │
              ▼
    ┌─────────────────┐
    │     Redis       │
    │   Port: 6379    │
    │   ┌──────────┐  │
    │   │ Cache    │  │
    │   │ Sessions │  │
    │   │ Jobs     │  │
    │   └──────────┘  │
    └─────────────────┘
```

## Componentes

### 1. Frontend (apps/web)

**Tecnologías**: React 18, TypeScript, Vite, React Router

**Responsabilidades**:
- Interfaz de usuario para gestión de datos
- Visualización de problemas de calidad
- Dashboard de métricas
- Aplicación de correcciones

**Comunicación**: HTTP REST con API Backend

### 2. Backend API (apps/api)

**Tecnologías**: Fastify, TypeScript, Pino (logging)

**Responsabilidades**:
- Orquestación de servicios
- Autenticación y autorización (futuro)
- Gestión de uploads y almacenamiento
- Coordinación con servicio Python
- Auditoría y trazabilidad

**Endpoints actuales**:
- `GET /health` - Estado del servicio
- `GET /ready` - Readiness probe

**Endpoints futuros**:
- `POST /upload` - Subir archivos CSV
- `GET /issues` - Listar problemas detectados
- `POST /fixes` - Aplicar correcciones
- `GET /exports` - Exportar datos limpios

### 3. Servicio Python de Calidad (services/py-quality)

**Tecnologías**: FastAPI, Pydantic, Pandas (futuro), ML libraries (futuro)

**Responsabilidades**:
- Análisis de calidad de datos
- Detección de anomalías
- Aplicación de reglas configurables
- Sugerencias de corrección impulsadas por IA (futuro)

**Endpoints actuales**:
- `GET /health` - Estado del servicio
- `POST /analyze` - Análisis de datos (stub)

### 4. Base de Datos (PostgreSQL)

**Esquema futuro**:
- `uploads` - Metadatos de archivos subidos
- `issues` - Problemas de calidad detectados
- `fixes` - Correcciones aplicadas
- `audit_log` - Registro de auditoría
- `rules` - Reglas de validación configurables

### 5. Cache (Redis)

**Uso**:
- Cache de resultados de análisis
- Sesiones de usuario
- Cola de trabajos en background
- Rate limiting

## Flujo de Datos

### Escenario: Upload y Análisis de CSV

```
1. Usuario sube CSV
   Web → API: POST /upload

2. API almacena archivo
   API → Storage: Guardar en /storage/uploads/
   API → PostgreSQL: Crear registro en uploads

3. API solicita análisis
   API → py-quality: POST /analyze
   py-quality → Análisis de datos
   py-quality → Retorna issues detectados

4. API almacena resultados
   API → PostgreSQL: Insertar issues
   API → Redis: Cache resultados

5. Usuario visualiza resultados
   Web ← API: GET /issues
   Web: Renderiza tabla de problemas

6. Usuario aplica corrección
   Web → API: POST /fixes
   API → py-quality: Validar corrección
   API → PostgreSQL: Registrar fix
   API → Storage: Actualizar archivo
```

## Principios de Diseño

### 1. Separación de Responsabilidades
- **Frontend**: Presentación y UX
- **API**: Lógica de negocio y orquestación
- **Python Service**: Análisis técnico y ML
- **Databases**: Persistencia y cache

### 2. Comunicación Asíncrona
- Jobs largos (análisis de archivos grandes) → Redis queues
- Notificaciones en tiempo real → WebSockets (futuro)

### 3. Escalabilidad
- Servicios stateless
- Horizontal scaling de API y py-quality
- Cache distribuido con Redis

### 4. Observabilidad
- Logging estructurado (Pino)
- Health checks en todos los servicios
- Tracing distribuido (futuro: OpenTelemetry)

## Seguridad y RGPD

### Capas de Seguridad
1. **Red**: Firewall, rate limiting
2. **Aplicación**: Helmet middleware, CORS
3. **Datos**: Encriptación en reposo y en tránsito
4. **Acceso**: Autenticación JWT (futuro)

### Cumplimiento RGPD
- **Minimización**: Solo datos necesarios. Uploads limitados por tamaño y tipo.
- **Retención**: Limpieza automática después de `RETENTION_DAYS` (Default: 30) mediante Cron Job.
- **Auditoría**: Registro completo de operaciones (`audit_log`) para trazabilidad.
- **Portabilidad**: Exportación en formatos estándar (CSV, XLSX).
- **Derecho al olvido**: Eliminación completa de datos (`DELETE /dataset/:id`) con borrado en cascada.
- **IA Segura**: Control `SEND_TO_LLM` para evitar fugas de datos a proveedores externos.

## Tecnologías y Dependencias

### Frontend
- React 18.2
- TypeScript 5.3
- Vite 5.0
- React Router 6.22

### Backend
- Node.js 18+
- Fastify 4.26
- TypeScript 5.3
- Pino 8.19

### Python Service
- Python 3.10+
- FastAPI 0.109
- Uvicorn 0.27
- Pydantic 2.6

### Infrastructure
- PostgreSQL 16
- Redis 7
- Docker & Docker Compose
- pnpm 9+

## Próximos Pasos

1. **Fase 2**: Integración con bases de datos
2. **Fase 3**: Lógica de análisis de calidad
3. **Fase 4**: Sistema de reglas no-code
4. **Fase 5**: Integración con LLM (Gemini/OpenAI)
5. **Fase 6**: Dashboard y visualizaciones
6. **Fase 7**: Autenticación y multi-tenancy
