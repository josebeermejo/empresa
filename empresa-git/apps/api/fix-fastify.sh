#!/bin/bash

# Este script reemplaza la configuración de logger booleana (true/false)
# por un objeto de configuración vacío, que es lo que requiere Fastify 5.

FILE="src/server.ts"

if [ ! -f "$FILE" ]; then
    echo "❌ No se encontró $FILE. ¿Estás en la carpeta apps/api?"
    exit 1
fi

echo "🔍 Buscando configuración de logger en $FILE..."

# Buscamos 'logger: true' y lo cambiamos por 'logger: {}'
# También buscamos 'logger: false' por si acaso
sed -i 's/logger: true/logger: {}/g' "$FILE"
sed -i 's/logger: false/logger: {}/g' "$FILE"

echo "✅ Parche aplicado. Intentando arrancar el servidor..."

# Intentar instalar la dependencia de logs necesaria para que se vea bonito
npm install -D pino-pretty

echo "🚀 Ejecutando npm run dev..."
npm run dev
