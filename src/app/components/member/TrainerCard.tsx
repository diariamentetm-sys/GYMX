import { Bot, MessageCircle, User } from "lucide-react";
import type { GymTrainer } from "../../types/workout";
import type { PrescriptionType } from "../../types/workout";
import { PRESCRIPTION_TYPE_LABELS } from "../../constants/workouts";

interface TrainerCardProps {
  trainer?: GymTrainer;
  supervisor?: GymTrainer;
  prescriptionType: PrescriptionType;
  aiGenerated?: boolean;
  compact?: boolean;
}

export function TrainerCard({
  trainer,
  supervisor,
  prescriptionType,
  aiGenerated,
  compact,
}: TrainerCardProps) {
  if (!trainer) return null;

  const initials = trainer.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`bg-neutral-800/50 border border-neutral-700 rounded-md ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-neutral-700 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
          {trainer.photoUrl ? (
            <img
              src={trainer.photoUrl}
              alt={trainer.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-yellow-400 font-bold text-sm">{initials}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm">{trainer.fullName}</p>
          <p className="text-neutral-500 text-xs">CREF {trainer.cref}</p>
          <p className="text-neutral-400 text-xs mt-1 flex items-center gap-1">
            <User size={12} />
            Professor responsável
          </p>
        </div>
        {!compact && (
          <a
            href={`mailto:${trainer.email}?subject=GYMX - Dúvida sobre treino`}
            className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 text-xs font-semibold uppercase shrink-0"
          >
            <MessageCircle size={14} />
            Contato
          </a>
        )}
      </div>

      {(aiGenerated || prescriptionType !== "manual") && (
        <div className="mt-3 pt-3 border-t border-neutral-700 space-y-2">
          <p className="text-xs text-neutral-400 flex items-center gap-1.5">
            <Bot size={14} className="text-blue-400" />
            {PRESCRIPTION_TYPE_LABELS[prescriptionType]}
          </p>
          {supervisor && (
            <p className="text-xs text-neutral-500">
              Supervisor: <span className="text-neutral-300">{supervisor.fullName}</span>{" "}
              (CREF {supervisor.cref})
            </p>
          )}
        </div>
      )}
    </div>
  );
}
