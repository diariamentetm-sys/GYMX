import { FormEvent, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { TrainerVideoUrlFields } from "../components/dashboard/TrainerVideoUrlFields";
import { FormInput } from "../components/FormInput";
import { getStaffMember } from "../services/staffService";
import {
  fetchStaffExerciseLibrary,
  fetchStaffMemberProgram,
  findExerciseById,
  saveStaffExercise,
  type StaffExerciseLibraryItem,
} from "../services/staffWorkoutService";
import type { WorkoutExercise } from "../types/workout";
import { isHttpVideoUrl, normalizeTrainerVideoUrl } from "../utils/video";

export default function StudentExerciseDetailPage() {
  const { id, exerciseId } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<WorkoutExercise | null>(null);
  const [memberName, setMemberName] = useState("");
  const [library, setLibrary] = useState<StaffExerciseLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("10");
  const [loadKg, setLoadKg] = useState("");
  const [rest, setRest] = useState("60");
  const [notes, setNotes] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedLibraryId, setSelectedLibraryId] = useState("");

  const load = useCallback(async () => {
    if (!id || !exerciseId) return;
    setError("");
    const [memberResult, program, libraryItems] = await Promise.all([
      getStaffMember(id),
      fetchStaffMemberProgram(id),
      fetchStaffExerciseLibrary(),
    ]);
    setMemberName(memberResult.member?.fullName ?? "Aluno");
    setLibrary(libraryItems);
    const current = findExerciseById(program?.exercises, exerciseId);
    if (!current || !program) {
      setExercise(null);
      setLoading(false);
      return;
    }
    setExercise(current);
    setName(current.name);
    setSets(String(current.sets));
    setReps(current.reps);
    setLoadKg(current.loadKg != null ? String(current.loadKg) : "");
    setRest(String(current.restSeconds));
    setNotes(current.notes ?? "");
    const stored = isHttpVideoUrl(current.videoRef) ? current.videoRef ?? "" : "";
    setVideoUrl(stored);
    const match = libraryItems.find(
      (item) => item.videoUrl === stored || item.name.toLowerCase() === current.name.toLowerCase()
    );
    setSelectedLibraryId(match?.id ?? "");
    setLoading(false);
  }, [exerciseId, id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!exercise) return;
    setSaving(true);
    setError("");
    setMessage("");

    const normalized = normalizeTrainerVideoUrl(videoUrl);
    if (normalized.error) {
      setSaving(false);
      setError(normalized.error);
      return;
    }

    const result = await saveStaffExercise({
      programId: exercise.programId,
      exerciseId: exercise.id,
      name,
      sets: Number(sets) || 3,
      reps,
      loadKg: loadKg ? Number(loadKg) : undefined,
      restSeconds: Number(rest) || 60,
      notes,
      videoUrl: normalized.url ?? null,
    });
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setMessage("URL salva nesta ficha. O aluno já vê este vídeo em Meu Treino.");
    await load();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-neutral-950 flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-8">
          <p className="text-neutral-400">Exercício não encontrado nesta ficha.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <div className="bg-neutral-900 border-b border-neutral-800 px-6 lg:px-8 py-4">
          <div className="max-w-[900px] mx-auto">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/alunos/${id}/treino`)}
              className="flex items-center gap-2 text-neutral-400 hover:text-yellow-400 text-sm font-semibold uppercase tracking-wide"
            >
              <ArrowLeft size={16} />
              Voltar à lista
            </button>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <div className="max-w-[900px] mx-auto space-y-6">
            <div>
              <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wider">
                Detalhe do exercício · {memberName}
              </p>
              <h1 className="font-display text-3xl font-black uppercase text-white">
                {exercise.name}
              </h1>
              <p className="text-neutral-500 text-sm">
                A URL que você colar aqui é a videoaula que o aluno assiste neste movimento.
              </p>
            </div>

            {error ? <p className="text-orange-500 text-sm">{error}</p> : null}
            {message ? <p className="text-green-400 text-sm">{message}</p> : null}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Nome"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
                <FormInput
                  label="Séries"
                  type="number"
                  min={1}
                  value={sets}
                  onChange={(event) => setSets(event.target.value)}
                />
                <FormInput
                  label="Repetições"
                  value={reps}
                  onChange={(event) => setReps(event.target.value)}
                />
                <FormInput
                  label="Carga (kg)"
                  type="number"
                  min={0}
                  step="0.5"
                  value={loadKg}
                  onChange={(event) => setLoadKg(event.target.value)}
                />
                <FormInput
                  label="Descanso (segundos)"
                  type="number"
                  min={0}
                  value={rest}
                  onChange={(event) => setRest(event.target.value)}
                />
              </div>

              <TrainerVideoUrlFields
                library={library}
                selectedLibraryId={selectedLibraryId}
                videoUrl={videoUrl}
                previewTitle={name || exercise.name}
                onSelectLibrary={(item) => {
                  if (!item) {
                    setSelectedLibraryId("");
                    return;
                  }
                  setSelectedLibraryId(item.id);
                  setVideoUrl(item.videoUrl);
                }}
                onVideoUrlChange={(value) => {
                  setVideoUrl(value);
                  setSelectedLibraryId("");
                }}
              />

              <FormInput
                label="Observação para o aluno"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Ex.: manter o quadril alinhado"
              />

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 rounded-md font-bold text-sm uppercase tracking-wide disabled:opacity-60"
              >
                {saving ? "Salvando..." : "Salvar exercício e URL"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
