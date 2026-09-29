import { supabase } from "../lib/supabase";
import type { WorkoutExercise, WorkoutModality } from "../types/workout";
import { isHttpVideoUrl } from "../utils/video";
import { fetchActiveWorkoutPrograms } from "./workoutService";

const STORAGE_PREFIX = "storage:";
const VIDEO_BUCKET = "exercise-videos";
const MAX_VIDEO_BYTES = 40 * 1024 * 1024;

function rpcError(payload: { success?: boolean; error?: string } | null, fallback: string) {
  if (!payload?.success) {
    return payload?.error ?? fallback;
  }
  return null;
}

export function isStoredWorkoutVideo(ref?: string) {
  return Boolean(ref?.startsWith(STORAGE_PREFIX));
}

export interface StaffExerciseLibraryItem {
  id: string;
  name: string;
  videoUrl: string;
}

export async function fetchStaffExerciseLibrary(): Promise<StaffExerciseLibraryItem[]> {
  const { data, error } = await supabase
    .from("staff_exercise_library")
    .select("id, name, video_url")
    .order("name");

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id as string,
    name: row.name as string,
    videoUrl: row.video_url as string,
  }));
}

async function rememberTrainerVideo(name: string, videoUrl: string) {
  if (!isHttpVideoUrl(videoUrl)) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("staff_exercise_library").upsert(
    {
      staff_id: user.id,
      name: name.trim(),
      video_url: videoUrl.trim(),
    },
    { onConflict: "staff_id,name" }
  );
}

export async function ensureStaffMemberProgram(input: {
  memberId: string;
  label: string;
  division?: string;
  modality?: WorkoutModality;
  objective?: string;
}): Promise<{ programId?: string; error?: string }> {
  const { data, error } = await supabase.rpc("staff_ensure_member_program", {
    p_member_id: input.memberId,
    p_label: input.label,
    p_division: input.division ?? "",
    p_modality: input.modality ?? "musculacao",
    p_objective: input.objective ?? "",
  });

  if (error) {
    return { error: "Não foi possível criar a ficha de treino." };
  }

  const payload = data as { success?: boolean; error?: string; program_id?: string } | null;
  const message = rpcError(payload, "Não foi possível criar a ficha de treino.");
  if (message) return { error: message };
  return { programId: payload?.program_id };
}

export async function saveStaffExercise(input: {
  programId: string;
  name: string;
  exerciseId?: string;
  sets: number;
  reps: string;
  loadKg?: number;
  restSeconds: number;
  notes?: string;
  videoUrl?: string | null;
}): Promise<{ exerciseId?: string; error?: string }> {
  const { data, error } = await supabase.rpc("staff_save_exercise", {
    p_program_id: input.programId,
    p_name: input.name,
    p_exercise_id: input.exerciseId ?? null,
    p_sets: input.sets,
    p_reps: input.reps,
    p_load_kg: input.loadKg ?? null,
    p_rest_seconds: input.restSeconds,
    p_notes: input.notes ?? null,
    p_video_url: input.videoUrl ?? null,
  });

  if (error) {
    return { error: "Não foi possível salvar o exercício." };
  }

  const payload = data as { success?: boolean; error?: string; exercise_id?: string } | null;
  const message = rpcError(payload, "Não foi possível salvar o exercício.");
  if (message) return { error: message };

  if (input.videoUrl) {
    await rememberTrainerVideo(input.name, input.videoUrl);
  }

  return { exerciseId: payload?.exercise_id };
}

export async function deleteStaffExercise(exerciseId: string): Promise<{ error?: string }> {
  const { data, error } = await supabase.rpc("staff_delete_exercise", {
    p_exercise_id: exerciseId,
  });
  if (error) {
    return { error: "Não foi possível remover o exercício." };
  }
  const payload = data as { success?: boolean; error?: string } | null;
  const message = rpcError(payload, "Não foi possível remover o exercício.");
  return message ? { error: message } : {};
}

export async function uploadExerciseVideo(input: {
  memberId: string;
  exerciseId: string;
  file: File;
}): Promise<{ videoRef?: string; error?: string }> {
  if (!input.file.type.startsWith("video/")) {
    return { error: "Envie um arquivo de vídeo (MP4 ou WebM)." };
  }
  if (input.file.size > MAX_VIDEO_BYTES) {
    return { error: "O vídeo deve ter no máximo 40 MB." };
  }

  const extension = input.file.name.split(".").pop()?.toLowerCase() === "webm" ? "webm" : "mp4";
  const path = `${input.memberId}/${input.exerciseId}/${Date.now()}.${extension}`;

  const { error } = await supabase.storage.from(VIDEO_BUCKET).upload(path, input.file, {
    cacheControl: "3600",
    upsert: true,
    contentType: input.file.type,
  });

  if (error) {
    return { error: "Não foi possível enviar a videoaula." };
  }

  return { videoRef: `${STORAGE_PREFIX}${path}` };
}

export async function fetchStaffMemberProgram(memberId: string) {
  const programs = await fetchActiveWorkoutPrograms(memberId);
  return programs[0] ?? null;
}

export function findExerciseById(
  exercises: WorkoutExercise[] | undefined,
  exerciseId: string
) {
  return exercises?.find((item) => item.id === exerciseId) ?? null;
}
