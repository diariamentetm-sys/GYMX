import { FormEvent, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ChevronRight,
  Dumbbell,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { TrainerVideoUrlFields } from "../components/dashboard/TrainerVideoUrlFields";
import { FormInput } from "../components/FormInput";
import { getNameInitials, getStaffMember } from "../services/staffService";
import {
  deleteStaffExercise,
  ensureStaffMemberProgram,
  fetchStaffExerciseLibrary,
  fetchStaffMemberProgram,
  saveStaffExercise,
  type StaffExerciseLibraryItem,
} from "../services/staffWorkoutService";
import type { StaffMemberListItem } from "../types/staff";
import type { WorkoutModality, WorkoutProgram } from "../types/workout";
import { MODALITY_LABELS } from "../constants/workouts";
import { formatRest } from "../utils/workoutCalculations";
import { hasAssignedTrainerVideo, normalizeTrainerVideoUrl } from "../utils/video";

export default function StudentWorkoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState<StaffMemberListItem | null>(null);
  const [program, setProgram] = useState<WorkoutProgram | null>(null);
  const [library, setLibrary] = useState<StaffExerciseLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [label, setLabel] = useState("Treino A");
  const [division, setDivision] = useState("Full body");
  const [modality, setModality] = useState<WorkoutModality>("musculacao");
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("10");
  const [rest, setRest] = useState("60");
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedLibraryId, setSelectedLibraryId] = useState("");

  const load = useCallback(async () => {
    if (!id) return;
    setError("");
    const [memberResult, currentProgram, libraryItems] = await Promise.all([
      getStaffMember(id),
      fetchStaffMemberProgram(id),
      fetchStaffExerciseLibrary(),
    ]);
    if (memberResult.error) setError(memberResult.error);
    setMember(memberResult.member);
    setProgram(currentProgram);
    setLibrary(libraryItems);
    if (currentProgram) {
      setLabel(currentProgram.label);
      setDivision(currentProgram.division);
      setModality(currentProgram.modality);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSaveProgram = async (event: FormEvent) => {
    event.preventDefault();
    if (!id) return;
    setSaving(true);
    setError("");
    const result = await ensureStaffMemberProgram({
      memberId: id,
      label,
      division,
      modality,
    });
    setSaving(false);
    if (result.error || !result.programId) {
      setError(result.error ?? "Não foi possível salvar a ficha.");
      return;
    }
    await load();
  };

  const handleNameChange = (value: string) => {
    setExerciseName(value);
    const match = library.find(
      (item) => item.name.toLowerCase() === value.trim().toLowerCase()
    );
    if (match && !videoUrl.trim()) {
      setVideoUrl(match.videoUrl);
      setSelectedLibraryId(match.id);
    }
  };

  const handleAddExercise = async (event: FormEvent) => {
    event.preventDefault();
    if (!id) return;
    setSaving(true);
    setError("");

    const normalized = normalizeTrainerVideoUrl(videoUrl);
    if (normalized.error) {
      setSaving(false);
      setError(normalized.error);
      return;
    }

    let programId = program?.id;
    if (!programId) {
      const created = await ensureStaffMemberProgram({
        memberId: id,
        label,
        division,
        modality,
      });
      if (created.error || !created.programId) {
        setSaving(false);
        setError(created.error ?? "Crie a ficha antes de adicionar exercícios.");
        return;
      }
      programId = created.programId;
    }

    const saved = await saveStaffExercise({
      programId,
      name: exerciseName,
      sets: Number(sets) || 3,
      reps,
      restSeconds: Number(rest) || 60,
      videoUrl: normalized.url ?? null,
    });
    setSaving(false);

    if (saved.error || !saved.exerciseId) {
      setError(saved.error ?? "Não foi possível adicionar o exercício.");
      return;
    }

    setExerciseName("");
    setVideoUrl("");
    setSelectedLibraryId("");
    await load();
  };

  const handleDelete = async (exerciseId: string) => {
    if (!window.confirm("Remover este exercício da ficha?")) return;
    setSaving(true);
    const result = await deleteStaffExercise(exerciseId);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
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

  if (!member) {
    return (
      <div className="min-h-screen bg-neutral-950 flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-8">
          <p className="text-neutral-400">Aluno não encontrado.</p>
        </main>
      </div>
    );
  }

  const exercises = program?.exercises ?? [];

  return (
    <div className="min-h-screen bg-neutral-950 flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <div className="bg-neutral-900 border-b border-neutral-800 px-6 lg:px-8 py-4">
          <div className="max-w-[1100px] mx-auto">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/alunos/${member.id}`)}
              className="flex items-center gap-2 text-neutral-400 hover:text-yellow-400 text-sm font-semibold uppercase tracking-wide"
            >
              <ArrowLeft size={16} />
              Voltar ao aluno
            </button>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <div className="max-w-[1100px] mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-yellow-900 font-bold">
                  {getNameInitials(member.fullName)}
                </span>
              </div>
              <div>
                <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wider">
                  Prescrição
                </p>
                <h1 className="font-display text-3xl font-black uppercase text-white">
                  Treino de {member.fullName}
                </h1>
                <p className="text-neutral-500 text-sm">
                  Inclua a URL da sua videoaula em cada exercício. O aluno vê exatamente esse vídeo em Meu Treino.
                </p>
              </div>
            </div>

            {error ? <p className="text-orange-500 text-sm">{error}</p> : null}

            <form
              onSubmit={handleSaveProgram}
              className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-6 space-y-4"
            >
              <h2 className="font-display text-xl font-black uppercase text-white">
                Ficha
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="Nome da ficha"
                  value={label}
                  onChange={(event) => setLabel(event.target.value)}
                  required
                />
                <FormInput
                  label="Divisão"
                  value={division}
                  onChange={(event) => setDivision(event.target.value)}
                  placeholder="Ex.: A — Peito e tríceps"
                />
                <div className="space-y-2">
                  <label className="block text-neutral-300 text-xs font-semibold uppercase tracking-[0.1em]">
                    Modalidade
                  </label>
                  <select
                    value={modality}
                    onChange={(event) => setModality(event.target.value as WorkoutModality)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-4 py-3.5 text-white focus:border-yellow-400 focus:outline-none"
                  >
                    {(Object.keys(MODALITY_LABELS) as WorkoutModality[]).map((key) => (
                      <option key={key} value={key}>
                        {MODALITY_LABELS[key]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md font-bold text-sm uppercase tracking-wide disabled:opacity-60"
              >
                {program ? "Atualizar ficha" : "Criar ficha"}
              </button>
            </form>

            <section className="space-y-4">
              <h2 className="font-display text-xl font-black uppercase text-white">
                Lista de exercícios
              </h2>
              {exercises.length === 0 ? (
                <p className="text-neutral-500 text-sm">
                  Nenhum exercício ainda. Adicione o movimento e a URL da sua videoaula — o aluno vê isso no portal.
                </p>
              ) : (
                <div className="space-y-3">
                  {exercises.map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-neutral-900 border border-neutral-700 rounded-md p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/dashboard/alunos/${member.id}/treino/${exercise.id}`)
                        }
                        className="flex-1 text-left flex items-center gap-3 min-w-0"
                      >
                        <div className="w-10 h-10 bg-yellow-400/10 rounded-md flex items-center justify-center shrink-0">
                          {hasAssignedTrainerVideo(exercise) ? (
                            <Video className="text-yellow-400" size={18} />
                          ) : (
                            <Dumbbell className="text-yellow-400" size={18} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-semibold truncate">
                            {index + 1}. {exercise.name}
                          </p>
                          <p className="text-neutral-500 text-xs">
                            {exercise.sets}×{exercise.reps}
                            {exercise.loadKg ? ` · ${exercise.loadKg} kg` : ""} ·{" "}
                            {formatRest(exercise.restSeconds)}
                            {hasAssignedTrainerVideo(exercise)
                              ? " · com videoaula"
                              : " · sem URL"}
                          </p>
                        </div>
                        <ChevronRight className="text-neutral-600 ml-auto shrink-0" size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(exercise.id)}
                        className="px-3 py-2 text-orange-400 hover:bg-neutral-800 rounded-md"
                        aria-label={`Remover ${exercise.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

            <form
              onSubmit={handleAddExercise}
              className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-yellow-400/30 rounded-md p-6 space-y-4"
            >
              <h2 className="font-display text-xl font-black uppercase text-white flex items-center gap-2">
                <Plus size={18} className="text-yellow-400" />
                Novo exercício
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <FormInput
                    label="Exercício"
                    value={exerciseName}
                    onChange={(event) => handleNameChange(event.target.value)}
                    placeholder="Ex.: Agachamento livre"
                    required
                  />
                </div>
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
                previewTitle={exerciseName}
                onSelectLibrary={(item) => {
                  if (!item) {
                    setSelectedLibraryId("");
                    return;
                  }
                  setSelectedLibraryId(item.id);
                  setExerciseName(item.name);
                  setVideoUrl(item.videoUrl);
                }}
                onVideoUrlChange={(value) => {
                  setVideoUrl(value);
                  setSelectedLibraryId("");
                }}
              />

              <button
                type="submit"
                disabled={saving}
                className="px-5 py-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 rounded-md font-bold text-sm uppercase tracking-wide disabled:opacity-60"
              >
                Incluir na ficha do aluno
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
