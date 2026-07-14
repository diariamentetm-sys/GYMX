import type { WorkoutModality, PrescriptionType } from "../types/workout";

export const DEFAULT_WORKOUT_VALIDITY_DAYS = 45;
export const WORKOUT_EXPIRY_WARNING_DAYS = 7;

export const MODALITY_LABELS: Record<WorkoutModality, string> = {
  musculacao: "Musculação",
  funcional: "Funcional",
  cardio: "Cardio",
  mobilidade: "Mobilidade",
};

export const PRESCRIPTION_TYPE_LABELS: Record<PrescriptionType, string> = {
  manual: "Prescrição manual",
  ia: "Gerado por IA",
  hibrido: "IA + ajuste humano",
};

export const PROGRAM_STATUS_LABELS = {
  ativo: "Ativo",
  expirado: "Expirado",
  arquivado: "Arquivado",
  pendente_aprovacao: "Aguardando aprovação",
} as const;

/** Tempo médio por repetição para estimar duração do exercício (modo guiado). */
export const SECONDS_PER_REP = 3;

/** Duração mínima de execução por série no modo guiado. */
export const MIN_WORK_SET_SECONDS = 20;
