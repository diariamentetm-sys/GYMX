import { useState, type ReactNode } from "react";
import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  Dumbbell,
  Home,
  LayoutDashboard,
  Mail,
  Play,
  Settings,
  Shield,
  User,
  Users,
} from "lucide-react";
import {
  COMPONENT_LIBRARY,
  UNUSED_LIBRARY_COMPONENTS,
  type LibraryComponent,
} from "../../data/productBible";
import { BrandMark } from "../BrandMark";
import { FormInput } from "../FormInput";
import { FormSelect } from "../FormSelect";
import { FormSectionHeader } from "../FormSectionHeader";
import { ToggleButtons } from "../ToggleButtons";
import { MultiSelectChips } from "../MultiSelectChips";
import { SignaturePad } from "../SignaturePad";
import { InfoCard } from "../InfoCard";
import { LoadingSpinner } from "../LoadingSpinner";
import { TickerStrip } from "../TickerStrip";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { MetricCard } from "../dashboard/MetricCard";
import { TrainerVideoUrlFields } from "../dashboard/TrainerVideoUrlFields";
import { PlanCard } from "../member/PlanCard";
import { TrainerCard } from "../member/TrainerCard";
import { WorkoutEmptyState } from "../member/WorkoutEmptyState";
import { WorkoutProgramCard } from "../member/WorkoutProgramCard";
import { WorkoutHistoryPanel } from "../member/WorkoutHistoryPanel";
import { ClassFiltersBar } from "../member/ClassFiltersBar";
import { ClassHistoryPanel } from "../member/ClassHistoryPanel";
import { ExerciseVideoPlayer } from "../member/ExerciseVideoPlayer";
import { ParQForm, emptyParQAnswers } from "../member/ParQForm";
import type { GymPlan } from "../../types/subscription";
import type { GymTrainer, WorkoutProgram } from "../../types/workout";
import type { ClassModality, DayPeriod } from "../../types/class";
import { formatCurrency } from "../../utils/subscriptionCalculations";

const USED_COUNT = COMPONENT_LIBRARY.reduce((sum, group) => sum + group.items.length, 0);

const SAMPLE_PLAN: GymPlan = {
  id: "spec-plan",
  name: "Acompanhamento",
  slug: "acompanhamento",
  badge: "Mais escolhido",
  description: "Ficha no portal, vídeo do personal e ajuste mensal.",
  monthlyPrice: 180,
  loyaltyMonths: 3,
  penaltyPercent: 20,
  freezeDaysPerCycle: 7,
  checkinsPerMonth: null,
  scheduleLabel: "Horário flexível",
  benefits: ["Ficha no app", "Vídeo do personal", "Ajuste mensal", "Check-in"],
  sortOrder: 1,
};

const SAMPLE_TRAINER: GymTrainer = {
  id: "spec-trainer",
  fullName: "Ana Ribeiro",
  cref: "012345-G/SP",
  email: "ana@gymx.app",
  specialties: ["Hipertrofia"],
};

const SAMPLE_PROGRAM: WorkoutProgram = {
  id: "spec-program",
  memberId: "spec-member",
  trainerId: SAMPLE_TRAINER.id,
  modality: "musculacao",
  objective: "Hipertrofia",
  label: "Upper A",
  division: "Upper / Lower",
  prescriptionType: "manual",
  status: "ativo",
  versionNumber: 1,
  validFrom: "2026-10-01",
  validUntil: "2026-12-15",
  cycleWeeks: 6,
  aiGenerated: false,
  createdAt: "2026-10-01T00:00:00.000Z",
  updatedAt: "2026-10-01T00:00:00.000Z",
  trainer: SAMPLE_TRAINER,
  exercises: [
    {
      id: "spec-ex",
      programId: "spec-program",
      sortOrder: 1,
      name: "Supino reto",
      sets: 4,
      reps: "8–10",
      restSeconds: 90,
    },
  ],
};

