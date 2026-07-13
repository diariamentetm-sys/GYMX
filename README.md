# GymX - Fitness Dashboard

![React](https://img.shields.io/badge/React-18.3.1-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.12-38B2AC)
![Motion](https://img.shields.io/badge/Motion-12.23.24-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)

Uma aplicação web moderna e de alta performance para academias, construída com React, Tailwind CSS e Motion (Framer Motion). Design dark-first, editorial e focado em performance.

---

## 🚨 IMPORTANTE: Design System

**Antes de criar qualquer componente ou estilo:**

1. 📖 Leia: **[LEIA_PRIMEIRO.md](./LEIA_PRIMEIRO.md)** - Checklist rápido
2. 🎨 Consulte: **[DESIGN_SYSTEM_REFERENCE.md](./DESIGN_SYSTEM_REFERENCE.md)** - Documento oficial
3. 📚 Navegue: **[DOCUMENTACAO_INDEX.md](./DOCUMENTACAO_INDEX.md)** - Índice completo

**Estes documentos garantem consistência visual e seguem as melhores práticas do projeto!**

---

## ✨ Features

- ✅ Design System completo e documentado
- ✅ Animações fluidas com Motion (Framer Motion)
- ✅ Totalmente responsivo (mobile-first)
- ✅ Dark mode nativo
- ✅ Componentes reutilizáveis
- ✅ Hooks customizados
- ✅ TypeScript support
- ✅ Otimizado para performance
- ✅ Pronto para expansão em dashboard

## 🚀 Quick Start

```bash
# O projeto já está configurado e pronto para uso
# Basta começar a desenvolver!
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/        # Componentes React
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── TickerStrip.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── PricingSection.tsx
│   │   ├── FinalCTA.tsx
│   │   ├── Footer.tsx
│   │   ├── AnimatedButton.tsx
│   │   ├── Badge.tsx
│   │   ├── StatCard.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── DashboardCard.tsx
│   │   ├── PageTransition.tsx
│   │   ├── examples/      # Exemplos de uso
│   │   └── index.ts       # Exports centralizados
│   ├── hooks/             # Hooks customizados
│   │   ├── useScrollAnimation.ts
│   │   ├── useWindowSize.ts
│   │   └── index.ts
│   ├── utils/             # Utilitários
│   │   └── cn.ts
│   ├── constants/         # Constantes do projeto
│   │   └── index.ts
│   └── App.tsx            # Componente principal
├── styles/
│   ├── theme.css          # Design System CSS
│   └── fonts.css          # Imports de fontes
└── imports/               # Assets importados

DESIGN_SYSTEM.md           # Documentação do Design System
QUICK_START.md             # Guia de início rápido
README.md                  # Este arquivo
```

## 🎨 Design System

### Cores

#### Escala Neutra
- `neutral-950` (#0D0D0D) - Fundo principal
- `neutral-900` (#1A1A1A) - Cards
- `neutral-800` (#222222) - Seções alternadas
- `neutral-700` (#2E2E2E) - Bordas

#### Acentos
- `yellow-400` (#E5C000) - Acento primário
- `orange-500` (#FF5A1A) - Acento secundário

### Tipografia

- **Display**: Bebas Neue (headlines, títulos)
- **Body**: Inter (texto de corpo)

### Espaçamento

Sistema base 8pt: `4px`, `8px`, `16px`, `24px`, `32px`, `48px`, `64px`, `80px`, `120px`

## 🧩 Componentes Principais

### AnimatedButton
Botão com animação e três variantes.

```tsx
<AnimatedButton variant="primary" size="md">
  Click Me
</AnimatedButton>
```

### StatCard
Card de estatística com animação e trend indicator.

```tsx
<StatCard
  label="Active Members"
  value="2.5K+"
  trend={{ value: "+12%", isPositive: true }}
/>
```

### SectionHeader
Header de seção padronizado com palavra destacada.

```tsx
<SectionHeader
  eyebrow="Our Services"
  title="Discover Fitness Services"
  highlightWord="Services"
/>
```

### DashboardCard
Card genérico para dashboard.

```tsx
<DashboardCard title="Revenue Overview">
  <p>Content here</p>
</DashboardCard>
```

## 🪝 Hooks Customizados

### useScrollAnimation
Hook para animações baseadas em scroll.

```tsx
const { ref, isInView } = useScrollAnimation();

<motion.div
  ref={ref}
  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
>
  Content
</motion.div>
```

### useWindowSize
Hook para obter tamanho da janela e breakpoints.

```tsx
const { isMobile, isDesktop } = useWindowSize();

return isMobile ? <MobileNav /> : <DesktopNav />;
```

## 🎭 Animações

O projeto usa **Motion** (Framer Motion) para animações fluidas:

- **Entrance sequences** - Hero, Header
- **Scroll-linked reveals** - Todas as seções
- **Hover effects** - Botões, cards
- **Continuous animations** - Ticker strip

## 📱 Responsividade

O design é **mobile-first** e totalmente responsivo:

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔮 Próximos Passos

### Dashboard Expansion

1. **Routing**: Implementar React Router para navegação
2. **Charts**: Adicionar visualizações com Recharts
3. **Authentication**: Sistema de login/logout
4. **API Integration**: Conectar com backend
5. **State Management**: Context API ou Zustand
6. **Forms**: Formulários complexos com validação

### Exemplos Incluídos

- `DashboardExample.tsx` - Template de página de dashboard
- Consulte `QUICK_START.md` para guias detalhados

## 📚 Documentação

### 🎯 Documentos Principais

- **[DOCUMENTACAO_INDEX.md](./DOCUMENTACAO_INDEX.md)** - 📖 **COMECE AQUI** - Índice completo de toda a documentação
- **[DESIGN_SYSTEM_REFERENCE.md](./DESIGN_SYSTEM_REFERENCE.md)** - 🎨 **FONTE ÚNICA DE VERDADE** - Design system completo
- **[QUICK_START.md](./QUICK_START.md)** - Guia de início rápido e exemplos de uso
- **[COMPONENTS_REFERENCE.md](./COMPONENTS_REFERENCE.md)** - Referência de todos os componentes
- **[LOGIN_SYSTEM.md](./LOGIN_SYSTEM.md)** - Sistema de autenticação implementado
- **[CONTEUDO.md](./CONTEUDO.md)** - Conteúdo editorial completo

### 📋 Outros Documentos

- CHANGELOG.md - Histórico de versões
- CONTRIBUTING.md - Guia de contribuição
- PROXIMOS_PASSOS.md - Roadmap do projeto
- ATUALIZACOES.md - Log de mudanças recentes

**💡 Dica:** Sempre consulte **DESIGN_SYSTEM_REFERENCE.md** antes de criar novos componentes ou estilos!

## 🛠 Tecnologias

- **React** 18.3.1 - Library UI
- **Tailwind CSS** 4.1.12 - Styling framework
- **Motion** 12.23.24 - Animações
- **Vite** 6.3.5 - Build tool
- **TypeScript** - Type safety
- **Recharts** 2.15.2 - Data visualization
- **React Router** 7.13.0 - Routing
- **Lucide React** - Ícones

## ⚡ Performance

- Lazy loading de componentes
- Otimização de imagens com ImageWithFallback
- Animações otimizadas com Motion
- CSS purge automático do Tailwind
- Bundle splitting com Vite

## 🎯 Princípios de Design

1. **Dark-first** - Design escuro como base
2. **High-contrast** - Contraste máximo para legibilidade
3. **Kinetic** - Movimento intencional e energético
4. **Editorial-bold** - Tipografia impactante
5. **Performance-driven** - Foco em ação
6. **Minimal-chrome** - Sem ornamentação

## 📄 Licença

Projeto desenvolvido para GymX - 2026

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, entre em contato:
- Email: contato@gymx.com.br
- Phone: +55 11 98765-4321

---

**Desenvolvido com ❤️ usando React, Tailwind CSS e Motion**
