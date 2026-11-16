import { useLocation, useNavigate } from "react-router";
import { DOC_PHASES, type DocPhase } from "../../data/productBible";
import { scrollToPageTop } from "../../utils/scroll";

const DOCS_NAV_ID = "docs-phase-nav";

function revealIsolatedDocument() {
  const chrome = document.getElementById(DOCS_NAV_ID);
  if (!chrome) {
    scrollToPageTop();
    return;
  }
  const mobileHeader = window.matchMedia("(min-width: 1024px)").matches ? 0 : 64;
  const top = chrome.getBoundingClientRect().top + window.scrollY - mobileHeader;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

interface DocsPhaseTabsProps {
  phase: DocPhase;
  documentId: string;
}

export function DocsPhaseTabs({ phase, documentId }: DocsPhaseTabsProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const openPhase = (item: DocPhase) => {
    const firstDocument = item.nav[0]?.id;
    if (location.pathname === item.path && location.hash.replace(/^#/, "") === firstDocument) {
      scrollToPageTop();
      return;
    }
    navigate({ pathname: item.path, search: "", hash: firstDocument ?? "" }, { preventScrollReset: true });
    requestAnimationFrame(() => scrollToPageTop());
  };

  const openDocument = (id: string) => {
    if (id !== documentId) {
      navigate({ pathname: phase.path, search: "", hash: id }, { preventScrollReset: true });
    }
    requestAnimationFrame(() => revealIsolatedDocument());
  };

  return (
    <div id={DOCS_NAV_ID} className="mb-8 sticky top-16 lg:top-0 z-20 bg-neutral-950 pt-2">
      <div
        role="tablist"
        aria-label="Fases do projeto"
        className="flex gap-1 overflow-x-auto border-b border-neutral-800 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {DOC_PHASES.map((item) => {
          const selected = item.id === phase.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`fase-${item.id}`}
              id={`tab-${item.id}`}
              onClick={() => openPhase(item)}
              className={`shrink-0 px-4 py-2 text-sm font-medium uppercase tracking-wider rounded-t-md whitespace-nowrap transition-colors ${
                selected
                  ? "text-yellow-400 border-b-2 border-yellow-400 -mb-px"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <nav
        aria-label={`Documentos de ${phase.label}`}
        className="flex flex-wrap gap-2 py-4"
      >
        {phase.nav.map((item) => {
          const selected = item.id === documentId;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => openDocument(item.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${
                selected
                  ? "border border-yellow-400/40 text-yellow-400 bg-yellow-400/10"
                  : "border border-neutral-800 text-neutral-500 bg-transparent hover:border-neutral-600 hover:text-neutral-300"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
