import { useLocation } from "react-router";
import { DesignSystemDocument } from "../../components/internal/DesignSystemDocument";
import { DocsPhaseTabs } from "../../components/internal/DocsPhaseTabs";
import { InternalLayout } from "../../components/internal/InternalLayout";
import {
  DOC_PHASES,
  FUNCTIONAL_GROUPS,
  NEXT_SLICE,
  NON_FUNCTIONAL,
  PERSONAS,
  PRODUCT_CONCEPT,
  REQUIREMENT_CRITERION,
  REQUIREMENT_STATUS_LABEL,
  TECH_STACK,
  requirementsByStatus,
  resolvePhaseDocumentId,
  type DocPhase,
  type Requirement,
  type RequirementStatus,
} from "../../data/productBible";

function statusClass(status: RequirementStatus) {
  if (status === "implementado") return "bg-yellow-400 text-yellow-900";
  if (status === "parcial") return "bg-orange-500 text-white";
  if (status === "planejado") return "bg-neutral-700 text-neutral-050";
  return "border border-neutral-600 text-neutral-300";
}

function StatusBadge({ status }: { status: RequirementStatus }) {
  return (
    <span
      className={`inline-flex px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-wider ${statusClass(status)}`}
    >
      {REQUIREMENT_STATUS_LABEL[status]}
    </span>
  );
}

function SectionTitle({
  kicker,
  title,
  highlight,
}: {
  kicker: string;
  title: string;
  highlight: string;
}) {
  const parts = title.split(highlight);
  return (
    <div className="mb-8 space-y-3">
      <p className="text-orange-500 text-xs font-semibold uppercase tracking-widest">{kicker}</p>
      <h2 className="font-display text-4xl md:text-5xl font-black uppercase text-white leading-tight">
        {parts[0]}
        <span className="text-yellow-400">{highlight}</span>
        {parts[1] ?? ""}
      </h2>
    </div>
  );
}

function RequirementCard({ item }: { item: Requirement }) {
  return (
    <article className="bg-neutral-900 border border-neutral-800 rounded-md p-5">
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <span className="text-yellow-400 text-xs font-mono">{item.id}</span>
        <h4 className="text-white font-semibold">{item.title}</h4>
        <StatusBadge status={item.status} />
      </div>
      <p className="text-neutral-300 text-sm leading-relaxed">{item.rule}</p>
    </article>
  );
}

