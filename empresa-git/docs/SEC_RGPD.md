# Seguridad y RGPD - AI Data Steward

## Resumen Ejecutivo

AI Data Steward está diseñado desde el principio para cumplir con el Reglamento General de Protección de Datos (RGPD/GDPR) y aplicar las mejores prácticas de seguridad en el manejo de datos personales y empresariales.

## Principios RGPD

### 1. Minimización de Datos

**Principio**: Recolectar solo los datos estrictamente necesarios para el propósito declarado.

**Implementación**:
- Los archivos CSV cargados se procesan sin extraer información adicional
- No se almacenan metadatos innecesarios
- Las copias temporales se eliminan después del procesamiento
- Solo se retienen los datos de auditoría esenciales

**Configuración**:
```env
# .env
STORAGE_DIR=./storage
RETENTION_DAYS=30  # Configurable según necesidades
```

### 2. Limitación de la Finalidad

**Propósito declarado**: Mejora de la calidad de datos empresariales

**Usos NO permitidos**:
- Perfilado de usuarios sin consentimiento explícito
- Venta o cesión de datos a terceros
- Uso de datos para fines distintos al análisis de calidad

**Registro**:
- Cada operación registra su propósito en el audit log
- Los datos procesados no se reutilizan para otros fines

### 3. Limitación del Almacenamiento

**Retención por defecto**: 30 días

**Política de limpieza**:
```javascript
// Pseudo-código de limpieza automática
async function cleanupExpiredData() {
  const retention = env.retentionDays;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retention);
  
  // Eliminar archivos antiguos
  await deleteFilesOlderThan(cutoffDate);
  
  // Eliminar registros de BD
  await deleteRecordsOlderThan(cutoffDate);
  
  // Limpiar cache
  await clearCacheOlderThan(cutoffDate);
}
```

**Excepciones**:
- Datos de auditoría legal: retención extendida según requisitos legales
- Datos anonimizados: pueden retenerse para estadísticas agregadas

### 4. Exactitud

**Garantías**:
- Validación de correcciones antes de aplicarlas
- Trazabilidad completa de cambios
- Posibilidad de revertir correcciones
- Auditoría de confianza en correcciones automáticas

### 5. Confidencialidad e Integridad

**Medidas técnicas**:
- Encriptación en tránsito (HTTPS/TLS 1.3)
- Encriptación en reposo (opcional, para datos sensibles)
- Control de acceso basado en roles (RBAC) - futuro
- Logs de auditoría inmutables

### 6. Responsabilidad Proactiva (Accountability)

**Documentación**:
- Registro de tratamiento de datos (este documento)
- Políticas de privacidad
- Procedimientos de respuesta a incidentes
- Evaluaciones de impacto (DPIA) para funciones de IA

## Derechos de los Interesados

### Derecho de Acceso

**Implementación (futuro)**:
```
GET /api/user/:userId/data
```

Permite al usuario descargar todos sus datos en formato portable.

### Derecho de Rectificación

**Implementación**:
- Interfaz de usuario para corrección manual
- Registro de correcciones aplicadas

### Derecho de Supresión ("Derecho al Olvido")

**Implementación (futuro)**:
```
DELETE /api/user/:userId/data
```

**Proceso**:
1. Eliminar archivos del usuario de `/storage`
2. Eliminar registros de base de datos
3. Purgar cache de Redis
4. Mantener registro anonimizado en audit log (solo timestamps y tipos de operación)

### Derecho a la Portabilidad

**Formatos soportados**:
- CSV (nativo)
- JSON
- Excel (XLSX) - si `FEATURE_EXPORT_SHEETS=true`

### Derecho de Oposición

**Implementación**:
- Opt-out de procesamiento automático
- Posibilidad de deshabilitar sugerencias de IA
- Control granular sobre qué análisis ejecutar

## Seguridad Técnica

### Control de Acceso

**Capas actuales**:
- CORS configurado para orígenes permitidos
- Helmet middleware para headers de seguridad

**Futuro**:
- Autenticación JWT
- RBAC (Admin, Analyst, Viewer)
- Rate limiting por usuario
- API keys para integraciones

### Logging y Auditoría

**Información registrada**:
- Usuario (cuando esté implementada la autenticación)
- Acción realizada
- Timestamp (UTC)
- IP de origen
- Resultado de la operación
- Datos afectados (sin incluir contenido sensible)

