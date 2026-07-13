# Requisitos de Tela — Cadastro de Novo Aluno
**Sistema:** Plataforma de gestão de academia (FORGEE)  
**Tela:** Cadastrar Novo Aluno  
**Tipo de documento:** Requisitos funcionais e de conteúdo para recriação no Figma Make  
**Versão:** 1.0

---

## VISÃO GERAL DA TELA

Esta é uma tela de formulário longo (long-form) para cadastro completo de um novo aluno em uma academia. O formulário é dividido em **7 seções numeradas**, cada uma com um ícone colorido e título em destaque. O preenchimento é linear, de cima para baixo. Ao final, o aluno assina digitalmente um termo de responsabilidade.

---

## ESTRUTURA GLOBAL DA TELA

### Barra de Navegação Lateral (Sidebar)
- Logo da plataforma no topo: **FORGEE** com ícone de ave/fênix
- Subtítulo abaixo do logo: *"NOSSA FORÇA"* (ou similar)
- Menu lateral com os seguintes itens:
  - Dashboard
  - Alunos
  - Check-ins
  - Modo Recepção
  - Configurações
- Rodapé da sidebar:
  - Avatar/nome do usuário logado: **Admin FORGEE** com cargo abaixo (ex: *Edição*)
  - Botão: **Sair**

### Header da Tela (Topbar)
- **Breadcrumb / título da página:**
  - Título principal: **NOVO ALUNO**
  - Subtítulo/breadcrumb: *Cadastro de Novo Aluno*
- **Botões de ação no topo direito:**
  - Ícone de configurações (engrenagem)
  - Botão secundário: **+ NOVO ALUNO** (outline)
  - Botão primário: **ATIVAR RECEPÇÃO** (fundo vermelho/laranja)

### Subheader da Página de Formulário
- Botão de voltar: **← VOLTAR**
- Título da página: **CADASTRAR NOVO ALUNO**
- Botões de ação do formulário:
  - Botão: **Imprimir** (ícone de impressora)
  - Botão primário: **SALVAR CADASTRO** (fundo vermelho)

---

## SEÇÕES DO FORMULÁRIO

---

### SEÇÃO 1 — DADOS PESSOAIS
**Ícone:** 🔴 (círculo vermelho com número 1)  
**Título:** DADOS PESSOAIS  
**Obrigatoriedade:** Todos os campos marcados com asterisco (*) são obrigatórios

#### Campos desta seção:

| Campo | Tipo | Obrigatório | Observações |
|---|---|---|---|
| Nome Completo | Input texto | Sim | Campo largo, ocupa linha inteira |
| Data de Nascimento | Input data | Sim | Formato DD/MM/AAAA |
| CPF | Input texto | Sim | Máscara: 000.000.000-00 |
| RG | Input texto | Não | Campo livre |
| Sexo | Dropdown/Select | Sim | Opções: Ativo (visível), presumivelmente: Masculino, Feminino, Outro |
| Estado Civil | Dropdown/Select | Não | Placeholder: "Selecione" |
| Profissão | Input texto | Não | Campo livre |
| Telefone (WhatsApp) | Input telefone | Sim | Máscara de telefone BR |
| E-mail | Input e-mail | Sim | Validação de formato de e-mail |
| Endereço Completo | Input texto | Sim | Placeholder: "Rua, Número, Bairro, Cidade, Estado, CEP" — campo largo |
| Contato de Emergência | Input texto | Sim | Nome completo do contato |
| Telefone do Contato de Emergência | Input telefone | Sim | Máscara: (00) 00000-0000 |

---

### SEÇÃO 2 — DADOS DE SAÚDE (ANAMNESE BÁSICA)
**Ícone:** ❤️ (coração vermelho com número 2)  
**Título:** DADOS DE SAÚDE (ANAMNESE BÁSICA)  
**Instrução implícita:** Responder SIM ou NÃO para cada pergunta

Cada pergunta é apresentada em um **card individual** com fundo escuro levemente diferenciado. As opções de resposta são botões tipo **toggle/pill seleccionável** (SIM / NÃO), exceto onde indicado.

#### Perguntas desta seção:

| # | Pergunta | Opções de Resposta |
|---|---|---|
| 1 | Possui alguma doença diagnosticada? | SIM / NÃO |
| 2 | Problemas cardíacos? | SIM / NÃO |
| 3 | Pressão alta ou baixa? | NÃO / ALTA / BAIXA |
| 4 | Possui diabetes? | SIM / NÃO |
| 5 | Desmaios ou tonturas frequentes? | SIM / NÃO |
| 6 | Problemas respiratórios? | SIM / NÃO |
| 7 | Problemas articulares? | SIM / NÃO |
| 8 | Já realizou cirurgia? | SIM / NÃO |
| 9 | Faz uso de medicação contínua? | SIM / NÃO |
| 10 | Está gestante? | SIM / NÃO / N/A |
| 11 | Possui limitação física? | SIM / NÃO |
| 12 | Possui recomendação médica para prática de exercícios? | SIM / NÃO |

