# Páginas - GymX

Documentação das páginas da aplicação.

---

## 📄 Páginas Disponíveis

### HomePage (`/`)
Página inicial com todas as seções da landing page.

**Seções:**
1. Header
2. Hero
3. Ticker Strip
4. About
5. Testimonials
6. Pricing
7. FAQ
8. Final CTA
9. Footer

**Acesso:**
- URL: `/`
- Pública: Sim

---

### LoginPage (`/login`)
Página de login para membros da academia.

**Features:**
- Formulário de login (email + senha)
- Validação client-side
- Mensagens de erro
- Loading states
- Links úteis (esqueci senha, conhecer planos)
- Totalmente responsivo

**Acesso:**
- URL: `/login`
- Pública: Sim
- Link no header: "Sou Membro"

**Campos:**
- Email (obrigatório, validado)
- Senha (obrigatória, min 6 chars)

**Validações:**
```tsx
// Email
- Não pode estar vazio
- Deve ter formato válido (regex)

// Senha
- Não pode estar vazia
- Mínimo 6 caracteres
```

**Estados:**
- Default: Formulário vazio
- Validating: Durante submit
- Error: Campos com erro
- Loading: Autenticando
- Success: Redirecionamento (futuro)

---

## 🛣️ Navegação

```
Home (/)
  ├─ Header
  │   └─ "Sou Membro" → /login
  ├─ Hero
  │   └─ "Agendar visita" → (futuro)
  └─ Footer
      └─ Links

Login (/login)
  ├─ Header
  │   └─ Logo → /
  ├─ Form
  │   ├─ Submit → (auth API)
  │   └─ "Esqueci senha" → (futuro)
  └─ Links
      ├─ "Conhecer planos" → /#planos
      └─ "Voltar" → /
```

---

## 🔮 Páginas Futuras

### RecoverPasswordPage (`/recuperar-senha`)
```tsx
// src/app/pages/RecoverPasswordPage.tsx
export function RecoverPasswordPage() {
  // Form para email
  // Envio de link de recuperação
  // Feedback de email enviado
}
```

### ResetPasswordPage (`/resetar-senha/:token`)
```tsx
// src/app/pages/ResetPasswordPage.tsx
export function ResetPasswordPage() {
  // Validação do token
  // Form para nova senha
  // Confirmação de senha
  // Redirect para login
}
```

### DashboardPage (`/dashboard`)
```tsx
// src/app/pages/DashboardPage.tsx
export function DashboardPage() {
  // Protected route
  // Visão geral do membro
  // Próximos treinos
  // Histórico
  // Métricas
}
```

### ProfilePage (`/perfil`)
```tsx
// src/app/pages/ProfilePage.tsx
export function ProfilePage() {
  // Dados pessoais
  // Foto
  // Editar informações
  // Trocar senha
}
```

### WorkoutsPage (`/treinos`)
```tsx
// src/app/pages/WorkoutsPage.tsx
export function WorkoutsPage() {
  // Lista de treinos
  // Calendário
  // Filtros
  // Detalhes do treino
}
```

---

## 📋 Checklist de Nova Página

Ao criar uma nova página, seguir:

- [ ] Criar arquivo em `src/app/pages/NomePage.tsx`
- [ ] Usar estrutura base:
  ```tsx
  export function NomePage() {
    return (
      <div className="min-h-screen bg-neutral-950">
        {/* Content */}
      </div>
    );
  }
  ```
- [ ] Adicionar ao router em `App.tsx`
- [ ] Exportar em `pages/index.ts`
- [ ] Documentar neste README
- [ ] Adicionar meta tags (futuro)
- [ ] Testar responsividade
- [ ] Verificar acessibilidade

---

## 🎨 Padrões de Design

### Layout Base
```tsx
<div className="min-h-screen bg-neutral-950">
  {/* Header (opcional) */}
  
  {/* Main Content */}
  <div className="flex-1 flex items-center justify-center px-6 py-12">
    <div className="w-full max-w-md">
      {/* Conteúdo */}
    </div>
  </div>
  
  {/* Footer (opcional) */}
  {/* Gradient overlay (opcional) */}
</div>
```

### Animações de Entrada
```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
  {/* Content */}
</motion.div>
```

### Formulários
```tsx
<form onSubmit={handleSubmit} className="space-y-6">
  <FormInput
    label="Campo"
    type="text"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    error={errors.field}
  />
  
  <button
    type="submit"
    className="w-full bg-yellow-400 text-yellow-900 py-4 rounded-md..."
  >
    Enviar
  </button>
</form>
```

---

## 🔒 Protected Routes

Para páginas que requerem autenticação:

```tsx
// components/PrivateRoute.tsx
export function PrivateRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuth(); // Custom hook
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
}

// App.tsx
<Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <DashboardPage />
    </PrivateRoute>
  }
/>
```

---

## 📱 Responsividade

Todas as páginas seguem mobile-first:

```tsx
// Mobile (default)
className="px-6 py-12"

// Tablet (md: 768px+)
className="md:px-12 md:py-16"

// Desktop (lg: 1024px+)
className="lg:px-16 lg:py-20"
```

---

## ♿ Acessibilidade

Checklist por página:

- [ ] Heading hierarchy (h1 → h2 → h3)
- [ ] Labels em todos os inputs
- [ ] Alt text em imagens
- [ ] Focus visible em elementos interativos
- [ ] Contraste de cores (WCAG AA)
- [ ] Keyboard navigation
- [ ] ARIA labels quando necessário
- [ ] Loading states claros
- [ ] Error messages específicas

---

**Última atualização:** 11/04/2026