**Ejemplo de log**:
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "userId": "user-uuid",
  "action": "upload_file",
  "resource": "upload-uuid",
  "result": "success",
  "metadata": {
    "filename": "clientes.csv",
    "rows": 1250,
    "ip": "192.168.1.100"
  }
}
```

**Logs NO incluyen**:
- Contenido de archivos
- Datos personales raw
- Contraseñas o tokens
- Información financiera

### Encriptación

**En tránsito**:
- TLS 1.3 para todas las comunicaciones HTTP
- Certificados válidos en producción
- HSTS habilitado

**En reposo** (futuro):
- Encriptación de volúmenes Docker
- Encriptación de campos sensibles en PostgreSQL
- Tokenización de datos altamente sensibles

### Gestión de Secretos

> [!CAUTION]
> **NUNCA** commitear archivos `.env` con claves reales.

**Buenas prácticas**:
- `.env` está en `.gitignore`
- Usar gestores de secretos en producción (AWS Secrets Manager, HashiCorp Vault)
- Rotar claves periódicamente
- Separar secretos por entorno

### Backup y Recuperación

**Política de backup** (futuro):
- Backups diarios de PostgreSQL
- Retención de backups: 30 días
- Backups encriptados
- Pruebas de restauración mensuales

## Evaluación de Impacto (DPIA)

### Procesamiento de Alto Riesgo

**Funciones que requieren DPIA**:
- Uso de LLM para análisis de datos personales
- Procesamiento automatizado de decisiones
- Análisis a gran escala de datos sensibles

**Proceso de DPIA**:
1. Identificar necesidad de DPIA
2. Describir el procesamiento
3. Evaluar necesidad y proporcionalidad
4. Identificar riesgos
5. Medidas de mitigación
6. Revisión por DPO (Data Protection Officer)

### Mitigación de Riesgos de IA

**Riesgos identificados**:
- Correcciones incorrectas sugeridas por LLM
- Sesgo en detección de anomalías
- Fuga de datos a través de prompts de LLM

**Mitigaciones**:
- Validación humana para correcciones críticas
- Confianza mínima configurable para auto-corrección
- LLM self-hosted o contratos de DPA con proveedores
- Anonimización de datos antes de enviar a LLM externo (si aplica)
- Logging de todas las interacciones con LLM

## Notificación de Brechas

**Proceso en caso de brecha de seguridad**:

1. **Detección** (0-24h):
   - Identificar el alcance de la brecha
   - Contener el incidente

2. **Evaluación** (24-48h):
   - Determinar si afecta a datos personales
   - Evaluar riesgo para los interesados

3. **Notificación** (72h desde detección):
   - Si hay alto riesgo: notificar a autoridad de control (AEPD en España)
   - Si hay alto riesgo para interesados: notificar a afectados directamente

4. **Documentación**:
   - Registro completo en audit log
   - Informe de incidente
   - Medidas correctivas aplicadas

## Transferencias Internacionales

**Región por defecto**: EU (España)

**Configuración**:
```env
REGION=EU  # EU, US, ASIA, etc.
```

**Política**:
- Servidores ubicados en la región configurada
- Si se usan proveedores de LLM externos (OpenAI, etc.):
  - Verificar cláusulas contractuales estándar (SCC)
  - Evaluar decisión de adecuación del país
  - Considerar LLM auto-hospedado en EU

## Cumplimiento Continuo

### Checklist de Cumplimiento

- [ ] Política de privacidad publicada y accesible
- [ ] Registro de actividades de tratamiento actualizado
- [ ] Configuración de retención de datos revisada
- [ ] Auditoría de logs de seguridad (mensual)
- [ ] Revisión de permisos de acceso (trimestral)
- [ ] Pruebas de restauración de backups
- [ ] DPIA actualizada para nuevas funciones de IA
- [ ] Formación del equipo en RGPD (anual)

### Recursos

- [Guía RGPD - AEPD](https://www.aepd.es/)
- [GDPR Official Text](https://gdpr.eu/)
- [OWASP Security Guidelines](https://owasp.org/)

---

**Última revisión**: 2024-01-15  
**Próxima revisión**: 2024-07-15  
**Responsable**: Tech Lead / DPO (pendiente de asignar)