> **Nota de comportamento:** A pergunta 3 (Pressão) tem três opções em vez de duas: NÃO / ALTA / BAIXA. A pergunta 10 (Gestante) tem três opções: SIM / NÃO / N/A.

---

### SEÇÃO 3 — QUESTIONÁRIO PAR-Q (PRONTIDÃO PARA ATIVIDADE FÍSICA)
**Ícone:** ⚡ (raio vermelho com número 3)  
**Título:** QUESTIONÁRIO PAR-Q (PRONTIDÃO PARA ATIVIDADE FÍSICA)  
**Instrução:** *"Responda SIM ou NÃO para cada pergunta"*

Mesmo padrão visual da seção anterior: cards individuais por pergunta com botões SIM / NÃO.

#### Perguntas desta seção:

| # | Pergunta | Opções |
|---|---|---|
| 1 | Algum médico já disse que você possui problema cardíaco? | SIM / NÃO |
| 2 | Sente dor no peito ao realizar atividade física? | SIM / NÃO |
| 3 | Sentiu dor no peito no último mês? | SIM / NÃO |
| 4 | Perde o equilíbrio por tontura ou já perdeu a consciência? | SIM / NÃO |
| 5 | Possui problema ósseo ou articular que pode piorar com exercício? | SIM / NÃO |
| 6 | Seu médico já recomendou restrição de atividade física? | SIM / NÃO |

#### Alerta condicional (comportamento importante):
> Se **qualquer** resposta do PAR-Q for **SIM**, um alerta em destaque deve aparecer abaixo das perguntas com o seguinte texto (em vermelho/laranja, fundo colorido):
>
> *"⚠️ Se assinalou 1 ou mais respostas 'SIM', recomenda-se avaliação médica antes de iniciar."*

---

### SEÇÃO 4 — OBJETIVOS DO ALUNO
**Ícone:** 🎯 (alvo vermelho com número 4)  
**Título:** OBJETIVOS DO ALUNO

#### Campo: Qual seu principal objetivo?
- **Tipo:** Seleção múltipla de botões (toggle chips/pills)
- **Opções disponíveis (em grid):**
  - Emagrecimento
  - Hipertrofia
  - Condicionamento Físico
  - Reabilitação
  - Saúde Geral
  - Outro
- **Comportamento:** O aluno pode selecionar uma ou mais opções. O botão selecionado fica destacado (fundo vermelho/laranja ou borda colorida).

#### Campo: Já treinou antes?
- **Tipo:** Dropdown / Select
- **Placeholder:** "Selecione"
- **Opções prováveis:** Nunca treinei / Treinei há mais de 1 ano / Treino regularmente

#### Campo: Há quanto tempo pratica exercícios?
- **Tipo:** Input texto livre
- **Placeholder:** *"Ex: 6 meses, 1 ano..."*

#### Campo: Quantas vezes por semana pretende treinar?
- **Tipo:** Dropdown / Select
- **Placeholder:** "Selecione"
- **Opções prováveis:** 1x / 2x / 3x / 4x / 5x ou mais

#### Campo: Preferência de horário?
- **Tipo:** Input texto livre ou Select
- **Placeholder:** *"Ex: Manhã, Tarde, Noite"*

---

### SEÇÃO 5 — INFORMAÇÕES CORPORAIS (AVALIAÇÃO INICIAL — OPCIONAL)
**Ícone:** 📊 (gráfico vermelho com número 5)  
**Título:** INFORMAÇÕES CORPORAIS (AVALIAÇÃO INICIAL — OPCIONAL)  
**Observação:** Seção marcada como opcional — pode ser preenchida depois

#### Campos em linha (grid de 4 colunas):

| Campo | Tipo | Placeholder / Exemplo |
|---|---|---|
| Peso (kg) | Input numérico | Ex: 70 |
| Altura (cm) | Input numérico | Ex: 170 |
| IMC | Input numérico (calculado automaticamente ou manual) | Ex: 24,2 |
| % Gordura | Input numérico | Ex: 18% |

> **Comportamento sugerido:** O IMC pode ser calculado automaticamente a partir do Peso e da Altura preenchidos.

#### Campo: Medidas Corporais
- **Tipo:** Input texto longo / textarea
- **Placeholder:** *"Ex: Braço 35cm, Cintura 80cm, Quadril 95cm"*
- **Observação:** Campo livre para registrar medidas antropométricas diversas

---

### SEÇÃO 6 — PLANO CONTRATADO
**Ícone:** 📋 (prancheta vermelha com número 6)  
**Título:** PLANO CONTRATADO

#### Campos desta seção:

| Campo | Tipo | Obrigatório | Observações |
|---|---|---|---|
| Tipo de Plano | Dropdown / Select | Sim | Placeholder: selecionar plano disponível |
| Valor (R$) | Input numérico / moeda | Sim | Placeholder: "R$ 0,00" |
| Data de Início | Input data | Sim | Formato DD/MM/AAAA |
| Data de Vencimento | Input data | Sim | Formato DD/MM/AAAA — pode ser calculada automaticamente |
| Forma de Pagamento | Dropdown / Select | Sim | Placeholder: "Selecione" — Opções prováveis: Dinheiro, Cartão de Crédito, Cartão de Débito, PIX, Boleto |

