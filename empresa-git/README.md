# AI Data Steward

> Plataforma inteligente para la gestión de calidad y gobernanza de datos empresariales

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/)

## 📋 Descripción

AI Data Steward es una plataforma modular que combina análisis automatizado, reglas configurables e inteligencia artificial para detectar y corregir problemas de calidad en datos empresariales. Diseñado con cumplimiento RGPD nativo y arquitectura de microservicios escalable.

## ✨ Características

- 🔍 **Detección Automática** - Identifica problemas de calidad usando reglas y análisis impulsado por IA
- 🤖 **Corrección Inteligente** - Sugerencias de corrección con diferentes niveles de confianza
- 📊 **Dashboard en Tiempo Real** - Visualización del estado de calidad de tus datos
- 🔒 **RGPD & Seguridad** - Cumplimiento nativo con minimización, retención configurable y auditoría
- 🔌 **Integración Flexible** - Soporte para CSV, bases de datos y APIs
- 📝 **Reglas No-Code** - Define validaciones sin programar usando YAML/JSON

## 🚀 Quickstart 60s

### Requisitos

- **Node.js** 18+ and **pnpm** 9+
- **Python** 3.10+
- **Docker** & Docker Compose (opcional, para desarrollo con contenedores)

### Instalación Rápida

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd ai-data-steward

# 2. Copiar configuración de ejemplo
cp .env.example .env

# 3. Instalar dependencias
pnpm install

# 4. Iniciar desarrollo (sin Docker)
make dev
```

Abre tu navegador en:
- **Web**: http://localhost:5173
- **API**: http://localhost:8080/health

### Con Docker

```bash
# Iniciar todos los servicios (postgres, redis, api, web, py-quality)
make up

# Ver logs
make logs

# Detener servicios
make down
```

## 📁 Estructura del Proyecto

```
ai-data-steward/
├── apps/
│   ├── web/              # Frontend (React + Vite)
│   └── api/              # Backend API (Fastify + TypeScript)
├── services/
│   └── py-quality/       # Servicio Python de análisis (FastAPI)
├── datasets/
│   └── samples/          # CSV de ejemplo con datos "sucios"
├── docs/                 # Documentación técnica
│   ├── ARCH.md           # Arquitectura del sistema
│   ├── API.md            # Documentación de API
│   ├── SEC_RGPD.md       # Seguridad y cumplimiento RGPD
│   ├── LLM.md            # Integración con LLM
│   ├── RULES.md          # Sistema de reglas no-code
│   └── DEPLOY.md         # Guía de despliegue
├── storage/              # Archivos temporales (ignorado por git)
├── docker-compose.yml    # Orquestación de servicios
├── Makefile              # Comandos de desarrollo
└── README.md             # Este archivo
```

## 🎯 Comandos Disponibles

```bash
make help           # Mostrar todos los comandos disponibles
make install        # Instalar dependencias
make dev            # Desarrollo local (sin Docker)
make up             # Iniciar con Docker
make down           # Detener Docker
make logs           # Ver logs de Docker
make build          # Compilar aplicaciones
make fmt            # Formatear código (Prettier)
make lint           # Verificar código (ESLint)
make lint:fix       # Corregir problemas de linting
make typecheck      # Verificar tipos TypeScript
make test           # Ejecutar tests (placeholder)
make seed           # Poblar base de datos (placeholder)
make clean          # Limpiar artefactos
```

## 🔧 Configuración

### Variables de Entorno

Edita `.env` para personalizar:

```env
# Puertos
PORT_WEB=5173
PORT_API=8080
PORT_PY_QUALITY=8000

# Base de datos
DATABASE_URL=postgres://postgres:postgres@localhost:5432/stewarddb

# LLM Provider (mock, gemini, openai, azure)
LLM_PROVIDER=mock

# Retención de datos (días)
RETENTION_DAYS=30

# Feature flags
FEATURE_EXPORT_SHEETS=false
```

Ver `.env.example` para todas las opciones disponibles.

## 📊 Datasets de Ejemplo

En `/datasets/samples` encontrarás tres archivos CSV con problemas de calidad comunes:

- **clientes_sucios.csv** - Emails inválidos, duplicados, datos faltantes
- **ventas_sucias.csv** - Fechas en múltiples formatos, valores inconsistentes
- **inventario_sucio.csv** - SKUs vacíos, precios negativos, duplicados

Estos archivos son útiles para probar el sistema.

## 📚 Documentación

- [**Arquitectura**](docs/ARCH.md) - Diagrama y explicación de componentes
- [**API**](docs/API.md) - Endpoints y formatos de request/response
- [**Seguridad & RGPD**](docs/SEC_RGPD.md) - Cumplimiento y mejores prácticas
- [**LLM Integration**](docs/LLM.md) - Multi-proveedor (Gemini, OpenAI, Azure)
- [**Reglas No-Code**](docs/RULES.md) - Sistema de validación declarativo
- [**Deployment**](docs/DEPLOY.md) - Guía de despliegue a producción

## 🛠 Tecnologías

### Frontend
- React 18 + TypeScript
- Vite 5
- React Router 6

### Backend API
- Fastify 4 + TypeScript
- Pino (logging)
- CORS & Helmet (seguridad)

### Servicio Python
- FastAPI
- Uvicorn
- Pydantic

### Infraestructura
- PostgreSQL 16
- Redis 7
- Docker & Docker Compose
- pnpm workspaces (monorepo)

## 🐛 Troubleshooting

### Puerto ya en uso

```bash
# Identificar proceso usando el puerto
lsof -i :8080

# Cambiar puerto en .env
PORT_API=8081
```

### Errores al instalar dependencias

```bash
# Limpiar caché de pnpm
pnpm store prune

# Reinstalar
rm -rf node_modules apps/*/node_modules
pnpm install
```

### Docker Compose no inicia

```bash
# Reconstruir imágenes
make down
docker compose build --no-cache
make up
```

### Permisos en carpeta storage

```bash
# Dar permisos de escritura
chmod -R 755 storage/
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'feat: add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

Ver [PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md) para el formato esperado.

### Convención de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nueva característica
fix: corrección de bug
docs: cambios en documentación
style: formateo, punto y coma, etc.
refactor: refactorización sin cambio de features
test: añadir tests
chore: tareas de mantenimiento
```

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

**DemoLab** - Organización de desarrollo

## 🗺 Roadmap

- [x] **Fase 1**: Scaffolding y tooling
- [ ] **Fase 2**: Integración con bases de datos
- [ ] **Fase 3**: Lógica de análisis de calidad
- [ ] **Fase 4**: Sistema de reglas no-code
- [ ] **Fase 5**: Integración con LLM (Gemini/OpenAI)
- [ ] **Fase 6**: Dashboard y visualizaciones
- [ ] **Fase 7**: Autenticación y multi-tenancy

## 📞 Soporte

- **Issues**: [GitHub Issues](../../issues)
- **Documentación**: [/docs](docs/)
- **Email**: support@demolab.com

---

**Hecho con ❤️ por DemoLab**
