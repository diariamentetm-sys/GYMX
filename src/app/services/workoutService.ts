import { resolveExerciseVideoUrl } from "../constants/exerciseVideos";
import { supabase } from "../lib/supabase";
import type {
  GymTrainer,
  WorkoutExercise,
  WorkoutModality,
  WorkoutProgram,
  WorkoutProgramEdit,
  WorkoutRequest,
  WorkoutSession,
  WorkoutSessionSetInput,
} from "../types/workout";
import {
  calculateAdherenceRate,
  getDaysUntilExpiry,
  hasExecutionDivergence,
} from "../utils/workoutCalculations";

interface TrainerRow {
  id: string;
  full_name: string;
  cref: string;
  email: string;
  photo_url: string | null;
  specialties: string[];
}

interface ProgramRow {
  id: string;
  member_id: string;
  trainer_id: string;
  supervisor_trainer_id: string | null;
  original_author_id: string | null;
  approved_by: string | null;
  modality: WorkoutModality;
  objective: string;
  label: string;
  division: string;
  prescription_type: WorkoutProgram["prescriptionType"];
  status: WorkoutProgram["status"];
  version_number: number;
  parent_program_id: string | null;
  valid_from: string;
  valid_until: string;
  cycle_weeks: number;
  ai_generated: boolean;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  gym_trainers: TrainerRow | null;
  supervisor: TrainerRow | null;
}

interface ExerciseRow {
  id: string;
  program_id: string;
  sort_order: number;
  name: string;
  sets: number;
  reps: string;
  load_kg: number | null;
  rest_seconds: number;
  notes: string | null;
  video_url: string | null;
}

function mapTrainer(row: TrainerRow | null | undefined): GymTrainer | undefined {
  if (!row) return undefined;
  return {
    id: row.id,
    fullName: row.full_name,
    cref: row.cref,
    email: row.email,
    photoUrl: row.photo_url ?? undefined,
    specialties: row.specialties ?? [],
  };
}

function mapExercise(row: ExerciseRow): WorkoutExercise {
  return {
    id: row.id,
    programId: row.program_id,
    sortOrder: row.sort_order,
    name: row.name,
    sets: row.sets,
    reps: row.reps,
    loadKg: row.load_kg !== null ? Number(row.load_kg) : undefined,
    restSeconds: row.rest_seconds,
    notes: row.notes ?? undefined,
    videoUrl: resolveExerciseVideoUrl(row.name, row.video_url ?? undefined),
  };
}

function mapProgram(row: ProgramRow, exercises?: WorkoutExercise[]): WorkoutProgram {
  return {
    id: row.id,
    memberId: row.member_id,
    trainerId: row.trainer_id,
    supervisorTrainerId: row.supervisor_trainer_id ?? undefined,
    originalAuthorId: row.original_author_id ?? undefined,
    approvedBy: row.approved_by ?? undefined,
    modality: row.modality,
    objective: row.objective,
    label: row.label,
    division: row.division,
    prescriptionType: row.prescription_type,
    status: row.status,
    versionNumber: row.version_number,
    parentProgramId: row.parent_program_id ?? undefined,
    validFrom: row.valid_from,
    validUntil: row.valid_until,
    cycleWeeks: row.cycle_weeks,
    aiGenerated: row.ai_generated,
    approvedAt: row.approved_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    trainer: mapTrainer(row.gym_trainers),
    supervisor: mapTrainer(row.supervisor),
    exercises,
    daysUntilExpiry: getDaysUntilExpiry(row.valid_until),
  };
}

const programSelect = `
  *,
  gym_trainers:trainer_id (id, full_name, cref, email, photo_url, specialties),
  supervisor:supervisor_trainer_id (id, full_name, cref, email, photo_url, specialties)
`;

export async function fetchActiveWorkoutPrograms(
  memberId: string
): Promise<WorkoutProgram[]> {
  const { data, error } = await supabase
    .from("member_workout_programs")
    .select(programSelect)
    .eq("member_id", memberId)
    .eq("status", "ativo")
    .order("modality")
    .order("label");

  if (error || !data) return [];

  const programs = data as ProgramRow[];
  const programIds = programs.map((p) => p.id);

  if (programIds.length === 0) return [];

  const { data: exercises } = await supabase
    .from("member_workout_exercises")
    .select("*")
    .in("program_id", programIds)
    .order("sort_order");

  const exerciseMap = ((exercises ?? []) as ExerciseRow[]).reduce<
    Record<string, WorkoutExercise[]>
  >((acc, row) => {
    if (!acc[row.program_id]) acc[row.program_id] = [];
    acc[row.program_id].push(mapExercise(row));
    return acc;
  }, {});

  return programs.map((row) => mapProgram(row, exerciseMap[row.id] ?? []));
}

export async function fetchWorkoutProgramById(
  programId: string
): Promise<WorkoutProgram | null> {
  const { data, error } = await supabase
    .from("member_workout_programs")
    .select(programSelect)
    .eq("id", programId)
    .maybeSingle();

  if (error || !data) return null;

  const { data: exercises } = await supabase
    .from("member_workout_exercises")
    .select("*")
    .eq("program_id", programId)
    .order("sort_order");

  return mapProgram(
    data as ProgramRow,
    ((exercises ?? []) as ExerciseRow[]).map(mapExercise)
  );
}

