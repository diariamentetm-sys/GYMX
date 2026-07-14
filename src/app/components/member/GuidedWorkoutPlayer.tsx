import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  Pause,
  Play,
  SkipForward,
  Timer,
  X,
} from "lucide-react";
import type { WorkoutProgram, WorkoutSessionSetInput } from "../../types/workout";
import {
  buildGuidedWorkoutSteps,
  buildSessionSetsFromExercises,
  formatCountdown,
  formatRest,
  type GuidedWorkoutStep,
} from "../../utils/workoutCalculations";
import {
  extractYoutubeVideoId,
  isDirectVideoUrl,
  isYoutubeUrl,
  toYoutubeEmbedUrl,
} from "../../utils/video";

type PlayerStatus = "ready" | "running" | "paused" | "finished";

interface GuidedWorkoutPlayerProps {
  program: WorkoutProgram;
  loading: boolean;
  autoStart?: boolean;
  onComplete: (sets: WorkoutSessionSetInput[], feedbackPain?: string) => void;
  onCancel: () => void;
}

export function GuidedWorkoutPlayer({
  program,
  loading,
  autoStart = false,
  onComplete,
  onCancel,
}: GuidedWorkoutPlayerProps) {
  const exercises = program.exercises ?? [];
  const steps = useMemo(() => buildGuidedWorkoutSteps(exercises), [exercises]);

  const [status, setStatus] = useState<PlayerStatus>("ready");
  const [stepIndex, setStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [feedbackPain, setFeedbackPain] = useState("");

  const currentStep = steps[stepIndex];
  const totalSteps = steps.length;
  const progress = totalSteps > 0 ? ((stepIndex + 1) / totalSteps) * 100 : 0;

  const getWorkExerciseForStep = useCallback(
    (step: GuidedWorkoutStep) => {
      if (step.phase === "work") return step.exercise;
      const next = steps[step.stepIndex + 1];
      return next?.exercise ?? step.exercise;
    },
    [steps]
  );

  const goToStep = useCallback(
    (index: number) => {
      if (index >= steps.length) {
        setStatus("finished");
        return;
      }
      setStepIndex(index);
      setTimeLeft(steps[index].durationSeconds);
    },
    [steps]
  );

  useEffect(() => {
    if (status !== "running" || timeLeft <= 0) return;

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [status, timeLeft]);

  useEffect(() => {
    if (status !== "running" || timeLeft > 0) return;

    if (stepIndex >= steps.length - 1) {
      setStatus("finished");
      return;
    }

    goToStep(stepIndex + 1);
  }, [timeLeft, status, stepIndex, steps.length, goToStep]);

  useEffect(() => {
    if (!autoStart || status !== "ready" || steps.length === 0) return;
    setStatus("running");
    goToStep(0);
  }, [autoStart, status, steps.length, goToStep]);

  const startWorkout = () => {
    if (steps.length === 0) return;
    setStatus("running");
    goToStep(0);
  };

  const togglePause = () => {
    setStatus((s) => (s === "running" ? "paused" : "running"));
  };

  const skipStep = () => {
    if (stepIndex >= steps.length - 1) {
      setStatus("finished");
      return;
    }
    goToStep(stepIndex + 1);
  };

  const handleFinish = () => {
    const sets = buildSessionSetsFromExercises(exercises).map((set) => {
      const exercise = exercises.find((e) => e.id === set.exerciseId);
      const reps = parseInt(set.prescribedReps, 10);
      return {
        ...set,
        executedReps: Number.isNaN(reps) ? undefined : reps,
        executedLoadKg: exercise?.loadKg,
        skipped: false,
      };
    });
    onComplete(sets, feedbackPain.trim() || undefined);
  };

  if (steps.length === 0) {
    return (
      <p className="text-neutral-500 text-sm">Este treino não possui exercícios configurados.</p>
    );
  }

  if (status === "ready") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-yellow-400/30 rounded-md p-8 text-center"
      >
        <div className="w-20 h-20 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Play className="text-yellow-400" size={40} fill="currentColor" />
        </div>
        <h2 className="font-display text-3xl font-black uppercase text-white mb-2">
          Treino guiado
        </h2>
        <p className="text-neutral-400 text-sm mb-2">
          {exercises.length} exercícios · {steps.filter((s) => s.phase === "work").length} séries
        </p>
        <p className="text-neutral-500 text-xs mb-8 max-w-sm mx-auto">
          Vídeo e contador sincronizados. Ao terminar cada série, o descanso inicia
          automaticamente e o próximo exercício é carregado.
        </p>
        <button
          type="button"
          onClick={startWorkout}
          className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-8 py-4 rounded-md font-bold uppercase text-sm tracking-wider hover:bg-yellow-300"
        >
          <Play size={20} fill="currentColor" />
          Iniciar treino
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="block mx-auto mt-4 text-neutral-500 hover:text-neutral-300 text-sm"
        >
          Voltar
        </button>
      </motion.div>
    );
  }

  if (status === "finished") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <div className="bg-gradient-to-br from-green-900/30 to-neutral-900 border border-green-500/30 rounded-md p-8 text-center">
          <CheckCircle2 className="text-green-400 mx-auto mb-4" size={48} />
          <h2 className="font-display text-2xl font-black uppercase text-white mb-2">
            Treino concluído!
          </h2>
          <p className="text-neutral-400 text-sm">
            Todas as séries foram registradas. Confirme para salvar no histórico.
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-700 rounded-md p-4">
          <label className="block text-neutral-400 text-xs uppercase tracking-wider mb-2">
            Dor ou desconforto? (opcional)
          </label>
          <textarea
            value={feedbackPain}
            onChange={(e) => setFeedbackPain(e.target.value)}
            rows={3}
            placeholder="O professor será notificado em até 24h..."
            className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-yellow-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={handleFinish}
            className="flex items-center gap-2 bg-yellow-400 text-yellow-900 px-6 py-3 rounded-md font-bold uppercase text-sm tracking-wider hover:bg-yellow-300 disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar treino"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-md border border-neutral-700 text-neutral-400 text-sm uppercase font-semibold"
          >
            Descartar
          </button>
        </div>
      </motion.div>
    );
  }

  const workExercise =
    currentStep?.phase === "work"
      ? currentStep.exercise
      : getWorkExerciseForStep(currentStep!);
  const isWork = currentStep?.phase === "work";
  const duration = currentStep?.durationSeconds ?? 1;
  const elapsed = duration - timeLeft;
  const ringProgress = Math.min(100, (elapsed / duration) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-yellow-400"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-neutral-500 text-xs shrink-0">
          {stepIndex + 1}/{totalSteps}
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="text-neutral-500 hover:text-orange-400"
          aria-label="Encerrar treino"
        >
          <X size={20} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${stepIndex}-${currentStep?.phase}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {isWork ? (
            <div className="relative">
              <GuidedExerciseVideo
                url={workExercise.videoUrl}
                title={workExercise.name}
                active={status === "running"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-neutral-950/40 pointer-events-none rounded-md" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <p className="text-yellow-400 text-xs uppercase tracking-wider font-semibold mb-1">
                  Executando · Série {currentStep.setNumber}/{currentStep.totalSets}
                </p>
                <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-white mb-1">
                  {workExercise.name}
                </h3>
                <p className="text-neutral-400 text-sm">
                  {workExercise.sets}×{workExercise.reps}
                  {workExercise.loadKg ? ` · ${workExercise.loadKg}kg` : ""}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-blue-500/30 rounded-md aspect-video flex flex-col items-center justify-center p-6 text-center">
              <Timer className="text-blue-400 mb-4" size={40} />
              <p className="text-blue-400 text-xs uppercase tracking-wider font-semibold mb-2">
                Descanso
              </p>
              <p className="text-neutral-400 text-sm mb-1">Próximo:</p>
              <p className="text-white font-semibold">{currentStep?.nextLabel}</p>
              <p className="text-neutral-500 text-xs mt-2">
                Descanso prescrito: {formatRest(currentStep?.durationSeconds ?? 0)}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-col items-center py-4">
        <div className="relative w-36 h-36 sm:w-44 sm:h-44">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-neutral-800"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${ringProgress * 2.76} 276`}
              className={isWork ? "text-yellow-400" : "text-blue-400"}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`font-display text-4xl sm:text-5xl font-black tabular-nums ${
                isWork ? "text-yellow-400" : "text-blue-400"
              }`}
            >
              {formatCountdown(timeLeft)}
            </span>
            <span className="text-neutral-500 text-xs uppercase mt-1">
              {isWork ? "Executar" : "Descansar"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={togglePause}
          className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 text-white px-5 py-2.5 rounded-md text-sm font-semibold uppercase hover:border-yellow-400/50"
        >
          {status === "paused" ? <Play size={16} /> : <Pause size={16} />}
          {status === "paused" ? "Continuar" : "Pausar"}
        </button>
        <button
          type="button"
          onClick={skipStep}
          className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 text-neutral-300 px-5 py-2.5 rounded-md text-sm font-semibold uppercase hover:border-neutral-500"
        >
          <SkipForward size={16} />
          {isWork ? "Pular série" : "Pular descanso"}
        </button>
      </div>
    </div>
  );
}

function GuidedExerciseVideo({
  url,
  title,
  active,
}: {
  url?: string;
  title: string;
  active: boolean;
}) {
  if (!url) {
    return (
      <div className="aspect-video bg-neutral-900 border border-neutral-700 rounded-md flex items-center justify-center">
        <p className="text-neutral-600 text-sm">Sem vídeo para este exercício</p>
      </div>
    );
  }

  const isYoutube = isYoutubeUrl(url);
  const isDirect = isDirectVideoUrl(url);

  if (isYoutube) {
    const embed = toYoutubeEmbedUrl(url);
    const videoId = extractYoutubeVideoId(url);
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      autoplay: active ? "1" : "0",
      mute: "1",
      loop: "1",
      controls: "0",
      playsinline: "1",
    });
    if (videoId) params.set("playlist", videoId);

    return (
      <div className="relative w-full aspect-video rounded-md overflow-hidden bg-neutral-950 border border-neutral-700">
        <iframe
          key={`${embed}-${active}`}
          src={`${embed}?${params.toString()}`}
          title={`Vídeo: ${title}`}
          className="absolute inset-0 w-full h-full pointer-events-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    );
  }

  if (isDirect) {
    return (
      <div className="relative w-full aspect-video rounded-md overflow-hidden bg-neutral-950 border border-neutral-700">
        <video
          key={url}
          src={url}
          autoPlay={active}
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          title={`Vídeo: ${title}`}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-md overflow-hidden bg-neutral-950 border border-neutral-700">
      <iframe
        src={url}
        title={`Vídeo: ${title}`}
        className="absolute inset-0 w-full h-full"
        allowFullScreen
      />
    </div>
  );
}
