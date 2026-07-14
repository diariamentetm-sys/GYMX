import { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { ExerciseVideoPlayer } from "./ExerciseVideoPlayer";
import type { WorkoutExercise, WorkoutProgram, WorkoutSessionSetInput } from "../../types/workout";
import { buildSessionSetsFromExercises, formatRest } from "../../utils/workoutCalculations";

interface WorkoutExecutionFormProps {
  program: WorkoutProgram;
  loading: boolean;
  onComplete: (sets: WorkoutSessionSetInput[], feedbackPain?: string) => void;
  onCancel: () => void;
}

export function WorkoutExecutionForm({
  program,
  loading,
  onComplete,
  onCancel,
}: WorkoutExecutionFormProps) {
  const exercises = program.exercises ?? [];
  const [sets, setSets] = useState<WorkoutSessionSetInput[]>(() =>
    buildSessionSetsFromExercises(exercises)
  );
  const [feedbackPain, setFeedbackPain] = useState("");

  const updateSet = (
    exerciseId: string,
    setNumber: number,
    patch: Partial<WorkoutSessionSetInput>
  ) => {
    setSets((prev) =>
      prev.map((s) =>
        s.exerciseId === exerciseId && s.setNumber === setNumber
          ? { ...s, ...patch }
          : s
      )
    );
  };

  const handleSubmit = () => {
    onComplete(sets, feedbackPain.trim() || undefined);
  };

  return (
    <div className="space-y-6">
      {exercises.map((exercise) => (
        <ExerciseExecutionBlock
          key={exercise.id}
          exercise={exercise}
          sets={sets.filter((s) => s.exerciseId === exercise.id)}
          onUpdate={(setNumber, patch) => updateSet(exercise.id, setNumber, patch)}
        />
      ))}

      <div className="bg-neutral-900 border border-neutral-700 rounded-md p-4">
        <label className="block text-neutral-400 text-xs uppercase tracking-wider mb-2">
          Dor ou desconforto durante o treino? (opcional)
        </label>
        <textarea
          value={feedbackPain}
          onChange={(e) => setFeedbackPain(e.target.value)}
          rows={3}
          placeholder="Descreva para o professor revisar em até 24h..."
          className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-yellow-400 focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-yellow-400 text-yellow-900 px-6 py-3 rounded-md font-bold uppercase text-sm tracking-wider hover:bg-yellow-300 disabled:opacity-50"
        >
          <CheckCircle2 size={18} />
          {loading ? "Salvando..." : "Finalizar treino"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-md border border-neutral-700 text-neutral-400 text-sm uppercase font-semibold hover:border-neutral-500"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

function ExerciseExecutionBlock({
  exercise,
  sets,
  onUpdate,
}: {
  exercise: WorkoutExercise;
  sets: WorkoutSessionSetInput[];
  onUpdate: (setNumber: number, patch: Partial<WorkoutSessionSetInput>) => void;
}) {
  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-white font-semibold text-sm">{exercise.name}</h4>
          <p className="text-neutral-500 text-xs">
            Prescrito: {exercise.sets}×{exercise.reps}
            {exercise.loadKg ? ` · ${exercise.loadKg}kg` : ""} · descanso{" "}
            {formatRest(exercise.restSeconds)}
          </p>
        </div>
      </div>

      <ExerciseVideoPlayer
        url={exercise.videoUrl}
        title={exercise.name}
        defaultExpanded
      />

      <div className="space-y-2">
        {sets.map((set) => (
          <div
            key={`${set.exerciseId}-${set.setNumber}`}
            className={`grid grid-cols-2 sm:grid-cols-5 gap-2 items-center p-2 rounded ${
              set.skipped ? "bg-orange-500/10 border border-orange-500/20" : "bg-neutral-800/50"
            }`}
          >
            <span className="text-neutral-400 text-xs font-semibold col-span-2 sm:col-span-1">
              Série {set.setNumber}
            </span>
            <input
              type="number"
              min={0}
              placeholder="Reps"
              value={set.executedReps ?? ""}
              disabled={set.skipped}
              onChange={(e) =>
                onUpdate(set.setNumber, {
                  executedReps: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-sm text-white disabled:opacity-40"
            />
            <input
              type="number"
              min={0}
              step={0.5}
              placeholder="Carga kg"
              value={set.executedLoadKg ?? ""}
              disabled={set.skipped}
              onChange={(e) =>
                onUpdate(set.setNumber, {
                  executedLoadKg: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-sm text-white disabled:opacity-40"
            />
            <input
              type="number"
              min={1}
              max={10}
              placeholder="RPE"
              value={set.rpe ?? ""}
              disabled={set.skipped}
              onChange={(e) =>
                onUpdate(set.setNumber, {
                  rpe: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-sm text-white disabled:opacity-40"
            />
            <label className="flex items-center gap-1 text-xs text-neutral-400 cursor-pointer">
              <input
                type="checkbox"
                checked={set.skipped}
                onChange={(e) =>
                  onUpdate(set.setNumber, { skipped: e.target.checked })
                }
                className="accent-orange-500"
              />
              Pular
            </label>
          </div>
        ))}
      </div>

      {sets.some((s) => s.skipped) && (
        <p className="text-orange-400 text-xs mt-2 flex items-center gap-1">
          <AlertTriangle size={12} />
          Divergência será sinalizada ao professor
        </p>
      )}
    </div>
  );
}
