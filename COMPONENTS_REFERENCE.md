# Referência Rápida de Componentes - GymX

Guia rápido de todos os componentes disponíveis no projeto.

## 📦 Componentes de Layout

### Header
Cabeçalho fixo com navegação.

```tsx
import { Header } from "./components";
<Header />
```

**Features:**
- Navegação responsiva
- Animação de entrada
- Botão CTA
- Backdrop blur

---

### Footer
Rodapé com 4 colunas.

```tsx
import { Footer } from "./components";
<Footer />
```

**Colunas:**
- Quick Links
- Services
- Contact Info
- Social Media

---

## 🎯 Componentes de Seção

### Hero
Hero section full-screen.

```tsx
import { Hero } from "./components";
<Hero />
```

**Features:**
- Animação sequencial
- Imagem de fundo
- Scroll indicator
- Headline com palavra destacada

---

### TickerStrip
Faixa animada infinita.

```tsx
import { TickerStrip } from "./components";
<TickerStrip />
```

**Features:**
- Scroll infinito
- Duas linhas (direções opostas)
- Totalmente customizável

---

### AboutSection
Seção sobre com stats.

```tsx
import { AboutSection } from "./components";
<AboutSection />
```

**Layout:**
- Grid 3 colunas (lg)
- Texto + Imagem + Stats
- Scroll animations

---

### ServicesSection
Grid de serviços.

```tsx
import { ServicesSection } from "./components";
<ServicesSection />
```

**Features:**
- Grid responsivo
- Cards com hover effect
- Imagens full-bleed

---

### PricingSection
Seção de planos.

```tsx
import { PricingSection } from "./components";
<PricingSection />
```

**Features:**
- 3 planos
- Card destacado
- Lista de features
- Botões de ação

---

### FinalCTA
Call-to-action final.

```tsx
import { FinalCTA } from "./components";
<FinalCTA />
```

**Features:**
- Imagem full-bleed
- Headline impactante
- Botão destacado
- Overlay colorido

---

## 🧩 Componentes Reutilizáveis

### AnimatedButton

```tsx
import { AnimatedButton } from "./components";

// Variantes: primary | secondary | outline
// Tamanhos: sm | md | lg

<AnimatedButton 
  variant="primary" 
  size="md"
  onClick={() => {}}
>
  Click Me
</AnimatedButton>
```

**Props:**
- `variant`: "primary" | "secondary" | "outline"
- `size`: "sm" | "md" | "lg"
- `onClick`: () => void
- `className`: string
- `fullWidth`: boolean

**Estilos:**
- Primary: bg-yellow-400
- Secondary: bg-orange-500
- Outline: border-2 border-neutral-700

---

### Badge

```tsx
import { Badge } from "./components";

<Badge variant="primary" size="md">
  New
</Badge>
```

**Props:**
- `variant`: "primary" | "secondary" | "outline"
- `size`: "sm" | "md" | "lg"
- `children`: ReactNode

**Uso Comum:**
- Labels de status
- Tags de categoria
- Indicadores

---

### StatCard

```tsx
import { StatCard } from "./components";

<StatCard
  label="Active Members"
  value="2.5K+"
  trend={{ value: "+12%", isPositive: true }}
  delay={0.2}
/>
```

**Props:**
- `label`: string (texto do label)
- `value`: string | number (valor principal)
- `icon`: ReactNode (ícone opcional)
- `trend`: { value: string, isPositive: boolean }
- `delay`: number (delay da animação)

**Features:**
- Animação de entrada
- Hover effect
- Trend indicator (+ ou -)
- Gradient background

---

### SectionHeader

```tsx
import { SectionHeader } from "./components";

<SectionHeader
  eyebrow="Our Services"
  title="Discover Fitness Services"
  highlightWord="Services"
  description="Transform your body"
  align="center"
/>
```

**Props:**
- `eyebrow`: string (label pequeno acima)
- `title`: string (título principal)
- `highlightWord`: string (palavra a destacar)
- `description`: string (texto de suporte)
- `align`: "left" | "center"

**Features:**
- Palavra destacada automática
- Scroll animation
- Responsivo

---

### LoadingSpinner

```tsx
import { LoadingSpinner } from "./components";

<LoadingSpinner size="md" color="primary" />
```

**Props:**
- `size`: "sm" | "md" | "lg"
- `color`: "primary" | "secondary" | "white"

**Tamanhos:**
- sm: 24px
- md: 48px
- lg: 64px

---

### DashboardCard

```tsx
import { DashboardCard } from "./components";

<DashboardCard title="Revenue" hoverable={true}>
  <p>Content here</p>
</DashboardCard>
```

