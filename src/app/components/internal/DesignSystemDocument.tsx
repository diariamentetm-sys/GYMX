import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import { Play, Shield } from "lucide-react";
import { BrandMark } from "../BrandMark";
import { LoadingSpinner } from "../LoadingSpinner";
import {
  DESIGN_SYSTEM,
  DESIGN_SYSTEM_LAYER_PARAM,
  resolveDesignSystemLayer,
  type DesignSystemElement,
} from "../../data/productBible";
import { INTERNAL_IDEACAO_PATH } from "../../constants/internal";
import { ComponentLibraryDocument } from "./ComponentLibraryDocument";

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
    <div className="mb-6 space-y-3">
      <p className="text-orange-500 text-xs font-semibold uppercase tracking-widest">{kicker}</p>
      <h2 className="font-display text-4xl md:text-5xl font-black uppercase text-white leading-tight">
        {parts[0]}
        <span className="text-yellow-400">{highlight}</span>
        {parts[1] ?? ""}
      </h2>
    </div>
  );
}

function ItemList({ items }: { items: DesignSystemElement["items"] }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {items.map((item) => (
        <article
          key={item.title}
          className="bg-neutral-900 border border-neutral-800 rounded-md p-5"
        >
          <h3 className="text-white font-semibold mb-2">{item.title}</h3>
          <p className="text-neutral-400 text-sm leading-relaxed">{item.detail}</p>
        </article>
      ))}
    </div>
  );
}

