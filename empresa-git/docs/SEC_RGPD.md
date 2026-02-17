# Seguridad y Cumplimiento RGPD (AI Data Steward)

Este documento detalla las medidas de seguridad y privacidad implementadas en el sistema AI Data Steward.

## 1. Arquitectura de Seguridad

### Backend (API)
- **Helmet**: Implementación de cabeceras de seguridad HTTP (HSTS, X-Frame-Options, X-XSS-Protection).
- **CSP (Content Security Policy)**: Política estricta que solo permite scripts e imágenes del mismo origen, bloqueando inyecciones XSS.
- **CORS**: Restricción de orígenes permitidos (configurable vía `CORS_ORIGIN`).
- **Rate Limiting**: Limitación de 100 peticiones por minuto por IP para prevenir ataques DDoS y fuerza bruta.
- **Validación de Datos**: Uso de `Zod` para validar estrictamente todos los inputs en endpoints.

### Frontend
- **Sanitización**: React escapa por defecto el contenido renderizado para prevenir XSS.
- **Gestión de Estado**: No se almacenan datos sensibles en LocalStorage (salvo preferencias de usuario no críticas).

## 2. Privacidad y RGPD

### Consentimiento
- **Banner de Privacidad**: Los usuarios deben aceptar explícitamente el uso de cookies y procesamiento de datos.
- **Registro de Consentimiento**: Se guarda un registro de auditoría (timestamp y user-agent) cuando se acepta el consentimiento.
- **Revocación**: El usuario puede gestionar sus preferencias en `/privacidad`.

### Minimización de Datos
- **Retención**: Los datasets se marcan para eliminación automática tras 30 días (configurable via `RETENTION_DAYS`).
- **Eliminación**: Los usuarios pueden eliminar sus datasets manualmente, lo que borra tanto los metadatos en DB como los archivos físicos.
- **Purga Automática**: Un Job (Cron) se ejecuta diariamente a las 03:00 AM para eliminar datasets expirados.

### Inteligencia Artificial (Guardrails)
- **Control de Envío**: Variable `SEND_TO_LLM` (true/false) controla si se permite enviar datos a APIs externas de IA.
- **Enmascaramiento (Planned)**: Si se activa el envío, se aplicará enmascaramiento de PII (emails, teléfonos, nombres) antes de salir del entorno seguro.
- **Mocking**: Por defecto en desarrollo, se utiliza un proveedor "Mock" que simula respuestas de IA sin enviar datos reales.

## 3. Auditoría (Audit Log)

Todas las acciones críticas se registran en la tabla `AuditLog`:
- `upload_dataset`
- `delete_dataset`
- `purge_dataset`
- `consent_accept`

## 4. Configuración

Variables de entorno relevantes:
\`\`\`bash
# Seguridad
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_MAX=100
CSP_REPORT_ONLY=false

# Privacidad
ENABLE_PURGE_CRON=true
RETENTION_DAYS=30
SEND_TO_LLM=false
PRIVACY_BANNER=true
\`\`\`
