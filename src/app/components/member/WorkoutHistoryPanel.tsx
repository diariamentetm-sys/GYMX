import { motion } from "motion/react";
import { History, TrendingUp } from "lucide-react";
import type { WorkoutProgram } from "../../types/workout";
import { MODALITY_LABELS, PROGRAM_STATUS_LABELS } from "../../constants/workouts";
import { formatDateBR } from "../../utils/subscriptionCalculations";
import { TrainerCard } from "./TrainerCard";

interface WorkoutHistoryPanelProps {
  programs: WorkoutProgram[];
  loading: boolean;
}

export function WorkoutHistoryPanel({ programs, loading }: WorkoutHistoryPanelProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500 text-sm">
        <History className="mx-auto mb-3 opacity-50" size={32} />
        Nenhum treino anterior registrado.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {programs.map((program) => (
        <motion.div
          key={program.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="text-white font-bold uppercase text-sm">
                {program.label} (v{program.versionNumber})
              </h3>
              <p className="text-neutral-400 text-sm">{program.division}</p>
              <p className="text-neutral-500 text-xs mt-1">
                {MODALITY_LABELS[program.modality]} ·{" "}
                {PROGRAM_STATUS_LABELS[program.status]}
              </p>
            </div>
            <div className="text-right">
              <p className="text-neutral-500 text-xs">Vigência</p>
              <p className="text-neutral-300 text-sm">
                {formatDateBR(program.validFrom)} — {formatDateBR(program.validUntil)}
              </p>
              {program.adherenceRate !== undefined && (
                <p className="text-green-400 text-xs mt-1 flex items-center justify-end gap-1">
                  <TrendingUp size={12} />
                  Aderência: {program.adherenceRate}%
                </p>
              )}
            </div>
          </div>

          <TrainerCard
            trainer={program.trainer}
            supervisor={program.supervisor}
            prescriptionType={program.prescriptionType}
            aiGenerated={program.aiGenerated}
            compact
          />
        </motion.div>
      ))}
    </div>
  );
}
