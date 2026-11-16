import { ANIMATION, COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../constants";
import {
  INTERNAL_IDEACAO_PATH,
  INTERNAL_IMMERSAO_PATH,
  INTERNAL_MELHORIA_PATH,
} from "../constants/internal";

export type RequirementStatus = "implementado" | "parcial" | "planejado" | "legado";

export const REQUIREMENT_STATUS_LABEL: Record<RequirementStatus, string> = {
  implementado: "Implementado",
  parcial: "Parcial",
  planejado: "Planejado",
  legado: "Legado academia",
};

export interface ProductSection {
  id: string;
  label: string;
}

export interface DocPhase {
  id: "imersao" | "ideacao" | "melhoria";
  path: string;
  label: string;
  kicker: string;
  title: string;
  highlight: string;
  summary: string;
  nav: ProductSection[];
}

export interface PersonaJob {
  job: string;
  outcome: string;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  age: string;
  quote: string;
  bio: string;
  goals: string[];
  pains: string[];
  jobs: PersonaJob[];
}

export interface Requirement {
  id: string;
  title: string;
  rule: string;
  status: RequirementStatus;
}

export interface RequirementGroup {
  id: string;
  title: string;
  items: Requirement[];
}

export function resolvePhaseDocumentId(phase: DocPhase, hash: string): string {
  const clean = hash.replace(/^#/, "");
  if (phase.nav.some((item) => item.id === clean)) return clean;
  return phase.nav[0]?.id ?? "";
}

export const DOC_PHASES: DocPhase[] = [
  {
    id: "imersao",
    path: INTERNAL_IMMERSAO_PATH,
    label: "Imersão · definição",
    kicker: "Fase 1",
    title: "Imersão e definição",
    highlight: "definição",
    summary:
      "Antes de desenhar a solução: o que o produto é, para quem existe e qual trabalho cada pessoa precisa concluir.",
    nav: [
      { id: "conceito", label: "Conceito" },
      { id: "personas", label: "Personas" },
      { id: "jtbd", label: "Jobs to be done" },
    ],
  },
  {
    id: "ideacao",
    path: INTERNAL_IDEACAO_PATH,
    label: "Ideação · desenvolvimento",
    kicker: "Fase 2",
    title: "Ideação e desenvolvimento",
    highlight: "desenvolvimento",
    summary:
      "A solução em construção: o que o sistema faz (incluindo persistir e isolar dados), a qualidade exigida, a stack e o design system.",
    nav: [
      { id: "funcionais", label: "Requisitos funcionais" },
      { id: "nao-funcionais", label: "Não funcionais" },
      { id: "tecnologias", label: "Tecnologias" },
      { id: "design-system", label: "Design system" },
    ],
  },
  {
    id: "melhoria",
    path: INTERNAL_MELHORIA_PATH,
    label: "Melhoria contínua",
    kicker: "Fase 3",
    title: "Melhoria contínua",
    highlight: "contínua",
    summary:
      "O que ainda evolui, o que ficou de legado de academia e a próxima fatia operacional depois do marketplace.",
    nav: [
      { id: "evolucao", label: "Em evolução" },
      { id: "backlog", label: "Backlog" },
      { id: "legado", label: "Legado" },
      { id: "proxima-fatia", label: "Próxima fatia" },
    ],
  },
];

export const REQUIREMENT_CRITERION = {
  functional:
    "Requisito funcional descreve o que o sistema faz — inclusive persistir, amarrar e isolar dados. Schema, RLS e RPC de contrato são comportamento, não 'qualidade'.",
  nonFunctional:
    "Requisito não funcional descreve qualidade e restrição de operação: desempenho, acessibilidade, disponibilidade, sigilo da chave, consistência visual. Banco e regras de dado ficam nos funcionais.",
};

export const NEXT_SLICE = [
  {
    title: "Contratos",
    detail: "Painel GYMX de assinaturas aluno ↔ personal, status de pagamento e cancelamento.",
  },
  {
    title: "Personais",
    detail: "Gestão da vitrine: personais listados, slugs, CREF e suporte a quem publica página.",
  },
  {
    title: "Take-rate",
    detail: "Persistir o percentual GYMX no contrato, liquidar o split e exibir o valor na operação.",
  },
];

export const PRODUCT_CONCEPT = {
  name: "Personal GYMX",
  oneLiner: "A plataforma do personal trainer: o aluno encontra o profissional, contrata o serviço e treina com a ficha e o vídeo prescritos por ele.",
  whatItIs: [
    "Marketplace de personais, não uma academia com catraca.",
    "O personal publica uma página com URL própria e aparece na lista da landing quando quiser ser encontrado.",
    "O aluno contrata aquele personal na plataforma. A mensalidade é cobrada do aluno; um percentual fica com a GYMX e o restante vai para o profissional.",
    "O painel do personal é o lugar de cadastrar alunos, prescrever treino e colar a URL da videoaula (YouTube, Vimeo ou Loom).",
    "O portal do aluno mostra só o que o personal dele prescreveu — sem catálogo genérico da marca.",
  ],
  whatItIsNot: [
    "Não é SaaS vendido ao personal como produto isolado de captação (o contrato amarra aluno ↔ personal).",
    "Não existe convite secreto: a descoberta é lista pública + URL compartilhada.",
    "Não substitui CREF, avaliação presencial nem responsabilidade profissional.",
    "O dashboard de operador GYMX (esta área) não é o painel do personal.",
  ],
  revenue: "Um ledger: o aluno paga a mensalidade do personal contratado. O take-rate GYMX ainda não está persistido no contrato — a regra de negócio está definida em produto, o split financeiro entra na próxima fatia operacional.",
  surfaces: [
    { name: "Landing pública", path: "/", detail: "Catálogo #personais, proposta de valor, FAQ e planos." },
    { name: "Página do personal", path: "/p/:slug", detail: "URL compartilhável, preço mensal e CTA de contratar." },
    { name: "Portal do aluno", path: "/portal", detail: "Onboarding, PAR-Q, Meu Treino, plano, check-in e perfil." },
    { name: "Painel do personal", path: "/dashboard", detail: "Alunos contratados, fichas, vídeos, página pública." },
    { name: "Operação GYMX", path: "/interno", detail: "Controle interno da plataforma. Sem link na landing." },
  ],
};

export const PERSONAS: Persona[] = [
  {
    id: "aluno",
    name: "Camila Alves",
    role: "Aluna",
    age: "29 anos",
    quote: "Quero treinar com alguém de verdade, não com um PDF genérico.",
    bio: "Trabalha em escritório, treina 4× por semana na academia do bairro. Já pagou personal presencial e perdeu a ficha no WhatsApp. Busca um profissional na landing, abre a página e contrata pelo app.",
    goals: [
      "Encontrar um personal alinhado ao objetivo (hipertrofia, emagrecimento, volta ao esporte).",
      "Ver a ficha do dia com vídeo do movimento, no celular.",
      "Saber quanto paga, para quem, e o status do contrato.",
    ],
    pains: [
      "Planilha, print e áudio no WhatsApp.",
      "Trocar de personal e recomeçar do zero.",
      "Não saber se está apta a treinar sem uma triagem de saúde.",
    ],
    jobs: [
      {
        job: "Quando quero um personal, preciso vê-lo na lista ou num link e contratar sem pedir convite.",
        outcome: "Contrato amarrado a um profissional, com preço visível.",
      },
      {
        job: "Quando chego na academia, preciso abrir o treino prescrito e o vídeo daquele exercício.",
        outcome: "Meu Treino mostra séries, descanso e a URL que o personal colou.",
      },
      {
        job: "Quando mudo de ideia ou de profissional, preciso entender o plano vigente.",
        outcome: "Meu Plano mostra o personal contratado, não um catálogo de academia.",
      },
    ],
  },
  {
    id: "personal",
    name: "Rafael Moura",
    role: "Personal trainer",
    age: "34 anos · CREF",
    quote: "Meu método é o produto. A plataforma só precisa não atrapalhar.",
    bio: "Atende ~18 alunos em academias diferentes. Já usa YouTube e Loom para explicar o movimento. Quer captação (página pública) e operação (ficha por aluno) no mesmo lugar.",
    goals: [
      "Ser encontrado por URL e na lista da landing.",
      "Prescrever por aluno, com a própria videoaula.",
      "Ver só os alunos que contrataram o serviço dele.",
    ],
    pains: [
      "Aluno some no WhatsApp e a ficha fica desatualizada.",
      "Vídeo genérico de catálogo que não é o método dele.",
      "Ferramenta de academia que trata o personal como funcionário da unidade.",
    ],
    jobs: [
      {
        job: "Quando um aluno novo chega, preciso cadastrar, revisar PAR-Q e soltar a primeira ficha.",
        outcome: "Painel com alunos contratados, onboarding e prescrição.",
      },
      {
        job: "Quando monto o exercício, preciso colar o link do meu vídeo e reutilizar na biblioteca.",
        outcome: "URL YouTube/Vimeo/Loom na ficha e no portal do aluno.",
      },
      {
        job: "Quando divulgo o trabalho, preciso de uma página com preço e especialidades.",
        outcome: "Página pública /p/:slug, listada ou não, editável em Configurações.",
      },
    ],
  },
  {
    id: "operador",
    name: "Helena Costa",
    role: "Operação GYMX",
    age: "38 anos",
    quote: "Preciso do mapa do produto no mesmo lugar em que o time opera a plataforma.",
    bio: "Faz parte do time Personal GYMX. Não treina aluno. Precisa de uma área fechada para requisitos, personas, stack e design system — base do dashboard operador (contratos, take-rate, personais listados).",
    goals: [
      "Consultar a fonte da verdade do produto sem abrir o repositório.",
      "Separar o que está no ar do que é legado de academia ou roadmap.",
      "Entrar sem aparecer na navegação pública.",
    ],
    pains: [
      "Documentação espalhada em markdown do repo.",
      "Confundir painel do personal com administração da plataforma.",
      "Regras antigas de unidade (catraca, planos Livre/Plus/Elite) misturadas com o marketplace.",
    ],
    jobs: [
      {
        job: "Quando onboardei alguém do time, preciso mostrar conceito, personas e requisitos num só lugar.",
        outcome: "Esta área interna, autenticada só para operadores.",
      },
      {
        job: "Quando priorizo backlog, preciso ver o que já está implementado versus planejado.",
        outcome: "Requisitos com status explícito.",
      },
    ],
  },
  {
    id: "responsavel",
    name: "Marcos Silva",
    role: "Responsável legal",
    age: "47 anos",
    quote: "Meu filho pode treinar, mas eu preciso ter aceitado os termos.",
    bio: "Pai de aluno menor de 18 anos. Não usa o portal no dia a dia, mas o cadastro bloqueia a conta sem nome, CPF, e-mail e aceite do responsável.",
    goals: [
      "Autorizar o menor com rastreio de consentimento.",
      "Não misturar a conta dele com a do filho.",
    ],
    pains: [
      "Cadastro de academia que ignora responsável.",
      "Termos genéricos sem registro.",
    ],
    jobs: [
      {
        job: "Quando o menor cria conta, preciso informar meus dados e aceitar os termos no lugar dele.",
        outcome: "Fluxo de responsável no cadastro, obrigatório se menor de 18.",
      },
    ],
  },
];

export const FUNCTIONAL_GROUPS: RequirementGroup[] = [
  {
    id: "dados",
    title: "Dados e persistência",
    items: [
      {
        id: "RF-29",
        title: "Persistência no schema gym_academy",
        rule: "Todos os dados do Personal GYMX ficam no schema gym_academy, no projeto Supabase Projetos. O cliente usa db.schema gym_academy. Frontend só VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.",
        status: "implementado",
      },
      {
        id: "RF-30",
        title: "Cadastro GYMX isolado no Auth compartilhado",
        rule: "No Auth de Projetos, só o cadastro com metadata GYMX (app=gymx, conta de personal ou CPF) cria ficha em gym_academy. O trigger do Brechó permanece separado.",
        status: "implementado",
      },
      {
        id: "RF-31",
        title: "Isolamento de dados por papel",
        rule: "Toda tabela com RLS, policy por operação e grant mínimo. Contrato e operações críticas passam por RPC (ex.: contract_personal_service). O personal só lê aluno com personal_id = auth.uid().",
        status: "implementado",
      },
    ],
  },
  {
    id: "descoberta",
    title: "Descoberta e página pública",
    items: [
      {
        id: "RF-01",
        title: "Lista pública de personais",
        rule: "A landing exibe personais com perfil listado. Visitante vê nome, headline, preço e atalho para a página do profissional.",
        status: "implementado",
      },
      {
        id: "RF-02",
        title: "URL do profissional",
        rule: "Cada personal tem slug único (3–60, a-z0-9-) em /p/:slug, compartilhável fora da landing.",
        status: "implementado",
      },
      {
        id: "RF-03",
        title: "Edição da página pública",
        rule: "O personal edita headline, bio, foto, CREF, especialidades, preço mensal e se a página fica listada.",
        status: "implementado",
      },
      {
        id: "RF-04",
        title: "Leitura anônima segura",
        rule: "Anon lê só perfis públicos listados. staff_profiles.role não vaza para o catálogo.",
        status: "implementado",
      },
    ],
  },
  {
    id: "contrato",
    title: "Contrato aluno ↔ personal",
    items: [
      {
        id: "RF-05",
        title: "Contratação amarrada a um personal",
        rule: "O aluno contrata um personal. member_subscriptions.personal_id grava o vínculo. Não há fluxo de convite.",
        status: "implementado",
      },
      {
        id: "RF-06",
        title: "CTA cadastro com slug",
        rule: "Visitante em /p/:slug segue para /cadastro?personal=:slug. O slug persiste até o contrato.",
        status: "implementado",
      },
      {
        id: "RF-07",
        title: "RPC de contrato",
        rule: "contract_personal_service(p_staff_id) cria/amarra a assinatura. Um contrato aberto por aluno.",
        status: "implementado",
      },
      {
        id: "RF-08",
        title: "Meu Plano mostra o personal",
        rule: "No portal, o aluno vê o profissional contratado — não o catálogo antigo da academia.",
        status: "implementado",
      },
      {
        id: "RF-09",
        title: "Take-rate GYMX",
        rule: "Percentual da mensalidade para a empresa e restante para o personal. Copy de produto existe; split ainda não é persistido nem liquidado.",
        status: "parcial",
      },
      {
        id: "RF-10",
        title: "Gateway de pagamento",
        rule: "PIX automático, cartão recorrente, boleto, inadimplência e NF. Definido em regras antigas de academia; não está no marketplace atual.",
        status: "planejado",
      },
    ],
  },
  {
    id: "auth",
    title: "Contas e autenticação",
    items: [
      {
        id: "RF-11",
        title: "Login e-mail e senha",
        rule: "Aluno e personal entram com e-mail e senha no Auth GYMX. Login Google foi removido do produto.",
        status: "implementado",
      },
      {
        id: "RF-12",
        title: "Cadastro de aluno",
        rule: "Nome, CPF válido, nascimento, e-mail, telefone, senha. Menor de 18 exige responsável legal.",
        status: "implementado",
      },
      {
        id: "RF-13",
        title: "Verificação de e-mail",
        rule: "Conta de aluno confirma código de 6 dígitos antes do onboarding.",
        status: "implementado",
      },
      {
        id: "RF-14",
        title: "Recuperação de senha",
        rule: "Fluxo /recuperar-senha e /redefinir-senha via e-mail do Auth.",
        status: "implementado",
      },
      {
        id: "RF-15",
        title: "Termos e LGPD",
        rule: "Aceite de termos no onboarding; reaceitação bloqueia o portal quando a versão muda.",
        status: "implementado",
      },
    ],
  },
  {
    id: "aluno-portal",
    title: "Portal do aluno",
    items: [
      {
        id: "RF-16",
        title: "Onboarding + PAR-Q",
        rule: "Antes de treino e check-in, o aluno completa anamnese. Status: apto, apto com restrição ou encaminhar avaliação.",
        status: "implementado",
      },
      {
        id: "RF-17",
        title: "Meu Treino",
        rule: "Ficha ativa com exercícios, séries, cargas, descanso e player da URL prescrita pelo personal.",
        status: "implementado",
      },
      {
        id: "RF-18",
        title: "Registro de sessão",
        rule: "Aluno marca execução, cargas e histórico visível para ele e para o personal.",
        status: "implementado",
      },
      {
        id: "RF-19",
        title: "Check-in no app",
        rule: "Check-in digital no portal. Catraca, biometria e geofence de unidade são legado de academia, não o modelo atual.",
        status: "parcial",
      },
      {
        id: "RF-20",
        title: "Aulas coletivas",
        rule: "Módulo de reserva/waitlist existe no código (herança de unidade). Não é o núcleo do marketplace de personal.",
        status: "legado",
      },
      {
        id: "RF-21",
        title: "Perfil do aluno",
        rule: "Edição de telefone, foto, objetivos e emergência. CPF/nome/nascimento exigem revalidação.",
        status: "parcial",
      },
    ],
  },
  {
    id: "painel-personal",
    title: "Painel do personal",
    items: [
      {
        id: "RF-22",
        title: "Lista de alunos contratados",
        rule: "O personal só vê membros com personal_id = auth.uid(). RLS impede vazar aluno de outro profissional.",
        status: "implementado",
      },
      {
        id: "RF-23",
        title: "Cadastro e edição de aluno",
        rule: "Personal cria/edita ficha do aluno no painel (além do self-serve da landing).",
        status: "implementado",
      },
      {
        id: "RF-24",
        title: "Prescrição por aluno",
        rule: "Monta programa e exercícios. Biblioteca própria. URL de vídeo por exercício.",
        status: "implementado",
      },
      {
        id: "RF-25",
        title: "Revisão de PAR-Q",
        rule: "Personal revisa anamnese e registra decisão profissional.",
        status: "implementado",
      },
      {
        id: "RF-26",
        title: "Modo demonstração aluno",
        rule: "Conta dual staff+demo permite o personal abrir o portal como aluno para validar a experiência.",
        status: "implementado",
      },
    ],
  },
  {
    id: "operacao",
    title: "Operação da plataforma",
    items: [
      {
        id: "RF-27",
        title: "Área interna autenticada",
        rule: "Rota /interno autenticada. Enquanto não há conta de operador GYMX, o personal entra com a mesma conta do painel. Sem link na landing.",
        status: "implementado",
      },
      {
        id: "RF-28",
        title: "Dashboard operador (contratos, take-rate, personais)",
        rule: "Gestão GYMX de personais listados, contratos, split financeiro e suporte. Fora desta fatia.",
        status: "planejado",
      },
    ],
  },
];

export const NON_FUNCTIONAL: Requirement[] = [
  {
    id: "RNF-01",
    title: "Mobile-first",
    rule: "UI começa no mobile (~375px) e escala para tablet, desktop e tela grande. Painéis com drawer no mobile.",
    status: "implementado",
  },
  {
    id: "RNF-02",
    title: "Acessibilidade",
    rule: "Contraste no dark-first, labels em forms, focus visível yellow-400, navegação por teclado nos fluxos principais.",
    status: "parcial",
  },
  {
    id: "RNF-03",
    title: "Performance percebida",
    rule: "Vite + React. Animações 0,3–0,6s. Bundle ainda é um chunk grande; lazy loading de rotas pesadas é melhoria.",
    status: "parcial",
  },
  {
    id: "RNF-04",
    title: "LGPD",
    rule: "Consentimento de termos com versão, responsável legal para menor, mínimo de dados no cadastro. IP/dispositivo no aceite ainda não auditados de ponta a ponta.",
    status: "parcial",
  },
  {
    id: "RNF-05",
    title: "Disponibilidade",
    rule: "Front na Vercel; dados no Supabase. Build de produção precisa passar (vite build) antes do deploy.",
    status: "implementado",
  },
  {
    id: "RNF-06",
    title: "Segredo e anon key",
    rule: "Nunca service_role no frontend. Sem hardcode de tokens. Variáveis só em .env / painel Vercel.",
    status: "implementado",
  },
  {
    id: "RNF-07",
    title: "Consistência visual",
    rule: "Design system GymX é a fonte da verdade: tokens, uma palavra em amarelo nas headlines, rounded-md, base 8pt.",
    status: "implementado",
  },
];

export function flattenFunctional(): Requirement[] {
  return FUNCTIONAL_GROUPS.flatMap((group) => group.items);
}

export function requirementsByStatus(
  status: RequirementStatus,
  source: "functional" | "nonFunctional" | "all" = "all",
): Requirement[] {
  const functional = flattenFunctional().filter((item) => item.status === status);
  const nonFunctional = NON_FUNCTIONAL.filter((item) => item.status === status);
  if (source === "functional") return functional;
  if (source === "nonFunctional") return nonFunctional;
  return [...functional, ...nonFunctional];
}

export const TECH_STACK = {
  frontend: [
    { name: "React 18", detail: "Functional components e hooks. Sem classes." },
    { name: "TypeScript", detail: "Tipos de domínio em src/app/types." },
    { name: "Vite 6", detail: "Dev server e build. Alias @ → src." },
    { name: "React Router 7", detail: "Rotas públicas, portal, dashboard e /interno." },
    { name: "Tailwind CSS 4", detail: "Utilitários + tokens do tema GymX." },
    { name: "Motion", detail: "Animações de entrada e microinteração." },
    { name: "Lucide", detail: "Ícones lineares do produto." },
  ],
  backend: [
    { name: "Supabase Postgres", detail: "Schema gym_academy. Fonte da verdade dos dados." },
    { name: "Supabase Auth", detail: "E-mail/senha, recovery, sessão persistida no cliente." },
    { name: "RLS + policies", detail: "Isolamento aluno / personal / anon / operador." },
    { name: "RPC (Postgres)", detail: "Contrato, bootstrap de staff, demo, verificação." },
    { name: "Storage", detail: "Assets de perfil quando houver upload." },
  ],
  ops: [
    { name: "Vercel", detail: "Hosting do SPA. Env: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY." },
    { name: "GitHub", detail: "Histórico e PR antes de main." },
    { name: "Cursor + MCP", detail: "Migrations e inspect do schema gym_academy no projeto Projetos." },
  ],
  outOfScope: [
    "API Node própria — a lógica crítica vive em SQL/RPC.",
    "OAuth Google — removido da interface e do AuthContext.",
    "Service role no browser.",
  ],
};

export const DESIGN_SYSTEM_LAYER_PARAM = "camada";

export interface DesignSystemItem {
  title: string;
  detail: string;
}

export interface DesignSystemElement {
  id: string;
  label: string;
  group: "envelope" | "design" | "component" | "development" | "content" | "docs";
  nestedIn?: string;
  kicker: string;
  title: string;
  highlight: string;
  summary: string;
  items: DesignSystemItem[];
}

export interface LibraryComponent {
  name: string;
  file: string;
  surfaces: string[];
  detail: string;
}

export interface LibraryGroup {
  id: string;
  title: string;
  detail: string;
  items: LibraryComponent[];
}

export const COMPONENT_LIBRARY: LibraryGroup[] = [
  {
    id: "landing",
    title: "Landing e vitrine",
    detail:
      "Peças da home e da página pública do personal. Header e Footer também vestem /p/:slug.",
    items: [
      {
        name: "Header",
        file: "components/Header.tsx",
        surfaces: ["Landing", "/p/:slug"],
        detail: "Barra fixa com BrandMark, âncoras da home e links Entrar / Começar.",
      },
      {
        name: "BrandMark",
        file: "components/BrandMark.tsx",
        surfaces: ["Landing", "Auth", "Painel", "Portal", "Interno"],
        detail: "Personal em yellow-400, GYMX em branco. Inline no header; stacked nas sidebars.",
      },
      {
        name: "Hero",
        file: "components/Hero.tsx",
        surfaces: ["Landing"],
        detail: "Tela cheia, foto, kicker e headline. CTAs para a vitrine e para o cadastro.",
      },
      {
        name: "ImageWithFallback",
        file: "components/figma/ImageWithFallback.tsx",
        surfaces: ["Landing"],
        detail: "Img com fallback. Hero, About e FinalCTA usam para a foto de fundo.",
      },
      {
        name: "TickerStrip",
        file: "components/TickerStrip.tsx",
        surfaces: ["Landing"],
        detail: "Faixa orange-500 com palavras do produto em loop: fichas, videoaulas, PAR-Q.",
      },
      {
        name: "AboutSection",
        file: "components/AboutSection.tsx",
        surfaces: ["Landing"],
        detail: "Como a plataforma funciona, com foto e três pontos de método.",
      },
      {
        name: "TestimonialsSection",
        file: "components/TestimonialsSection.tsx",
        surfaces: ["Landing"],
        detail: "Depoimentos em cards dark. Prova social da landing.",
      },
      {
        name: "PersonalsSection",
        file: "components/PersonalsSection.tsx",
        surfaces: ["Landing"],
        detail: "Vitrine pública. Cada card leva a /p/:slug com preço e CTA Contratar.",
      },
      {
        name: "FAQSection",
        file: "components/FAQSection.tsx",
        surfaces: ["Landing"],
        detail: "Accordion. Uma pergunta aberta por vez, resposta em Inter.",
      },
      {
        name: "FinalCTA",
        file: "components/FinalCTA.tsx",
        surfaces: ["Landing"],
        detail: "Bloco final da home com foto, headline e cadastro.",
      },
      {
        name: "ContactFormSection",
        file: "components/ContactFormSection.tsx",
        surfaces: ["Landing"],
        detail: "Formulário de contato da landing. Campos no padrão FormInput.",
      },
      {
        name: "Footer",
        file: "components/Footer.tsx",
        surfaces: ["Landing", "/p/:slug"],
        detail: "Colunas de links, marca e CTAs de acesso. Fecha a página pública.",
      },
    ],
  },
  {
    id: "forms",
    title: "Auth e formulários",
    detail:
      "Campos e blocos reusados em login, cadastro, recuperação, ficha de aluno e configurações.",
    items: [
      {
        name: "FormInput",
        file: "components/FormInput.tsx",
        surfaces: ["Auth", "Painel", "Interno"],
        detail: "Label 11px uppercase. Fundo neutral-900, borda 700, focus yellow-400.",
      },
      {
        name: "FormSelect",
        file: "components/FormSelect.tsx",
        surfaces: ["Painel"],
        detail: "Select nativo com a mesma pele do input. Usado na ficha de aluno.",
      },
      {
        name: "ToggleButtons",
        file: "components/ToggleButtons.tsx",
        surfaces: ["Painel"],
        detail: "Pergunta com opções exclusivas. A selecionada preenche yellow-400.",
      },
      {
        name: "MultiSelectChips",
        file: "components/MultiSelectChips.tsx",
        surfaces: ["Painel"],
        detail: "Chips de múltipla escolha. Objetivos e restrições na ficha.",
      },
      {
        name: "FormSectionHeader",
        file: "components/FormSectionHeader.tsx",
        surfaces: ["Painel"],
        detail: "Número no círculo amarelo, ícone e título Bebas. Divide a ficha longa.",
      },
      {
        name: "SignaturePad",
        file: "components/SignaturePad.tsx",
        surfaces: ["Painel"],
        detail: "Canvas para assinar o termo na ficha. Traço yellow-400, botão de apagar.",
      },
    ],
  },
  {
    id: "staff",
    title: "Painel do personal",
    detail: "Chrome e blocos do /dashboard: métrica, aluno, treino e perfil público.",
    items: [
      {
        name: "Sidebar",
        file: "components/dashboard/Sidebar.tsx",
        surfaces: ["Painel"],
        detail: "Navegação do personal: Dashboard, Alunos, Check-ins, Treinos, Configurações.",
      },
      {
        name: "MetricCard",
        file: "components/dashboard/MetricCard.tsx",
        surfaces: ["Painel"],
        detail: "Card de KPI com ícone, valor em Bebas e tendência.",
      },
      {
        name: "MemberGrowthChart",
        file: "components/dashboard/MemberGrowthChart.tsx",
        surfaces: ["Painel"],
        detail: "Gráfico de evolução de alunos na home do painel.",
      },
      {
        name: "RecentMembersList",
        file: "components/dashboard/RecentMembersList.tsx",
        surfaces: ["Painel"],
        detail: "Lista dos últimos alunos cadastrados, com status e atalho.",
      },
      {
        name: "TouristAlert",
        file: "components/dashboard/TouristAlert.tsx",
        surfaces: ["Painel"],
        detail: "Alerta orange-500 de alunos sem check-in recente.",
      },
      {
        name: "PublicProfileSettings",
        file: "components/dashboard/PublicProfileSettings.tsx",
        surfaces: ["Painel"],
        detail: "Formulário do perfil público: slug, bio, preço, foto e listagem na vitrine.",
      },
      {
        name: "ParQReviewModal",
        file: "components/dashboard/ParQReviewModal.tsx",
        surfaces: ["Painel"],
        detail: "Modal para o personal ler e registrar o PAR-Q do aluno.",
      },
      {
        name: "TrainerVideoUrlFields",
        file: "components/dashboard/TrainerVideoUrlFields.tsx",
        surfaces: ["Painel"],
        detail: "Campo de URL + biblioteca do personal. Preview com ExerciseVideoPlayer.",
      },
      {
        name: "InfoCard",
        file: "components/InfoCard.tsx",
        surfaces: ["Painel"],
        detail: "Par label/valor com ícone. Dados de contato na ficha do aluno.",
      },
    ],
  },
  {
    id: "member",
    title: "Portal do aluno",
    detail: "Layout, treino, aulas, plano e onboarding de quem contrata um personal.",
    items: [
      {
        name: "MemberLayout",
        file: "components/member/MemberLayout.tsx",
        surfaces: ["Portal"],
        detail: "Shell do /portal: sidebar, header mobile e área de conteúdo.",
      },
      {
        name: "MemberSidebar",
        file: "components/member/MemberSidebar.tsx",
        surfaces: ["Portal"],
        detail: "Início, Treino, Check-in, Aulas, Plano e Perfil. BrandMark stacked.",
      },
      {
        name: "DemoModeBanner",
        file: "components/member/DemoModeBanner.tsx",
        surfaces: ["Portal"],
        detail: "Faixa yellow-400 quando o personal entra na visão do aluno.",
      },
      {
        name: "PlanCard",
        file: "components/member/PlanCard.tsx",
        surfaces: ["Portal"],
        detail: "Card de mensalidade com benefícios, preço e CTA. Destaque com borda yellow-400.",
      },
      {
        name: "PaymentModal",
        file: "components/member/PlanCard.tsx",
        surfaces: ["Portal"],
        detail: "Modal de confirmação de pagamento / contratação do plano.",
      },
      {
        name: "TrainerCard",
        file: "components/member/TrainerCard.tsx",
        surfaces: ["Portal"],
        detail: "Professor responsável pela ficha: foto, CREF e contato.",
      },
      {
        name: "WorkoutProgramCard",
        file: "components/member/WorkoutProgramCard.tsx",
        surfaces: ["Portal"],
        detail: "Card da ficha ativa: modalidade, divisão, validade e prescrição.",
      },
      {
        name: "WorkoutEmptyState",
        file: "components/member/WorkoutEmptyState.tsx",
        surfaces: ["Portal"],
        detail: "Estado vazio de Meu Treino, com pedido de avaliação.",
      },
      {
        name: "WorkoutHistoryPanel",
        file: "components/member/WorkoutHistoryPanel.tsx",
        surfaces: ["Portal"],
        detail: "Histórico de sessões concluídas no portal.",
      },
      {
        name: "GuidedWorkoutPlayer",
        file: "components/member/GuidedWorkoutPlayer.tsx",
        surfaces: ["Portal"],
        detail: "Modo guiado: série, descanso e avanço exercício a exercício.",
      },
      {
        name: "ExerciseVideoPlayer",
        file: "components/member/ExerciseVideoPlayer.tsx",
        surfaces: ["Portal", "Painel"],
        detail: "Player da URL do personal (YouTube, Vimeo, Loom ou arquivo direto).",
      },
      {
        name: "ClassFiltersBar",
        file: "components/member/ClassFiltersBar.tsx",
        surfaces: ["Portal"],
        detail: "Filtros de aula: modalidade, professor e período do dia.",
      },
      {
        name: "ClassSessionCard",
        file: "components/member/ClassSessionCard.tsx",
        surfaces: ["Portal"],
        detail: "Card da sessão: horário, vagas, status e ações de reserva.",
      },
      {
        name: "ClassReservationCard",
        file: "components/member/ClassReservationCard.tsx",
        surfaces: ["Portal"],
        detail: "Reserva já feita, com cancelar ou check-in.",
      },
      {
        name: "ClassHistoryPanel",
        file: "components/member/ClassHistoryPanel.tsx",
        surfaces: ["Portal"],
        detail: "Histórico de aulas frequentadas e no-shows.",
      },
      {
        name: "ClassLimitsBanner",
        file: "components/member/ClassLimitsBanner.tsx",
        surfaces: ["Portal"],
        detail: "Limite do plano, bloqueio por no-show ou status da assinatura.",
      },
      {
        name: "TermsConsentForm",
        file: "components/member/TermsConsentForm.tsx",
        surfaces: ["Portal"],
        detail: "Aceite de termos no onboarding e no reaceite.",
      },
      {
        name: "ParQForm",
        file: "components/member/ParQForm.tsx",
        surfaces: ["Portal"],
        detail: "Questionário PAR-Q do aluno, no onboarding e no perfil.",
      },
    ],
  },
  {
    id: "internal",
    title: "Interno e rotas",
    detail: "Documentação /interno e os guards que isolam staff, aluno e operador.",
    items: [
      {
        name: "InternalLayout",
        file: "components/internal/InternalLayout.tsx",
        surfaces: ["Interno"],
        detail: "Shell da documentação: sidebar com escudo, BrandMark e item Documentação.",
      },
      {
        name: "DocsPhaseTabs",
        file: "components/internal/DocsPhaseTabs.tsx",
        surfaces: ["Interno"],
        detail: "Tab underline das fases + tags terciárias dos documentos.",
      },
      {
        name: "DesignSystemDocument",
        file: "components/internal/DesignSystemDocument.tsx",
        surfaces: ["Interno"],
        detail: "Documento do DS: mapa Terem, camadas isoladas e espécimes.",
      },
      {
        name: "AppErrorBoundary",
        file: "components/AppErrorBoundary.tsx",
        surfaces: ["App"],
        detail: "Boundary global. Se a árvore quebra, mostra fallback em vez de tela branca.",
      },
      {
        name: "AuthFlowRedirect",
        file: "components/auth/AuthFlowRedirect.tsx",
        surfaces: ["Auth"],
        detail: "Depois do login, manda staff ao painel, aluno ao portal e operador ao interno.",
      },
      {
        name: "RequireStaff",
        file: "components/auth/RequireStaff.tsx",
        surfaces: ["Painel"],
        detail: "Protege /dashboard. Sem staff, redireciona.",
      },
      {
        name: "RequireMemberAccess",
        file: "components/auth/RequireMemberAccess.tsx",
        surfaces: ["Portal"],
        detail: "Protege /portal. Exige aluno autenticado (ou demo do personal).",
      },
      {
        name: "RequireOperator",
        file: "components/auth/RequireOperator.tsx",
        surfaces: ["Interno"],
        detail: "Protege /interno. Staff ou operador com acesso à documentação.",
      },
    ],
  },
];

export const UNUSED_LIBRARY_COMPONENTS: LibraryComponent[] = [
  {
    name: "AnimatedButton",
    file: "components/AnimatedButton.tsx",
    surfaces: ["examples/"],
    detail: "CTA animado. Só o DashboardExample importa — nenhuma página do portal.",
  },
  {
    name: "Badge",
    file: "components/Badge.tsx",
    surfaces: ["examples/"],
    detail: "Selo uppercase. Só no exemplo, não nas rotas.",
  },
  {
    name: "StatCard",
    file: "components/StatCard.tsx",
    surfaces: ["examples/"],
    detail: "Card de estatística. Substituído por MetricCard no painel real.",
  },
  {
    name: "SectionHeader",
    file: "components/SectionHeader.tsx",
    surfaces: ["examples/"],
    detail: "Título de seção com eyebrow. Landing usa o padrão inline, não este componente.",
  },
  {
    name: "DashboardCard",
    file: "components/DashboardCard.tsx",
    surfaces: ["examples/"],
    detail: "Container de card do exemplo. O painel usa MetricCard e listas próprias.",
  },
  {
    name: "PricingSection",
    file: "components/PricingSection.tsx",
    surfaces: [],
    detail: "Seção de preços da landing antiga. A home atual não importa.",
  },
  {
    name: "ServicesSection",
    file: "components/ServicesSection.tsx",
    surfaces: [],
    detail: "Seção de serviços da landing antiga. Fora da home.",
  },
  {
    name: "AdminHeader",
    file: "components/dashboard/AdminHeader.tsx",
    surfaces: [],
    detail: "Título de página do painel. As rotas atuais não usam.",
  },
  {
    name: "PageTransition",
    file: "components/PageTransition.tsx",
    surfaces: [],
    detail: "Wrapper Motion de página. App.tsx não envolve as rotas com ele.",
  },
  {
    name: "WorkoutExecutionForm",
    file: "components/member/WorkoutExecutionForm.tsx",
    surfaces: [],
    detail: "Formulário de execução de treino. Nenhuma página importa ainda.",
  },
  {
    name: "LoadingSpinner",
    file: "components/LoadingSpinner.tsx",
    surfaces: ["Interno"],
    detail: "Spinner yellow-400. Hoje só o documento do DS monta; páginas usam loading inline.",
  },
  {
    name: "RequireAuth",
    file: "components/auth/RequireAuth.tsx",
    surfaces: [],
    detail: "Gate genérico de sessão. Nenhuma rota importa — o App usa RequireStaff, RequireMemberAccess e RequireOperator.",
  },
];

export const DESIGN_SYSTEM = {
  name: "GymX Design System",
  version: "2.0",
  model:
    "O design system não é só paleta e tipo. É o envelope Interface Design System: processo de design, linguagem visual, sistema de componentes, processo de desenvolvimento, estratégia de conteúdo e sistema de documentação — o mesmo recorte do modelo de elementos de um DS.",
  principles: [
    { title: "Dark-first", detail: "Base preta, acentos elétricos, zero skin clara no produto." },
    { title: "High-contrast", detail: "Hierarquia por contraste, não por ornamentação." },
    { title: "Kinetic", detail: "Movimento curto e energético (0,3–0,6s)." },
    { title: "Editorial-bold", detail: "Headlines Bebas Neue, caixa alta, uma palavra em amarelo." },
    { title: "Performance-driven", detail: "UI de ação. Sem glassmorphism gratuito." },
    { title: "Mobile-first", detail: "Começa em 375px e sobe." },
  ],
  colors: [
    { token: "neutral-950", hex: COLORS.neutral[950], use: "Fundo da página" },
    { token: "neutral-900", hex: COLORS.neutral[900], use: "Cards e sidebar" },
    { token: "neutral-800", hex: COLORS.neutral[800], use: "Inputs e seções" },
    { token: "neutral-700", hex: COLORS.neutral[700], use: "Bordas" },
    { token: "neutral-300", hex: COLORS.neutral[300], use: "Texto secundário" },
    { token: "neutral-050", hex: COLORS.neutral[50], use: "Corpo de texto" },
    { token: "yellow-400", hex: COLORS.yellow[400], use: "CTA e destaque" },
    { token: "yellow-900", hex: COLORS.yellow[900], use: "Texto sobre amarelo" },
    { token: "orange-500", hex: COLORS.orange[500], use: "Badge, alerta, preço" },
  ],
  type: {
    display: TYPOGRAPHY.fontFamily.display,
    body: TYPOGRAPHY.fontFamily.body,
    rules: [
      "H1/H2: font-display, black, uppercase.",
      "Corpo e navegação: Inter (font-body).",
      "Labels: 11–12px, uppercase, tracking amplo.",
      "Só uma palavra em text-yellow-400 na headline.",
    ],
    levels: [
      {
        token: "H1",
        family: "display" as const,
        size: TYPOGRAPHY.fontSize.h1,
        weight: TYPOGRAPHY.fontWeight.black,
        lineHeight: String(TYPOGRAPHY.lineHeight.h1),
        letterSpacing: TYPOGRAPHY.letterSpacing.h1,
        sample: "GYMX",
        use: "Hero e título de página",
      },
      {
        token: "H2",
        family: "display" as const,
        size: TYPOGRAPHY.fontSize.h2,
        weight: TYPOGRAPHY.fontWeight.black,
        lineHeight: String(TYPOGRAPHY.lineHeight.h2),
        letterSpacing: TYPOGRAPHY.letterSpacing.h2,
        sample: "Personais",
        use: "Título de seção",
      },
      {
        token: "H3",
        family: "display" as const,
        size: TYPOGRAPHY.fontSize.h3,
        weight: TYPOGRAPHY.fontWeight.bold,
        lineHeight: String(TYPOGRAPHY.lineHeight.h3),
        letterSpacing: TYPOGRAPHY.letterSpacing.h3,
        sample: "Tipo",
        use: "Card e bloco",
      },
      {
        token: "H4",
        family: "display" as const,
        size: TYPOGRAPHY.fontSize.h4,
        weight: TYPOGRAPHY.fontWeight.bold,
        lineHeight: String(TYPOGRAPHY.lineHeight.h4),
        letterSpacing: TYPOGRAPHY.letterSpacing.h4,
        sample: "Kicker de card",
        use: "Subtítulo",
      },
      {
        token: "Stat",
        family: "display" as const,
        size: TYPOGRAPHY.fontSize.stat,
        weight: TYPOGRAPHY.fontWeight.black,
        lineHeight: "1",
        letterSpacing: TYPOGRAPHY.letterSpacing.h2,
        sample: "248",
        use: "Métrica do painel",
      },
      {
        token: "Body",
        family: "body" as const,
        size: TYPOGRAPHY.fontSize.body,
        weight: TYPOGRAPHY.fontWeight.normal,
        lineHeight: String(TYPOGRAPHY.lineHeight.body),
        letterSpacing: TYPOGRAPHY.letterSpacing.body,
        sample: "Cadastre-se e gerencie alunos, fichas e videoaulas.",
        use: "Parágrafo",
      },
      {
        token: "Label",
        family: "body" as const,
        size: TYPOGRAPHY.fontSize.label,
        weight: TYPOGRAPHY.fontWeight.semibold,
        lineHeight: String(TYPOGRAPHY.lineHeight.label),
        letterSpacing: TYPOGRAPHY.letterSpacing.label,
        sample: "E-mail",
        use: "Label, kicker e navegação",
      },
    ],
  },
  spacing: Object.entries(SPACING).map(([key, value]) => ({ key, value })),
  radius: [
    { token: "rounded-md", value: RADIUS.md, use: "Padrão de botão, input e card" },
    { token: "rounded", value: RADIUS.sm, use: "Badge pequeno" },
    { token: "rounded-none", value: RADIUS.none, use: "Imagens (ângulo reto)" },
    { token: "rounded-full", value: RADIUS.pill, use: "Tags terciárias e chips" },
  ],
  motion: [
    { token: "fast", value: `${ANIMATION.duration.fast}s`, use: "Hover e focus" },
    { token: "normal", value: `${ANIMATION.duration.normal}s`, use: "Entrada de card e tab" },
    { token: "slow", value: `${ANIMATION.duration.slow}s`, use: "Hero e transições de página" },
  ],
  components: COMPONENT_LIBRARY.flatMap((group) => group.items),
  elements: [
    {
      id: "interface",
      label: "Interface Design System",
      group: "envelope",
      kicker: "Envelope",
      title: "Interface Design System",
      highlight: "System",
      summary:
        "O recorte maior. Paleta, tipo e botão só existem se estiverem amarrados a processo de design, componentes, desenvolvimento, conteúdo e documentação.",
      items: [
        {
          title: "Não é um kit de UI solto",
          detail:
            "Tokens sem processo, biblioteca sem contrato visual ou copy fora da voz GYMX quebram o sistema — mesmo com a cor certa.",
        },
        {
          title: "Uma fonte da verdade",
          detail:
            "Tokens em src/app/constants, componentes em src/app/components, copy neste bible, QA no protocolo GymX. Figma, se existir, espelha o código — não o contrário.",
        },
        {
          title: "Onde vive no produto",
          detail:
            "Landing, /p/:slug, cadastro, portal do aluno, painel do personal e esta área /interno. Sem skin clara em nenhum desses recortes.",
        },
      ],
    },
    {
      id: "design-process",
      label: "Processo de design",
      group: "design",
      kicker: "Design Process",
      title: "Processo de design",
      highlight: "design",
      summary:
        "Como a interface nasce: mobile-first, base 8pt, contraste no escuro, uma palavra em amarelo. Assets e linguagem visual são filhos deste processo.",
      items: [
        {
          title: "Começa em 375px",
          detail: "Layout, toque e hierarquia fecham no mobile antes de subir para tablet, desktop e tela grande.",
        },
        {
          title: "Grid de 8pt",
          detail: "Espaçamento só na escala do design system. Nada de 13px ou 15px improvisado.",
        },
        {
          title: "Revisão antes de ship",
          detail:
            "Toda tela nova passa pelo checklist visual GymX: tokens, headline, rounded-md, estados vazio/erro/loading.",
        },
        {
          title: "Filhos deste círculo",
          detail: "Design Assets (marca e evidência) e UI Visual language (tokens). O Component System encosta aqui e no desenvolvimento.",
        },
      ],
    },
    {
      id: "design-assets",
      label: "Design Assets",
      group: "design",
      nestedIn: "design-process",
      kicker: "Assets",
      title: "Design Assets",
      highlight: "Assets",
      summary:
        "Peças reutilizáveis de marca: logotipo, marca tipográfica, swatches e espécimes. Não substituem o token — materializam o token.",
      items: [
        {
          title: "BrandMark",
          detail:
            "Marca tipográfica do produto: Personal em yellow-400, GYMX em branco. Na landing e no header ela corre em linha; no sidebar, empilha. No hover, GYMX passa a amarelo.",
        },
        {
          title: "Símbolo interno",
          detail:
            "Selo da área de operação: escudo dentro de um quadrado yellow-400, ao lado da BrandMark. Identifica o controle interno, não a academia física.",
        },
        {
          title: "Swatches",
          detail:
            "Paleta fechada do código (COLORS). Cada token tem um papel: fundo, card, borda, texto, CTA ou alerta. Sobre amarelo, o texto é yellow-900.",
        },
        {
          title: "Foto e mídia",
          detail:
            "Capa da vitrine em ângulo reto, com o nome do personal por cima. Vídeo é a URL que o profissional cola (YouTube, Vimeo ou Loom).",
        },
      ],
    },
    {
      id: "visual-language",
      label: "Linguagem visual",
      group: "design",
      nestedIn: "design-process",
      kicker: "UI Visual language",
      title: "Linguagem visual da UI",
      highlight: "visual",
      summary:
        "O alfabeto da interface: princípios, cor, escala de tipo (H1–H4, letter-spacing, line-height), grid de 8pt, raio e movimento. Tokens vivem aqui — o componente só consome.",
      items: [
        {
          title: "Cor",
          detail:
            "A interface nasce no preto. Kicker e preço usam orange-500. O parágrafo usa neutral-050. O botão principal é yellow-400 preenchido, com texto yellow-900.",
        },
        {
          title: "Tipo",
          detail:
            "Títulos em Bebas Neue, caixa alta. Parágrafo, label e navegação em Inter. Na headline, uma palavra em yellow-400 faz o destaque. A escala abaixo traz tamanho, peso, line-height e letter-spacing de cada nível.",
        },
        {
          title: "Espaço e raio",
          detail:
            "Tudo alinha à grade de 8 pontos, de 4px a 120px. Botão, input e card têm raio de 8px. Tags são pill. Fotos e capas ficam em ângulo reto.",
        },
        {
          title: "Movimento",
          detail:
            "Hover e focus em 0,2s. Entrada de card e troca de aba em 0,3s. Hero e troca de página em 0,6s. A escala no hover é curta, com curva ease-out.",
        },
      ],
    },
    {
      id: "component-system",
      label: "Sistema de componentes",
      group: "component",
      kicker: "Component System",
      title: "Sistema de componentes",
      highlight: "componentes",
      summary:
        "A interseção entre design e desenvolvimento: o contrato. Token (linguagem visual) vira classe, classe vira componente, componente tem força primária, secundária e terciária — botão e menu.",
      items: [
        {
          title: "Contrato token → código",
          detail:
            "A Linguagem visual define o token (cor, tipo, espaço). O código lê esse token em constants, aplica a classe Tailwind e entrega um componente GymX. O JSX referencia o token, não um hex avulso.",
        },
        {
          title: "Três forças de botão",
          detail:
            "Primária: preenchida yellow-400 — a ação principal, uma por bloco. Secundária: contorno — a alternativa. Terciária: só texto — a ação leve, como ver detalhes.",
        },
        {
          title: "Três forças de menu",
          detail:
            "Primário: links do header ou da sidebar, em Inter uppercase. Secundário: abas com underline, para fases e seções. Terciário: tags em pill, para documento, filtro ou camada.",
        },
        {
          title: "Anatomia estável",
          detail:
            "Todo componente de produto mostra quatro estados: vazio com o próximo passo, loading, erro em orange-500 e focus visível em yellow-400.",
        },
      ],
    },
    {
      id: "development-process",
      label: "Processo de desenvolvimento",
      group: "development",
      kicker: "Development Process",
      title: "Processo de desenvolvimento",
      highlight: "desenvolvimento",
      summary:
        "Como o sistema entra no produto: React function component, Tailwind, Motion, pastas por responsabilidade, build verde antes do deploy.",
      items: [
        {
          title: "Stack da UI",
          detail: "React 18 + Vite + Tailwind 4 + Motion + React Router 7. Sem class component e sem CSS solto que fuja do token.",
        },
        {
          title: "Separação",
          detail: "UI em components, regra em services/hooks, dado em types. Página não fala com Supabase direto se já existe service.",
        },
        {
          title: "Segurança de front",
          detail: "Só VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY. Nunca service_role no bundle.",
        },
        {
          title: "Filhos deste círculo",
          detail: "Component libraries (o que se importa) e Issue Tracking (como se corrige e se acorda o drift).",
        },
      ],
    },
    {
      id: "component-libraries",
      label: "Bibliotecas de componentes",
      group: "development",
      nestedIn: "development-process",
      kicker: "Component libraries",
      title: "Bibliotecas de componentes",
      highlight: "Bibliotecas",
      summary:
        "O inventário importável do portal: cada peça que uma página realmente usa. Reuse daqui antes de nascer outra. src/app/components/ui é base Radix, sem skin GymX — fica de fora.",
      items: [
        {
          title: "Landing e vitrine",
          detail:
            "Header, Hero, ticker, seções da home, lista de personais, FAQ, CTA, contato e Footer. Também a página pública /p/:slug.",
        },
        {
          title: "Auth e formulários",
          detail:
            "BrandMark nas telas de acesso, FormInput, FormSelect, ToggleButtons, MultiSelectChips, FormSectionHeader e SignaturePad.",
        },
        {
          title: "Painel do personal",
          detail:
            "Sidebar, MetricCard, gráficos, lista de alunos, alerta de turistas, perfil público, PAR-Q, URL de vídeo e InfoCard.",
        },
        {
          title: "Portal do aluno",
          detail:
            "MemberLayout, planos, treino, players, aulas, check-in, PAR-Q, termos e banners de demo e limite.",
        },
        {
          title: "Interno e rotas",
          detail:
            "InternalLayout, DocsPhaseTabs, DesignSystemDocument e os guards de Auth que isolam staff, aluno e operador.",
        },
      ],
    },
    {
      id: "issue-tracking",
      label: "Rastreamento de issues",
      group: "development",
      nestedIn: "development-process",
      kicker: "Issue Tracking",
      title: "Rastreamento de issues",
      highlight: "issues",
      summary:
        "Onde o drift do sistema vira trabalho: GitHub, convenção de commit, QA sênior antes de aprovar. Sem isso o DS apodrece em silêncio.",
      items: [
        {
          title: "GitHub",
          detail: "Branch por feature, PR antes de main, commits feat:/fix:/refactor:/chore:/docs:. Nunca .env no commit.",
        },
        {
          title: "QA obrigatório",
          detail:
            "Depois de feature, layout ou integração: fluxo real no browser, breakpoints, design system. Qualquer erro → REPROVADO.",
        },
        {
          title: "Drift visual",
          detail: "Hex fora do token, headline com duas palavras em amarelo, botão primário usado como tab — abrir issue/fix, não ‘ajuste depois’.",
        },
        {
          title: "Status nesta bible",
          detail: "Requisitos com status implementado / parcial / planejado / legado. O DS aponta o que já está no código e o que ainda é regra.",
        },
      ],
    },
    {
      id: "content-strategy",
      label: "Estratégia de conteúdo",
      group: "content",
      kicker: "Content Strategy",
      title: "Estratégia de conteúdo",
      highlight: "conteúdo",
      summary:
        "A voz GYMX. O sistema visual sem copy vira um tema genérico de academia. Palavra, hierarquia e tom são parte do DS.",
      items: [
        {
          title: "Nome do produto",
          detail: "Personal GYMX. Marketplace de personais — nunca ‘academia com catraca’ nem SaaS solto vendido ao profissional.",
        },
        {
          title: "Hierarquia de texto",
          detail: "Kicker orange-500 uppercase. Headline Bebas com uma palavra em yellow-400. Corpo Inter em neutral-300/050.",
        },
        {
          title: "Labels",
          detail: "11–12px, uppercase, tracking amplo. Tab de fase neste peso; tag de documento em força terciária.",
        },
        {
          title: "Superfícies",
          detail:
            "Landing (descoberta), /p/:slug (página do personal), portal (aluno), dashboard (prescrição), /interno (esta documentação). O tom muda a audiência, não a marca.",
        },
      ],
    },
    {
      id: "documentation-system",
      label: "Sistema de documentação",
      group: "docs",
      kicker: "Documentation System",
      title: "Sistema de documentação",
      highlight: "documentação",
      summary:
        "Onde o DS se explica e se fiscaliza: esta área interna, o bible no código e o arquivo de referência. Sem documentação o componente vira folklore.",
      items: [
        {
          title: "Área /interno",
          detail:
            "Fases do projeto em tab menu. Documentos em tag terciária. Cada clique isola um conteúdo — inclusive as camadas deste design system.",
        },
        {
          title: "productBible.ts",
          detail: "Fonte da verdade desta página. Persona, RF/RNF, stack e DS saem daqui. UI só renderiza.",
        },
        {
          title: "DESIGN_SYSTEM_REFERENCE.md",
          detail: "Referência longa de implementação (classes, motion, a11y). Esta página é o mapa; o .md é o manual.",
        },
        {
          title: "Fase certa",
          detail: "O DS mora em Ideação · desenvolvimento: é solução em construção, não imersão e não backlog operacional.",
        },
      ],
    },
  ] satisfies DesignSystemElement[],
};

export function resolveDesignSystemLayer(search: string): DesignSystemElement {
  const id = new URLSearchParams(search).get(DESIGN_SYSTEM_LAYER_PARAM);
  const match = DESIGN_SYSTEM.elements.find((item) => item.id === id);
  return match ?? DESIGN_SYSTEM.elements[0];
}
