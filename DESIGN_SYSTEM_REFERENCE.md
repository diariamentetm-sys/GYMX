# Design System - GymX

**Versão:** 2.0  
**Última atualização:** 11 de abril de 2026  
**Status:** Documento oficial de referência

---

## 📖 Índice

1. [Princípios de Design](#princípios-de-design)
2. [Cores](#cores)
3. [Tipografia](#tipografia)
4. [Espaçamento](#espaçamento)
5. [Border Radius](#border-radius)
6. [Grid e Layout](#grid-e-layout)
7. [Componentes](#componentes)
8. [Botões](#botões)
9. [Inputs e Forms](#inputs-e-forms)
10. [Cards](#cards)
11. [Animações](#animações)
12. [Estados Interativos](#estados-interativos)
13. [Ícones](#ícones)
14. [Acessibilidade](#acessibilidade)
15. [Boas Práticas](#boas-práticas)

---

## 🎯 Princípios de Design

### 1. Dark-First
O design é construído sobre uma base escura. Fundo preto dominante com acentos elétricos.

### 2. High-Contrast
Contraste máximo entre elementos para garantir legibilidade e hierarquia visual clara.

### 3. Kinetic
Movimento intencional e energético. Animações suaves que transmitem performance.

### 4. Editorial-Bold
Tipografia impactante com headlines condensadas e em caixa alta.

### 5. Performance-Driven
Foco em ação e resultados. Sem ornamentação desnecessária.

### 6. Mobile-First
Todo design começa do mobile e escala para desktop.

---

## 🎨 Cores

### Escala Neutra (Base Dark)

```css
/* Backgrounds */
neutral-950: #0D0D0D  /* Fundo de página, hero sections */
neutral-900: #1A1A1A  /* Cards, containers primários */
neutral-800: #222222  /* Seções alternadas, inputs */

/* Superfícies e Bordas */
neutral-700: #2E2E2E  /* Bordas visíveis, cards secundários */
neutral-500: #444444  /* Divisores, elementos inativos */

/* Texto */
neutral-300: #888888  /* Texto de suporte, metadados, labels */
neutral-050: #F5F5F5  /* Texto de corpo em fundos escuros */
white:       #FFFFFF  /* Títulos principais, texto de destaque */
```

**Uso:**
```tsx
// Background principal
className="bg-neutral-950"

// Cards e containers
className="bg-neutral-900"

// Inputs
className="bg-neutral-800"

// Bordas
className="border-neutral-700"

// Texto de corpo
className="text-neutral-050"

// Texto secundário
className="text-neutral-300"
```

---

### Acentos

#### Amarelo Elétrico (Primário)

```css
yellow-400: #E5C000  /* CTA principal, palavra de destaque, badges */
yellow-300: #F0D000  /* Hover states, variações de destaque */
yellow-900: #1A1200  /* Texto sobre fundo amarelo */
```

**Uso:**
```tsx
// Botão primário
className="bg-yellow-400 text-yellow-900"

// Hover state
className="hover:bg-yellow-300"

// Texto de destaque em headline
<span className="text-yellow-400">PALAVRA</span>

// Border em focus
className="focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
```

**⚠️ Regra importante:** Em headlines, **apenas UMA palavra** recebe a cor amarela. O restante permanece branco.

❌ **Errado:**
```tsx
<h1 className="text-yellow-400">TODA HEADLINE AMARELA</h1>
```

✅ **Correto:**
```tsx
<h1>
  Seu corpo é o <span className="text-yellow-400">projeto</span> mais importante
</h1>
```

---

#### Laranja Chama (Secundário)

```css
orange-500: #FF5A1A  /* Badges, preços, tags de seção, CTA secundário */
orange-700: #CC3D00  /* Estados ativos, hover em elementos laranja */
orange-050: #FFF0E8  /* Background de badges em modo claro (uso raro) */
```

**Uso:**
```tsx
// Badge/Tag
className="bg-orange-500 text-white"

// Borda de destaque
className="border-orange-500"

// Mensagens de erro
className="text-orange-500"
```

**⚠️ Regra importante:** Amarelo e laranja **NÃO** devem coexistir no mesmo componente. Escolha um.

---

### Cores Semânticas

```css
/* Ação Primária */
primary: yellow-400 (#E5C000)

/* Ação Secundária */
secondary: orange-500 (#FF5A1A)

/* Superfície */
surface: neutral-900 (#1A1A1A)

/* Background */
background: neutral-950 (#0D0D0D)

/* Texto Primário */
text-primary: white (#FFFFFF)

/* Texto Secundário */
text-secondary: neutral-050 (#F5F5F5)

/* Texto Muted */
text-muted: neutral-300 (#888888)

/* Borda Padrão */
border-default: neutral-700 (#2E2E2E)

/* Borda de Acento */
border-accent: yellow-400 (#E5C000)
```

---

### Gradientes

**Gradiente de Overlay (fotos):**
```css
bg-gradient-to-t from-neutral-950/80 to-transparent
```

**Gradiente de Rodapé:**
```css
bg-gradient-to-t from-yellow-400/5 to-transparent
```

**Gradiente em Cards:**
```css
bg-gradient-to-br from-neutral-900 to-neutral-800
```

---

### Contraste e Acessibilidade

| Par | Contraste | WCAG |
|-----|-----------|------|
| White (#FFFFFF) sobre neutral-950 (#0D0D0D) | ~21:1 | AAA |
| Yellow-400 (#E5C000) sobre neutral-950 | ~9.2:1 | AAA |
| Neutral-050 (#F5F5F5) sobre neutral-950 | ~18:1 | AAA |
| Orange-500 (#FF5A1A) sobre neutral-950 | ~4.8:1 | AA |
| Neutral-300 (#888888) sobre neutral-950 | ~4.5:1 | AA |

---

## ✍️ Tipografia

### Famílias de Fonte

```css
/* Display (Headlines) */
--font-display: 'Bebas Neue', 'Barlow Condensed', 'Anton', sans-serif;

/* Body (Texto de corpo) */
--font-body: 'Inter', 'DM Sans', 'Manrope', sans-serif;
```

**Importação:**
```css
/* src/styles/fonts.css */
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

---

### Escala Tipográfica

#### Headlines (Display)

```css
/* H1 - Hero Headlines */
font-family: var(--font-display);
font-size: 80px;           /* Desktop */
font-size: 56px;           /* Mobile */
font-weight: 900 (Black);
line-height: 0.9;
text-transform: uppercase;
letter-spacing: -0.02em;
color: #FFFFFF;
```

**Uso:**
```tsx
<h1 className="font-display text-[56px] md:text-[80px] font-black uppercase leading-[0.9] tracking-tight text-white">
  HEADLINE
</h1>
```

---

```css
/* H2 - Section Headlines */
font-family: var(--font-display);
font-size: 48px;           /* Desktop */
font-size: 40px;           /* Mobile */
font-weight: 900 (Black);
line-height: 1.0;
text-transform: uppercase;
letter-spacing: -0.01em;
color: #FFFFFF;
```

**Uso:**
```tsx
<h2 className="font-display text-5xl md:text-6xl font-black uppercase leading-tight text-white">
  Section Title
</h2>
```

---

```css
/* H3 - Subsection */
font-family: var(--font-display);
font-size: 28px;
font-weight: 700 (Bold);
line-height: 1.1;
text-transform: uppercase;
letter-spacing: 0em;
color: #FFFFFF;
```

**Uso:**
```tsx
<h3 className="font-display text-3xl font-bold uppercase text-white">
  Subsection
</h3>
```

---

```css
/* H4 - Card Titles */
font-family: var(--font-display);
font-size: 18px;
font-weight: 700 (Bold);
line-height: 1.2;
text-transform: uppercase;
letter-spacing: 0.04em;
color: #FFFFFF;
```

**Uso:**
```tsx
<h4 className="font-display text-xl font-bold uppercase tracking-wide text-white">
  Card Title
</h4>
```

---

#### Body Text

```css
/* Paragraph - Corpo de texto */
font-family: var(--font-body);
font-size: 15px;
font-weight: 400 (Regular);
line-height: 1.6;
color: #F5F5F5;
```

**Uso:**
```tsx
<p className="font-body text-base text-neutral-050 leading-relaxed">
  Corpo de texto aqui.
</p>
```

---

```css
/* Caption - Legendas e metadados */
font-family: var(--font-body);
font-size: 12px;
font-weight: 400 (Regular);
line-height: 1.5;
color: #888888;
```

**Uso:**
```tsx
<p className="text-xs text-neutral-300 leading-normal">
  Legenda ou metadata
</p>
```

---

```css
/* Label - Labels de formulário e tags */
font-family: var(--font-body);
font-size: 11px;
font-weight: 600 (Semibold);
line-height: 1.0;
text-transform: uppercase;
letter-spacing: 0.1em;
color: #888888;
```

**Uso:**
```tsx
<label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
  Email
</label>
```

---

```css
/* Stat - Números grandes */
font-family: var(--font-display);
font-size: 36px;
font-weight: 600 (Semibold);
letter-spacing: -0.01em;
color: #FFFFFF;
```

**Uso:**
```tsx
<div className="font-display text-5xl font-black text-white">
  2.5K+
</div>
```

---

### Pesos de Fonte

```css
font-weight-black:    900  /* Headlines H1, H2 */
font-weight-bold:     700  /* Headlines H3, H4, botões */
font-weight-semibold: 600  /* Labels, navegação */
font-weight-medium:   500  /* Links, CTAs */
font-weight-normal:   400  /* Corpo de texto */
```

**Uso em Tailwind:**
```tsx
font-black    /* 900 */
font-bold     /* 700 */
font-semibold /* 600 */
font-medium   /* 500 */
font-normal   /* 400 */
```

---

### Hierarquia Responsiva

```tsx
/* H1 - Hero */
className="
  text-[56px] leading-[0.95]        /* Mobile */
  md:text-[72px] md:leading-[0.95]  /* Tablet */
  lg:text-[90px] lg:leading-[0.95]  /* Desktop */
"

/* H2 - Sections */
className="
  text-5xl                           /* Mobile: 48px */
  md:text-6xl                        /* Tablet: 60px */
"

/* Body */
className="
  text-base                          /* Mobile: 16px */
  md:text-lg                         /* Tablet: 18px */
"
```

---

## 📏 Espaçamento

### Sistema Base 8pt

```css
space-1:  4px    /* 0.25rem */
space-2:  8px    /* 0.5rem */
space-3:  16px   /* 1rem */
space-4:  24px   /* 1.5rem */
space-5:  32px   /* 2rem */
space-6:  48px   /* 3rem */
space-7:  64px   /* 4rem */
space-8:  80px   /* 5rem */
space-9:  120px  /* 7.5rem */
```

### Uso por Contexto

**Gap entre elementos inline:**
```tsx
gap-2  /* 8px - Entre ícone e label */
gap-4  /* 16px - Entre botões */
gap-6  /* 24px - Entre campos de form */
```

**Padding interno:**
```tsx
p-3    /* 12px - Badges */
p-4    /* 16px - Botões, inputs */
p-6    /* 24px - Cards pequenos */
p-8    /* 32px - Cards médios */
```

**Margin entre componentes:**
```tsx
mb-4   /* 16px - Entre label e input */
mb-8   /* 32px - Entre campos */
mb-12  /* 48px - Entre seções de form */
mb-16  /* 64px - Entre seções de página */
```

**Padding de seções:**
```tsx
py-12  /* 48px - Mobile */
py-16  /* 64px - Tablet */
py-32  /* 128px - Desktop */
```

**Padding horizontal de container:**
```tsx
px-6         /* 24px - Mobile */
lg:px-16     /* 64px - Desktop */
```

---

### Grid e Containers

**Container máximo:**
```tsx
max-w-[1440px] mx-auto px-8 lg:px-16
```

**Container de conteúdo:**
```tsx
max-w-md    /* 28rem = 448px - Forms */
max-w-2xl   /* 42rem = 672px - Texto */
max-w-4xl   /* 56rem = 896px - Texto longo */
max-w-5xl   /* 64rem = 1024px - Headlines */
max-w-7xl   /* 80rem = 1280px - Geral */
```

---

## 🔲 Border Radius

```css
radius-none: 0px     /* Containers de imagem, overlays */
radius-sm:   4px     /* Badges pequenos */
radius-md:   8px     /* Botões, inputs, cards (PADRÃO) */
radius-lg:   12px    /* Cards grandes */
radius-xl:   16px    /* Modais, overlays */
radius-2xl:  24px    /* Elementos especiais */
radius-pill: 999px   /* Tags circulares, chips */
```

**Uso:**
```tsx
/* Padrão para a maioria dos elementos */
rounded-md     /* 8px */

/* Botões e inputs */
rounded-md     /* 8px */

/* Cards */
rounded-md     /* 8px */

/* Badges */
rounded        /* 4px */

/* Imagens */
rounded-none   /* 0px - Mantém sharp edges */
```

**⚠️ Princípio:** Sharp edges dominam o sistema. Arredondamento existe apenas onde há interatividade explícita.

---

## 📐 Grid e Layout

### Sistema de Grid

```css
/* 12 colunas */
grid-cols-12

/* Gutter */
gap-6  /* 24px - Padrão */
gap-8  /* 32px - Mais espaço */

/* Margins */
mx-auto max-w-[1440px] px-8 lg:px-16
```

### Breakpoints

```css
sm:  640px   /* Smartphone landscape */
md:  768px   /* Tablet portrait */
lg:  1024px  /* Tablet landscape / Desktop pequeno */
xl:  1280px  /* Desktop médio */
2xl: 1536px  /* Desktop grande */
```

**Uso mobile-first:**
```tsx
/* Mobile (default) */
className="grid grid-cols-1"

/* Tablet */
className="md:grid-cols-2"

/* Desktop */
className="lg:grid-cols-3"
```

### Layouts Comuns

**Grid de Cards:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* Cards */}
</div>
```

**Grid de Stats:**
```tsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Stats */}
</div>
```

**Split Layout (50/50):**
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
  {/* Left content */}
  {/* Right content */}
</div>
```

**Sidebar Layout:**
```tsx
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
  <div className="lg:col-span-8">{/* Main */}</div>
  <div className="lg:col-span-4">{/* Sidebar */}</div>
</div>
```

---

## 🧩 Componentes

### Badge

```tsx
<div className="
  inline-flex items-center justify-center
  px-3 py-1.5
  bg-yellow-400 text-yellow-900
  rounded
  text-xs font-semibold uppercase tracking-wider
">
  Badge
</div>
```

**Variantes:**
```tsx
/* Primary */
bg-yellow-400 text-yellow-900

/* Secondary */
bg-orange-500 text-white

/* Outline */
bg-transparent border-2 border-yellow-400 text-yellow-400
```

---

### Card

```tsx
<div className="
  bg-gradient-to-br from-neutral-900 to-neutral-800
  border border-neutral-700
  rounded-md
  p-8
  hover:border-yellow-400/50
  transition-all duration-300
">
  {/* Content */}
</div>
```

**Com hover effect:**
```tsx
<motion.div
  whileHover={{ y: -5 }}
  className="bg-neutral-900 border border-neutral-700 p-8 rounded-md"
>
  {/* Content */}
</motion.div>
```

---

### Divider

**Horizontal:**
```tsx
<div className="w-full border-t border-neutral-800" />
```

**Com texto:**
```tsx
<div className="relative my-8">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-neutral-800" />
  </div>
  <div className="relative flex justify-center">
    <span className="px-4 bg-neutral-950 text-neutral-500 text-xs uppercase tracking-wider">
      Ou
    </span>
  </div>
</div>
```

---

## 🔘 Botões

### Botão Primário

```tsx
<button className="
  bg-yellow-400 text-yellow-900
  px-8 py-4
  rounded-md
  font-bold uppercase text-sm tracking-wide
  transition-all duration-300
  hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-400/20
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Texto do Botão
</button>
```

**Com Motion:**
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="bg-yellow-400 text-yellow-900 px-8 py-4 rounded-md font-bold uppercase text-sm tracking-wide"
>
  Texto
</motion.button>
```

---

### Botão Secundário

```tsx
<button className="
  bg-orange-500 text-white
  px-8 py-4
  rounded-md
  font-bold uppercase text-sm tracking-wide
  transition-all duration-300
  hover:bg-orange-700
">
  Texto do Botão
</button>
```

---

### Botão Outline

```tsx
<button className="
  bg-transparent
  border-2 border-neutral-700 text-white
  px-8 py-4
  rounded-md
  font-bold uppercase text-sm tracking-wide
  transition-all duration-300
  hover:border-yellow-400 hover:text-yellow-400
">
  Texto do Botão
</button>
```

---

### Botão Ghost/Link

```tsx
<button className="
  bg-transparent
  text-neutral-300
  px-4 py-2
  font-medium text-sm
  transition-colors
  hover:text-yellow-400
">
  Link Button
</button>
```

---

### Tamanhos de Botão

```tsx
/* Small */
className="px-4 py-2 text-xs"

/* Medium (padrão) */
className="px-8 py-4 text-sm"

/* Large */
className="px-12 py-5 text-base"

/* Full Width */
className="w-full px-8 py-4"
```

---

### Botão com Ícone

```tsx
<button className="flex items-center justify-center gap-2 bg-yellow-400 text-yellow-900 px-8 py-4 rounded-md">
  <Shield size={18} strokeWidth={2} />
  Texto do Botão
</button>
```

---

### Estados de Botão

```tsx
/* Loading */
<button disabled className="flex items-center gap-2">
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    className="w-5 h-5 border-2 border-yellow-900 border-t-transparent rounded-full"
  />
  Carregando...
</button>

/* Disabled */
<button disabled className="opacity-50 cursor-not-allowed">
  Desabilitado
</button>

/* Active */
<button className="ring-2 ring-yellow-400">
  Ativo
</button>
```

---

## 📝 Inputs e Forms

### Input de Texto

```tsx
<div className="w-full space-y-2">
  {/* Label */}
  <label className="block text-neutral-300 text-xs font-semibold uppercase tracking-wider">
    Email
  </label>
  
  {/* Input */}
  <input
    type="email"
    className="
      w-full
      bg-neutral-900
      border border-neutral-700
      rounded-md
      px-4 py-3.5
      text-neutral-050 text-base
      placeholder:text-neutral-500
      focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400
      transition-all duration-300
      hover:border-neutral-600
    "
    placeholder="seu@email.com"
  />
</div>
```

---

### Input com Ícone

```tsx
<div className="relative">
  {/* Icon */}
  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
    <Mail size={20} strokeWidth={1.5} />
  </div>
  
  {/* Input */}
  <input
    type="email"
    className="w-full bg-neutral-900 border border-neutral-700 rounded-md pl-12 pr-4 py-3.5..."
  />
</div>
```

---

### Input de Senha

```tsx
<div className="relative">
  {/* Input */}
  <input
    type={showPassword ? "text" : "password"}
    className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-12 py-3.5..."
  />
  
  {/* Toggle Button */}
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-yellow-400"
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</div>
```

---

### Mensagem de Erro

```tsx
{error && (
  <p className="text-orange-500 text-sm font-medium mt-2">
    {error}
  </p>
)}
```

**Input com erro:**
```tsx
<input
  className={`
    ...
    ${error ? 'border-orange-500 focus:border-orange-500 focus:ring-orange-500' : ''}
  `}
/>
```

---

### Textarea

```tsx
<textarea
  className="
    w-full
    bg-neutral-900
    border border-neutral-700
    rounded-md
    px-4 py-3.5
    text-neutral-050
    placeholder:text-neutral-500
    focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400
    resize-none
  "
  rows={4}
/>
```

---

### Checkbox

```tsx
<label className="flex items-center gap-3 cursor-pointer">
  <input
    type="checkbox"
    className="
      w-5 h-5
      bg-neutral-900
      border-2 border-neutral-700
      rounded
      text-yellow-400
      focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-neutral-950
      transition-colors
    "
  />
  <span className="text-neutral-050 text-sm">Lembrar de mim</span>
</label>
```

---

## 🎬 Animações

### Princípios

1. **Duração:** 0.3s padrão, 0.6s para animações mais complexas
2. **Easing:** easeOut para entrada, easeIn para saída
3. **Sequência:** Delay incremental (0.1s, 0.2s, 0.3s...)
4. **Performance:** Sempre 60fps - usar transform e opacity

---

### Entrada de Elementos

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  {/* Content */}
</motion.div>
```

---

### Scroll Animation

```tsx
import { useInView } from "motion/react";
import { useRef } from "react";

const ref = useRef(null);
const isInView = useInView(ref, { once: true, margin: "-100px" });

<motion.div
  ref={ref}
  initial={{ opacity: 0, y: 50 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.6 }}
>
  {/* Content */}
</motion.div>
```

---

### Hover Animation

```tsx
<motion.div
  whileHover={{ scale: 1.05, y: -5 }}
  transition={{ duration: 0.3 }}
>
  {/* Content */}
</motion.div>
```

---

### Loading Spinner

```tsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{
    duration: 1,
    repeat: Infinity,
    ease: "linear"
  }}
  className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full"
/>
```

---

### Sequência de Animação

```tsx
const items = ["Item 1", "Item 2", "Item 3"];

{items.map((item, index) => (
  <motion.div
    key={item}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1, duration: 0.4 }}
  >
    {item}
  </motion.div>
))}
```

---

## 🎭 Estados Interativos

### Hover States

```tsx
/* Links */
className="text-neutral-300 hover:text-yellow-400 transition-colors"

/* Botões */
className="bg-yellow-400 hover:bg-yellow-300 transition-all"

/* Cards */
className="border-neutral-700 hover:border-yellow-400/50 transition-all"
```

---

### Focus States

```tsx
/* Inputs */
className="
  focus:outline-none
  focus:border-yellow-400
  focus:ring-1
  focus:ring-yellow-400
"

/* Botões */
className="
  focus:outline-none
  focus:ring-2
  focus:ring-yellow-400
  focus:ring-offset-2
  focus:ring-offset-neutral-950
"
```

---

### Active States

```tsx
/* Botões */
className="active:scale-95"

/* Links */
className="active:text-yellow-300"
```

---

### Disabled States

```tsx
className="
  disabled:opacity-50
  disabled:cursor-not-allowed
  disabled:hover:bg-yellow-400
"
```

---

## 🎨 Ícones

### Biblioteca: Lucide React

```bash
# Já instalado
npm install lucide-react
```

### Uso

```tsx
import { Shield, Mail, Lock, Eye, ArrowLeft } from "lucide-react";

<Shield size={20} strokeWidth={1.5} className="text-yellow-400" />
```

### Tamanhos Padrão

```tsx
size={16}  /* Pequeno - Inline com texto */
size={20}  /* Médio - Inputs, botões */
size={24}  /* Grande - Ícones de destaque */
size={32}  /* Extra grande - Hero icons */
```

### Stroke Width

```tsx
strokeWidth={1}    /* Fino */
strokeWidth={1.5}  /* Padrão */
strokeWidth={2}    /* Médio */
strokeWidth={2.5}  /* Grosso */
```

---

## ♿ Acessibilidade

### Checklist WCAG 2.1 AA

- ✅ Contraste mínimo 4.5:1 para texto normal
- ✅ Contraste mínimo 3:1 para texto grande
- ✅ Focus visível em todos os elementos interativos
- ✅ Labels em todos os inputs
- ✅ Textos alternativos em imagens
- ✅ Navegação por teclado
- ✅ Estados claros (loading, error, success)
- ✅ Mensagens de erro específicas

---

### Labels e ARIA

```tsx
/* Input com label */
<label htmlFor="email" className="...">
  Email
</label>
<input id="email" name="email" />

/* Botão com aria-label */
<button aria-label="Fechar menu">
  <X size={20} />
</button>

/* Loading state */
<button aria-busy="true" disabled>
  Carregando...
</button>

/* Error message */
<input aria-invalid="true" aria-describedby="error-msg" />
<p id="error-msg" role="alert">
  Email é obrigatório
</p>
```

---

### Navegação por Teclado

```tsx
/* Skip to main content */
<a
  href="#main"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-yellow-400"
>
  Pular para conteúdo principal
</a>

/* Trap focus em modal */
<FocusTrap active={isOpen}>
  <div role="dialog" aria-modal="true">
    {/* Modal content */}
  </div>
</FocusTrap>
```

---

## 📋 Boas Práticas

### 1. Sempre use o Design System

❌ **Não faça:**
```tsx
<div style={{ backgroundColor: "#E5C000" }}>
```

✅ **Faça:**
```tsx
<div className="bg-yellow-400">
```

---

### 2. Mobile-First

❌ **Não faça:**
```tsx
<div className="lg:text-base text-lg">
```

✅ **Faça:**
```tsx
<div className="text-base lg:text-lg">
```

---

### 3. Consistência em Espaçamentos

❌ **Não faça:**
```tsx
<div className="mb-5">  /* 20px - fora do sistema */
```

✅ **Faça:**
```tsx
<div className="mb-6">  /* 24px - dentro do sistema */
```

---

### 4. Use Componentes Reutilizáveis

❌ **Não faça:**
```tsx
<button className="bg-yellow-400 text-yellow-900 px-8 py-4 rounded-md...">
  Botão 1
</button>
<button className="bg-yellow-400 text-yellow-900 px-8 py-4 rounded-md...">
  Botão 2
</button>
```

✅ **Faça:**
```tsx
import { AnimatedButton } from "./components";

<AnimatedButton variant="primary">Botão 1</AnimatedButton>
<AnimatedButton variant="primary">Botão 2</AnimatedButton>
```

---

### 5. Hierarquia de Headlines

❌ **Não faça:**
```tsx
<h1>Título</h1>
<h3>Subtítulo</h3>  /* Pulou h2 */
```

✅ **Faça:**
```tsx
<h1>Título</h1>
<h2>Subtítulo</h2>
<h3>Subseção</h3>
```

---

### 6. Animações Performáticas

❌ **Não faça:**
```tsx
transition={{ duration: 2 }}  /* Muito lento */
```

✅ **Faça:**
```tsx
transition={{ duration: 0.3 }}  /* Rápido e responsivo */
```

---

### 7. Cores Semânticas

❌ **Não faça:**
```tsx
<p className="text-orange-500">Texto normal</p>
```

✅ **Faça:**
```tsx
<p className="text-neutral-050">Texto normal</p>
<p className="text-orange-500">Mensagem de erro</p>
```

---

## 📚 Recursos

### Ferramentas

- **Tailwind CSS v4**: https://tailwindcss.com/
- **Motion**: https://motion.dev/
- **Lucide Icons**: https://lucide.dev/
- **Contrast Checker**: https://webaim.org/resources/contrastchecker/

### Documentos Relacionados

- `README.md` - Overview geral do projeto
- `QUICK_START.md` - Guia de início rápido
- `COMPONENTS_REFERENCE.md` - Referência de componentes
- `LOGIN_SYSTEM.md` - Sistema de autenticação

---

## 🔄 Versionamento

### v2.0 (Atual)
- ✅ Sistema completo documentado
- ✅ Login implementado
- ✅ Componentes reutilizáveis
- ✅ Mobile-first
- ✅ Acessibilidade WCAG AA

### v1.0
- ✅ Landing page completa
- ✅ Design system inicial
- ✅ Componentes básicos

---

**Este documento é a fonte única de verdade para o design system do GymX.**  
**Sempre consulte antes de criar novos componentes ou estilos.**

**Última revisão:** 11 de abril de 2026  
**Responsável:** Equipe GymX
