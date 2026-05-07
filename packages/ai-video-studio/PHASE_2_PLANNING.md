# 🎯 Próximos Passos - AI Video Studio Fase 2

**Data**: 2026-05-07
**Fase**: 2 - Frontend Development
**Status**: Planejamento

---

## 📋 Análise do Que Já Existe no Remotion

### Studio Existente

O Remotion já possui um **Studio completo** em `packages/studio/` com:

✅ **Componentes React**
- Editor completo
- Canvas com preview
- Composition selector
- Asset selector
- Audio waveform
- Context menus
- Props editor
- Ruler e guides

✅ **Infraestrutura**
- React 19.2.3
- Fast Refresh
- Context API para state management
- Portal rendering
- CSS injection

✅ **Funcionalidades**
- Live preview
- Composition management
- Asset management
- Visual controls
- Error overlay

### Player Existente

`packages/player/` oferece:
- ✅ Embeddable video player
- ✅ Playback controls
- ✅ Seek bar
- ✅ Volume control
- ✅ Playback rate control
- ✅ Thumbnail support

---

## 🤔 Decisão: Reutilizar ou Criar do Zero?

### Opção A: Reutilizar Studio Existente ❌

**Problema**: O Studio é muito genérico e complexo. Seria overkill para nosso caso.

**Por quê não**:
- Muito acoplado ao Remotion internals
- Difícil de customizar para nosso fluxo específico
- Adiciona complexidade desnecessária
- Não é feito para o fluxo de onboarding que queremos

### Opção B: Usar Player + Criar UI Customizada ✅ **RECOMENDADO**

**Vantagens**:
- ✅ Reutiliza `@remotion/player` para preview
- ✅ Cria UI customizada para nosso fluxo
- ✅ Mais simples e focado
- ✅ Melhor UX para onboarding
- ✅ Menos dependências do Remotion internals

**Abordagem**:
1. Usar `@remotion/player` para preview
2. Criar UI customizada em React
3. Integrar com nosso backend
4. Manter simplicidade

---

## 🎨 Arquitetura Proposta para Frontend

### Stack Recomendado

```
Frontend Stack:
├── React 19.2.3 (usar catalog do monorepo)
├── TypeScript (strict mode)
├── Vite (build tool)
├── Tailwind CSS (styling)
├── @remotion/player (preview)
├── React Query (data fetching)
└── Zustand (state management - simples)
```

### Por que essas escolhas?

1. **React 19.2.3** - Já no monorepo, versão estável
2. **TypeScript** - Consistência com backend
3. **Vite** - Rápido, moderno, usado no Remotion
4. **Tailwind** - Rápido de desenvolver, consistente
5. **@remotion/player** - Reutilizar do Remotion
6. **React Query** - Gerenciar estado do servidor
7. **Zustand** - State local simples (não Redux)

---

## 📁 Estrutura Proposta

