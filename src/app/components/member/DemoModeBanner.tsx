import { LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

export function DemoModeBanner() {
  const navigate = useNavigate();
  const { staffProfile, profile } = useAuth();

  if (!staffProfile) return null;

  return (
    <div className="bg-yellow-400 text-yellow-900 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <p className="text-sm font-semibold">
        Visão demonstrativa do aluno
        {profile?.isDemo ? " · dados de simulação" : ""}
        . O painel administrativo continua disponível.
      </p>
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-yellow-900 text-yellow-400 rounded-md text-xs font-bold uppercase tracking-wide hover:bg-neutral-950"
      >
        <LayoutDashboard size={14} />
        Voltar ao painel
      </button>
    </div>
  );
}
