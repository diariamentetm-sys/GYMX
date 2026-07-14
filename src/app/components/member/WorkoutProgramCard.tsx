import { motion } from "motion/react";
import { AlertTriangle, Calendar, ChevronRight, Dumbbell } from "lucide-react";
import type { WorkoutProgram } from "../../types/workout";
import { MODALITY_LABELS, PRESCRIPTION_TYPE_LABELS } from "../../constants/workouts";
import { formatDateBR } from "../../utils/subscriptionCalculations";
import { isWorkoutExpiringSoon } from "../../utils/workoutCalculations";

interface WorkoutProgramCardProps {
  program: WorkoutProgram;
  onOpen: () => void;
}

export function WorkoutProgramCard({ program, onOpen }: WorkoutProgramCardProps) {
  const expiring = isWorkoutExpiringSoon(program);
  const exerciseCount = program.exercises?.length ?? 0;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onOpen}
      className="w-full text-left bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 hover:border-yellow-400/50 rounded-md p-5 transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 bg-yellow-400/10 rounded-md flex items-center justify-center shrink-0">
            <Dumbbell className="text-yellow-400" size={22} />
          </div>
          <div>
            <h3 className="text-white font-bold uppercase text-sm tracking-wide">
              {program.label}
            </h3>
            <p className="text-neutral-400 text-sm">{program.division}</p>
            <p className="text-neutral-500 text-xs mt-1">
              {MODALITY_LABELS[program.modality]} · {exerciseCount} exercícios
            </p>
          </div>
        </div>
        <ChevronRight
          size={20}
          className="text-neutral-600 group-hover:text-yellow-400 transition-colors shrink-0 mt-1"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="bg-neutral-800 text-neutral-300 px-2 py-1 rounded uppercase tracking-wider">
          {PRESCRIPTION_TYPE_LABELS[program.prescriptionType]}
        </span>
        {program.trainer && (
          <span className="text-neutral-500">
            Prof. {program.trainer.fullName.split(" ")[0]}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-neutral-500 flex items-center gap-1">
          <Calendar size={12} />
          Válido até {formatDateBR(program.validUntil)}
        </span>
        {expiring && (
          <span className="text-orange-400 flex items-center gap-1">
            <AlertTriangle size={12} />
            Expira em {program.daysUntilExpiry} dias
          </span>
        )}
      </div>
    </motion.button>
  );
}
