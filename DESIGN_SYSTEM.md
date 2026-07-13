# Design System - GymX

**📚 Versão resumida** - Para documentação completa, consulte: **[DESIGN_SYSTEM_REFERENCE.md](./DESIGN_SYSTEM_REFERENCE.md)**

---

## 🎯 Quick Reference

Este é um guia rápido do design system GymX. Para detalhes completos, exemplos de código e boas práticas, consulte o documento de referência completo.

---

## 🎨 Cores Principais

```css
/* Backgrounds */
neutral-950: #0D0D0D  /* Background principal */
neutral-900: #1A1A1A  /* Cards e containers */
neutral-800: #222222  /* Inputs */

/* Acentos */
yellow-400:  #E5C000  /* Primário - CTAs, destaques */
orange-500:  #FF5A1A  /* Secundário - Badges, erros */

/* Texto */
white:       #FFFFFF  /* Títulos */
neutral-050: #F5F5F5  /* Corpo de texto */
neutral-300: #888888  /* Texto secundário */

/* Bordas */
neutral-700: #2E2E2E  /* Bordas padrão */
```

**⚠️ Regra de ouro:** Em headlines, apenas **UMA palavra** em amarelo!

---

## ✍️ Tipografia

```css
/* Display (Headlines) */
font-display: 'Bebas Neue', sans-serif;
/* Uso: Headlines em caixa alta, peso 900 */

/* Body (Texto) */
font-body: 'Inter', sans-serif;
/* Uso: Texto de corpo, labels, navegação */
```

**Escala:**
- H1: 56-90px (mobile → desktop)
- H2: 48-60px
- Body: 15-16px
- Labels: 11-12px uppercase

---

## 📏 Espaçamento (Base 8pt)

```css
gap-2   /* 8px  - Entre ícone e texto */
gap-4   /* 16px - Entre botões */
gap-6   /* 24px - Entre campos de form */
gap-8   /* 32px - Entre cards */

p-4     /* 16px - Padding de inputs/botões */
p-6     /* 24px - Padding de cards pequenos */
p-8     /* 32px - Padding de cards médios */

py-12   /* 48px - Seções mobile */
py-32   /* 128px - Seções desktop */
```

---

## 🔲 Border Radius

```css
rounded-md   /* 8px - PADRÃO para botões, inputs, cards */
rounded      /* 4px - Badges pequenos */
rounded-none /* 0px - Imagens (sharp edges) */
```

---

## 🔘 Componentes Rápidos

### Botão Primário
```tsx
<button className="bg-yellow-400 text-yellow-900 px-8 py-4 rounded-md font-bold uppercase text-sm hover:bg-yellow-300">
  Texto
</button>
```

### Input
```tsx
<input className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-4 py-3.5 text-neutral-050 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400" />
```

### Card
```tsx
<div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-8">
  Content
</div>
```

---

## 🎬 Animações

```tsx
import { motion } from "motion/react";

/* Entrada */
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>

/* Hover */
<motion.div whileHover={{ scale: 1.05 }}>
  Content
</motion.div>
```

**Durações:**
- Rápido: 0.3s
- Normal: 0.6s
- Lento: 0.8s

---

## 📱 Breakpoints

```css
sm:  640px   /* Smartphone landscape */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Desktop grande */
```

**Mobile-first:**
```tsx
className="text-base md:text-lg lg:text-xl"
```

---

## ♿ Acessibilidade

✅ **Checklist:**
- Contraste WCAG AA mínimo
- Labels em todos os inputs
- Focus visível (ring amarelo)
- Alt text em imagens
- Navegação por teclado
- Mensagens de erro claras

---

## 📋 Componentes Disponíveis

```tsx
import {
  AnimatedButton,
  Badge,
  StatCard,
  SectionHeader,
  FormInput,
  LoadingSpinner,
  DashboardCard,
  PageTransition,
} from "./components";
```

**Documentação completa:** `COMPONENTS_REFERENCE.md`

---

## 🎯 Princípios

1. **Dark-first** - Base escura sempre
2. **High-contrast** - Contraste máximo
3. **Kinetic** - Movimento com propósito
4. **Editorial-bold** - Tipografia impactante
5. **Mobile-first** - Mobile → Desktop
6. **Performance** - 60fps sempre

---

## 🚀 Stack

- React 18.3.1
- Tailwind CSS 4.1.12
- Motion 12.23.24
- TypeScript
- React Router 7.13.0
- Lucide Icons

---

## 📚 Documentação Completa

Para informações detalhadas, exemplos de código completos e boas práticas:

👉 **[DESIGN_SYSTEM_REFERENCE.md](./DESIGN_SYSTEM_REFERENCE.md)**

Outros documentos:
- `QUICK_START.md` - Guia de início rápido
- `COMPONENTS_REFERENCE.md` - Referência de componentes
- `LOGIN_SYSTEM.md` - Sistema de autenticação
- `CONTEUDO.md` - Conteúdo editorial

---

**Este documento serve como referência rápida. Sempre consulte DESIGN_SYSTEM_REFERENCE.md para detalhes completos.**

**Versão:** 2.0  
**Data:** 11 de abril de 2026
