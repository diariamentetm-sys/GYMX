# Quick Start - GymX Fitness Dashboard

## Índice
1. [Instalação](#instalação)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Uso de Componentes](#uso-de-componentes)
4. [Animações](#animações)
5. [Expandindo para Dashboard](#expandindo-para-dashboard)

## Instalação

O projeto já está configurado com todas as dependências necessárias:

- React 18.3.1
- Tailwind CSS 4.1.12
- Motion (Framer Motion) 12.23.24
- Vite 6.3.5

## Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── Header.tsx              # Cabeçalho fixo
│   │   ├── Hero.tsx                # Hero section com animação
│   │   ├── TickerStrip.tsx         # Faixa animada de modalidades
│   │   ├── AboutSection.tsx        # Seção sobre + stats
│   │   ├── ServicesSection.tsx     # Grid de serviços
│   │   ├── PricingSection.tsx      # Planos de preços
│   │   ├── FinalCTA.tsx            # CTA final
│   │   ├── Footer.tsx              # Rodapé
│   │   ├── AnimatedButton.tsx      # Botão reutilizável
│   │   ├── Badge.tsx               # Badge/Tag
│   │   ├── StatCard.tsx            # Card de estatística
│   │   ├── SectionHeader.tsx       # Header de seção
│   │   ├── LoadingSpinner.tsx      # Loading spinner
│   │   ├── DashboardCard.tsx       # Card para dashboard
│   │   ├── PageTransition.tsx      # Transição de página
│   │   └── index.ts                # Exports centralizados
│   └── App.tsx                     # Componente principal
├── styles/
│   ├── theme.css                   # Design system CSS
│   └── fonts.css                   # Imports de fontes
└── imports/                        # Assets importados
```

## Uso de Componentes

### Importação Simples

```tsx
// Importar componentes individuais
import { AnimatedButton, Badge, StatCard } from "./components";

// Ou importar diretamente
import { AnimatedButton } from "./components/AnimatedButton";
```

### AnimatedButton

```tsx
// Variantes: primary, secondary, outline
// Tamanhos: sm, md, lg

<AnimatedButton variant="primary" size="md" onClick={() => console.log("clicked")}>
  Click Me
</AnimatedButton>

<AnimatedButton variant="secondary" size="lg" fullWidth>
  Full Width Button
</AnimatedButton>

<AnimatedButton variant="outline" size="sm">
  Outline Button
</AnimatedButton>
```

### Badge

```tsx
// Variantes: primary, secondary, outline
// Tamanhos: sm, md, lg

<Badge variant="primary" size="md">
  New
</Badge>

<Badge variant="secondary" size="sm">
  Featured
</Badge>
```

### StatCard

```tsx
<StatCard
  label="Active Members"
  value="2.5K+"
  trend={{ value: "+12%", isPositive: true }}
  delay={0.2}
/>

<StatCard
  label="Revenue"
  value="$45K"
  icon={<DollarIcon />}
  trend={{ value: "-5%", isPositive: false }}
/>
```

### SectionHeader

```tsx
// Header com eyebrow e palavra destacada
<SectionHeader
  eyebrow="Our Services"
  title="Discover Fitness Services"
  highlightWord="Services"
  description="Transform your body and mind with our expert training programs"
  align="center"
/>

// Header simples
<SectionHeader
  title="Welcome to GymX"
  align="left"
/>
```

### DashboardCard

```tsx
<DashboardCard title="Revenue Overview" hoverable={true} delay={0.2}>
  <p>Card content goes here</p>
</DashboardCard>
```

### LoadingSpinner

```tsx
// Tamanhos: sm, md, lg
// Cores: primary, secondary, white

<LoadingSpinner size="md" color="primary" />
```

## Animações

### useInView (Scroll Animations)

```tsx
import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";

function MyComponent() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        Content
      </motion.div>
    </section>
  );
}
```

### Hover Animations

```tsx
<motion.div
  whileHover={{ scale: 1.05, y: -10 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.3 }}
>
  Hover me
</motion.div>
```

### Continuous Animations (Loop)

```tsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "linear",
  }}
>
  Rotating element
</motion.div>
```

## Expandindo para Dashboard

### 1. Adicionar React Router

```bash
# React Router já está instalado
```

```tsx
// Em App.tsx no futuro
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 2. Criar Layout de Dashboard

```tsx
// components/DashboardLayout.tsx
import { Header } from "./components";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### 3. Adicionar Charts (Recharts)

```tsx
// Recharts já está instalado
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function AnalyticsChart() {
  const data = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    // ...
  ];

  return (
    <DashboardCard title="Revenue Trend">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2E2E2E" />
          <XAxis dataKey="name" stroke="#888888" />
          <YAxis stroke="#888888" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A1A1A",
              border: "1px solid #2E2E2E",
              borderRadius: "8px",
            }}
          />
          <Line type="monotone" dataKey="revenue" stroke="#E5C000" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </DashboardCard>
  );
}
```

### 4. Gerenciamento de Estado

Para dashboard complexo, considere:
- **React Context** para estado global simples
- **Zustand** para estado mais complexo (precisa instalar)
- **React Query** para cache de dados (precisa instalar)

### 5. Autenticação

```tsx
// Criar context de autenticação
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (credentials) => {
    // Implementar lógica de login
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

## Classes Tailwind Úteis

### Cores do Sistema

```tsx
// Backgrounds
bg-neutral-950  // Fundo principal (#0D0D0D)
bg-neutral-900  // Cards (#1A1A1A)
bg-neutral-800  // Seções alternadas (#222222)

// Acentos
text-yellow-400  // Amarelo primário (#E5C000)
text-orange-500  // Laranja secundário (#FF5A1A)

// Bordas
border-neutral-700  // Borda padrão (#2E2E2E)
border-orange-500   // Borda destaque (#FF5A1A)
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
// Padding de seções
py-32  // 128px (space-8 * 4)

// Gaps
gap-8   // 32px
gap-12  // 48px
gap-16  // 64px
```

## Dicas de Performance

1. **Lazy Loading**: Carregar componentes pesados sob demanda
```tsx
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
```

2. **Otimizar Imagens**: Usar ImageWithFallback com URLs otimizadas

3. **Memoização**: Usar React.memo para componentes pesados
```tsx
export const HeavyComponent = React.memo(({ data }) => {
  // ...
});
```

4. **Virtualização**: Para listas longas, considere react-window

## Recursos Adicionais

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Motion (Framer Motion) Docs](https://motion.dev/)
- [React Router Docs](https://reactrouter.com/)
- [Recharts Docs](https://recharts.org/)

## Próximos Passos Sugeridos

1. ✅ Setup inicial completo
2. ✅ Design system implementado
3. ✅ Home page com animações
4. ✅ Componentes reutilizáveis criados
5. ⏳ Adicionar páginas de dashboard
6. ⏳ Implementar navegação com React Router
7. ⏳ Adicionar charts e visualizações de dados
8. ⏳ Sistema de autenticação
9. ⏳ Formulários e validação
10. ⏳ API integration

---

**Desenvolvido com React, Tailwind CSS e Motion**
