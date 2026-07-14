import type { ParQStatus } from "../types/member";
import type { MemberSubscription } from "../types/subscription";
import type { WorkoutExercise, WorkoutProgram, WorkoutSessionSetInput } from "../types/workout";
import { canAccessGymFeatures } from "./subscriptionCalculations";
import { canAccessWorkoutPrescription } from "./parq";
import {
  MIN_WORK_SET_SECONDS,
  SECONDS_PER_REP,
  WORKOUT_EXPIRY_WARNING_DAYS,
} from "../constants/workouts";

export function canAccessWorkoutArea(
  parQStatus: ParQStatus,
  subscription: MemberSubscription | null
): { canAccess: boolean; parQBlocked: boolean; planBlocked: boolean } {
  const parQBlocked = !canAccessWorkoutPrescription(parQStatus);
  const planBlocked = !canAccessGymFeatures(subscription);

  return {
    canAccess: !parQBlocked && !planBlocked,
    parQBlocked,
    planBlocked,
  };
}

export function getDaysUntilExpiry(validUntil: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(validUntil + "T12:00:00");
  const diff = end.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isWorkoutExpiringSoon(program: WorkoutProgram): boolean {
  if (program.status !== "ativo") return false;
  const days = getDaysUntilExpiry(program.validUntil);
  return days > 0 && days <= WORKOUT_EXPIRY_WARNING_DAYS;
}

export function groupProgramsByModality(programs: WorkoutProgram[]) {
  return programs.reduce<Record<string, WorkoutProgram[]>>((acc, program) => {
    const key = program.modality;
    if (!acc[key]) acc[key] = [];
    acc[key].push(program);
    return acc;
  }, {});
}

export function hasExecutionDivergence(
  prescribed: Pick<WorkoutExercise, "sets" | "reps" | "loadKg">,
  executed: { executedReps?: number; executedLoadKg?: number; skipped: boolean }
): boolean {
  if (executed.skipped) return true;

  const prescribedReps = parseInt(prescribed.reps, 10);
  if (
    executed.executedReps !== undefined &&
    !Number.isNaN(prescribedReps) &&
    executed.executedReps < prescribedReps
  ) {
    return true;
  }

  if (
    prescribed.loadKg !== undefined &&
    executed.executedLoadKg !== undefined &&
    executed.executedLoadKg < prescribed.loadKg * 0.9
  ) {
    return true;
  }

  return false;
}

export function buildSessionSetsFromExercises(
  exercises: WorkoutExercise[]
): WorkoutSessionSetInput[] {
  return exercises.flatMap((exercise) =>
    Array.from({ length: exercise.sets }, (_, index) => ({
      exerciseId: exercise.id,
      setNumber: index + 1,
      prescribedSets: exercise.sets,
      prescribedReps: exercise.reps,
      prescribedLoadKg: exercise.loadKg,
      executedReps: undefined,
      executedLoadKg: exercise.loadKg,
      rpe: undefined,
      skipped: false,
    }))
  );
}

export function calculateAdherenceRate(
  totalSessions: number,
  completedSessions: number
): number {
  if (totalSessions === 0) return 0;
  return Math.round((completedSessions / totalSessions) * 100);
}

export function formatRest(seconds: number): string {
  if (seconds >= 60) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m${secs}s` : `${mins}m`;
  }
  return `${seconds}s`;
}

export type GuidedPhase = "work" | "rest";

export interface GuidedWorkoutStep {
  exercise: WorkoutExercise;
  setNumber: number;
  totalSets: number;
  phase: GuidedPhase;
  durationSeconds: number;
  stepIndex: number;
  nextLabel?: string;
}

export function parseWorkDurationSeconds(reps: string): number {
  const trimmed = reps.trim().toLowerCase();

  const timeMatch = trimmed.match(/^(\d+)\s*s(?:ec(?:ond)?s?)?$/);
  if (timeMatch) return parseInt(timeMatch[1], 10);

  const rangeMatch = trimmed.match(/(\d+)\s*-\s*(\d+)/);
  if (rangeMatch) {
    const avg = (parseInt(rangeMatch[1], 10) + parseInt(rangeMatch[2], 10)) / 2;
    return Math.max(MIN_WORK_SET_SECONDS, Math.round(avg * SECONDS_PER_REP));
  }

  const numMatch = trimmed.match(/(\d+)/);
  if (numMatch) {
    const count = parseInt(numMatch[1], 10);
    return Math.max(MIN_WORK_SET_SECONDS, Math.round(count * SECONDS_PER_REP));
  }

  return 45;
}

export function buildGuidedWorkoutSteps(
  exercises: WorkoutExercise[]
): GuidedWorkoutStep[] {
  const steps: GuidedWorkoutStep[] = [];
  let stepIndex = 0;

  exercises.forEach((exercise, exerciseIndex) => {
    for (let set = 1; set <= exercise.sets; set += 1) {
      const isLastSet = set === exercise.sets;
      const isLastExercise = exerciseIndex === exercises.length - 1;

      steps.push({
        exercise,
        setNumber: set,
        totalSets: exercise.sets,
        phase: "work",
        durationSeconds: parseWorkDurationSeconds(exercise.reps),
        stepIndex: stepIndex++,
        nextLabel: isLastSet && isLastExercise ? undefined : "Descanso",
      });

      if (!isLastSet || !isLastExercise) {
        const nextExercise = !isLastSet ? exercise : exercises[exerciseIndex + 1];
        const nextSet = !isLastSet ? set + 1 : 1;
        steps.push({
          exercise,
          setNumber: set,
          totalSets: exercise.sets,
          phase: "rest",
          durationSeconds: exercise.restSeconds,
          stepIndex: stepIndex++,
          nextLabel: `${nextExercise.name} · Série ${nextSet}`,
        });
      }
    }
  });

  return steps;
}

export function formatCountdown(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
