# 📚 Índice de Documentação - GymX

Bem-vindo à documentação completa do projeto GymX. Este índice organiza todos os documentos por categoria.

---

## 🚀 Começando

### Para Novos Desenvolvedores

1. **[README.md](./README.md)** - Comece aqui!
   - Overview do projeto
   - Features principais
   - Setup inicial
   - Stack tecnológica

2. **[QUICK_START.md](./QUICK_START.md)** - Guia prático
   - Como usar os componentes
   - Exemplos de código
   - Expandindo para dashboard

3. **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribuindo
   - Código de conduta
   - Padrões de código
   - Como fazer PRs

---

## 🎨 Design System

### Referência Visual (IMPORTANTE!)

**👉 [DESIGN_SYSTEM_REFERENCE.md](./DESIGN_SYSTEM_REFERENCE.md)** - **DOCUMENTO OFICIAL**
- ✅ **USE ESTE como fonte única de verdade**
- Cores completas (neutral, acentos, semânticas)
- Tipografia detalhada (escalas, pesos, uso)
- Espaçamento (sistema 8pt)
- Border radius
- Grid e layout
- Componentes (padrões visuais)
- Botões (todos os estilos)
- Inputs e forms
- Cards
- Animações
- Estados (hover, focus, active, disabled)
- Ícones
- Acessibilidade
- Boas práticas

**Consulte SEMPRE antes de criar qualquer componente ou estilo!**

---

### Guias Complementares

