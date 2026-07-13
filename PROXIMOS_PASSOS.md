# Próximos Passos - GymX

Guia do que fazer a seguir para completar o site.

---

## 🎯 Fase 1: Conteúdo Completo (Prioridade Alta)

### Seções Faltantes do Documento Original

#### 1. Seção de Equipamentos
**Status:** Não implementada  
**Prioridade:** Alta  
**Conteúdo disponível:** Sim (no documento original)

**O que fazer:**
- [ ] Criar `EquipmentSection.tsx`
- [ ] 7 categorias de equipamentos:
  - Cardio
  - Condicionamento
  - Força
  - Pesos Livres
  - Máquinas
  - Funcional
  - Infraestrutura
- [ ] Layout em tabs ou accordion
- [ ] Ícones para cada categoria
- [ ] Fotos dos equipamentos

**Código sugerido:**
```tsx
// src/app/components/EquipmentSection.tsx
// Ver conteúdo em CONTEUDO.md seção 05
```

---

#### 2. Seção de Protocolo/Método
**Status:** Não implementada  
**Prioridade:** Alta  
**Conteúdo disponível:** Sim

**O que fazer:**
- [ ] Criar `ProtocolSection.tsx`
- [ ] 4 pilares do sistema:
  - Avaliação
  - Periodização
  - Acompanhamento
  - Revisão
- [ ] Layout em grid ou timeline
- [ ] Icons para cada pilar

---

#### 3. Seção de Coaches
**Status:** Não implementada  
**Prioridade:** Alta  
**Conteúdo disponível:** Sim

**O que fazer:**
- [ ] Criar `CoachesSection.tsx`
- [ ] 4 coaches:
  - Lucas Andrade - Força e Levantamento Olímpico
  - Fernanda Rocha - Condicionamento e Emagrecimento
  - Thiago Melo - Hipertrofia e Periodização
  - Mariana Costa - Mobilidade e Funcional
- [ ] Cards com foto + nome + especialidade + frase
- [ ] Fotos profissionais dos coaches
- [ ] Hover effect revelando mais info

**Estrutura de dados:**
```tsx
const coaches = [
  {
    name: "Lucas Andrade",
    specialty: "Força e Levantamento Olímpico",
    credentials: "CREF ativo · Especialização em Powerlifting · CrossFit L2",
    quote: "Técnica primeiro. Carga depois. Sempre.",
    experience: "9 anos",
    image: "/coaches/lucas.jpg"
  },
  // ...
]
```

---

#### 4. Seção de Localização
**Status:** Não implementada  
**Prioridade:** Média  
**Conteúdo disponível:** Sim

**O que fazer:**
- [ ] Criar `LocationSection.tsx`
- [ ] Integrar Google Maps
- [ ] Endereço completo
- [ ] Horários de funcionamento por dia
- [ ] Referências de localização
- [ ] Como chegar (transporte público)
- [ ] Link para Waze/Google Maps

**Endereço atual (fictício):**
Rua Augusta, 2690 - Cerqueira César  
São Paulo, SP — CEP 01413-000

---

## 🖼️ Fase 2: Imagens e Assets (Prioridade Alta)

### Imagens Necessárias

#### Hero
- [ ] Atleta(s) treinando - foto dramática de alta qualidade
- [ ] Resolução: 1920x1080 mínimo
- [ ] Formato: JPG otimizado
- [ ] Iluminação: dramática, alto contraste

#### About/Quem Somos
- [ ] Ambiente interno da academia
- [ ] Coach em sessão de treino
- [ ] 2 fotos editoriais de alta qualidade

#### Depoimentos
- [ ] Fotos dos 4 alunos (opcional, mas recomendado)
- [ ] Formato: quadrado (400x400px)
- [ ] Estilo: profissional, natural

#### Coaches
- [ ] 4 fotos profissionais dos coaches
- [ ] Fundo neutro ou ambiente da academia
- [ ] Formato: vertical (600x800px)
- [ ] Alta qualidade

#### Equipamentos
- [ ] Fotos de cada categoria de equipamento
- [ ] 7 fotos mínimo (uma por categoria)
- [ ] Estilo: editorial, clean

#### CTA Final
- [ ] Foto impactante de atleta
- [ ] Efeito de fumaça colorida (opcional)
- [ ] Alta resolução

### Onde buscar fotos temporárias?

**Unsplash Collections:**
- Gym/Fitness: https://unsplash.com/s/photos/gym
- Athletes: https://unsplash.com/s/photos/athlete
- Workout: https://unsplash.com/s/photos/workout