function RequirementList({ items }: { items: Requirement[] }) {
  if (items.length === 0) {
    return <p className="text-neutral-500 text-sm">Nenhum item neste recorte.</p>;
  }
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <RequirementCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function ImersaoSections({ documentId }: { documentId: string }) {
  if (documentId === "personas") {
    return (
      <section className="space-y-6">
        <SectionTitle kicker="Quem usa" title="Perfis e personas" highlight="personas" />
        <div className="grid md:grid-cols-2 gap-6">
          {PERSONAS.map((persona) => (
            <article
              key={persona.id}
              className="bg-neutral-900 border border-neutral-800 rounded-md p-6 flex flex-col gap-4"
            >
              <div>
                <p className="text-orange-500 text-xs font-semibold uppercase tracking-widest">
                  {persona.role} · {persona.age}
                </p>
                <h3 className="font-display text-3xl font-black uppercase text-white mt-1">
                  {persona.name}
                </h3>
              </div>
              <p className="text-yellow-400 text-sm italic">“{persona.quote}”</p>
              <p className="text-neutral-300 text-sm leading-relaxed">{persona.bio}</p>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-neutral-500 mb-2">
                  Objetivos
                </p>
                <ul className="text-neutral-050 text-sm space-y-1">
                  {persona.goals.map((goal) => (
                    <li key={goal}>• {goal}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-neutral-500 mb-2">Dores</p>
                <ul className="text-neutral-050 text-sm space-y-1">
                  {persona.pains.map((pain) => (
                    <li key={pain}>• {pain}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (documentId === "jtbd") {
    return (
      <section className="space-y-6">
        <SectionTitle kicker="Trabalho a fazer" title="Jobs to be done" highlight="done" />
        <div className="space-y-8">
          {PERSONAS.map((persona) => (
            <div key={persona.id}>
              <h3 className="text-white font-semibold mb-4">
                {persona.name} <span className="text-neutral-500 font-normal">· {persona.role}</span>
              </h3>
              <div className="space-y-3">
                {persona.jobs.map((job) => (
                  <div
                    key={job.job}
                    className="bg-neutral-900 border border-neutral-800 rounded-md p-5"
                  >
                    <p className="text-neutral-050 text-sm leading-relaxed">{job.job}</p>
                    <p className="text-yellow-400 text-sm mt-2">{job.outcome}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <SectionTitle kicker="O que é" title="Conceito do produto" highlight="produto" />
        <p className="text-white text-lg leading-relaxed max-w-3xl">{PRODUCT_CONCEPT.oneLiner}</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-md p-6 space-y-3">
            <h3 className="text-yellow-400 text-xs font-semibold uppercase tracking-widest">É</h3>
            <ul className="space-y-2 text-neutral-050 text-sm leading-relaxed">
              {PRODUCT_CONCEPT.whatItIs.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-md p-6 space-y-3">
            <h3 className="text-orange-500 text-xs font-semibold uppercase tracking-widest">
              Não é
            </h3>
            <ul className="space-y-2 text-neutral-050 text-sm leading-relaxed">
              {PRODUCT_CONCEPT.whatItIsNot.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-neutral-300 text-sm leading-relaxed border-l-2 border-yellow-400 pl-4">
          {PRODUCT_CONCEPT.revenue}
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {PRODUCT_CONCEPT.surfaces.map((surface) => (
            <div
              key={surface.path}
              className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-5"
            >
              <p className="text-white font-semibold">{surface.name}</p>
              <p className="text-yellow-400 text-xs font-mono mt-1">{surface.path}</p>
              <p className="text-neutral-300 text-sm mt-2">{surface.detail}</p>
            </div>
          ))}
        </div>
      </section>
  );
}

function IdeacaoSections({ documentId }: { documentId: string }) {
  if (documentId === "nao-funcionais") {
    return (
      <section className="space-y-6">
        <SectionTitle kicker="Qualidade" title="Requisitos não funcionais" highlight="funcionais" />
        <p className="text-neutral-300 text-sm leading-relaxed border-l-2 border-yellow-400 pl-4">
          {REQUIREMENT_CRITERION.nonFunctional}
        </p>
        <RequirementList items={NON_FUNCTIONAL} />
      </section>
    );
  }

  if (documentId === "tecnologias") {
    return (
      <section className="space-y-6">
        <SectionTitle kicker="Stack" title="Tecnologias de frente e fundo" highlight="fundo" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-md p-6">
            <h3 className="text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-4">
              Front
            </h3>
            <ul className="space-y-3">
              {TECH_STACK.frontend.map((item) => (
                <li key={item.name}>
                  <p className="text-white text-sm font-semibold">{item.name}</p>
                  <p className="text-neutral-400 text-sm">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-md p-6">
            <h3 className="text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-4">
              Backend
            </h3>
            <ul className="space-y-3">
              {TECH_STACK.backend.map((item) => (
                <li key={item.name}>
                  <p className="text-white text-sm font-semibold">{item.name}</p>
                  <p className="text-neutral-400 text-sm">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-md p-6">
            <h3 className="text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-4">
              Operação
            </h3>
            <ul className="space-y-3 mb-6">
              {TECH_STACK.ops.map((item) => (
                <li key={item.name}>
                  <p className="text-white text-sm font-semibold">{item.name}</p>
                  <p className="text-neutral-400 text-sm">{item.detail}</p>
                </li>
              ))}
            </ul>
            <p className="text-[11px] uppercase tracking-widest text-neutral-500 mb-2">
              Fora de escopo
            </p>
            <ul className="text-neutral-400 text-sm space-y-1">
              {TECH_STACK.outOfScope.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  }

  if (documentId === "design-system") {
    return <DesignSystemDocument />;
  }

  return (
    <section className="space-y-6">
      <SectionTitle kicker="Escopo" title="Requisitos funcionais" highlight="funcionais" />
      <p className="text-neutral-300 text-sm leading-relaxed border-l-2 border-yellow-400 pl-4">
        {REQUIREMENT_CRITERION.functional}
      </p>
      <p className="text-neutral-400 text-sm">
        Status reflete o produto no ar. Legado academia = regra de unidade que não é o modelo
        marketplace.
      </p>
      <div className="space-y-10">
        {FUNCTIONAL_GROUPS.map((group) => (
          <div key={group.id}>
            <h3 className="font-display text-2xl font-black uppercase text-white mb-4">
              {group.title}
            </h3>
            <RequirementList items={group.items} />
          </div>
        ))}
      </div>
    </section>
  );
}

function MelhoriaSections({ documentId }: { documentId: string }) {
  const evolving = requirementsByStatus("parcial");
  const backlog = requirementsByStatus("planejado");
  const legacy = requirementsByStatus("legado", "functional");

  if (documentId === "backlog") {
    return (
      <section className="space-y-6">
        <SectionTitle kicker="Fila" title="Backlog planejado" highlight="planejado" />
        <p className="text-neutral-400 text-sm">Definido em produto, ainda não implementado.</p>
        <RequirementList items={backlog} />
      </section>
    );
  }

  if (documentId === "legado") {
    return (
      <section className="space-y-6">
        <SectionTitle kicker="Aposentar" title="Legado de academia" highlight="academia" />
        <p className="text-neutral-400 text-sm">
          Herança de unidade com catraca. Não é o núcleo do marketplace de personal.
        </p>
        <RequirementList items={legacy} />
      </section>
    );
  }

  if (documentId === "proxima-fatia") {
    return (
      <section className="space-y-6">
        <SectionTitle kicker="Operação" title="Próxima fatia GYMX" highlight="GYMX" />
        <p className="text-neutral-400 text-sm">
          Fora desta documentação de produto. Entram no menu interno quando a operação da
          plataforma existir.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {NEXT_SLICE.map((item) => (
            <div
              key={item.title}
              className="bg-neutral-900 border border-neutral-800 rounded-md p-5"
            >
              <p className="text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-2">
                Em breve
              </p>
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <SectionTitle kicker="Agora" title="Itens em evolução" highlight="evolução" />
      <p className="text-neutral-400 text-sm">
        Já existe no produto, mas ainda não fecha o critério. Próximo ciclo de melhoria.
      </p>
      <RequirementList items={evolving} />
    </section>
  );
}

function phaseSections(phase: DocPhase, documentId: string) {
  if (phase.id === "imersao") return <ImersaoSections documentId={documentId} />;
  if (phase.id === "ideacao") return <IdeacaoSections documentId={documentId} />;
  return <MelhoriaSections documentId={documentId} />;
}

export default function InternalProductPage() {
  const location = useLocation();
  const phase =
    DOC_PHASES.find((item) => location.pathname === item.path) ?? DOC_PHASES[0];
  const documentId = resolvePhaseDocumentId(phase, location.hash);

  return (
    <InternalLayout>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 lg:py-16 pb-16">
        <header className="mb-8">
          <p className="text-orange-500 text-xs font-semibold uppercase tracking-widest mb-4">
            Documentação · {phase.kicker}
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-black uppercase text-white leading-none mb-6">
            {phase.title.split(phase.highlight)[0]}
            <span className="text-yellow-400">{phase.highlight}</span>
            {phase.title.split(phase.highlight)[1] ?? ""}
          </h1>
          <p className="text-neutral-300 text-base max-w-3xl leading-relaxed">{phase.summary}</p>
        </header>

        <DocsPhaseTabs phase={phase} documentId={documentId} />

        <div
          id={`fase-${phase.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${phase.id}`}
        >
          <div key={`${phase.id}-${documentId}`}>{phaseSections(phase, documentId)}</div>
        </div>
      </div>
    </InternalLayout>
  );
}
