# Guia de Contribuição - GymX

Obrigado por contribuir com o projeto GymX! Este guia ajudará você a entender como contribuir de forma efetiva.

## 📋 Índice

1. [Código de Conduta](#código-de-conduta)
2. [Como Contribuir](#como-contribuir)
3. [Padrões de Código](#padrões-de-código)
4. [Estrutura de Commits](#estrutura-de-commits)
5. [Pull Requests](#pull-requests)
6. [Reportar Bugs](#reportar-bugs)
7. [Sugerir Features](#sugerir-features)

## 🤝 Código de Conduta

- Seja respeitoso com todos os contribuidores
- Foque em feedback construtivo
- Aceite críticas com profissionalismo
- Priorize o bem do projeto

## 🚀 Como Contribuir

### 1. Fork o Repositório

```bash
git clone https://github.com/seu-usuario/gymx.git
cd gymx
```

### 2. Crie uma Branch

```bash
git checkout -b feature/nova-feature
# ou
git checkout -b fix/correcao-bug
```

### 3. Faça suas Alterações

Siga os [Padrões de Código](#padrões-de-código) descritos abaixo.

### 4. Teste suas Alterações

Certifique-se de que tudo funciona corretamente.

### 5. Commit

```bash
git add .
git commit -m "feat: adiciona nova feature X"
```

### 6. Push

```bash
git push origin feature/nova-feature
```

### 7. Abra um Pull Request

Descreva suas alterações de forma clara e concisa.

## 📝 Padrões de Código

### TypeScript

- Use TypeScript para todos os novos componentes
- Defina interfaces para todas as props
- Evite `any` - use tipos específicos

```tsx
// ✅ Bom
interface ButtonProps {
  variant: "primary" | "secondary";
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ variant, onClick, children }: ButtonProps) {
  // ...
}

// ❌ Ruim
export function Button(props: any) {
  // ...
}
```

### Componentes

- Use function components com hooks
- Exporte componentes como named exports
- Mantenha componentes pequenos e focados (< 200 linhas)

```tsx
// ✅ Bom
export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  // ...
}

// ❌ Ruim
export default function Header() {
  // 500+ linhas de código
}
```

### Styling

- Use Tailwind CSS classes
- Siga o design system estabelecido
- Use variáveis CSS do tema (`var(--yellow-400)`)

```tsx
// ✅ Bom
<button className="bg-yellow-400 text-yellow-900 px-8 py-4 rounded">
  Click
</button>

// ❌ Ruim
<button style={{ backgroundColor: "#E5C000", padding: "16px 32px" }}>
  Click
</button>
```

### Animações

- Use Motion (Framer Motion) para animações
- Mantenha animações sutis e performáticas
- Use durações consistentes (0.3s, 0.6s)

```tsx
// ✅ Bom
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>

// ❌ Ruim
<div className="animate-spin-crazy">
  Content
</div>
```

### Importações

- Agrupe imports: React, libraries, components, utils
- Use imports absolutos quando possível
- Evite imports circulares

```tsx
// ✅ Bom
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "./components";
import { cn } from "./utils/cn";

// ❌ Ruim
import { cn } from "./utils/cn";
import { useState } from "react";
import { Button } from "./components";
import { motion } from "motion/react";
```

## 📦 Estrutura de Commits

Use conventional commits:

- `feat:` - Nova feature
- `fix:` - Correção de bug
- `docs:` - Mudanças em documentação
- `style:` - Formatação, espaçamento (sem mudança de código)
- `refactor:` - Refatoração de código
- `test:` - Adição de testes
- `chore:` - Manutenção, configuração

```bash
# Exemplos
git commit -m "feat: adiciona componente de modal"
git commit -m "fix: corrige bug no scroll animation"
git commit -m "docs: atualiza README com novas instruções"
git commit -m "style: formata código com prettier"
git commit -m "refactor: otimiza StatCard component"
git commit -m "test: adiciona testes para Header"
git commit -m "chore: atualiza dependências"
```

## 🔄 Pull Requests

### Checklist

Antes de abrir um PR, certifique-se de:

- [ ] Código segue os padrões estabelecidos
- [ ] Componentes são responsivos
- [ ] Animações funcionam corretamente
- [ ] Sem erros no console
- [ ] Documentação atualizada (se necessário)
- [ ] Commits seguem conventional commits
- [ ] Branch está atualizada com main

### Template de PR

```markdown
## Descrição
Breve descrição das mudanças

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Como Testar
1. Passo 1
2. Passo 2
3. Passo 3

## Screenshots
(se aplicável)

## Checklist
- [ ] Código segue padrões do projeto
- [ ] Responsivo
- [ ] Sem erros
- [ ] Documentação atualizada
```

## 🐛 Reportar Bugs

### Template de Bug Report

```markdown
**Descrição do Bug**
Descrição clara do problema

**Passos para Reproduzir**
1. Ir para '...'
2. Clicar em '...'
3. Ver erro

**Comportamento Esperado**
O que deveria acontecer

**Screenshots**
Se aplicável

**Ambiente**
- OS: [e.g. iOS, Windows]
- Browser: [e.g. chrome, safari]
- Versão: [e.g. 22]
```

## 💡 Sugerir Features

### Template de Feature Request

```markdown
**Problema que a Feature Resolve**
Descrição clara do problema

**Solução Proposta**
Como você imagina que isso deveria funcionar

**Alternativas Consideradas**
Outras formas de resolver o problema

**Contexto Adicional**
Qualquer outra informação relevante
```

## 🎨 Design System

Ao criar novos componentes:

1. Consulte `DESIGN_SYSTEM.md` para cores, tipografia e espaçamento
2. Siga a escala de cores estabelecida
3. Use variáveis CSS do tema
4. Mantenha consistência com componentes existentes

## 📱 Responsividade

Todos os componentes devem ser responsivos:

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

Use Tailwind breakpoints:

```tsx
<div className="
  text-sm md:text-base lg:text-lg
  p-4 md:p-6 lg:p-8
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
">
  Content
</div>
```

## ⚡ Performance

- Otimize imagens
- Use lazy loading quando apropriado
- Evite re-renders desnecessários
- Use React.memo para componentes pesados
- Mantenha animações em 60fps

## 🧪 Testes

(Em desenvolvimento)

## 📚 Recursos

- [React Docs](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Motion Docs](https://motion.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/)

## ❓ Dúvidas

Se tiver dúvidas, abra uma issue com a label `question`.

---

Obrigado por contribuir! 🎉
