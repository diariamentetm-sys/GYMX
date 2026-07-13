# ⚠️ LEIA PRIMEIRO - Design System GymX

## 🎨 Antes de Criar Qualquer Componente ou Estilo

### 1. Consulte o Design System Oficial

**👉 [DESIGN_SYSTEM_REFERENCE.md](./DESIGN_SYSTEM_REFERENCE.md)**

Este é o **documento oficial de referência** com TUDO sobre:
- ✅ Cores (neutral, acentos, semânticas)
- ✅ Tipografia (escalas, pesos, uso correto)
- ✅ Espaçamento (sistema base 8pt)
- ✅ Border radius
- ✅ Componentes (padrões visuais)
- ✅ Botões, Inputs, Cards
- ✅ Animações
- ✅ Estados (hover, focus, active)
- ✅ Acessibilidade
- ✅ Boas práticas

---

## 🚫 NUNCA faça:

```tsx
// ❌ Cores hardcoded
<div style={{ backgroundColor: "#E5C000" }}>

// ❌ Espaçamentos aleatórios
<div className="mb-5">  /* 20px - fora do sistema */

// ❌ Border radius inconsistente
<div className="rounded-2xl">  /* Só usamos rounded-md (8px) */

// ❌ Tipografia errada
<h1 className="font-body">  /* H1 usa font-display */

// ❌ Múltiplas palavras destacadas
<h1 className="text-yellow-400">TODA HEADLINE</h1>
```

---

## ✅ SEMPRE faça:

```tsx
// ✅ Use as classes do Tailwind
<div className="bg-yellow-400">

// ✅ Use o sistema de espaçamento
<div className="mb-6">  /* 24px - dentro do sistema */

// ✅ Use border radius padrão
<div className="rounded-md">  /* 8px - consistente */

// ✅ Use tipografia correta
<h1 className="font-display font-black uppercase">

// ✅ Apenas UMA palavra destacada
<h1>Seu corpo é o <span className="text-yellow-400">projeto</span> mais importante</h1>
```

---

## 📋 Checklist Rápido

Antes de fazer commit:

- [ ] Consultei DESIGN_SYSTEM_REFERENCE.md?
- [ ] Estou usando cores do sistema (yellow-400, neutral-950, etc)?
- [ ] Espaçamento segue base 8pt (gap-4, gap-6, gap-8)?
- [ ] Border radius é rounded-md (8px)?
- [ ] Tipografia usa font-display para headlines?
- [ ] Apenas UMA palavra em amarelo nas headlines?
- [ ] Componente é mobile-first?
- [ ] Estados de hover/focus implementados?
- [ ] Acessível (labels, contraste, keyboard)?
- [ ] Animações são suaves (0.3s-0.6s)?

---

## 🗺️ Navegação Rápida

- **Índice completo:** [DOCUMENTACAO_INDEX.md](./DOCUMENTACAO_INDEX.md)
- **Design System:** [DESIGN_SYSTEM_REFERENCE.md](./DESIGN_SYSTEM_REFERENCE.md) ⭐
- **Componentes:** [COMPONENTS_REFERENCE.md](./COMPONENTS_REFERENCE.md)
- **Início rápido:** [QUICK_START.md](./QUICK_START.md)

---

## 🎨 Cores Mais Usadas

```css
bg-neutral-950     /* Background (#0D0D0D) */
bg-neutral-900     /* Cards (#1A1A1A) */
bg-yellow-400      /* Botão primário (#E5C000) */
text-yellow-400    /* Destaque em headlines */
border-neutral-700 /* Bordas (#2E2E2E) */
text-neutral-050   /* Texto de corpo (#F5F5F5) */
```

---

## 📏 Espaçamentos Mais Usados

```css
gap-4   /* 16px - Entre botões */
gap-6   /* 24px - Entre campos de form */
gap-8   /* 32px - Entre cards */

p-4     /* 16px - Padding de inputs */
p-8     /* 32px - Padding de cards */

mb-6    /* 24px - Entre elementos */
mb-12   /* 48px - Entre seções */
```

---

## 🔘 Template de Botão

```tsx
<button className="
  bg-yellow-400 text-yellow-900
  px-8 py-4
  rounded-md
  font-bold uppercase text-sm tracking-wide
  hover:bg-yellow-300
  transition-all duration-300
">
  Texto
</button>
```

---

## 📝 Template de Input

```tsx
<input className="
  w-full
  bg-neutral-900
  border border-neutral-700
  rounded-md
  px-4 py-3.5
  text-neutral-050
  focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400
  transition-all duration-300
" />
```

---

## 🎬 Template de Animação

```tsx
import { motion } from "motion/react";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

---

**💡 Bookmark este arquivo e DESIGN_SYSTEM_REFERENCE.md!**

**🎯 Lembre-se:** Consistência visual é fundamental para um produto profissional.

---

**Versão do Design System:** 2.0  
**Última atualização:** 11 de abril de 2026