function LayerTag({
  element,
  selected,
  onSelect,
}: {
  element: DesignSystemElement;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(element.id)}
      className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${
        selected
          ? "border border-yellow-400/40 text-yellow-400 bg-yellow-400/10"
          : "border border-neutral-800 text-neutral-500 bg-transparent hover:border-neutral-600 hover:text-neutral-300"
      }`}
    >
      {element.label}
    </button>
  );
}

function MapNode({
  element,
  onSelect,
  featured = false,
}: {
  element: DesignSystemElement;
  onSelect: (id: string) => void;
  featured?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(element.id)}
      className={`w-full text-left rounded-md p-4 transition-colors ${
        featured
          ? "bg-yellow-400/10 border border-yellow-400/40 hover:border-yellow-400"
          : "bg-neutral-950/60 border border-neutral-700 hover:border-yellow-400/50"
      }`}
    >
      <p
        className={`text-[11px] uppercase tracking-widest mb-1 ${
          featured ? "text-yellow-400" : "text-neutral-500"
        }`}
      >
        {element.kicker}
      </p>
      <p className="text-white font-semibold">{element.label}</p>
      <p className="text-neutral-400 text-sm mt-2 leading-relaxed">{element.summary}</p>
    </button>
  );
}

function DesignSystemMap({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  const byId = (id: string) => DESIGN_SYSTEM.elements.find((item) => item.id === id);

  const design = byId("design-process");
  const assets = byId("design-assets");
  const visual = byId("visual-language");
  const component = byId("component-system");
  const development = byId("development-process");
  const libraries = byId("component-libraries");
  const issues = byId("issue-tracking");
  const content = byId("content-strategy");
  const docs = byId("documentation-system");

  if (
    !design ||
    !assets ||
    !visual ||
    !component ||
    !development ||
    !libraries ||
    !issues ||
    !content ||
    !docs
  ) {
    return null;
  }

  return (
    <div className="rounded-md border border-neutral-700 bg-neutral-900/40 p-4 md:p-8 space-y-4">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
        Interface Design System
      </p>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="rounded-md border border-orange-500/35 bg-orange-500/5 p-4 space-y-3">
          <MapNode element={design} onSelect={onSelect} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <MapNode element={assets} onSelect={onSelect} />
            <MapNode element={visual} onSelect={onSelect} />
          </div>
        </div>

        <div className="flex items-stretch lg:items-center">
          <MapNode element={component} onSelect={onSelect} featured />
        </div>

        <div className="rounded-md border border-neutral-600 bg-neutral-800/40 p-4 space-y-3">
          <MapNode element={development} onSelect={onSelect} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <MapNode element={libraries} onSelect={onSelect} />
            <MapNode element={issues} onSelect={onSelect} />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-md border border-neutral-600 bg-neutral-800/30 p-3">
          <MapNode element={content} onSelect={onSelect} />
        </div>
        <div className="rounded-md border border-neutral-700 bg-neutral-950/40 p-3">
          <MapNode element={docs} onSelect={onSelect} />
        </div>
      </div>
    </div>
  );
}

function VisualLanguageExtras() {
  const layer = DESIGN_SYSTEM.elements.find((item) => item.id === "visual-language");
  const copy = Object.fromEntries((layer?.items ?? []).map((item) => [item.title, item.detail]));

  return (
    <div className="space-y-6">
      <AssetCard title="Cor" detail={copy.Cor ?? ""}>
        <div className="bg-neutral-950 border border-neutral-800 rounded-md p-5 space-y-4">
          <SpecimenLabel>Como as cores se encontram na tela</SpecimenLabel>
          <p className="text-orange-500 text-[11px] font-semibold uppercase tracking-widest">
            Personais
          </p>
          <p className="font-display text-3xl uppercase text-white leading-none">
            Escolha quem vai <span className="text-yellow-400">treinar você</span>
          </p>
          <p className="text-neutral-050 text-sm leading-relaxed max-w-xl">
            Kicker em orange-500. Headline branca com uma palavra em yellow-400. Corpo em
            neutral-050. Preço em orange-500. CTA preenchido em yellow-400.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="bg-yellow-400 text-yellow-900 px-6 py-3 rounded-md font-bold uppercase text-sm tracking-wide"
            >
              Contratar
            </button>
            <span className="text-orange-500 text-sm font-semibold">R$ 180/mês</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {DESIGN_SYSTEM.colors.map((color) => (
            <div key={color.token} className="border border-neutral-800 rounded-md overflow-hidden">
              <div className="h-12" style={{ backgroundColor: color.hex }} />
              <div className="p-2.5 bg-neutral-950">
                <p className="text-white text-[11px] font-mono">{color.token}</p>
                <p className="text-neutral-500 text-[10px] font-mono">{color.hex}</p>
                <p className="text-neutral-400 text-[10px] mt-1">{color.use}</p>
              </div>
            </div>
          ))}
        </div>
      </AssetCard>

      <AssetCard title="Tipo" detail={copy.Tipo ?? ""}>
        <div className="bg-neutral-950 border border-neutral-800 rounded-md p-5 space-y-3">
          <SpecimenLabel>Headline, corpo e label juntos</SpecimenLabel>
          <p className="text-orange-500 text-[11px] font-semibold uppercase tracking-widest">
            Escopo
          </p>
          <p className="font-display text-4xl uppercase text-white leading-none">
            Requisitos <span className="text-yellow-400">funcionais</span>
          </p>
          <p className="font-body text-neutral-300 text-sm leading-relaxed max-w-xl">
            O título é Bebas Neue. Uma palavra em yellow-400 puxa o olho. O parágrafo e a label
            abaixo são Inter — 15px no corpo, 11px na label, caixa alta e tracking amplo.
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
            Label 11px · uppercase
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-md p-5">
            <p className="text-[11px] uppercase tracking-widest text-neutral-500 mb-2">Display</p>
            <p className="font-display text-5xl uppercase text-white leading-none">Bebas Neue</p>
            <p className="text-neutral-500 text-xs mt-3">H1 a H4 e métricas do painel.</p>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 rounded-md p-5">
            <p className="text-[11px] uppercase tracking-widest text-neutral-500 mb-2">Corpo</p>
            <p className="font-body text-lg text-neutral-050">
              Inter — 15px no texto, 11–12px nas labels.
            </p>
            <p className="text-neutral-500 text-xs mt-3">Parágrafo, navegação, botão e campo.</p>
          </div>
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-md p-5 overflow-x-auto">
          <p className="text-[11px] uppercase tracking-widest text-yellow-400 font-semibold mb-1">
            Escala tipográfica
          </p>
          <p className="text-neutral-400 text-sm mb-4 leading-relaxed">
            Cada nível tem tamanho, peso, line-height e letter-spacing fixos. Os valores vêm de
            TYPOGRAPHY e de theme.css.
          </p>
          {DESIGN_SYSTEM.type.levels.map((level) => {
            const isDisplay = level.family === "display";
            return (
              <div
                key={level.token}
                className="border-b border-neutral-800 py-4 last:border-0 last:pb-0"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                  <span className="text-yellow-400 font-mono text-xs">{level.token}</span>
                  <span className="text-neutral-500 font-mono text-[11px]">
                    {level.size} · lh {level.lineHeight} · tracking {level.letterSpacing} · {level.weight}
                  </span>
                  <span className="text-neutral-600 text-[11px]">{level.use}</span>
                </div>
                <p
                  className={isDisplay ? "font-display text-white" : "font-body text-neutral-050"}
                  style={{
                    fontSize: level.size,
                    lineHeight: Number(level.lineHeight),
                    letterSpacing: level.letterSpacing,
                    fontWeight: level.weight,
                    textTransform: isDisplay || level.token === "Label" ? "uppercase" : "none",
                  }}
                >
                  {level.sample}
                </p>
              </div>
            );
          })}
        </div>
      </AssetCard>

      <AssetCard title="Espaço e raio" detail={copy["Espaço e raio"] ?? ""}>
        <div className="bg-neutral-950 border border-neutral-800 rounded-md overflow-hidden">
          <div className="px-5 pt-5">
            <SpecimenLabel>Grade de 8 pontos</SpecimenLabel>
            <p className="text-neutral-400 text-sm mb-4 leading-relaxed">
              Padding, gap e margin sobem na escala 4, 8, 16, 24, 32, 48, 64, 80 e 120.
            </p>
          </div>
          <div
            className="mx-5 mb-5 rounded-md border border-yellow-400/20 p-6"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(229,192,0,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(229,192,0,0.14) 1px, transparent 1px)",
              backgroundSize: "8px 8px",
            }}
          >
            <div className="bg-neutral-900/95 border border-neutral-700 rounded-md p-6 max-w-sm">
              <p className="text-orange-500 text-[11px] font-semibold uppercase tracking-widest mb-2">
                Espaço 16
              </p>
              <p className="font-display text-3xl uppercase text-white leading-none mb-4">Card 24pt</p>
              <p className="text-neutral-300 text-sm mb-6">
                O padding do card é 24px. O espaço entre título e botão é múltiplo de 8.
              </p>
              <button
                type="button"
                className="bg-yellow-400 text-yellow-900 px-6 py-3 rounded-md font-bold uppercase text-sm tracking-wide"
              >
                Contratar
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mb-1">
          {DESIGN_SYSTEM.spacing.map((item) => (
            <div key={item.key} className="text-center">
              <div
                className="bg-yellow-400 rounded-sm mx-auto"
                style={{ width: item.value, height: item.value }}
              />
              <p className="text-neutral-400 text-[11px] mt-2 font-mono">
                {item.key} · {item.value}
              </p>
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-md p-4">
            <SpecimenLabel>Card e botão · 8px</SpecimenLabel>
            <div className="bg-neutral-900 border border-neutral-700 rounded-md p-4 space-y-3">
              <p className="text-white text-sm font-semibold">rounded-md</p>
              <button
                type="button"
                className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-md font-bold uppercase text-xs tracking-wide"
              >
                Entrar
              </button>
            </div>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 rounded-md p-4">
            <SpecimenLabel>Tag · pill</SpecimenLabel>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border border-yellow-400/40 text-yellow-400 bg-yellow-400/10">
                Linguagem visual
              </span>
              <span className="px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border border-neutral-800 text-neutral-500">
                Tipo
              </span>
            </div>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 rounded-md p-4">
            <SpecimenLabel>Imagem · ângulo reto</SpecimenLabel>
            <div className="rounded-none h-20 bg-gradient-to-br from-neutral-700 to-neutral-950 border border-neutral-700" />
          </div>
        </div>
      </AssetCard>

      <AssetCard title="Movimento" detail={copy.Movimento ?? ""}>
        <div className="grid sm:grid-cols-3 gap-4">
          {DESIGN_SYSTEM.motion.map((item) => (
            <div
              key={item.token}
              className="bg-neutral-950 border border-neutral-800 rounded-md p-5"
            >
              <p className="text-white font-mono text-sm">{item.token}</p>
              <p className="text-yellow-400 text-sm mt-1">{item.value}</p>
              <p className="text-neutral-400 text-xs mt-2">{item.use}</p>
            </div>
          ))}
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-md p-5">
          <SpecimenLabel>Hover em 0,2s</SpecimenLabel>
          <button
            type="button"
            className="bg-yellow-400 text-yellow-900 px-8 py-4 rounded-md font-bold uppercase text-sm tracking-wide transition-transform duration-200 hover:scale-105"
          >
            Passe o mouse
          </button>
          <p className="text-neutral-400 text-sm mt-3 leading-relaxed">
            O botão cresce um pouco e volta. A curva é ease-out; a duração é a do token fast.
          </p>
        </div>
      </AssetCard>
    </div>
  );
}

function SpecimenLabel({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-widest mb-3 text-yellow-400">
      {children}
    </p>
  );
}

function AssetCard({
  title,
  detail,
  children,
}: {
  title: string;
  detail: string;
  children: ReactNode;
}) {
  return (
    <article className="bg-neutral-900 border border-neutral-800 rounded-md p-5 md:p-6 space-y-5">
      <div>
        <h3 className="font-display text-3xl md:text-4xl font-black uppercase text-white leading-none mb-3">
          {title}
        </h3>
        <p className="text-neutral-400 text-sm leading-relaxed">{detail}</p>
      </div>
      {children}
    </article>
  );
}

function DesignAssetsExtras() {
  const assets = DESIGN_SYSTEM.elements.find((item) => item.id === "design-assets");
  const copy = Object.fromEntries((assets?.items ?? []).map((item) => [item.title, item.detail]));

  return (
    <div className="space-y-6">
      <AssetCard title="BrandMark" detail={copy.BrandMark ?? ""}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-md p-5">
            <SpecimenLabel>Em linha · landing e header</SpecimenLabel>
            <div className="group min-h-16 flex items-center">
              <BrandMark className="text-4xl" />
            </div>
            <p className="text-neutral-400 text-sm mt-4 leading-relaxed">
              Personal à esquerda, GYMX à direita. Passe o mouse: o núcleo GYMX vai a amarelo.
            </p>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 rounded-md p-5">
            <SpecimenLabel>Empilhada · sidebar</SpecimenLabel>
            <BrandMark stacked className="text-5xl" />
            <p className="text-neutral-400 text-sm mt-4 leading-relaxed">
              Personal em cima, GYMX embaixo. Cabe na coluna estreita do painel.
            </p>
          </div>
        </div>
      </AssetCard>

      <AssetCard title="Símbolo interno" detail={copy["Símbolo interno"] ?? ""}>
        <div className="bg-neutral-950 border border-neutral-800 rounded-md p-5">
          <SpecimenLabel>Escudo no tile amarelo</SpecimenLabel>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-400 rounded-md flex items-center justify-center shrink-0">
              <Shield className="text-yellow-900" size={24} strokeWidth={2.5} />
            </div>
            <BrandMark className="text-xl" />
          </div>
          <p className="text-neutral-400 text-sm mt-4 leading-relaxed max-w-xl">
            O quadrado yellow-400 com o escudo marca a área /interno. A BrandMark segue ao lado,
            na mesma linha do header da sidebar.
          </p>
        </div>
      </AssetCard>

      <AssetCard title="Swatches" detail={copy.Swatches ?? ""}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {DESIGN_SYSTEM.colors.map((color) => (
            <div key={color.token} className="border border-neutral-800 rounded-md overflow-hidden">
              <div className="h-14" style={{ backgroundColor: color.hex }} />
              <div className="p-3 bg-neutral-950">
                <p className="text-white text-xs font-mono">{color.token}</p>
                <p className="text-neutral-500 text-[11px] font-mono">{color.hex}</p>
                <p className="text-neutral-400 text-[11px] mt-1">{color.use}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-neutral-950 border border-neutral-800 rounded-md p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <SpecimenLabel>Texto sobre o CTA</SpecimenLabel>
            <p className="text-neutral-400 text-sm leading-relaxed">
              No botão preenchido, o texto é yellow-900 — o marrom da paleta, não preto puro.
            </p>
          </div>
          <button
            type="button"
            className="bg-yellow-400 text-yellow-900 px-6 py-3 rounded-md font-bold uppercase text-sm tracking-wide"
          >
            Contratar
          </button>
        </div>
      </AssetCard>

      <AssetCard title="Foto e mídia" detail={copy["Foto e mídia"] ?? ""}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-md p-4">
            <SpecimenLabel>Capa da vitrine</SpecimenLabel>
            <div className="rounded-none overflow-hidden border border-neutral-700">
              <div className="aspect-[4/5] bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-950 flex items-end p-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-orange-500">Personal</p>
                  <p className="font-display text-2xl uppercase text-white leading-none">Equipe GYMX</p>
                </div>
              </div>
            </div>
            <p className="text-neutral-400 text-sm mt-3 leading-relaxed">
              Foto em ângulo reto. Nome e kicker sentam na base da imagem.
            </p>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 rounded-md p-4">
            <SpecimenLabel>Vídeo do profissional</SpecimenLabel>
            <div className="rounded-none overflow-hidden border border-neutral-700 aspect-video bg-neutral-900 flex flex-col">
              <div className="flex-1 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center">
                  <Play className="text-yellow-900 ml-0.5" size={22} fill="currentColor" />
                </div>
              </div>
              <p className="text-[10px] font-mono text-neutral-500 px-3 py-2 border-t border-neutral-800 truncate">
                youtube.com/watch?v=…
              </p>
            </div>
            <p className="text-neutral-400 text-sm mt-3 leading-relaxed">
              O personal cola a URL (YouTube, Vimeo ou Loom). A plataforma só embute o player.
            </p>
          </div>
        </div>
      </AssetCard>
    </div>
  );
}

function ComponentSystemExtras() {
  const layer = DESIGN_SYSTEM.elements.find((item) => item.id === "component-system");
  const copy = Object.fromEntries((layer?.items ?? []).map((item) => [item.title, item.detail]));

  return (
    <div className="space-y-6">
      <p className="text-neutral-300 text-sm leading-relaxed border-l-2 border-yellow-400 pl-4 max-w-3xl">
        Tokens de tipo, grid e cor estão na{" "}
        <span className="text-yellow-400">Linguagem visual</span>. Esta aba mostra como eles viram
        botão, menu e estado.
      </p>

      <AssetCard title="Contrato token → código" detail={copy["Contrato token → código"] ?? ""}>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-md p-5 space-y-3">
            <p className="text-[11px] uppercase tracking-widest text-yellow-400 font-semibold">
              1 · Token
            </p>
            <div className="h-12 rounded-md bg-yellow-400" />
            <p className="text-white font-mono text-xs">yellow-400</p>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Valor nomeado em COLORS. É a cor do CTA, não um hex escolhido na hora.
            </p>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 rounded-md p-5 space-y-3">
            <p className="text-[11px] uppercase tracking-widest text-yellow-400 font-semibold">
              2 · Classe
            </p>
            <p className="text-yellow-400 font-mono text-sm">bg-yellow-400</p>
            <p className="text-yellow-400 font-mono text-sm">text-yellow-900</p>
            <p className="text-yellow-400 font-mono text-sm">rounded-md</p>
            <p className="text-neutral-400 text-sm leading-relaxed">
              A classe Tailwind aponta para o token. O JSX não carrega #E5C000.
            </p>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 rounded-md p-5 space-y-3">
            <p className="text-[11px] uppercase tracking-widest text-yellow-400 font-semibold">
              3 · Componente
            </p>
            <button
              type="button"
              className="bg-yellow-400 text-yellow-900 px-6 py-3 rounded-md font-bold uppercase text-sm tracking-wide"
            >
              Contratar
            </button>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Peça de produto: token, raio, uppercase e estado de hover já resolvidos.
            </p>
          </div>
        </div>
      </AssetCard>

      <AssetCard title="Três forças de botão" detail={copy["Três forças de botão"] ?? ""}>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-md p-5 space-y-4">
            <SpecimenLabel>Primária</SpecimenLabel>
            <button
              type="button"
              className="bg-yellow-400 text-yellow-900 px-6 py-3 rounded-md font-bold uppercase text-sm tracking-wide"
            >
              Contratar
            </button>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Preenchida em yellow-400. É a ação principal do bloco — uma por card ou tela.
            </p>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 rounded-md p-5 space-y-4">
            <SpecimenLabel>Secundária</SpecimenLabel>
            <button
              type="button"
              className="bg-transparent border-2 border-neutral-700 text-white hover:border-yellow-400 hover:text-yellow-400 px-6 py-3 rounded-md font-bold uppercase text-sm tracking-wide transition-colors"
            >
              Entrar
            </button>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Contorno em neutral-700. Serve para a alternativa: entrar, voltar, ver depois.
            </p>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 rounded-md p-5 space-y-4">
            <SpecimenLabel>Terciária</SpecimenLabel>
            <button
              type="button"
              className="text-neutral-300 hover:text-yellow-400 text-sm font-semibold uppercase tracking-wider transition-colors"
            >
              Ver detalhes
            </button>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Só texto Inter. Para ação leve, que não compete com o CTA.
            </p>
          </div>
        </div>
      </AssetCard>

      <AssetCard title="Três forças de menu" detail={copy["Três forças de menu"] ?? ""}>
        <div className="space-y-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-md p-5">
            <SpecimenLabel>Primário · header e sidebar</SpecimenLabel>
            <div className="flex flex-wrap items-center gap-6 border-b border-neutral-800 pb-4">
              {["Início", "Como funciona", "Personais", "FAQ"].map((label, index) => (
                <span
                  key={label}
                  className={`font-body text-sm font-medium uppercase tracking-wider ${
                    index === 0 ? "text-yellow-400" : "text-neutral-050"
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
            <p className="text-neutral-400 text-sm mt-3 leading-relaxed">
              Links de destino do produto. Inter uppercase, tracking amplo. O item ativo fica em
              yellow-400.
            </p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-md p-5">
            <SpecimenLabel>Secundário · tab underline</SpecimenLabel>
            <div className="flex gap-1 overflow-x-auto border-b border-neutral-800 [scrollbar-width:none]">
              {["Imersão · definição", "Ideação · desenvolvimento", "Melhoria contínua"].map(
                (label, index) => (
                  <span
                    key={label}
                    className={`shrink-0 px-4 py-2 text-sm font-medium uppercase tracking-wider rounded-t-md ${
                      index === 1
                        ? "text-yellow-400 border-b-2 border-yellow-400 -mb-px"
                        : "text-neutral-500"
                    }`}
                  >
                    {label}
                  </span>
                ),
              )}
            </div>
            <p className="text-neutral-400 text-sm mt-3 leading-relaxed">
              Seções no mesmo contexto — fases do projeto, abas de um painel. O ativo ganha texto
              amarelo e uma linha de 2px embaixo.
            </p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-md p-5">
            <SpecimenLabel>Terciário · tag pill</SpecimenLabel>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border border-yellow-400/40 text-yellow-400 bg-yellow-400/10">
                Design system
              </span>
              <span className="px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border border-neutral-800 text-neutral-500">
                Requisitos funcionais
              </span>
              <span className="px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border border-neutral-800 text-neutral-500">
                Tecnologias
              </span>
            </div>
            <p className="text-neutral-400 text-sm mt-3 leading-relaxed">
              Documento, filtro ou camada. Pill de 11px, tracking amplo. A selecionada usa borda e
              texto yellow-400.
            </p>
          </div>
        </div>
      </AssetCard>

      <AssetCard title="Anatomia estável" detail={copy["Anatomia estável"] ?? ""}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-neutral-950 border border-dashed border-neutral-700 rounded-md p-5 min-h-36 flex flex-col justify-center">
            <p className="text-[11px] uppercase tracking-widest text-yellow-400 font-semibold mb-2">
              Vazio
            </p>
            <p className="font-display text-2xl uppercase text-white leading-none mb-2">
              Nenhum aluno
            </p>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Título claro e um caminho para o próximo passo.
            </p>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 rounded-md p-5 min-h-36 flex flex-col items-center justify-center gap-3">
            <p className="text-[11px] uppercase tracking-widest text-yellow-400 font-semibold">
              Loading
            </p>
            <LoadingSpinner size="sm" />
            <p className="text-neutral-400 text-sm text-center leading-relaxed">
              Spinner yellow-400 enquanto o dado chega.
            </p>
          </div>
          <div className="bg-neutral-950 border border-orange-500/40 rounded-md p-5 min-h-36 flex flex-col justify-center">
            <p className="text-[11px] uppercase tracking-widest text-orange-500 font-semibold mb-2">
              Erro
            </p>
            <p className="text-white text-sm font-semibold mb-1">Não foi possível carregar</p>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Kicker e borda em orange-500, com mensagem objetiva.
            </p>
          </div>
          <div className="bg-neutral-950 border border-neutral-800 rounded-md p-5 min-h-36">
            <p className="text-[11px] uppercase tracking-widest text-yellow-400 font-semibold mb-3">
              Focus
            </p>
            <label className="block text-neutral-300 text-[11px] font-semibold uppercase tracking-[0.08em] mb-2">
              E-mail
            </label>
            <input
              readOnly
              value="equipe@gymx.app"
              className="w-full bg-neutral-900 border border-yellow-400 ring-1 ring-yellow-400 rounded-md px-3 py-2.5 text-neutral-050 text-sm"
            />
            <p className="text-neutral-400 text-sm mt-2 leading-relaxed">
              Campo ativo com borda e anel yellow-400.
            </p>
          </div>
        </div>
      </AssetCard>
    </div>
  );
}

