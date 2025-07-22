#!/bin/bash

# Script de integração para o portfólio Victor Brandão
# Este script prepara o projeto para ser integrado ao portfólio

echo "🚀 Preparando Cigarettes Count para integração no portfólio..."

# Verificar se estamos no diretório correto
if [ ! -f "index.html" ]; then
    echo "❌ Erro: Execute este script no diretório do projeto Cigarettes Count"
    exit 1
fi

# Criar diretório de build
echo "📁 Criando estrutura de build..."
mkdir -p build

# Copiar arquivos essenciais
echo "📋 Copiando arquivos..."
cp index.html build/
cp style.css build/
cp script.js build/
cp manifest.json build/
cp sw.js build/
cp vercel.json build/
cp package.json build/
cp README-portfolio.md build/README.md

# Verificar se os arquivos foram copiados
if [ ! -f "build/index.html" ]; then
    echo "❌ Erro ao copiar arquivos"
    exit 1
fi

echo "✅ Arquivos preparados na pasta 'build/'"
echo ""
echo "📋 Próximos passos:"
echo "1. Copie a pasta 'build/' para 'meuportfolio/cigarrettes-count/'"
echo "2. Faça commit no repositório do portfólio"
echo "3. Deploy automático no Vercel"
echo ""
echo "🌐 URL final: https://victorbrandao.tech/cigarrettes-count"
echo ""
echo "🎉 Pronto para integração!"
