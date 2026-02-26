#!/bin/bash

# AI Data Steward - Script de Lanzamiento Rápido
# Este script inicia la aplicación sin descargar dependencias ni Node.js.

set -e

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}==============================================${NC}"
echo -e "${BLUE}      AI Data Steward - Iniciador             ${NC}"
echo -e "${BLUE}==============================================${NC}"

# 1. Verificar .env
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    cp .env.example .env
    echo -e "⚙️  Archivo .env creado desde .env.example"
fi

# 2. Iniciar Aplicación
echo -e "${GREEN}🚀 Iniciando servidores...${NC}"
# Asegurar que los binarios locales estén en el PATH
export PATH=$PWD/node_modules/.bin:$PATH

npm run dev
