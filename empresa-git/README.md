# AI Data Steward

**AI Data Steward** es una plataforma integral para la gestión, limpieza y enriquecimiento de datos empresariales, potenciada por Inteligencia Artificial y diseñada con estrictos controles de privacidad y seguridad (RGPD).

![Estado](https://img.shields.io/badge/Estado-Beta-blue) ![Licencia](https://img.shields.io/badge/Licencia-Privada-red)

## 📋 Características Principales

- **Ingesta de Datos**: Carga y procesa archivos CSV y Excel de gran volumen.
- **Calidad de Datos**: Detecta automáticamente duplicados, errores de formato, valores faltantes y anomalías.
- **Asistente IA**: Sugiere correcciones y explica problemas de datos usando modelos LLM (simulados o reales).
- **Privacidad y Seguridad**:
  - Gestión de consentimiento y cumplimiento RGPD.
  - Purga automática de datos (retención configurable).
  - Auditoría de acciones sensibles.
  - Guardrails para evitar fugas de información a la IA.
- **Reglas Personalizables**: Motor de validación flexible (Regex, rangos numéricos, listas permitidas).

## 🚀 Guía de Inicio Rápido

### Prerrequisitos

- **Node.js**: Versión 12 o superior.
- **NPM** o **PNPM**: Gestor de paquetes.

### Instalación y Ejecución Rápida

1. Clonar el repositorio y entrar en la carpeta.
2. Ejecutar el script iniciador:
   ```bash
   ./aplicacion.sh
   ```

Este script verificará automáticamente tu versión de Node.js, instalará las dependencias si es necesario e iniciará los servidores.

### Instalación Manual (Alternativa)
1. Instalar dependencias (desde la raíz):
   ```bash
   npm install
   ```
2. Iniciar en desarrollo:
   ```bash
   npm run dev
   ```

Esto iniciará:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080

## 📖 Manual de Usuario

### 1. Panel Principal (Dashboard)
El dashboard ofrece una vista general del estado del sistema, incluyendo:
- Datasets recientes.
- Métricas de calidad (filas totales, errores detectados).
- Estado de los servicios.

### 2. Gestión de Datos (Ingeniería)
Navega a la sección **"Ingeniería"** para:
- **Subir Archivos**: Arrastra y suelta tus archivos CSV/Excel.
- **Ver Detalles**: Haz clic en cualquier dataset para ver su análisis.

### 3. Limpieza y Corrección
Dentro de un dataset:
- **Pestaña Issues**: Revisa la lista de problemas detectados (emails inválidos, teléfonos erróneos, etc.).
- **Asistente IA**: Usa el botón "Explain" o "Fix" para recibir ayuda sobre cómo solucionar un error.
- **Aplicar Reglas**: Define reglas específicas en la sección "Reglas" para automatizar validaciones.

### 4. Privacidad y Configuración
Accede a **"Privacidad"** (o vía el banner inferior) para:
- **Consentimiento**: Aceptar o rechazar el procesamiento de datos.
- **Configuración IA**: Activar/Desactivar el envío de datos a proveedores externos de IA (`SEND_TO_LLM`).
- **Zona de Peligro**: Eliminar permanentemente tus datasets (Borrado seguro en cascada).

### 5. Exportación
Una vez limpios tus datos los puedes descargar:
- Ve a la pestaña **"Exportar"** dentro del dataset.
- Selecciona el formato: CSV, Excel o JSON.

## 🛠️ Configuración Técnica

El sistema se configura mediante variables de entorno en `apps/api/.env` y `apps/web/.env`.

**Backend (`apps/api/.env`):**
```bash
PORT=8080
CORS_ORIGIN=http://localhost:5173
# Seguridad
RATE_LIMIT_MAX=100
RETENTION_DAYS=30
ENABLE_PURGE_CRON=true
# IA
SEND_TO_LLM=false (true para habilitar llamadas reales)
```

**Frontend (`apps/web/.env`):**
```bash
VITE_API_URL=http://localhost:8080
VITE_PRIVACY_BANNER=true
VITE_SEND_TO_LLM=false
```

## 📚 Documentación Adicional

Para detalles más profundos sobre la arquitectura y seguridad, consulta los documentos en la carpeta `/docs`:

- [**Arquitectura del Sistema**](docs/ARCH.md) (`docs/ARCH.md`)
- [**Referencia API**](docs/API.md) (`docs/API.md`)
- [**Seguridad y RGPD**](docs/SEC_RGPD.md) (`docs/SEC_RGPD.md`)

## 🆘 Solución de Problemas Comunes

### 1. Error: `pnpm: not found`
Se ha actualizado el proyecto para usar **NPM Workspaces** por defecto. Si intentas ejecutar `npm run dev` y recibes un error sobre `pnpm`, asegúrate de estar usando la última versión del código. Ya no es necesario instalar `pnpm`.

### 2. Error: `Prisma only supports Node.js >= 16.13` o similar
Este proyecto requiere **Node.js v12** o superior. Si tu versión actual es inferior, el sistema no funcionará.

**Para actualizar Node.js en Ubuntu/WSL:**
```bash
# Instalar NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
# Recargar shell
source ~/.bashrc
# Instalar Node 12
nvm install 12
nvm use 12
```

### 3. Errores de Tipado (TypeScript)
Si ves errores como `Cannot find type definition file for 'vitest/globals'`, es probable que sea porque las dependencias no se han instalado correctamente debido a la versión de Node. Una vez que actualices a Node 12 y ejecutes `npm install`, estos errores desaparecerán.

---
Desarrollado por el equipo de AI Data Steward.
