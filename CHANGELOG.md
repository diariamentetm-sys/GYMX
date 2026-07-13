# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-04-11

### 🎉 Initial Release

Primeira versão completa do projeto GymX com design system fitness implementado.

### ✨ Adicionado

#### Design System
- Sistema de cores dark-first completo (neutral scale + acentos amarelo e laranja)
- Tipografia com Bebas Neue (display) e Inter (body)
- Escala de espaçamento base 8pt
- Variáveis CSS centralizadas em `theme.css`
- Importação de fontes Google Fonts

#### Componentes de Layout
- `Header` - Cabeçalho fixo com navegação e animação de entrada
- `Hero` - Hero section full-screen com animações sequenciais
- `TickerStrip` - Faixa animada de modalidades com scroll infinito
- `Footer` - Rodapé com 4 colunas de informações

#### Componentes de Seção
- `AboutSection` - Seção sobre com grid de 3 colunas e stats cards
- `ServicesSection` - Grid de serviços com cards animados
- `PricingSection` - Seção de planos com 3 opções e card destacado
- `FinalCTA` - Call-to-action final com imagem full-bleed

#### Componentes Reutilizáveis
- `AnimatedButton` - Botão com 3 variantes e 3 tamanhos
- `Badge` - Badge/tag com variantes de cor
- `StatCard` - Card de estatística com trend indicator
- `SectionHeader` - Header de seção padronizado
- `LoadingSpinner` - Spinner de loading animado
- `DashboardCard` - Card genérico para dashboard
- `PageTransition` - Wrapper de transição de página

#### Hooks Customizados
- `useScrollAnimation` - Hook para animações baseadas em scroll
- `useScrollTo` - Hook para scroll suave
- `useScrollDirection` - Hook para detectar direção do scroll
- `useWindowSize` - Hook para tamanho da janela e breakpoints
- `useIsMobile` - Hook para detectar dispositivo móvel
- `useOrientation` - Hook para orientação do dispositivo

#### Utilitários
- `cn()` - Função para merge de classes Tailwind
- Constantes centralizadas (cores, tipografia, espaçamento)

#### Documentação
- `README.md` - Documentação principal do projeto
- `DESIGN_SYSTEM.md` - Documentação completa do design system
- `QUICK_START.md` - Guia de início rápido
- `CONTRIBUTING.md` - Guia de contribuição
- `CHANGELOG.md` - Este arquivo

#### Exemplos
- `DashboardExample.tsx` - Template completo de página de dashboard

### 🎨 Animações Implementadas

- Entrance sequences no Hero e Header
- Scroll-linked reveals em todas as seções
- Hover effects em botões e cards
- Continuous animation no TickerStrip
- Smooth scroll global
- Scroll indicator no Hero

### 📱 Responsividade

- Design mobile-first
- Breakpoints: mobile (< 768px), tablet (768px - 1024px), desktop (> 1024px)
- Grid responsivo em todas as seções
- Navegação adaptativa

### ⚡ Performance

- Lazy loading preparado
- Otimização de imagens com ImageWithFallback
- Animações otimizadas (60fps)
- CSS purge automático
- Bundle splitting com Vite

### 🛠 Tecnologias

- React 18.3.1
- Tailwind CSS 4.1.12
- Motion (Framer Motion) 12.23.24
- Vite 6.3.5
- TypeScript
- Recharts 2.15.2
- React Router 7.13.0
- Lucide React 0.487.0

### 📦 Estrutura do Projeto

```
src/
├── app/
│   ├── components/        # Componentes React
│   ├── hooks/             # Hooks customizados
│   ├── utils/             # Utilitários
│   ├── constants/         # Constantes
│   └── App.tsx
├── styles/
│   ├── theme.css          # Design System
│   └── fonts.css          # Fontes
└── imports/               # Assets
```

## [Unreleased]

### 🔮 Planejado para Próximas Versões

#### v1.1.0 - Dashboard Expansion
- [ ] Implementar React Router
- [ ] Criar layout de dashboard
- [ ] Adicionar sidebar de navegação
- [ ] Páginas: Dashboard, Analytics, Members, Classes

#### v1.2.0 - Data Visualization
- [ ] Integrar Recharts
- [ ] Charts: Line, Bar, Pie, Area
- [ ] Widgets de dados
- [ ] Filtros de data

#### v1.3.0 - Authentication
- [ ] Sistema de login/logout
- [ ] Proteção de rotas
- [ ] Perfil de usuário
- [ ] Gerenciamento de sessão

#### v1.4.0 - Forms & Validation
- [ ] Formulários complexos
- [ ] Validação com React Hook Form
- [ ] Upload de arquivos
- [ ] Máscaras de input

#### v1.5.0 - API Integration
- [ ] Configuração de API client
- [ ] React Query para cache
- [ ] Loading states
- [ ] Error handling

#### v2.0.0 - Advanced Features
- [ ] Real-time updates
- [ ] Notifications
- [ ] Search functionality
- [ ] Dark/Light mode toggle
- [ ] Internationalization (i18n)

---

## Tipos de Mudanças

- `Adicionado` para novas funcionalidades
- `Modificado` para mudanças em funcionalidades existentes
- `Descontinuado` para funcionalidades que serão removidas
- `Removido` para funcionalidades removidas
- `Corrigido` para correções de bugs
- `Segurança` para vulnerabilidades

## Links

- [Keep a Changelog](https://keepachangelog.com/pt-BR/)
- [Semantic Versioning](https://semver.org/lang/pt-BR/)
