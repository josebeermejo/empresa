#!/bin/bash

# AI Data Steward - Script de Ejecución (Portable Node)
# Este script verifica el entorno y descarga Node.js localmente si es necesario.

set -e

# Configuración
NODE_VERSION_REQ="18.19.0"
NODE_DIST="node-v$NODE_VERSION_REQ-linux-x64"
NODE_URL="https://nodejs.org/dist/v$NODE_VERSION_REQ/$NODE_DIST.tar.xz"
LOCAL_NODE_DIR="$(pwd)/.node"

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}==============================================${NC}"
echo -e "${BLUE}      AI Data Steward - Iniciador             ${NC}"
echo -e "${BLUE}==============================================${NC}"

# Función para verificar versión de node
check_node_version() {
    if ! command -v node &> /dev/null; then return 1; fi
    local version=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
    if [ "$version" -lt 18 ]; then return 1; fi
    return 0
}

# 1. Verificar/Instalar Node Portable
if ! check_node_version; then
    echo -e "⚠️  Node.js v18+ no detectado o versión antigua."
    
    if [ ! -d "$LOCAL_NODE_DIR" ]; then
        echo -e "📦 Descargando Node.js portable ($NODE_VERSION_REQ)..."
        mkdir -p "$LOCAL_NODE_DIR"
        
        # Usar un archivo temporal para la descarga
        TMP_FILE=$(mktemp)
        if command -v wget &> /dev/null; then
            wget -q --show-progress -O "$TMP_FILE" "$NODE_URL"
        else
            curl -L -o "$TMP_FILE" "$NODE_URL"
        fi
        
        echo -e "📂 Extrayendo..."
        tar -xJf "$TMP_FILE" -C "$LOCAL_NODE_DIR" --strip-components=1
        rm "$TMP_FILE"
    fi
    
    # Agregar al PATH para esta sesión
    export PATH="$LOCAL_NODE_DIR/bin:$PATH"
    echo -e "${GREEN}✅ Usando Node.js portable: $(node -v)${NC}"
else
    echo -e "${GREEN}✅ Node.js $(node -v) ya instalado en el sistema.${NC}"
fi

# 2. Instalar/Actualizar dependencias
# Si cambiamos de Node v12 a v18, es mejor reinstalar esbuild y otros binarios
if [ -d "node_modules" ] && [ -f ".node_version_last" ] && [ "$(cat .node_version_last)" != "$(node -v)" ]; then
    echo -e "🔄 Cambio de versión de Node detectado. Limpiando binarios para evitar errores..."
    # No borramos todo node_modules por velocidad, pero forzamos reinstalación de paquetes críticos
    rm -rf node_modules/.bin node_modules/esbuild node_modules/@esbuild
fi

if [ ! -d "node_modules" ] || [ ! -f ".node_version_last" ] || [ "$(cat .node_version_last)" != "$(node -v)" ]; then
    echo -e "📦 Instalando/Reparando dependencias (npm install)..."
    # Usamos --ignore-scripts para evitar errores de husky si no hay .git
    npm install --ignore-scripts
    node -v > .node_version_last
else
    echo -e "✅ Dependencias verificadas."
fi

# 3. .env
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    cp .env.example .env
    echo -e "⚙️  Archivo .env creado."
fi

# 4. Iniciar
echo -e "${GREEN}🚀 Iniciando servidores...${NC}"
npm run dev
