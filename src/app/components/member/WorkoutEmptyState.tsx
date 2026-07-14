import { motion } from "motion/react";
import { ClipboardList, Dumbbell } from "lucide-react";
import type { WorkoutModality } from "../../types/workout";
import { MODALITY_LABELS } from "../../constants/workouts";

interface WorkoutEmptyStateProps {
  pendingRequest: boolean;
  loading: boolean;
  onRequest: (modality: WorkoutModality, notes: string) => void;
}

export function WorkoutEmptyState({
  pendingRequest,
  loading,
  onRequest,
}: WorkoutEmptyStateProps) {
  const handleRequest = () => {
    onRequest("musculacao", "Solicitação de avaliação e prescrição inicial.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-8 text-center"
    >
      <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Dumbbell className="text-yellow-400" size={32} />
      </div>
      <h2 className="font-display text-2xl font-black uppercase text-white mb-2">
        Nenhum treino ativo
      </h2>
      <p className="text-neutral-400 text-sm mb-6 max-w-md mx-auto">
        Você ainda não possui fichas prescritas. Solicite uma avaliação com um
        professor disponível para receber seu plano personalizado.
      </p>

      {pendingRequest ? (
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-md text-sm">
          <ClipboardList size={18} />
          Solicitação enviada — aguardando atribuição pela coordenação
        </div>
      ) : (
        <button
          type="button"
          disabled={loading}
          onClick={handleRequest}
          className="bg-yellow-400 text-yellow-900 px-6 py-3 rounded-md font-bold uppercase text-sm tracking-wider hover:bg-yellow-300 disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Solicitar avaliação / prescrição"}
        </button>
      )}

      <p className="text-neutral-600 text-xs mt-4">
        Modalidade padrão: {MODALITY_LABELS.musculacao}
      </p>
    </motion.div>
  );
}
