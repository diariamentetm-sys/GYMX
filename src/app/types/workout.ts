export type WorkoutModality = "musculacao" | "funcional" | "cardio" | "mobilidade";

export type PrescriptionType = "manual" | "ia" | "hibrido";

export type WorkoutProgramStatus =
  | "ativo"
  | "expirado"
  | "arquivado"
  | "pendente_aprovacao";

export type WorkoutSessionStatus = "em_andamento" | "concluido" | "parcial";

export type WorkoutRequestStatus = "pendente" | "atribuido" | "concluido";

export interface GymTrainer {
  id: string;
  fullName: string;
  cref: string;
  email: string;
  photoUrl?: string;
  specialties: string[];
}

export interface WorkoutExercise {
  id: string;
  programId: string;
  sortOrder: number;
  name: string;
  sets: number;
  reps: string;
  loadKg?: number;
  restSeconds: number;
  notes?: string;
  videoUrl?: string;
}

export interface WorkoutProgram {
  id: string;
  memberId: string;
  trainerId: string;
  supervisorTrainerId?: string;
  originalAuthorId?: string;
  approvedBy?: string;
  modality: WorkoutModality;
  objective: string;
  label: string;
  division: string;
  prescriptionType: PrescriptionType;
  status: WorkoutProgramStatus;
  versionNumber: number;
  parentProgramId?: string;
  validFrom: string;
  validUntil: string;
  cycleWeeks: number;
  aiGenerated: boolean;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  trainer?: GymTrainer;
  supervisor?: GymTrainer;
  exercises?: WorkoutExercise[];
  adherenceRate?: number;
  daysUntilExpiry?: number;
}

export interface WorkoutProgramEdit {
  id: string;
  programId: string;
  editorTrainerId: string;
  originalAuthorId?: string;
  editType: "criacao" | "edicao" | "aprovacao_ia";
  notes?: string;
  createdAt: string;
  editor?: GymTrainer;
}

export interface WorkoutSessionSetInput {
  exerciseId: string;
  setNumber: number;
  prescribedSets: number;
  prescribedReps: string;
  prescribedLoadKg?: number;
  executedReps?: number;
  executedLoadKg?: number;
  rpe?: number;
  skipped: boolean;
}

export interface WorkoutSession {
  id: string;
  memberId: string;
  programId: string;
  trainerId: string;
  startedAt: string;
  completedAt?: string;
  status: WorkoutSessionStatus;
  feedbackPain?: string;
  wearableHrAvg?: number;
  wearableCalories?: number;
  program?: WorkoutProgram;
}

export interface WorkoutRequest {
  id: string;
  memberId: string;
  modality: WorkoutModality;
  notes?: string;
  status: WorkoutRequestStatus;
  assignedTrainerId?: string;
  createdAt: string;
}

export interface WorkoutAccessState {
  canAccess: boolean;
  parQBlocked: boolean;
  planBlocked: boolean;
  parQStatus: string;
}