**Dica:** O componente já usa ImageWithFallback, então URLs do Unsplash funcionam perfeitamente.

---

## 📝 Fase 3: Funcionalidades Interativas (Prioridade Média)

### 1. Formulário de Agendamento de Visita
**Status:** Não implementado  
**Prioridade:** Alta

**O que fazer:**
- [ ] Criar `VisitForm.tsx`
- [ ] Campos:
  - Nome completo
  - Email
  - Telefone/WhatsApp
  - Horário preferencial
  - Mensagem (opcional)
- [ ] Validação com React Hook Form
- [ ] Integração com backend ou email
- [ ] Modal ou página dedicada

**Onde usar:**
- CTA "Agendar visita gratuita" abre o modal

---

### 2. WhatsApp Integration
**Status:** Parcial (link no footer)  
**Prioridade:** Alta

**O que fazer:**
- [ ] Botão flutuante de WhatsApp (canto inferior direito)
- [ ] Link direto: `https://wa.me/5511987654321`
- [ ] Mensagem pré-preenchida opcional
- [ ] Sempre visível (fixed position)

**Código sugerido:**
```tsx
// src/app/components/WhatsAppButton.tsx
<motion.a
  href="https://wa.me/5511987654321?text=Olá! Gostaria de agendar uma visita."
  className="fixed bottom-8 right-8 z-50 bg-green-500..."
  whileHover={{ scale: 1.1 }}
>
  <WhatsAppIcon />
</motion.a>
```

---

### 3. Blog/Artigos (Opcional)
**Status:** Não implementado  
**Prioridade:** Baixa

**Seções sugeridas:**
- Dicas de treino
- Nutrição
- Recuperação
- Histórias de sucesso

---

## 🔧 Fase 4: Integrações Técnicas (Prioridade Média)

### 1. Google Analytics
- [ ] Criar conta GA4
- [ ] Instalar gtag
- [ ] Configurar events:
  - Page views
  - CTA clicks
  - Form submissions
  - Scroll depth

### 2. Google Tag Manager
- [ ] Configurar GTM
- [ ] Tags de conversão
- [ ] Remarketing

### 3. Meta Pixel (Facebook/Instagram)
- [ ] Instalar pixel
- [ ] Events de conversão

### 4. SEO
- [ ] Meta tags em cada seção
- [ ] Open Graph tags
- [ ] Twitter Cards
- [ ] Sitemap.xml
- [ ] Robots.txt
- [ ] Schema.org markup (LocalBusiness)

**Exemplo de meta tags:**
```tsx
<Helmet>
  <title>GymX - Treinamento de Alto Padrão em São Paulo</title>
  <meta name="description" content="Academia premium em SP. Protocolo individual, coaches certificados, equipamentos de alta performance." />
  <meta property="og:title" content="GymX - Treinamento de Alto Padrão" />
  <meta property="og:image" content="/og-image.jpg" />
</Helmet>
```

---

## 📱 Fase 5: Responsividade e Mobile (Prioridade Alta)

### Testes Necessários

- [ ] iPhone SE (375px)
- [ ] iPhone 12/13 (390px)
- [ ] iPhone Pro Max (428px)
- [ ] iPad (768px)
- [ ] iPad Pro (1024px)
- [ ] Desktop (1280px+)

### Ajustes Mobile

- [ ] Menu hamburger (< 768px)
- [ ] Tipografia responsiva (clamp)
- [ ] CTAs touch-friendly (min 44px)
- [ ] Formulários mobile-optimized
- [ ] Imagens otimizadas (srcset)

---

## 🚀 Fase 6: Performance (Prioridade Média)

### Otimizações

- [ ] Lazy load de imagens
- [ ] Code splitting por rota
- [ ] Compressão de imagens (WebP)
- [ ] Minificação CSS/JS
- [ ] CDN para assets
- [ ] Service Worker (PWA)

### Métricas Alvo

- Lighthouse Score: > 90
- FCP (First Contentful Paint): < 1.8s
- LCP (Largest Contentful Paint): < 2.5s
- CLS (Cumulative Layout Shift): < 0.1
- TTI (Time to Interactive): < 3.8s

---

## 🔐 Fase 7: Dados Reais (Prioridade CRÍTICA antes do deploy)

### Substituir Dados Fictícios

**Contato:**
- [ ] Endereço real da academia
- [ ] Telefone/WhatsApp real
- [ ] Email real
- [ ] Horários reais de funcionamento

**Equipe:**
- [ ] Nomes reais dos coaches
- [ ] CREFs reais
- [ ] Fotos reais
- [ ] Especializações reais

