---
name: google-oauth-supabase
description: >-
  Configures Google OAuth with Supabase in a strict order (provider first,
  callback URL, Google Cloud, then URL Configuration). Use when enabling Login
  with Google, fixing OAuth redirect loops, or setting Authorized redirect URIs.
---

# Login Google + Supabase — ordem obrigatória

Aqui a ordem importa MUITO. Se fizer fora dessa sequência → vai dar erro.

## 1. Ativar o Google no Supabase (ANTES DE TUDO)

Acesse: Supabase Dashboard > Authentication → Providers

Passos: Encontre o Google e clique para configurar (não precisa preencher nada ainda).

Por quê isso vem primeiro? Porque o Supabase vai te mostrar a URL de redirecionamento oficial. Essa URL é obrigatória no Google — sem ela, não funciona.

## 2. Copiar a URL de redirecionamento do Supabase

Você verá algo como: `https://SEU-PROJETO.supabase.co/auth/v1/callback`

Copie essa URL.

## 3. Criar credenciais no Google Cloud

Acesse: https://console.cloud.google.com/

Passos:

1. Criar projeto > New Project
2. Configurar tela de consentimento > Tipo: External > Nome do app + email
3. Criar OAuth Client ID > Tipo: Web Application

Agora vem a parte MAIS IMPORTANTE: Authorized redirect URIs

Cole a URL do Supabase: `https://SEU-PROJETO.supabase.co/auth/v1/callback`

Authorized JavaScript origins

Adicione: `http://localhost:5173` e também (produção): `https://seusite.com`

Salve.

Agora sim você terá: Client ID e Client Secret.

## 4. Voltar para o Supabase e configurar

Vá em: Authentication → Providers → Google

Passos: Cole o Client ID, cole o Client Secret e clique em Enable.

## 5. Configurar URL Configuration (ESSENCIAL)

Vá em: Authentication → URL Configuration

Configure:

- Site URL > URL principal do seu app. Exemplo: `http://localhost:5173`
- Redirect URLs: `http://localhost:5173/**` e também produção: `https://seusite.com/**`

Muito importante: O `/**` libera todas as rotas. Sem isso → o login até funciona, mas não volta corretamente.

## 6. Como tudo funciona

Usuário clica em login, vai pro Google, faz login, Google envia pro Supabase, Supabase valida e devolve pro seu site (URL Configuration).

---

## Valores deste projeto (GymX)

Não inverter a ordem. Não inventar callback.

| Campo | Valor atual |
|---|---|
| Callback (passo 2 e 3) | `https://brgucbuhwaxbwphkoogh.supabase.co/auth/v1/callback` |
| Origin local (passo 3) | `http://localhost:5173` |
| Site URL local (passo 5) | `http://localhost:5173` |
| Redirect URLs local (passo 5) | `http://localhost:5173/**` |
| Redirect no app | `signInWithOAuth({ provider: "google", options: { redirectTo: origin + "/login" } })` |

⚠️ O GymX usa o projeto **Projetos** (`brgucbuhwaxbwphkoogh`), que está **ACTIVE**. Não usar mais o Select Cars pausado.

Produção: só adicionar origin + `https://dominio/**` depois que existir deploy (Vercel). Até lá, não colocar URL inventada.

No app, o botão chama `signInWithGoogle()` em `memberService`. Depois do retorno, `AuthContext` lê a sessão e `LoginPage` redireciona com `getPostLoginRedirect`.