export function DesignSystemDocument() {
  const location = useLocation();
  const navigate = useNavigate();
  const layer = resolveDesignSystemLayer(location.search);
  const isMap = layer.id === "interface";

  const openLayer = (id: string) => {
    const params = new URLSearchParams();
    if (id !== "interface") params.set(DESIGN_SYSTEM_LAYER_PARAM, id);
    const search = params.toString();
    navigate(
      {
        pathname: INTERNAL_IDEACAO_PATH,
        search: search ? `?${search}` : "",
        hash: "design-system",
      },
      { preventScrollReset: true },
    );
  };

  return (
    <section className="space-y-6">
      <SectionTitle
        kicker={DESIGN_SYSTEM.name}
        title={`Design System ${DESIGN_SYSTEM.version}`}
        highlight="System"
      />
      <p className="text-neutral-300 text-sm leading-relaxed border-l-2 border-yellow-400 pl-4 max-w-3xl">
        {DESIGN_SYSTEM.model}
      </p>

      <nav
        aria-label="Camadas do design system"
        className="flex flex-wrap gap-2"
      >
        {DESIGN_SYSTEM.elements.map((element) => (
          <LayerTag
            key={element.id}
            element={element}
            selected={element.id === layer.id}
            onSelect={openLayer}
          />
        ))}
      </nav>

      {isMap ? (
        <DesignSystemMap onSelect={openLayer} />
      ) : (
        <div className="space-y-6">
          <SectionTitle
            kicker={layer.kicker}
            title={layer.title}
            highlight={layer.highlight}
          />
          <p className="text-neutral-400 text-sm leading-relaxed max-w-3xl">{layer.summary}</p>
          {layer.id === "design-assets" ? (
            <DesignAssetsExtras />
          ) : layer.id === "visual-language" ? (
            <VisualLanguageExtras />
          ) : layer.id === "component-system" ? (
            <ComponentSystemExtras />
          ) : layer.id === "component-libraries" ? (
            <ComponentLibraryDocument />
          ) : (
            <ItemList items={layer.items} />
          )}
        </div>
      )}
    </section>
  );
}