**Planos:**
- [ ] Preços reais
- [ ] Features reais de cada plano
- [ ] Regras de fidelidade

**Depoimentos:**
- [ ] Verificar se pode usar nomes reais
- [ ] Autorização por escrito dos alunos
- [ ] Fotos reais (se usar)

**Redes Sociais:**
- [ ] Instagram handle real
- [ ] YouTube channel real
- [ ] Links funcionais

---

## 🧪 Fase 8: Testes (Prioridade Alta antes do deploy)

### Checklist de Testes

**Funcionalidade:**
- [ ] Todos os links funcionam
- [ ] CTAs levam para lugares corretos
- [ ] Formulários validam
- [ ] Smooth scroll funciona
- [ ] Animações não travam
- [ ] Accordion FAQ abre/fecha
- [ ] WhatsApp abre no app/web

**Cross-browser:**
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Safari
- [ ] Mobile Chrome

**Responsividade:**
- [ ] Mobile (< 768px)
- [ ] Tablet (768-1024px)
- [ ] Desktop (> 1024px)
- [ ] 4K (> 1920px)

**Acessibilidade:**
- [ ] Tab navigation funciona
- [ ] Screen readers (teste básico)
- [ ] Contraste de cores OK
- [ ] Textos alternativos em imagens
- [ ] Focus visível em todos elementos

---

## 📦 Fase 9: Deploy (Prioridade quando tudo estiver pronto)

### Preparação

- [ ] Ambiente de produção configurado
- [ ] Domínio registrado
- [ ] SSL/HTTPS configurado
- [ ] Backup do código

### Plataformas Sugeridas

**Opção 1: Vercel** (Recomendado)
- Deploy automático
- Preview URLs
- CDN global
- Grátis para começar

**Opção 2: Netlify**
- Similar ao Vercel
- Form handling built-in

**Opção 3: VPS próprio**
- Maior controle
- Mais complexo

### Pós-Deploy

- [ ] Verificar todos os links
- [ ] Testar formulários
- [ ] Configurar monitoramento (Sentry, etc)
- [ ] Google Search Console
- [ ] Submit sitemap

---

## 📈 Fase 10: Marketing e Growth (Pós-lançamento)

### Conteúdo

- [ ] Google My Business
- [ ] Instagram feed integrado
- [ ] Blog posts regulares
- [ ] Newsletter signup

### Conversão

- [ ] A/B testing de CTAs
- [ ] Heatmaps (Hotjar)
- [ ] Analytics review mensal
- [ ] Otimização contínua

---

## ⚡ Quick Wins (Faça Primeiro)

Estas são as mudanças de maior impacto que você pode fazer AGORA:

1. **Substituir imagens por fotos reais** - Maior impacto visual
2. **Adicionar WhatsApp button** - Conversão imediata
3. **Implementar formulário de visita** - Captura de leads
4. **Criar seção de Coaches** - Credibilidade
5. **Google Maps na seção de localização** - Facilita visita

---

## 📋 Template de Tarefa

Use este template para criar issues/tasks:

```markdown
## [COMPONENTE] Nome da Tarefa

**Prioridade:** Alta | Média | Baixa
**Estimativa:** 2h
**Dependências:** Nenhuma

### Descrição
[O que precisa ser feito]

### Critérios de Aceitação
- [ ] Feature funciona
- [ ] Responsivo
- [ ] Sem erros console
- [ ] Testado em mobile

### Arquivos afetados
- `src/app/components/NovoComponente.tsx`
- `src/app/App.tsx`

### Referências
- CONTEUDO.md seção X
- Design no Figma (se houver)
```

---

## 🎓 Recursos Úteis

**React:**
- [React Docs](https://react.dev/)
- [React Hook Form](https://react-hook-form.com/)

**Animações:**
- [Motion Docs](https://motion.dev/)

**Maps:**
- [Google Maps React](https://www.npmjs.com/package/@react-google-maps/api)

**Forms:**
- [Formspree](https://formspree.io/) - Backend para formulários
- [EmailJS](https://www.emailjs.com/) - Enviar emails do frontend

**SEO:**
- [React Helmet](https://github.com/nfl/react-helmet)

---

**Boa sorte! 🚀**

Qualquer dúvida, consulte os arquivos de documentação:
- `README.md` - Overview geral
- `DESIGN_SYSTEM.md` - Guia visual
- `QUICK_START.md` - Guia técnico
- `CONTEUDO.md` - Todo o conteúdo editorial
- `COMPONENTS_REFERENCE.md` - Referência de componentes