function CatalogEntry({
  item,
  children,
}: {
  item: LibraryComponent;
  children?: ReactNode;
}) {
  return (
    <article className="bg-neutral-950 border border-neutral-800 rounded-md overflow-hidden">
      <div className="p-4 md:p-5 border-b border-neutral-800 space-y-2">
        <p className="text-yellow-400 font-mono text-sm">{item.name}</p>
        <p className="text-neutral-500 font-mono text-[11px]">{item.file}</p>
        <p className="text-neutral-400 text-sm leading-relaxed">{item.detail}</p>
        {item.surfaces.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {item.surfaces.map((surface) => (
              <span
                key={surface}
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border border-neutral-700 text-neutral-400"
              >
                {surface}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      {children ? <div className="p-4 md:p-5">{children}</div> : null}
    </article>
  );
}

function HeaderSpecimen() {
  return (
    <div className="bg-neutral-950/90 border border-neutral-700/50 rounded-md px-4 py-3 flex flex-wrap items-center justify-between gap-3">
      <BrandMark className="text-xl md:text-2xl" />
      <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-[11px] sm:text-sm font-medium uppercase tracking-wider font-body">
        <span className="text-yellow-400">Início</span>
        <span className="text-neutral-050">Como funciona</span>
        <span className="text-neutral-050">Personais</span>
        <span className="text-neutral-050">FAQ</span>
        <span className="text-neutral-050">Contato</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-neutral-050 text-sm font-medium uppercase tracking-wider">Entrar</span>
        <span className="bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wide">
          Começar
        </span>
      </div>
    </div>
  );
}

function FooterSpecimen() {
  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-md p-5">
      <p className="text-neutral-500 text-xs uppercase tracking-widest mb-4 pb-4 border-b border-neutral-800">
        Personal GYMX — a plataforma do personal trainer
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-display text-sm uppercase text-white mb-2">Links rápidos</p>
          <p className="text-neutral-400 text-sm">Início · Personais · FAQ</p>
        </div>
        <div>
          <p className="font-display text-sm uppercase text-white mb-2">Conta</p>
          <p className="text-neutral-400 text-sm">Entrar · Cadastre-se</p>
        </div>
      </div>
    </div>
  );
}

function HeroSpecimen() {
  return (
    <div className="relative overflow-hidden rounded-md border border-neutral-800 min-h-52 flex items-center justify-center">
      <ImageWithFallback
        src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/50 to-neutral-950/85" />
      <div className="relative z-10 text-center px-4 py-8 space-y-3">
        <p className="text-yellow-400 text-sm font-semibold uppercase tracking-[0.2em]">
          Feito para quem treina os outros.
        </p>
        <p className="font-display text-3xl md:text-4xl uppercase text-white leading-[0.95]">
          Seus alunos. Sua ficha.
          <br />
          Seu <span className="text-yellow-400">método</span>
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <span className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded text-xs font-bold uppercase tracking-wide">
            Quero um personal →
          </span>
          <span className="border-2 border-white text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wide">
            Sou personal
          </span>
        </div>
      </div>
    </div>
  );
}

function PersonalsCardSpecimen() {
  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-5 max-w-sm">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center shrink-0">
          <span className="text-yellow-400 font-bold">AR</span>
        </div>
        <div>
          <p className="text-white font-display uppercase text-xl leading-tight">Ana Ribeiro</p>
          <p className="text-neutral-500 text-xs mt-1">CREF 012345-G/SP</p>
        </div>
      </div>
      <p className="text-neutral-300 text-sm leading-relaxed mb-4">
        Hipertrofia e consistência. Ficha no portal, vídeo na sua URL.
      </p>
      <span className="text-[10px] uppercase tracking-wider text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
        Hipertrofia
      </span>
      <div className="flex items-end justify-between gap-3 mt-4 pt-4 border-t border-neutral-700">
        <div>
          <p className="text-neutral-500 text-[10px] uppercase tracking-widest">Mensalidade</p>
          <p className="text-white font-display text-2xl">
            {formatCurrency(180)}
            <span className="text-neutral-500 text-sm font-body font-medium">/mês</span>
          </p>
        </div>
        <span className="bg-yellow-400 text-yellow-900 px-4 py-2.5 rounded text-xs font-bold uppercase tracking-wide">
          Ver trabalho
        </span>
      </div>
    </div>
  );
}

function FaqSpecimen() {
  return (
    <div className="bg-gradient-to-br from-neutral-950 to-neutral-800 border border-neutral-700 rounded-md overflow-hidden">
      <div className="p-5 flex items-center justify-between gap-4">
        <p className="text-white font-semibold">O Personal GYMX é uma academia?</p>
        <span className="text-yellow-400 text-2xl font-bold">−</span>
      </div>
      <p className="px-5 pb-5 text-neutral-050 text-sm leading-relaxed border-t border-neutral-700 pt-4">
        Não. É a plataforma do personal trainer. Você cadastra os seus alunos, monta as fichas e
        cola a URL da videoaula.
      </p>
    </div>
  );
}

function SidebarSpecimen({
  title,
  brand,
  items,
}: {
  title: string;
  brand?: boolean;
  items: { icon: typeof Home; label: string; active?: boolean }[];
}) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-md p-4 w-full max-w-xs">
      {brand ? (
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-neutral-800">
          <div className="w-10 h-10 bg-yellow-400 rounded flex items-center justify-center">
            <Dumbbell className="text-yellow-900" size={22} strokeWidth={2.5} />
          </div>
          <BrandMark stacked className="text-xl" />
        </div>
      ) : null}
      <p className="text-[11px] uppercase tracking-widest text-neutral-500 mb-3">{title}</p>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium uppercase tracking-wide ${
                item.active ? "bg-yellow-400 text-yellow-900" : "text-neutral-300"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ToggleSpecimen() {
  const [value, setValue] = useState("nao");
  return (
    <ToggleButtons
      name="lesao-spec"
      question="Possui lesão em tratamento?"
      options={[
        { value: "sim", label: "Sim" },
        { value: "nao", label: "Não" },
      ]}
      value={value}
      onChange={setValue}
    />
  );
}

function ChipsSpecimen() {
  const [value, setValue] = useState(["hipertrofia"]);
  return (
    <MultiSelectChips
      label="Objetivo"
      options={[
        { value: "hipertrofia", label: "Hipertrofia" },
        { value: "emagrecer", label: "Emagrecer" },
        { value: "saude", label: "Saúde" },
      ]}
      value={value}
      onChange={setValue}
    />
  );
}

function VideoFieldsSpecimen() {
  const [url, setUrl] = useState("");
  const [libraryId, setLibraryId] = useState("");

  return (
    <TrainerVideoUrlFields
      library={[]}
      selectedLibraryId={libraryId}
      videoUrl={url}
      previewTitle="Supino reto"
      onSelectLibrary={(item) => setLibraryId(item?.id ?? "")}
      onVideoUrlChange={setUrl}
    />
  );
}

function FiltersSpecimen() {
  const [modality, setModality] = useState<ClassModality | "all">("all");
  const [instructorId, setInstructorId] = useState("all");
  const [period, setPeriod] = useState<DayPeriod>("all");

  return (
    <ClassFiltersBar
      modality={modality}
      instructorId={instructorId}
      period={period}
      instructors={[{ id: "ana", fullName: "Ana Ribeiro" }]}
      onModalityChange={setModality}
      onInstructorChange={setInstructorId}
      onPeriodChange={setPeriod}
    />
  );
}

function ParQSpecimen() {
  const [answers, setAnswers] = useState(emptyParQAnswers());
  return (
    <div className="relative max-h-72 overflow-hidden">
      <ParQForm answers={answers} onChange={setAnswers} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-neutral-950" />
    </div>
  );
}

function specimenFor(name: string): ReactNode {
  switch (name) {
    case "Header":
      return <HeaderSpecimen />;
    case "BrandMark":
      return (
        <div className="flex flex-wrap items-end gap-8">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2">Inline</p>
            <BrandMark className="text-3xl" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2">Stacked</p>
            <BrandMark stacked className="text-3xl" />
          </div>
        </div>
      );
    case "Hero":
      return <HeroSpecimen />;
    case "ImageWithFallback":
      return (
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=640&auto=format&fit=crop"
          alt="Foto de treino"
          className="h-28 w-full object-cover rounded-none"
        />
      );
    case "TickerStrip":
      return (
        <div className="rounded-md overflow-hidden">
          <TickerStrip />
        </div>
      );
    case "AboutSection":
      return (
        <div className="space-y-3">
          <p className="text-orange-500 text-xs font-semibold uppercase tracking-widest">
            Como funciona
          </p>
          <p className="font-display text-2xl uppercase text-white leading-none">
            O método é <span className="text-yellow-400">seu</span>
          </p>
          <div className="grid grid-cols-2 gap-2 pt-2">
            {[
              ["Seu método", "Na nuvem"],
              ["Seus alunos", "No painel"],
            ].map(([label, value]) => (
              <div key={label} className="bg-neutral-900 border border-neutral-800 rounded-md p-3">
                <p className="text-neutral-500 text-[10px] uppercase tracking-widest">{label}</p>
                <p className="text-white font-display text-lg uppercase">{value}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "TestimonialsSection":
      return (
        <div className="bg-gradient-to-br from-neutral-950 to-neutral-800 border border-neutral-700 rounded-md p-5">
          <span className="text-yellow-400 font-display text-5xl leading-none">"</span>
          <p className="text-neutral-050 text-sm leading-relaxed mt-1">
            Cadastro o aluno, colo a URL da minha videoaula e ele já vê o movimento no portal.
          </p>
          <div className="border-t border-neutral-700 pt-3 mt-4">
            <p className="text-white font-semibold text-sm">Marina Alves</p>
            <p className="text-neutral-300 text-xs italic">Personal · hipertrofia</p>
          </div>
        </div>
      );
    case "PersonalsSection":
      return <PersonalsCardSpecimen />;
    case "FAQSection":
      return <FaqSpecimen />;
    case "FinalCTA":
      return (
        <div className="relative overflow-hidden rounded-md border border-neutral-800 min-h-36 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-neutral-950 to-yellow-400/10" />
          <div className="relative z-10 text-center px-4 py-6 space-y-3">
            <p className="text-orange-500 text-xs font-semibold uppercase tracking-[0.2em]">
              O próximo passo
            </p>
            <p className="font-display text-2xl uppercase text-white leading-none">
              Comece com o <span className="text-yellow-400">seu</span> método
            </p>
            <span className="inline-block bg-yellow-400 text-yellow-900 px-4 py-2 rounded text-xs font-bold uppercase">
              Cadastre-se
            </span>
          </div>
        </div>
      );
    case "ContactFormSection":
      return (
        <div className="space-y-3 max-w-md">
          <FormInput label="Nome" defaultValue="Douglas" />
          <FormSelect
            label="Plano de interesse"
            options={[
              { value: "pro", label: "Pro — ilimitado" },
              { value: "start", label: "Start — até 20 alunos" },
            ]}
            defaultValue="pro"
          />
        </div>
      );
    case "Footer":
      return <FooterSpecimen />;
    case "FormInput":
      return <FormInput label="E-mail" type="email" defaultValue="aluno@gymx.app" icon="email" />;
    case "FormSelect":
      return (
        <FormSelect
          label="Plano"
          options={[
            { value: "acompanhamento", label: "Acompanhamento" },
            { value: "consultoria", label: "Consultoria" },
          ]}
          defaultValue="acompanhamento"
        />
      );
    case "ToggleButtons":
      return <ToggleSpecimen />;
    case "MultiSelectChips":
      return <ChipsSpecimen />;
    case "FormSectionHeader":
      return (
        <FormSectionHeader
          number={1}
          title="Dados do aluno"
          icon={Users}
          subtitle="Identificação e contato"
        />
      );
    case "SignaturePad":
      return <SignaturePad label="Assinatura do aluno" />;
    case "Sidebar":
      return (
        <SidebarSpecimen
          title="Painel do personal"
          brand
          items={[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: Users, label: "Alunos" },
            { icon: ClipboardCheck, label: "Check-ins" },
            { icon: Dumbbell, label: "Treinos" },
            { icon: Settings, label: "Configurações" },
          ]}
        />
      );
    case "MetricCard":
      return (
        <div className="max-w-xs">
          <MetricCard icon={Users} label="Alunos ativos" value={24} subtitle="neste ciclo" />
        </div>
      );
    case "MemberGrowthChart":
      return (
        <div className="h-28 rounded-md border border-neutral-800 bg-neutral-900 flex items-end gap-2 p-4">
          {[40, 55, 48, 70, 88, 76].map((height, index) => (
            <div
              key={index}
              className="flex-1 bg-yellow-400/80 rounded-sm"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      );
    case "RecentMembersList":
      return (
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-4 space-y-3">
          <p className="font-display text-xl uppercase text-white">Alunos recentes</p>
          {["Maria Santos", "João Silva"].map((name) => (
            <div
              key={name}
              className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded border border-neutral-700/50"
            >
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-yellow-900 font-bold text-xs">
                  {name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
              </div>
              <p className="text-white text-sm font-semibold">{name}</p>
            </div>
          ))}
        </div>
      );
    case "TouristAlert":
      return (
        <div className="bg-gradient-to-br from-orange-500/5 to-neutral-900 border border-orange-500/50 rounded-md p-4">
          <div className="flex items-center gap-3 mb-2">
            <p className="font-display text-xl uppercase text-white">Turistas</p>
            <span className="px-2 py-0.5 bg-orange-500/20 border border-orange-500/30 rounded text-orange-500 text-xs font-bold">
              5
            </span>
          </div>
          <p className="text-orange-500 text-sm">Alunos sem check-in recente</p>
        </div>
      );
    case "PublicProfileSettings":
      return (
        <div className="max-w-md space-y-3">
          <FormInput label="Slug público" defaultValue="ana-ribeiro" />
          <FormInput label="Preço mensal" defaultValue="180" />
        </div>
      );
    case "ParQReviewModal":
      return (
        <div className="bg-neutral-900 border border-neutral-700 rounded-md p-5 max-w-md">
          <p className="font-display text-xl uppercase text-white mb-2">PAR-Q · Marina Costa</p>
          <p className="text-neutral-400 text-sm mb-4">
            Respostas do aluno para o personal revisar.
          </p>
          <div className="flex gap-2">
            <span className="bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-md text-[11px] font-bold uppercase">
              Liberar
            </span>
            <span className="border border-neutral-600 text-neutral-300 px-3 py-1.5 rounded-md text-[11px] font-bold uppercase">
              Encaminhar
            </span>
          </div>
        </div>
      );
    case "TrainerVideoUrlFields":
      return <VideoFieldsSpecimen />;
    case "InfoCard":
      return (
        <div className="max-w-xs">
          <InfoCard label="E-mail" value="marina@gymx.app" icon={Mail} />
        </div>
      );
    case "MemberLayout":
      return (
        <div className="border border-neutral-800 rounded-md overflow-hidden flex min-h-40">
          <div className="hidden sm:block w-40 bg-neutral-900 border-r border-neutral-800 p-3">
            <BrandMark stacked className="text-lg mb-3" />
            <p className="text-[10px] uppercase tracking-widest text-yellow-400">Início</p>
          </div>
          <div className="flex-1 bg-neutral-950 p-4 space-y-3">
            <p className="font-display text-xl uppercase text-white">Meu treino</p>
            <div className="h-16 rounded-md border border-neutral-800 bg-neutral-900" />
          </div>
        </div>
      );
    case "MemberSidebar":
      return (
        <SidebarSpecimen
          title="Portal do aluno"
          brand
          items={[
            { icon: Home, label: "Início", active: true },
            { icon: Dumbbell, label: "Meu treino" },
            { icon: ClipboardCheck, label: "Check-in" },
            { icon: CalendarDays, label: "Aulas" },
            { icon: CreditCard, label: "Meu plano" },
            { icon: User, label: "Perfil" },
          ]}
        />
      );
    case "DemoModeBanner":
      return (
        <div className="bg-yellow-400 text-yellow-900 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-md">
          <p className="text-sm font-semibold">
            Visão demonstrativa do aluno · dados de simulação.
          </p>
          <span className="inline-flex items-center px-4 py-2 bg-yellow-900 text-yellow-400 rounded-md text-xs font-bold uppercase tracking-wide">
            Voltar ao painel
          </span>
        </div>
      );
    case "PlanCard":
      return (
        <div className="max-w-sm">
          <PlanCard
            plan={SAMPLE_PLAN}
            featured
            actionLabel="Contratar"
            onSelect={() => undefined}
          />
        </div>
      );
    case "PaymentModal":
      return (
        <div className="bg-neutral-900 border border-neutral-700 rounded-md p-5 max-w-sm">
          <p className="font-display text-xl uppercase text-white mb-2">Confirmar pagamento</p>
          <p className="text-neutral-400 text-sm mb-4">Acompanhamento · {formatCurrency(180)}/mês</p>
          <span className="inline-block bg-yellow-400 text-yellow-900 px-4 py-2 rounded-md text-xs font-bold uppercase">
            Confirmar
          </span>
        </div>
      );
    case "TrainerCard":
      return <TrainerCard trainer={SAMPLE_TRAINER} prescriptionType="manual" />;
    case "WorkoutProgramCard":
      return <WorkoutProgramCard program={SAMPLE_PROGRAM} onOpen={() => undefined} />;
    case "WorkoutEmptyState":
      return (
        <WorkoutEmptyState pendingRequest={false} loading={false} onRequest={() => undefined} />
      );
    case "WorkoutHistoryPanel":
      return <WorkoutHistoryPanel programs={[]} loading={false} />;
    case "GuidedWorkoutPlayer":
      return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-md p-5">
          <p className="text-orange-500 text-[11px] uppercase tracking-widest">Série 2 de 4</p>
          <p className="font-display text-3xl uppercase text-white leading-none mt-1">Supino reto</p>
          <p className="text-neutral-400 text-sm mt-2">8–10 reps · 90s descanso</p>
          <div className="flex items-center gap-2 mt-4">
            <span className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
              <Play className="text-yellow-900 ml-0.5" size={18} fill="currentColor" />
            </span>
            <span className="text-neutral-400 text-xs uppercase tracking-wider">Modo guiado</span>
          </div>
        </div>
      );
    case "ExerciseVideoPlayer":
      return (
        <ExerciseVideoPlayer
          url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          title="Supino reto"
          compact
        />
      );
    case "ClassFiltersBar":
      return <FiltersSpecimen />;
    case "ClassSessionCard":
      return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-md p-4 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
              Funcional
            </span>
            <p className="text-white font-semibold mt-2">Funcional · 18:00</p>
            <p className="text-neutral-500 text-xs mt-1">Ana Ribeiro · 8 vagas</p>
          </div>
          <span className="bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-md text-[11px] font-bold uppercase">
            Reservar
          </span>
        </div>
      );
    case "ClassReservationCard":
      return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-md p-4 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">
              Confirmada
            </span>
            <p className="text-white font-semibold mt-2">Reserva · amanhã 18:00</p>
            <p className="text-neutral-500 text-xs mt-1">Funcional</p>
          </div>
          <span className="text-neutral-300 text-[11px] font-semibold uppercase tracking-wider">
            Cancelar
          </span>
        </div>
      );
    case "ClassHistoryPanel":
      return <ClassHistoryPanel reservations={[]} />;
    case "ClassLimitsBanner":
      return (
        <div className="bg-neutral-900 border border-neutral-700 rounded-md p-4 flex items-start gap-3">
          <Shield className="text-yellow-400 shrink-0 mt-0.5" size={18} />
          <p className="text-neutral-300 text-sm">2 de 4 aulas do plano neste ciclo.</p>
        </div>
      );
    case "TermsConsentForm":
      return (
        <div className="bg-neutral-900 border border-neutral-700 rounded-md overflow-hidden">
          <div className="px-4 pt-4 pb-3 border-b border-neutral-800 flex items-center gap-3">
            <Shield className="text-yellow-400" size={18} />
            <p className="text-white text-sm font-semibold">
              Termos de Uso <span className="text-orange-500">*</span>
            </p>
          </div>
          <label className="flex items-start gap-3 p-4 text-sm text-neutral-300">
            <span className="mt-0.5 w-4 h-4 rounded-sm border border-yellow-400 bg-yellow-400/20 shrink-0" />
            Li o documento completo e aceito os termos.
          </label>
        </div>
      );
    case "ParQForm":
      return <ParQSpecimen />;
    case "InternalLayout":
      return (
        <SidebarSpecimen
          title="Controle interno"
          brand
          items={[{ icon: BookOpen, label: "Documentação", active: true }]}
        />
      );
    case "DocsPhaseTabs":
      return (
        <div>
          <div className="flex gap-1 border-b border-neutral-800 mb-3">
            <span className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-yellow-400 border-b-2 border-yellow-400">
              Ideação · desenvolvimento
            </span>
            <span className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-neutral-500">
              Melhoria contínua
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border border-yellow-400/40 text-yellow-400 bg-yellow-400/10">
              Design system
            </span>
            <span className="px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border border-neutral-800 text-neutral-500">
              Tecnologias
            </span>
          </div>
        </div>
      );
    case "DesignSystemDocument":
      return (
        <p className="text-neutral-400 text-sm leading-relaxed">
          Este próprio documento: mapa Terem, tags de camada e espécimes isolados por seção.
        </p>
      );
    case "AppErrorBoundary":
      return (
        <div className="bg-neutral-900 border border-orange-500/40 rounded-md p-5 text-center max-w-sm">
          <p className="text-white font-bold mb-1">Erro ao carregar a página</p>
          <p className="text-neutral-400 text-sm mb-3">Fallback global se a árvore quebrar.</p>
          <span className="inline-block bg-yellow-400 text-yellow-900 px-4 py-2 rounded-md font-semibold text-sm">
            Recarregar
          </span>
        </div>
      );
    case "AuthFlowRedirect":
    case "RequireStaff":
    case "RequireMemberAccess":
    case "RequireOperator":
      return (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-neutral-500 text-xs font-mono uppercase tracking-wider">
            Guard · spinner até a sessão resolver, depois redirect
          </p>
        </div>
      );
    default:
      return (
        <p className="text-neutral-500 text-sm">Sem recorte visual — peça de infra ou overlay.</p>
      );
  }
}

function GroupSection({
  title,
  detail,
  items,
}: {
  title: string;
  detail: string;
  items: LibraryComponent[];
}) {
  return (
    <section className="space-y-5 scroll-mt-36">
      <div>
        <h3 className="font-display text-3xl md:text-4xl uppercase text-white leading-none mb-3">
          {title}
        </h3>
        <p className="text-neutral-400 text-sm leading-relaxed max-w-3xl">
          {detail} {items.length} peças neste grupo.
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        {items.map((item) => (
          <CatalogEntry key={item.name} item={item}>
            {specimenFor(item.name)}
          </CatalogEntry>
        ))}
      </div>
    </section>
  );
}

export function ComponentLibraryDocument() {
  return (
    <div className="space-y-12">
      <p className="text-neutral-300 text-sm leading-relaxed border-l-2 border-yellow-400 pl-4 max-w-3xl">
        Inventário do que as páginas do portal importam hoje: {USED_COUNT} peças em produção e{" "}
        {UNUSED_LIBRARY_COMPONENTS.length} no disco sem rota. Cada card traz arquivo, superfície e
        um recorte visual. Header, Footer e sidebars aparecem como réplica — montá-los ao vivo
        fixaria overlay nesta documentação. src/app/components/ui (Radix) fica de fora: é base, sem
        skin GymX.
      </p>

      {COMPONENT_LIBRARY.map((group) => (
        <GroupSection
          key={group.id}
          title={group.title}
          detail={group.detail}
          items={group.items}
        />
      ))}

      <section className="space-y-5 scroll-mt-36">
        <div>
          <h3 className="font-display text-3xl md:text-4xl uppercase text-white leading-none mb-3">
            No disco, sem página
          </h3>
          <p className="text-neutral-400 text-sm leading-relaxed max-w-3xl">
            Existem em src/app/components, mas nenhuma rota de produção importa. Ou entram no
            fluxo, ou saem do inventário.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {UNUSED_LIBRARY_COMPONENTS.map((item) => (
            <CatalogEntry key={item.name} item={item}>
              {item.name === "LoadingSpinner" ? <LoadingSpinner size="sm" /> : null}
            </CatalogEntry>
          ))}
        </div>
      </section>
    </div>
  );
}