export async function fetchWorkoutHistory(
  memberId: string
): Promise<WorkoutProgram[]> {
  const { data, error } = await supabase
    .from("member_workout_programs")
    .select(programSelect)
    .eq("member_id", memberId)
    .in("status", ["expirado", "arquivado"])
    .order("valid_until", { ascending: false });

  if (error || !data) return [];

  const programs = data as ProgramRow[];

  const adherenceMap = await fetchAdherenceByProgram(
    memberId,
    programs.map((p) => p.id)
  );

  return programs.map((row) => ({
    ...mapProgram(row),
    adherenceRate: adherenceMap[row.id] ?? 0,
  }));
}

async function fetchAdherenceByProgram(
  memberId: string,
  programIds: string[]
): Promise<Record<string, number>> {
  if (programIds.length === 0) return {};

  const { data } = await supabase
    .from("member_workout_sessions")
    .select("program_id, status")
    .eq("member_id", memberId)
    .in("program_id", programIds);

  if (!data) return {};

  const stats = data.reduce<Record<string, { total: number; done: number }>>(
    (acc, row) => {
      const id = row.program_id as string;
      if (!acc[id]) acc[id] = { total: 0, done: 0 };
      acc[id].total += 1;
      if (row.status === "concluido") acc[id].done += 1;
      return acc;
    },
    {}
  );

  return Object.fromEntries(
    Object.entries(stats).map(([id, { total, done }]) => [
      id,
      calculateAdherenceRate(total, done),
    ])
  );
}

export async function fetchProgramEditHistory(
  programId: string
): Promise<WorkoutProgramEdit[]> {
  const { data, error } = await supabase
    .from("workout_program_edits")
    .select(
      `*, editor:editor_trainer_id (id, full_name, cref, email, photo_url, specialties)`
    )
    .eq("program_id", programId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    programId: row.program_id,
    editorTrainerId: row.editor_trainer_id,
    originalAuthorId: row.original_author_id ?? undefined,
    editType: row.edit_type,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    editor: mapTrainer(row.editor as TrainerRow),
  }));
}

export async function requestWorkoutPrescription(
  memberId: string,
  modality: WorkoutModality,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("member_workout_requests").insert({
    member_id: memberId,
    modality,
    notes: notes?.trim() || null,
    status: "pendente",
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function fetchPendingWorkoutRequest(
  memberId: string
): Promise<WorkoutRequest | null> {
  const { data } = await supabase
    .from("member_workout_requests")
    .select("*")
    .eq("member_id", memberId)
    .eq("status", "pendente")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.id,
    memberId: data.member_id,
    modality: data.modality,
    notes: data.notes ?? undefined,
    status: data.status,
    assignedTrainerId: data.assigned_trainer_id ?? undefined,
    createdAt: data.created_at,
  };
}

export async function startWorkoutSession(
  memberId: string,
  program: WorkoutProgram
): Promise<{ sessionId: string | null; error?: string }> {
  const { data, error } = await supabase
    .from("member_workout_sessions")
    .insert({
      member_id: memberId,
      program_id: program.id,
      trainer_id: program.trainerId,
      status: "em_andamento",
    })
    .select("id")
    .single();

  if (error || !data) return { sessionId: null, error: error?.message };
  return { sessionId: data.id };
}

export async function completeWorkoutSession(
  sessionId: string,
  sets: WorkoutSessionSetInput[],
  feedbackPain?: string
): Promise<{ success: boolean; error?: string }> {
  const rows = sets.map((set) => ({
    session_id: sessionId,
    exercise_id: set.exerciseId,
    set_number: set.setNumber,
    prescribed_sets: set.prescribedSets,
    prescribed_reps: set.prescribedReps,
    prescribed_load_kg: set.prescribedLoadKg ?? null,
    executed_reps: set.executedReps ?? null,
    executed_load_kg: set.executedLoadKg ?? null,
    rpe: set.rpe ?? null,
    skipped: set.skipped,
    divergence_flag: hasExecutionDivergence(
      {
        sets: set.prescribedSets,
        reps: set.prescribedReps,
        loadKg: set.prescribedLoadKg,
      },
      {
        executedReps: set.executedReps,
        executedLoadKg: set.executedLoadKg,
        skipped: set.skipped,
      }
    ),
  }));

  const { error: setsError } = await supabase
    .from("member_workout_session_sets")
    .insert(rows);

  if (setsError) return { success: false, error: setsError.message };

  const allSkipped = sets.every((s) => s.skipped);
  const status = allSkipped ? "parcial" : "concluido";

  const { error: sessionError } = await supabase
    .from("member_workout_sessions")
    .update({
      status,
      completed_at: new Date().toISOString(),
      feedback_pain: feedbackPain?.trim() || null,
    })
    .eq("id", sessionId);

  if (sessionError) return { success: false, error: sessionError.message };
  return { success: true };
}

export async function fetchRecentSessions(
  memberId: string,
  limit = 5
): Promise<WorkoutSession[]> {
  const { data, error } = await supabase
    .from("member_workout_sessions")
    .select(
      `*, program:program_id (id, label, division, modality, trainer_id, gym_trainers:trainer_id (id, full_name, cref, email, photo_url, specialties))`
    )
    .eq("member_id", memberId)
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    memberId: row.member_id,
    programId: row.program_id,
    trainerId: row.trainer_id,
    startedAt: row.started_at,
    completedAt: row.completed_at ?? undefined,
    status: row.status,
    feedbackPain: row.feedback_pain ?? undefined,
    wearableHrAvg: row.wearable_hr_avg ?? undefined,
    wearableCalories: row.wearable_calories ?? undefined,
  }));
}
