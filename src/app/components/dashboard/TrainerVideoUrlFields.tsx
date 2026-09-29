import { FormInput } from "../FormInput";
import { ExerciseVideoPlayer } from "../member/ExerciseVideoPlayer";
import type { StaffExerciseLibraryItem } from "../../services/staffWorkoutService";
import { normalizeTrainerVideoUrl } from "../../utils/video";

interface TrainerVideoUrlFieldsProps {
  library: StaffExerciseLibraryItem[];
  selectedLibraryId: string;
  videoUrl: string;
  previewTitle: string;
  onSelectLibrary: (item: StaffExerciseLibraryItem | null) => void;
  onVideoUrlChange: (value: string) => void;
}

export function TrainerVideoUrlFields({
  library,
  selectedLibraryId,
  videoUrl,
  previewTitle,
  onSelectLibrary,
  onVideoUrlChange,
}: TrainerVideoUrlFieldsProps) {
  const normalized = normalizeTrainerVideoUrl(videoUrl);
  const previewUrl = normalized.url;

  return (
    <div className="space-y-3">
      {library.length > 0 ? (
        <div className="space-y-2">
          <label className="block text-neutral-300 text-xs font-semibold uppercase tracking-[0.1em]">
            Reutilizar da sua biblioteca
          </label>
          <select
            value={selectedLibraryId}
            onChange={(event) => {
              const item = library.find((entry) => entry.id === event.target.value) ?? null;
              onSelectLibrary(item);
            }}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-4 py-3.5 text-white focus:border-yellow-400 focus:outline-none"
          >
            <option value="">Nova URL</option>
            {library.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <FormInput
        label="URL da sua videoaula"
        type="text"
        inputMode="url"
        value={videoUrl}
        onChange={(event) => onVideoUrlChange(event.target.value)}
        placeholder="https://www.youtube.com/watch?v=... ou Vimeo/Loom"
        error={videoUrl.trim().length > 12 ? normalized.error : undefined}
      />
      <p className="text-neutral-500 text-xs">
        Cole o link do vídeo que você gravou ou hospeda (YouTube, Vimeo ou Loom).
        Esse link fica nesta ficha e aparece em Meu Treino para o aluno.
      </p>

      {previewUrl ? (
        <ExerciseVideoPlayer url={previewUrl} title={previewTitle || "Prévia do movimento"} />
      ) : null}
    </div>
  );
}
