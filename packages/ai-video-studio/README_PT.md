# 🎬 AI Video Studio - Sistema de Criação de Vídeos com IA

## 🌟 Visão Geral

**AI Video Studio** é um sistema completo de criação de vídeos com inteligência artificial, totalmente integrado ao Remotion. Crie vídeos profissionais através de uma interface conversacional com Claude Code ou via API REST.

### ✨ Características Principais

- 🤖 **Criação Automatizada** - De URL a vídeo em segundos
- 🎨 **Extração de Marca** - Analisa sites e extrai cores, fontes e tom
- 📝 **Geração de Script** - IA cria roteiros personalizados
- 🎬 **Código Remotion** - Gera composições TypeScript automaticamente
- ⚡ **Tempo Real** - Acompanhe o progresso ao vivo
- 💾 **Armazenamento Local** - Todos os arquivos salvos localmente
- 🔌 **Integração Claude Code** - Use via linha de comando
- 📚 **Documentação Completa** - 10 guias detalhados

---

## 🚀 Início Rápido

### 1. Instalação (2 minutos)

```bash
cd packages/ai-video-studio
bun install
cp .env.example .env
```

### 2. Iniciar Backend (1 minuto)

```bash
bun run dev:backend
```

### 3. Testar (1 minuto)

```bash
bun run test-api.ts
```

### 4. Criar Seu Primeiro Vídeo (1 minuto)

```bash
claude "Crie um vídeo de 30 segundos para https://remotion.dev"
```

---

## 📖 Documentação

- **[START_HERE.md](./START_HERE.md)** - Comece aqui!
- **[QUICKSTART.md](./QUICKSTART.md)** - Guia rápido de 5 minutos
- **[SETUP.md](./SETUP.md)** - Setup detalhado
- **[CLAUDE_CODE_GUIDE.md](./CLAUDE_CODE_GUIDE.md)** - Integração Claude Code
- **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - Overview completo
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Detalhes técnicos
- **[AI_VIDEO_STUDIO_ARCHITECTURE.md](./AI_VIDEO_STUDIO_ARCHITECTURE.md)** - Arquitetura
- **[INDEX.md](./INDEX.md)** - Índice de documentação
- **[CHECKLIST.md](./CHECKLIST.md)** - Status da implementação
- **[FINAL_SUMMARY.md](./FINAL_SUMMARY.md)** - Resumo final

---

## 🎯 Como Funciona

### Fluxo Completo

```
1. Usuário: "Crie um vídeo para https://example.com"
   ↓
2. Sistema extrai: cores, fontes, tom de voz
   ↓
3. Sistema pergunta: objetivo, público, duração
   ↓
4. Sistema gera: script com cenas e timing
   ↓
5. Sistema cria: storyboard visual
   ↓
6. Sistema gera: código Remotion (composition.tsx)
   ↓
7. Usuário vê: preview do vídeo
```

---

## 🏗️ Arquitetura

```
Claude Code CLI
    ↓
MCP Server (4 ferramentas)
    ↓
Backend Express (API REST + SSE)
    ↓
Agentes Inteligentes (Processamento)
    ↓
Sistema de Arquivos (Armazenamento)
```

### 4 Agentes

1. **Brand Extractor** - Analisa sites
2. **Script Generator** - Cria roteiros
3. **Storyboard Generator** - Gera storyboards
4. **Video Composer** - Gera código Remotion

---

## 🔌 API Endpoints

### Projetos
- `GET /api/projects` - Listar projetos
- `POST /api/projects` - Criar projeto
- `GET /api/projects/:id` - Obter projeto
- `PATCH /api/projects/:id` - Atualizar projeto
- `DELETE /api/projects/:id` - Deletar projeto

### Agentes
- `POST /api/agents/extract-brand` - Extrair marca
- `POST /api/agents/generate-script` - Gerar script
- `POST /api/agents/generate-storyboard` - Criar storyboard
- `POST /api/agents/compose-video` - Compor vídeo

### Eventos
- `GET /api/events` - Stream SSE em tempo real

---

## 💾 Armazenamento

```
.remotion-ai-studio/projects/{projectId}/
├── config.json
├── brand-kit.json
├── script.json
├── storyboard.json
├── composition.tsx
└── renders/
```

---

## 🧪 Testes

```bash
# Testar API
bun run test-api.ts

# Testar MCP
bun run test-mcp.ts
```

---

## 📊 Status

### ✅ Fase 1: Backend (COMPLETA)
- ✅ Servidor Express
- ✅ MCP Server
- ✅ 4 Agentes
- ✅ API REST
- ✅ SSE
- ✅ Documentação
- ✅ Testes

### ⏳ Fase 2: Frontend (PRÓXIMA)
- ⏳ Interface React
- ⏳ Dashboard
- ⏳ Wizard
- ⏳ Preview

### ⏳ Fase 3+: Renderização, Templates, Áudio

---

## 📈 Métricas

| Métrica | Valor |
|---------|-------|
| Arquivos | 25+ |
| Código | ~1,500 linhas |
| Endpoints | 11 |
| Ferramentas MCP | 4 |
| Agentes | 4 |
| Documentação | 10 guias |
| Setup | 5 min |
| Criação | 5-10 seg |

---

## 🆘 Solução de Problemas

### Backend não inicia?
```bash
lsof -i :3001
PORT=3002 bun run dev:backend
```

### Testes falhando?
```bash
bun run dev:backend
# Em outro terminal:
bun run test-api.ts
```

### MCP não funciona?
- Verificar `.claude/mcp.json`
- Reiniciar Claude Code
- Verificar backend

---

## 🎉 Pronto para Começar?

```bash
cd packages/ai-video-studio
bun install
bun run dev:backend
claude "Crie um vídeo para meu site!"
```

**Vamos criar vídeos incríveis! 🚀**

---

## 📞 Suporte

1. Leia [START_HERE.md](./START_HERE.md)
2. Verifique [INDEX.md](./INDEX.md)
3. Revise os logs
4. Abra uma issue

---

**Documentação**: [INDEX.md](./INDEX.md)
**Status**: ✅ Backend Completo | ⏳ Frontend Próximo