```
packages/ai-video-studio/web-ui/
├── src/
│   ├── pages/
│   │   ├── index.tsx              # Home/Projects
│   │   ├── create/
│   │   │   ├── index.tsx          # Wizard container
│   │   │   ├── brand-step.tsx     # Step 1
│   │   │   ├── script-step.tsx    # Step 2
│   │   │   ├── storyboard-step.tsx # Step 3
│   │   │   └── preview-step.tsx   # Step 4
│   │   └── project/
│   │       └── [id].tsx           # Project detail
│   │
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── StepIndicator.tsx
│   │   ├── BrandKitViewer.tsx
│   │   ├── ScriptEditor.tsx
│   │   ├── StoryboardViewer.tsx
│   │   ├── VideoPreview.tsx       # Usa @remotion/player
│   │   ├── ProgressTracker.tsx
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       └── Loading.tsx
│   │
│   ├── hooks/
│   │   ├── useProject.ts
│   │   ├── useAgentProgress.ts
│   │   ├── useVideoPreview.ts
│   │   └── useSSE.ts
│   │
│   ├── context/
│   │   ├── ProjectContext.tsx
│   │   └── AgentContext.tsx
│   │
│   ├── services/
│   │   ├── api.ts                 # API client
│   │   └── sse.ts                 # SSE client
│   │
│   ├── types/
│   │   └── index.ts               # Reutilizar do backend
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

---

## 🔄 Fluxo de Desenvolvimento Proposto

### Fase 2.1: Setup Base (1-2 dias)

- [ ] Criar Vite app em `web-ui/`
- [ ] Configurar TypeScript
- [ ] Configurar Tailwind
- [ ] Setup React Query
- [ ] Setup Zustand
- [ ] Criar estrutura de pastas

### Fase 2.2: Componentes Base (2-3 dias)

- [ ] Layout principal
- [ ] Sidebar/Navigation
- [ ] Common components (Button, Input, Modal)
- [ ] ProjectCard
- [ ] StepIndicator

### Fase 2.3: Home Page (1-2 dias)

- [ ] Listar projetos
- [ ] Criar novo projeto
- [ ] Deletar projeto
- [ ] Editar projeto

### Fase 2.4: Wizard - Step 1 (1 dia)

- [ ] Brand extraction form
- [ ] URL input
- [ ] BrandKitViewer
- [ ] Progress tracking

### Fase 2.5: Wizard - Step 2 (1 dia)

- [ ] Questionnaire form
- [ ] Script preview
- [ ] Edit script

### Fase 2.6: Wizard - Step 3 (1 dia)

- [ ] Storyboard viewer
- [ ] Scene editor
- [ ] Add/remove scenes

### Fase 2.7: Wizard - Step 4 (2 dias)

- [ ] VideoPreview com @remotion/player
- [ ] Template selector
- [ ] Render button
- [ ] Download video

### Fase 2.8: Polish (1-2 dias)

- [ ] Error handling
- [ ] Loading states
- [ ] Animations
- [ ] Responsive design
- [ ] Accessibility

---

## 🎯 Decisões a Validar com Você

### 1. **Build Tool**
- [ ] Vite (recomendado - rápido, moderno)
- [ ] Next.js (mais features, mas mais pesado)
- [ ] Outro?

### 2. **State Management**
- [ ] Zustand (recomendado - simples)
- [ ] Redux (mais complexo)
- [ ] Context API (suficiente?)
- [ ] Outro?

### 3. **Styling**
- [ ] Tailwind CSS (recomendado)
- [ ] CSS Modules
- [ ] Styled Components
- [ ] Outro?

### 4. **Data Fetching**
- [ ] React Query (recomendado)
- [ ] SWR
- [ ] Fetch direto
- [ ] Outro?

### 5. **Prioridade de Features**
- [ ] Todas as 4 steps do wizard?
- [ ] Começar com steps 1-2 apenas?
- [ ] Começar com home page?
- [ ] Outra ordem?

### 6. **Integração com Studio**
- [ ] Usar @remotion/player para preview?
- [ ] Abrir Studio em nova aba para edição?
- [ ] Ambos?
- [ ] Outra abordagem?

---

## 📊 Estimativa de Tempo

| Fase | Tempo | Dependências |
|------|-------|--------------|
| 2.1: Setup | 1-2 dias | Nenhuma |
| 2.2: Componentes | 2-3 dias | Setup completo |
| 2.3: Home | 1-2 dias | Componentes |
| 2.4: Step 1 | 1 dia | Home |
| 2.5: Step 2 | 1 dia | Step 1 |
| 2.6: Step 3 | 1 dia | Step 2 |
| 2.7: Step 4 | 2 dias | Step 3 |
| 2.8: Polish | 1-2 dias | Todos steps |
| **Total** | **10-15 dias** | - |

---

## 🚀 Recomendação Final

### Abordagem Proposta:

1. **Usar Vite + React + TypeScript** - Stack moderno e rápido
2. **Reutilizar @remotion/player** - Não reinventar a roda
3. **Tailwind para styling** - Desenvolvimento rápido
4. **Zustand para state** - Simples e eficiente
5. **React Query para API** - Gerenciamento de dados
6. **Começar com Home + Step 1** - MVP rápido

### Benefícios:

✅ Reutiliza componentes do Remotion
✅ Stack moderno e simples
✅ Desenvolvimento rápido
✅ Fácil de manter
✅ Escalável

---

## ❓ Perguntas para Você

Antes de começar, gostaria de validar:

1. **Você concorda com a stack proposta?** (Vite + React + Tailwind + Zustand + React Query)

2. **Qual prioridade?**
   - [ ] MVP rápido (Home + Step 1 apenas)
   - [ ] Completo (todos os 4 steps)
   - [ ] Outra?

3. **Integração com Studio?**
   - [ ] Usar @remotion/player para preview
   - [ ] Abrir Studio em nova aba
   - [ ] Ambos?

4. **Começamos agora ou quer revisar algo?**

---

## 📝 Próximas Ações (Após Validação)

1. Criar Vite app em `web-ui/`
2. Configurar TypeScript + Tailwind
3. Criar estrutura de pastas
4. Implementar componentes base
5. Conectar com backend

---

**Aguardando sua validação para prosseguir! 🚀**