**[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Quick reference
- Resumo executivo
- Referências rápidas
- Aponta para documentação completa

---

## 🧩 Componentes

**[COMPONENTS_REFERENCE.md](./COMPONENTS_REFERENCE.md)** - Referência completa
- Todos os componentes disponíveis
- Props e APIs
- Exemplos de uso
- Classes Tailwind úteis
- Imports comuns

**Componentes principais:**
- AnimatedButton
- Badge
- StatCard
- SectionHeader
- FormInput ⭐ NEW
- LoadingSpinner
- DashboardCard
- PageTransition

---

## 📄 Páginas e Rotas

**[src/app/pages/README.md](./src/app/pages/README.md)** - Guia de páginas
- HomePage (`/`)
- LoginPage (`/login`) ⭐ NEW
- Páginas futuras
- Navegação
- Protected routes
- Padrões de design

**[LOGIN_SYSTEM.md](./LOGIN_SYSTEM.md)** - Sistema de login
- Adaptações Figma → GymX
- Componentes criados
- Validação
- Acessibilidade
- Responsividade
- Próximos passos

---

## 📝 Conteúdo Editorial

**[CONTEUDO.md](./CONTEUDO.md)** - Todo o conteúdo do site
- Seção por seção
- Headlines, subheadlines
- Body copy
- CTAs
- Depoimentos
- FAQ
- Planos
- Footer

---

## 📋 Gerenciamento

**[CHANGELOG.md](./CHANGELOG.md)** - Histórico de mudanças
- Versão 1.0 - Landing page
- Versão 2.0 - Sistema de login ⭐
- Próximas versões

**[ATUALIZACOES.md](./ATUALIZACOES.md)** - Reformulação premium
- Conteúdo reformulado PT-BR
- Componentes atualizados
- Novos componentes
- Estrutura da página

**[PROXIMOS_PASSOS.md](./PROXIMOS_PASSOS.md)** - Roadmap
- Seções faltantes
- Imagens necessárias
- Funcionalidades interativas
- Integrações técnicas
- Performance
- Deploy

---

## 🛠 Desenvolvimento

### Estrutura do Projeto

```
src/app/
├── components/       # Componentes reutilizáveis
├── pages/           # Páginas da aplicação
├── hooks/           # Custom hooks
├── utils/           # Utilitários
├── constants/       # Constantes
└── App.tsx          # Router principal
```

### Hooks Disponíveis

**[src/app/hooks/](./src/app/hooks/)**
- `useScrollAnimation` - Animações no scroll
- `useScrollTo` - Scroll suave
- `useScrollDirection` - Direção do scroll
- `useWindowSize` - Responsividade
- `useIsMobile` - Detecção mobile
- `useOrientation` - Orientação do device

---

## 🎯 Por Tipo de Tarefa

### Criar um Novo Componente

1. ✅ Consulte **DESIGN_SYSTEM_REFERENCE.md**
2. ✅ Veja exemplos em **COMPONENTS_REFERENCE.md**
3. ✅ Use componentes existentes como base
4. ✅ Siga padrões de **CONTRIBUTING.md**
5. ✅ Teste mobile-first

### Adicionar uma Nova Página

1. ✅ Consulte **src/app/pages/README.md**
2. ✅ Veja LoginPage como exemplo
3. ✅ Siga estrutura de layout padrão
4. ✅ Adicione ao router em App.tsx
5. ✅ Documente em pages/README.md

### Atualizar Conteúdo

1. ✅ Consulte **CONTEUDO.md**
2. ✅ Siga tom de voz estabelecido
3. ✅ Mantenha consistência
4. ✅ Atualize CONTEUDO.md após mudanças

### Fazer Deploy

1. ✅ Consulte **PROXIMOS_PASSOS.md** - Fase 9
2. ✅ Substitua dados fictícios por reais
3. ✅ Teste em todos os breakpoints
4. ✅ Verifique acessibilidade
5. ✅ Configure analytics

---

## 🎨 Referências de Estilo

### Cores

```css
/* Background */
bg-neutral-950  /* #0D0D0D */
bg-neutral-900  /* #1A1A1A */

/* Primário */
bg-yellow-400   /* #E5C000 */
text-yellow-400

/* Secundário */
bg-orange-500   /* #FF5A1A */
text-orange-500

/* Texto */
text-white      /* #FFFFFF */
text-neutral-050 /* #F5F5F5 */
text-neutral-300 /* #888888 */
```

### Tipografia

```css
/* Headlines */
font-display font-black uppercase

/* Body */
font-body font-normal

/* Labels */
font-body font-semibold uppercase tracking-wider
```

### Espaçamento

```css
gap-4   /* 16px */
gap-6   /* 24px */
gap-8   /* 32px */

p-4     /* 16px */
p-6     /* 24px */
p-8     /* 32px */
```

---

## 🔍 Busca Rápida

### Preciso de...

**Cores do sistema?**
→ DESIGN_SYSTEM_REFERENCE.md → Cores

**Como fazer um botão?**
→ DESIGN_SYSTEM_REFERENCE.md → Botões

**Como criar um input?**
→ DESIGN_SYSTEM_REFERENCE.md → Inputs e Forms  
→ COMPONENTS_REFERENCE.md → FormInput

**Como adicionar animação?**
→ DESIGN_SYSTEM_REFERENCE.md → Animações

**Qual o conteúdo da seção X?**
→ CONTEUDO.md → Seção X

**Como funciona o login?**
→ LOGIN_SYSTEM.md

**Quais componentes posso usar?**
→ COMPONENTS_REFERENCE.md

**Como contribuir?**
→ CONTRIBUTING.md

**O que fazer depois?**
→ PROXIMOS_PASSOS.md

---

## 📊 Status do Projeto

### ✅ Completo

- [x] Design system estabelecido
- [x] Landing page (home)
- [x] Todas as seções da home
- [x] Sistema de login
- [x] Componentes reutilizáveis
- [x] Responsividade mobile
- [x] Animações
- [x] Acessibilidade básica
- [x] Documentação completa

### 🚧 Em Progresso

- [ ] Páginas de autenticação (recuperar senha, etc)
- [ ] Dashboard do membro
- [ ] Backend integration
- [ ] Imagens reais

### 📋 Planejado

- [ ] Seção de Coaches
- [ ] Seção de Equipamentos
- [ ] Seção de Protocolo
- [ ] Blog/Artigos
- [ ] Área administrativa
- [ ] Mobile app (futuro)

---

## 🆘 Suporte

### Problemas Comuns

**Animações não funcionam?**
→ Verifique import do Motion: `import { motion } from "motion/react"`

**Cores não aplicam?**
→ Verifique se está usando classes do Tailwind: `bg-yellow-400` não `bg-#E5C000`

**Componente não aparece?**
→ Verifique import e export em `components/index.ts`

**Rotas não funcionam?**
→ Verifique BrowserRouter em App.tsx

---

## 📞 Contato

**Dúvidas sobre:**
- Design System → Consulte DESIGN_SYSTEM_REFERENCE.md primeiro
- Componentes → Consulte COMPONENTS_REFERENCE.md
- Código → Abra issue no GitHub
- Conteúdo → Consulte CONTEUDO.md

---

## 🗺️ Mapa de Documentação

```
📁 DOCUMENTACAO_INDEX.md (você está aqui!)
│
├─ 🚀 Começando
│  ├─ README.md
│  ├─ QUICK_START.md
│  └─ CONTRIBUTING.md
│
├─ 🎨 Design System ⭐ IMPORTANTE
│  ├─ DESIGN_SYSTEM_REFERENCE.md (OFICIAL!)
│  └─ DESIGN_SYSTEM.md (resumo)
│
├─ 🧩 Componentes
│  ├─ COMPONENTS_REFERENCE.md
│  └─ src/app/components/
│
├─ 📄 Páginas
│  ├─ src/app/pages/README.md
│  └─ LOGIN_SYSTEM.md
│
├─ 📝 Conteúdo
│  └─ CONTEUDO.md
│
└─ 📋 Gerenciamento
   ├─ CHANGELOG.md
   ├─ ATUALIZACOES.md
   └─ PROXIMOS_PASSOS.md
```

---

**💡 Dica:** Adicione este arquivo aos seus bookmarks!

**📌 Lembre-se:** DESIGN_SYSTEM_REFERENCE.md é a fonte única de verdade para estilos visuais.

---

**Última atualização:** 11 de abril de 2026  
**Versão do projeto:** 2.0