**Props:**
- `title`: string (título opcional)
- `children`: ReactNode (conteúdo)
- `className`: string (classes extras)
- `hoverable`: boolean (hover effect)
- `delay`: number (delay animação)

**Features:**
- Gradient background
- Border hover
- Animação de entrada

---

### PageTransition

```tsx
import { PageTransition } from "./components";

<PageTransition>
  <YourPageContent />
</PageTransition>
```

**Uso:**
Wrapper para transições de página com React Router.

---

## 🪝 Hooks

### useScrollAnimation

```tsx
import { useScrollAnimation } from "./hooks";

const { ref, isInView } = useScrollAnimation();

<motion.div
  ref={ref}
  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
>
  Content
</motion.div>
```

**Retorna:**
- `ref`: RefObject
- `isInView`: boolean

---

### useScrollTo

```tsx
import { useScrollTo } from "./hooks";

const scrollTo = useScrollTo();

<button onClick={() => scrollTo("#about")}>
  Go to About
</button>
```

---

### useScrollDirection

```tsx
import { useScrollDirection } from "./hooks";

const direction = useScrollDirection();

<Header className={direction === "down" ? "hidden" : "visible"} />
```

**Retorna:** "up" | "down" | null

---

### useWindowSize

```tsx
import { useWindowSize } from "./hooks";

const { width, height, isMobile, isTablet, isDesktop } = useWindowSize();

return isMobile ? <MobileNav /> : <DesktopNav />;
```

**Retorna:**
- `width`: number
- `height`: number
- `isMobile`: boolean (< 768px)
- `isTablet`: boolean (768px - 1024px)
- `isDesktop`: boolean (>= 1024px)

---

### useIsMobile

```tsx
import { useIsMobile } from "./hooks";

const isMobile = useIsMobile();
```

Atalho para `useWindowSize().isMobile`

---

### useOrientation

```tsx
import { useOrientation } from "./hooks";

const orientation = useOrientation();
// "portrait" | "landscape"
```

---

## 🛠 Utilitários

### cn()

```tsx
import { cn } from "./utils/cn";

const className = cn(
  "px-4 py-2",
  isActive && "bg-yellow-400",
  {
    "text-white": isPrimary,
    "text-neutral-300": !isPrimary,
  }
);
```

Combina classes Tailwind sem conflitos.

---

## 🎨 Classes Tailwind Comuns

### Cores

```tsx
// Backgrounds
bg-neutral-950  // #0D0D0D (página)
bg-neutral-900  // #1A1A1A (cards)
bg-neutral-800  // #222222 (seções)

// Acentos
bg-yellow-400   // #E5C000 (primário)
bg-orange-500   // #FF5A1A (secundário)

// Texto
text-white
text-neutral-050  // #F5F5F5
text-neutral-300  // #888888
text-yellow-400
text-orange-500

// Bordas
border-neutral-700  // #2E2E2E
border-yellow-400
border-orange-500
```

### Tipografia

```tsx
// Display (Headlines)
font-display text-6xl font-black uppercase

// Body
font-body text-base font-normal

// Labels
font-body text-xs font-semibold uppercase tracking-widest
```

### Espaçamento

```tsx
// Padding
p-4   // 16px
p-6   // 24px
p-8   // 32px

// Gap
gap-4   // 16px
gap-8   // 32px
gap-12  // 48px

// Margin
m-4   // 16px
mb-8  // 32px
mt-12 // 48px
```

### Grid

```tsx
// Responsivo
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

---

## 📱 Breakpoints

```tsx
// Mobile First
className="
  text-sm        // mobile
  md:text-base   // tablet (>= 768px)
  lg:text-lg     // desktop (>= 1024px)
"
```

**Breakpoints:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## 🎭 Animações Motion

### Básico

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

### Hover

```tsx
<motion.div
  whileHover={{ scale: 1.05, y: -10 }}
  whileTap={{ scale: 0.95 }}
>
  Hoverable
</motion.div>
```

### Scroll

```tsx
const { ref, isInView } = useScrollAnimation();

<motion.div
  ref={ref}
  initial={{ opacity: 0, y: 50 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
>
  Content
</motion.div>
```

### Loop

```tsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "linear",
  }}
>
  Spinning
</motion.div>
```

---

## 📚 Imports Comuns

```tsx
// Componentes
import {
  Header,
  Footer,
  Hero,
  AnimatedButton,
  Badge,
  StatCard,
  SectionHeader,
  LoadingSpinner,
  DashboardCard,
} from "./components";

// Hooks
import {
  useScrollAnimation,
  useWindowSize,
  useIsMobile,
} from "./hooks";

// Utils
import { cn } from "./utils/cn";

// Motion
import { motion } from "motion/react";
```

---

**Última atualização: 2026-04-11**
