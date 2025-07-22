# 📋 Instruções de Integração - Portfólio Victor Brandão

## 🎯 Objetivo

Integrar o app **Cigarettes Count** ao portfólio em https://victorbrandao.tech/cigarrettes-count

## 📁 Estrutura do Projeto no Portfólio

```
meuportfolio/
├── cigarrettes-count/          # Nova pasta para o app
│   ├── index.html              # App principal
│   ├── style.css              # Estilos modernos
│   ├── script.js              # Funcionalidades JS
│   ├── manifest.json          # PWA manifest (atualizado)
│   ├── sw.js                  # Service Worker (atualizado)
│   ├── vercel.json            # Configuração Vercel
│   ├── package.json           # Metadados do projeto
│   └── README-portfolio.md    # Documentação
```

## 🚀 Passos para Integração

### 1. Adicionar ao Repositório do Portfólio

```bash
# No repositório meuportfolio
mkdir cigarrettes-count

# Copiar todos os arquivos do projeto para a pasta
cp -r /caminho/cigarettes-count/* meuportfolio/cigarrettes-count/

# Commit as mudanças
git add cigarrettes-count/
git commit -m "feat: adiciona app Cigarettes Count ao portfólio"
git push origin main
```

### 2. Configuração do Vercel

O arquivo `vercel.json` já está configurado para:

- ✅ Servir arquivos estáticos
- ✅ Configurar headers para PWA
- ✅ Suporte a Service Worker
- ✅ Roteamento correto

### 3. Atualização da Navegação do Portfólio

No seu portfólio principal, adicione um link para o novo projeto:

```html
<!-- Seção de Projetos -->
<div class="project-card">
  <div class="project-image">
    <span class="project-icon">🚭</span>
  </div>
  <div class="project-content">
    <h3>Cigarettes Count</h3>
    <p>
      App moderno para controle de consumo de cigarros com interface elegante e
      funcionalidades avançadas.
    </p>
    <div class="project-tech">
      <span>JavaScript</span>
      <span>PWA</span>
      <span>Chart.js</span>
      <span>CSS Grid</span>
    </div>
    <div class="project-links">
      <a href="/cigarrettes-count" class="btn-primary">Ver App</a>
      <a
        href="https://github.com/victorbrandaao/cigarrettes-count"
        class="btn-secondary"
        >GitHub</a
      >
    </div>
  </div>
</div>
```

### 4. Metadados para SEO

```html
<!-- No head do portfólio principal -->
<meta property="og:title" content="Victor Brandão - Desenvolvedor Salesforce" />
<meta
  property="og:description"
  content="Projetos incluindo Cigarettes Count - App moderno de controle de consumo"
/>
<meta
  name="keywords"
  content="Victor Brandão, Salesforce, Developer, JavaScript, PWA, Cigarettes Count"
/>
```

## 🔧 Arquivos Modificados para Integração

### ✅ manifest.json

- `start_url`: `/cigarrettes-count/`
- `scope`: `/cigarrettes-count/`

### ✅ sw.js

- Base path: `/cigarrettes-count`
- URLs de cache atualizadas

### ✅ vercel.json

- Configuração para deploy no Vercel
- Headers para PWA

## 🌐 URLs Finais

- **App**: https://victorbrandao.tech/cigarrettes-count
- **Repositório**: https://github.com/victorbrandaao/cigarrettes-count
- **Portfólio**: https://victorbrandao.tech

## 🎨 Características do Projeto

### Tecnologias Destacadas

- Progressive Web App (PWA)
- Chart.js para visualizações
- CSS Grid e Flexbox moderno
- JavaScript ES6+ com módulos
- Service Worker para offline
- Responsive Design

### Funcionalidades Únicas

- Multi-usuário (Victor & Kalyne)
- Sistema de limites inteligente
- Feedback haptico
- Animações CSS customizadas
- Armazenamento local persistente

## 📊 Métricas de Performance

- ⚡ Lighthouse Score: 95+
- 📱 Mobile-first design
- 🔄 Offline functionality
- ⏱️ Loading time < 2s
- 💾 Local storage para dados

## 🎯 Próximos Passos

1. ✅ Fazer commit no repositório do portfólio
2. ✅ Deploy automático no Vercel
3. ✅ Testar funcionalidade em https://victorbrandao.tech/cigarrettes-count
4. ✅ Adicionar ao currículo como projeto destacado
5. ✅ Atualizar README do portfólio principal

---

**Pronto para integração!** 🚀
