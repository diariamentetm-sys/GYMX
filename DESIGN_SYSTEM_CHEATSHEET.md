# 🎨 Design System Cheat Sheet - GymX

Quick reference para copiar e colar. **Para detalhes completos:** [DESIGN_SYSTEM_REFERENCE.md](./DESIGN_SYSTEM_REFERENCE.md)

---

## 🎨 Cores

```tsx
// Backgrounds
bg-neutral-950     // #0D0D0D - Background principal
bg-neutral-900     // #1A1A1A - Cards, containers
bg-neutral-800     // #222222 - Inputs

// Acentos
bg-yellow-400      // #E5C000 - Primário (CTAs)
bg-orange-500      // #FF5A1A - Secundário (Badges)

// Texto
text-white         // #FFFFFF - Títulos
text-neutral-050   // #F5F5F5 - Corpo
text-neutral-300   // #888888 - Secundário

// Bordas
border-neutral-700 // #2E2E2E - Padrão
border-yellow-400  // #E5C000 - Focus/Destaque
```

---

## ✍️ Tipografia

```tsx
// Headlines
font-display font-black uppercase text-6xl

// Body
font-body text-base text-neutral-050

// Labels
font-body font-semibold uppercase text-xs tracking-wider text-neutral-300
```

---

## 📏 Espaçamento

```tsx
gap-2   // 8px
gap-4   // 16px
gap-6   // 24px
gap-8   // 32px

p-4     // 16px
p-6     // 24px
p-8     // 32px

mb-6    // 24px
mb-8    // 32px
mb-12   // 48px
mb-16   // 64px
```

---

## 🔲 Border Radius

```tsx
rounded-md   // 8px - PADRÃO (botões, inputs, cards)
rounded      // 4px - Badges
rounded-none // 0px - Imagens
```

---

## 🔘 Botão Primário

```tsx
<button className="bg-yellow-400 text-yellow-900 px-8 py-4 rounded-md font-bold uppercase text-sm tracking-wide hover:bg-yellow-300 transition-all duration-300">
  Texto
</button>
```

---

## 🔘 Botão Outline

```tsx
<button className="bg-transparent border-2 border-neutral-700 text-white px-8 py-4 rounded-md font-bold uppercase text-sm hover:border-yellow-400 hover:text-yellow-400 transition-all">
  Texto
</button>
```

---

## 📝 Input

```tsx
<input className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-4 py-3.5 text-neutral-050 placeholder:text-neutral-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all" />
```

---

## 🏷️ Label

```tsx
<label className="block text-neutral-300 text-xs font-semibold uppercase tracking-wider">
  Email
</label>
```

---

## 🃏 Card

```tsx
<div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-8 hover:border-yellow-400/50 transition-all">
  Content
</div>
```

---

## 🏷️ Badge

```tsx
<div className="inline-flex items-center justify-center px-3 py-1.5 bg-yellow-400 text-yellow-900 rounded text-xs font-semibold uppercase tracking-wider">
  Badge
</div>
```

---

## 🎬 Animação Entrada

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

---

## 🎬 Animação Hover

```tsx
<motion.div
  whileHover={{ scale: 1.05, y: -5 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

---

## 📱 Breakpoints

```tsx
// Mobile-first
className="text-base md:text-lg lg:text-xl"

sm:  640px   // Smartphone landscape
md:  768px   // Tablet
lg:  1024px  // Desktop
xl:  1280px  // Desktop grande
```

---

## 📐 Grid

```tsx
// 2 colunas no tablet, 3 no desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* Items */}
</div>
```

---

## 🎯 Container

```tsx
<div className="max-w-[1440px] mx-auto px-6 lg:px-16">
  {/* Content */}
</div>
```

---

## ⚠️ Mensagem de Erro

```tsx
<p className="text-orange-500 text-sm font-medium">
  Mensagem de erro
</p>
```

---

## ⚡ Loading Spinner

```tsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full"
/>
```

---

## ➗ Divider

```tsx
<div className="w-full border-t border-neutral-800" />
```

---

## 🔗 Link

```tsx
<a className="text-neutral-300 hover:text-yellow-400 transition-colors font-medium text-sm">
  Link
</a>
```

---

## 🎨 Gradient Overlay

```tsx
<div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent" />
```

---

## 📋 Form Group

```tsx
<div className="space-y-2">
  <label className="block text-neutral-300 text-xs font-semibold uppercase tracking-wider">
    Label
  </label>
  <input className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-4 py-3.5..." />
  {error && (
    <p className="text-orange-500 text-sm font-medium">{error}</p>
  )}
</div>
```

---

## 🎭 Estados

```tsx
// Hover
hover:bg-yellow-300
hover:text-yellow-400
hover:border-yellow-400
hover:scale-105

// Focus
focus:outline-none
focus:border-yellow-400
focus:ring-1
focus:ring-yellow-400

// Disabled
disabled:opacity-50
disabled:cursor-not-allowed

// Active
active:scale-95
```

---

## 📚 Imports Comuns

```tsx
// Motion
import { motion } from "motion/react";
import { useInView } from "motion/react";

// Icons
import { Shield, Mail, Lock, Eye, ArrowLeft } from "lucide-react";

// Components
import {
  AnimatedButton,
  Badge,
  FormInput,
  LoadingSpinner,
} from "./components";

// Router
import { Link } from "react-router";
```

---

## ⚠️ Regras de Ouro

1. **Apenas UMA palavra** em amarelo nas headlines
2. **Border radius padrão:** `rounded-md` (8px)
3. **Espaçamento:** Múltiplos de 8pt
4. **Mobile-first:** Classes base = mobile
5. **Animações:** 0.3s-0.6s
6. **Contraste:** Mínimo WCAG AA
7. **Focus:** Sempre visível (ring amarelo)
8. **Sharp edges:** Imagens sem border-radius

---

## 🎯 Template Completo de Página

```tsx
export function PageName() {
  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Page content */}
        </div>
      </div>
      
      {/* Footer (opcional) */}
      
      {/* Gradient overlay (opcional) */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-yellow-400/5 to-transparent pointer-events-none" />
    </div>
  );
}
```

---

**💾 Salve este arquivo para consulta rápida!**

**📖 Documentação completa:** [DESIGN_SYSTEM_REFERENCE.md](./DESIGN_SYSTEM_REFERENCE.md)

---

**Versão:** 2.0  
**Data:** 11 de abril de 2026