---

### SEÇÃO 7 — TERMO DE RESPONSABILIDADE
**Ícone:** 📄 (documento vermelho com número 7)  
**Título:** TERMO DE RESPONSABILIDADE

#### Texto do Termo (dois parágrafos):

**Parágrafo 1:**
> *"Declaro que as informações acima são verdadeiras e estou ciente de que a prática de atividades físicas envolve riscos. Comprometo-me a informar qualquer alteração em meu estado de saúde à administração da academia."*

**Parágrafo 2:**
> *"Autorizo o uso dos meus dados conforme a Lei Geral de Proteção de Dados (LGPD) para fins administrativos da academia, incluindo comunicações sobre serviços, agendamentos e informações relevantes."*

#### Campos de assinatura:

| Campo | Tipo | Obrigatório |
|---|---|---|
| Assinatura do Aluno | Campo de assinatura digital (canvas para desenhar ou upload de imagem) | Sim |
| Data | Input data, preenchida automaticamente com a data atual | Sim |

#### Botão final de envio:
- **Texto:** CADASTRAR
- **Estilo:** Botão primário, fundo vermelho, texto branco, largo (ocupa boa parte da largura)
- **Posição:** Abaixo do campo de assinatura, centralizado ou alinhado à direita

---

## COMPORTAMENTOS E REGRAS DE NEGÓCIO

### Validação de Campos Obrigatórios
- Campos marcados com `*` devem ser validados antes do envio
- Exibir mensagem de erro inline abaixo do campo quando vazio ou inválido
- O botão "SALVAR CADASTRO" só deve ser habilitado após os campos obrigatórios estarem preenchidos (ou disparar validação ao clicar)

### Alerta do PAR-Q
- Se qualquer resposta na Seção 3 (PAR-Q) for **SIM**, exibir automaticamente o alerta em vermelho/laranja abaixo das perguntas
- O alerta não bloqueia o cadastro, mas informa sobre necessidade de avaliação médica

### Cálculo de IMC
- Se Peso e Altura forem preenchidos, calcular e preencher o campo IMC automaticamente
- Fórmula: `IMC = Peso (kg) / (Altura (m))²`

### Data de Vencimento do Plano
- Ao selecionar o Tipo de Plano e preencher a Data de Início, calcular automaticamente a Data de Vencimento com base na duração do plano (ex: plano mensal = +30 dias, trimestral = +90 dias)

### Botão Imprimir
- Ao clicar em "Imprimir", gerar uma versão imprimível do formulário preenchido (ou em branco para assinatura física)

### Botão Salvar Cadastro
- Salva todas as informações no banco de dados
- Exibe confirmação de sucesso (toast ou modal)
- Redireciona para a página de perfil do aluno ou lista de alunos após salvar

---

## ESTRUTURA DE LAYOUT

### Tipo de layout
- Tela com sidebar fixa à esquerda (~220px)
- Área de conteúdo principal à direita (scroll vertical longo)
- Formulário centralizado com largura máxima (~900px)
- Fundo geral escuro (dark mode)

### Padrão visual dos cards de pergunta (Seções 2 e 3)
- Cada pergunta em um card com fundo levemente mais claro que o fundo principal
- Borda sutil (0.5px)
- Label da pergunta em texto branco, tamanho ~13–14px
- Botões de resposta (SIM / NÃO / etc.) em estilo pill/chip:
  - Estado padrão: fundo escuro, borda sutil, texto branco/cinza
  - Estado selecionado: fundo vermelho ou laranja, texto branco

### Padrão visual dos campos de input
- Fundo escuro (mais escuro que o card)
- Borda sutil visível
- Texto do placeholder em cinza médio
- Texto preenchido em branco
- Label do campo acima do input, texto pequeno (11–13px)

### Ícones de seção
- Cada seção tem um ícone numerado à esquerda do título
- Cor dominante: vermelho (`#E03131` ou similar)
- Tipografia do título: bold, uppercase, branco

---

## RESUMO DE CAMPOS POR SEÇÃO

| Seção | Qtd de Campos | Tipo Predominante |
|---|---|---|
| 1 — Dados Pessoais | 12 campos | Inputs de texto, selects |
| 2 — Anamnese Básica | 12 perguntas | Botões SIM/NÃO |
| 3 — PAR-Q | 6 perguntas + 1 alerta condicional | Botões SIM/NÃO |
| 4 — Objetivos | 5 campos | Chips de seleção, selects, inputs |
| 5 — Informações Corporais | 5 campos (opcional) | Inputs numéricos, textarea |
| 6 — Plano Contratado | 5 campos | Selects, inputs de data e valor |
| 7 — Termo de Responsabilidade | 2 campos | Texto fixo + assinatura + data |
| **Total** | **~47 campos/interações** | — |