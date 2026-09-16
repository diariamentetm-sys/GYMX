import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  AlertTriangle,
  ArrowLeft,
  CreditCard,
  HeartPulse,
  History,
  Play,
} from "lucide-react";
import { MemberLayout } from "../../components/member/MemberLayout";
import { RequireMemberAccess } from "../../components/auth/RequireMemberAccess";
import { TrainerCard } from "../../components/member/TrainerCard";
import { WorkoutEmptyState } from "../../components/member/WorkoutEmptyState";
import { GuidedWorkoutPlayer } from "../../components/member/GuidedWorkoutPlayer";
import { WorkoutHistoryPanel } from "../../components/member/WorkoutHistoryPanel";
import { WorkoutProgramCard } from "../../components/member/WorkoutProgramCard";
import { ExerciseVideoPlayer } from "../../components/member/ExerciseVideoPlayer";
import { useAuth } from "../../contexts/AuthContext";
import { refreshParQStatus } from "../../services/memberService";
import { fetchMemberSubscription } from "../../services/subscriptionService";
import {
  completeWorkoutSession,
  fetchActiveWorkoutPrograms,
  fetchPendingWorkoutRequest,
  fetchProgramEditHistory,
  fetchWorkoutHistory,
  fetchWorkoutProgramById,
  requestWorkoutPrescription,
  startWorkoutSession,
} from "../../services/workoutService";
import type { ParQStatus } from "../../types/member";
import type { WorkoutModality, WorkoutProgram, WorkoutSessionSetInput } from "../../types/workout";
import { MODALITY_LABELS } from "../../constants/workouts";
import { canAccessWorkoutPrescription } from "../../utils/parq";
import { canAccessWorkoutArea, formatRest, groupProgramsByModality } from "../../utils/workoutCalculations";
import { formatDateBR } from "../../utils/subscriptionCalculations";

type ViewMode = "list" | "detail" | "execute" | "history";

export default function MemberWorkoutPage() {
  const navigate = useNavigate();
  const { session, profile } = useAuth();
  const memberId = session?.user.id;

  const [parQStatus, setParQStatus] = useState<ParQStatus>(
    profile?.parQStatus ?? "nao_preenchido"
  );
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<WorkoutProgram | null>(null);
  const [editHistory, setEditHistory] = useState<Awaited<ReturnType<typeof fetchProgramEditHistory>>>([]);
  const [historyPrograms, setHistoryPrograms] = useState<WorkoutProgram[]>([]);
  const [pendingRequest, setPendingRequest] = useState(false);
  const [view, setView] = useState<ViewMode>("list");
  const [sessionId, setSessionId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!memberId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [sub, activePrograms, request, history] = await Promise.all([
        fetchMemberSubscription(memberId),
        fetchActiveWorkoutPrograms(memberId),
        fetchPendingWorkoutRequest(memberId),
        fetchWorkoutHistory(memberId),
      ]);

      const access = canAccessWorkoutArea(parQStatus, sub);
      setHasActivePlan(!access.planBlocked);
      setPrograms(activePrograms);
      setPendingRequest(!!request);
      setHistoryPrograms(history);
    } catch {
      setError("Não foi possível carregar seus treinos. Tente novamente.");
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  }, [memberId, parQStatus]);

  useEffect(() => {
    if (profile) {
      refreshParQStatus(profile).then(setParQStatus);
    }
  }, [profile]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openProgram = async (program: WorkoutProgram) => {
    setActionLoading(true);
    const full = await fetchWorkoutProgramById(program.id);
    const edits = full ? await fetchProgramEditHistory(full.id) : [];
    setActionLoading(false);

    if (!full) {
      setError("Não foi possível carregar o treino.");
      return;
    }

    setSelectedProgram(full);
    setEditHistory(edits);
    setView("detail");
    setError("");
  };

  const startExecution = async () => {
    if (!memberId || !selectedProgram) return;

    setActionLoading(true);
    const result = await startWorkoutSession(memberId, selectedProgram);
    setActionLoading(false);

    if (!result.sessionId) {
      setError(result.error ?? "Erro ao iniciar treino.");
      return;
    }

    setSessionId(result.sessionId);
    setView("execute");
  };

  const handleComplete = async (
    sets: WorkoutSessionSetInput[],
    feedbackPain?: string
  ) => {
    if (!sessionId) return;

    setActionLoading(true);
    const result = await completeWorkoutSession(sessionId, sets, feedbackPain);
    setActionLoading(false);

    if (!result.success) {
      setError(result.error ?? "Erro ao salvar execução.");
      return;
    }

    setMessage(
      feedbackPain
        ? "Treino registrado. Seu professor será notificado sobre o desconforto relatado."
        : "Treino concluído! Histórico de frequência atualizado."
    );
    setSessionId(null);
    setSelectedProgram(null);
    setView("list");
    await loadData();
  };

  const handleRequestPrescription = async (
    modality: WorkoutModality,
    notes: string
  ) => {
    if (!memberId) return;

    setActionLoading(true);
    const result = await requestWorkoutPrescription(memberId, modality, notes);
    setActionLoading(false);

    if (!result.success) {
      setError(result.error ?? "Erro ao enviar solicitação.");
      return;
    }

    setMessage("Solicitação enviada. A coordenação atribuirá um professor em breve.");
    setPendingRequest(true);
  };

  const parQBlocked = !canAccessWorkoutPrescription(parQStatus);
  const planBlocked = !hasActivePlan;
  const grouped = groupProgramsByModality(programs);

  return (
    <RequireMemberAccess>
      <MemberLayout
        title="Meu Treino"
        subtitle="Fichas prescritas, execução e histórico com rastreabilidade do professor"
      >
        {message && (
          <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-md p-4 text-green-400 text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-orange-500/10 border border-orange-500/30 rounded-md p-4 text-orange-400 text-sm">
            {error}
          </div>
        )}

        {parQBlocked ? (
          <BlockedState
            type="parq"
            parQStatus={parQStatus}
            onAction={() =>
              navigate(
                parQStatus === "nao_preenchido" ? "/portal/onboarding" : "/portal/perfil"
              )
            }
          />
        ) : planBlocked ? (
          <BlockedState
            type="plan"
            onAction={() => navigate("/portal/plano")}
          />
        ) : loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : view === "history" ? (
          <div>
            <button
              type="button"
              onClick={() => setView("list")}
              className="flex items-center gap-2 text-neutral-400 hover:text-yellow-400 text-sm mb-6"
            >
              <ArrowLeft size={16} />
              Voltar aos treinos ativos
            </button>
            <h2 className="font-display text-xl font-black uppercase text-white mb-4 flex items-center gap-2">
              <History size={20} className="text-yellow-400" />
              Histórico de Treinos
            </h2>
            <WorkoutHistoryPanel programs={historyPrograms} loading={false} />
          </div>
        ) : view === "execute" && selectedProgram ? (
          <div>
            <button
              type="button"
              onClick={() => {
                setView("detail");
                setSessionId(null);
              }}
              className="flex items-center gap-2 text-neutral-400 hover:text-yellow-400 text-sm mb-6"
            >
              <ArrowLeft size={16} />
              Voltar aos detalhes
            </button>
            <h2 className="font-display text-xl font-black uppercase text-white mb-2">
              {selectedProgram.label}
            </h2>
            <GuidedWorkoutPlayer
              program={selectedProgram}
              loading={actionLoading}
              autoStart={!!sessionId}
              onComplete={handleComplete}
              onCancel={() => {
                setView("detail");
                setSessionId(null);
              }}
            />
          </div>
        ) : view === "detail" && selectedProgram ? (
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => {
                setSelectedProgram(null);
                setView("list");
              }}
              className="flex items-center gap-2 text-neutral-400 hover:text-yellow-400 text-sm"
            >
              <ArrowLeft size={16} />
              Voltar à lista
            </button>

            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-yellow-400/30 rounded-md p-6">
              <h2 className="font-display text-2xl font-black uppercase text-white mb-1">
                {selectedProgram.label}
              </h2>
              <p className="text-neutral-400 text-sm mb-4">{selectedProgram.division}</p>
              <p className="text-neutral-500 text-xs">
                {MODALITY_LABELS[selectedProgram.modality]} · Objetivo:{" "}
                {selectedProgram.objective} · Válido até{" "}
                {formatDateBR(selectedProgram.validUntil)}
              </p>
            </div>

            <TrainerCard
              trainer={selectedProgram.trainer}
              supervisor={selectedProgram.supervisor}
              prescriptionType={selectedProgram.prescriptionType}
              aiGenerated={selectedProgram.aiGenerated}
            />

            <div className="space-y-4">
              {(selectedProgram.exercises ?? []).map((exercise) => (
                <div
                  key={exercise.id}
                  className="bg-neutral-900 border border-neutral-700 rounded-md p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-neutral-200 text-sm font-semibold">
                        {exercise.name}
                      </span>
                      {exercise.notes && (
                        <p className="text-neutral-600 text-xs mt-0.5">{exercise.notes}</p>
                      )}
                    </div>
                    <span className="text-yellow-400 text-xs font-semibold text-right">
                      {exercise.sets}×{exercise.reps}
                      {exercise.loadKg ? ` · ${exercise.loadKg}kg` : ""}
                      <br />
                      <span className="text-neutral-500">
                        {formatRest(exercise.restSeconds)}
                      </span>
                    </span>
                  </div>
                  <ExerciseVideoPlayer
                    url={exercise.videoUrl}
                    title={exercise.name}
                    compact
                  />
                </div>
              ))}
            </div>

            {editHistory.length > 0 && (
              <div className="bg-neutral-900 border border-neutral-700 rounded-md p-4">
                <p className="text-neutral-400 text-xs uppercase tracking-wider mb-3">
                  Rastreabilidade de autoria
                </p>
                <div className="space-y-2">
                  {editHistory.map((edit) => (
                    <p key={edit.id} className="text-neutral-500 text-xs">
                      {new Date(edit.createdAt).toLocaleDateString("pt-BR")} —{" "}
                      {edit.editor?.fullName ?? "Professor"} ({edit.editType})
                      {edit.notes ? `: ${edit.notes}` : ""}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={actionLoading}
              onClick={startExecution}
              className="flex items-center gap-2 bg-yellow-400 text-yellow-900 px-6 py-3 rounded-md font-bold uppercase text-sm tracking-wider hover:bg-yellow-300 disabled:opacity-50"
            >
              <Play size={18} />
              {actionLoading ? "Iniciando..." : "Iniciar treino guiado"}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-neutral-400 text-sm">
                {programs.length > 0
                  ? `${programs.length} treino(s) ativo(s)`
                  : "Sem treinos ativos"}
              </p>
              <button
                type="button"
                onClick={() => setView("history")}
                className="flex items-center gap-2 text-neutral-400 hover:text-yellow-400 text-sm uppercase font-semibold"
              >
                <History size={16} />
                Histórico
              </button>
            </div>

            {programs.length === 0 ? (
              <WorkoutEmptyState
                pendingRequest={pendingRequest}
                loading={actionLoading}
                onRequest={handleRequestPrescription}
              />
            ) : (
              Object.entries(grouped).map(([modality, items]) => (
                <section key={modality}>
                  <h2 className="text-neutral-500 text-xs uppercase tracking-wider font-semibold mb-3">
                    {MODALITY_LABELS[modality as WorkoutModality] ?? modality}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((program) => (
                      <WorkoutProgramCard
                        key={program.id}
                        program={program}
                        onOpen={() => openProgram(program)}
                      />
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        )}
      </MemberLayout>
    </RequireMemberAccess>
  );
}

function BlockedState({
  type,
  parQStatus,
  onAction,
}: {
  type: "parq" | "plan";
  parQStatus?: ParQStatus;
  onAction: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-orange-500/30 rounded-md p-8"
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-orange-500/20 rounded-full flex items-center justify-center shrink-0">
          {type === "plan" ? (
            <CreditCard className="text-orange-400" size={28} />
          ) : parQStatus === "encaminhar_avaliacao" ? (
            <HeartPulse className="text-orange-400" size={28} />
          ) : (
            <AlertTriangle className="text-orange-400" size={28} />
          )}
        </div>
        <div>
          <h2 className="font-display text-2xl font-black uppercase text-white mb-2">
            {type === "plan" ? "Plano necessário" : "Treino bloqueado"}
          </h2>
          {type === "plan" ? (
            <p className="text-neutral-300 text-sm mb-4">
              É necessário um plano ativo para acessar prescrições de treino.
            </p>
          ) : (
            <>
              {parQStatus === "encaminhar_avaliacao" && (
                <p className="text-neutral-300 text-sm mb-4">
                  PAR-Q com restrição de saúde. O treino fica bloqueado até a equipe
                  aprovar a avaliação no painel de alunos.
                </p>
              )}
              {parQStatus === "expirado" && (
                <p className="text-neutral-300 text-sm mb-4">
                  PAR-Q expirado. Atualize no perfil antes de acessar treinos.
                </p>
              )}
              {parQStatus === "nao_preenchido" && (
                <p className="text-neutral-300 text-sm mb-4">
                  PAR-Q obrigatório antes de liberar prescrição de treino.
                </p>
              )}
            </>
          )}
          <button
            type="button"
            onClick={onAction}
            className="bg-yellow-400 text-yellow-900 px-6 py-3 rounded-md font-bold uppercase text-sm tracking-wider hover:bg-yellow-300"
          >
            {type === "plan"
              ? "Contratar plano"
              : parQStatus === "encaminhar_avaliacao"
                ? "Ver meu perfil"
                : parQStatus === "nao_preenchido"
                  ? "Completar onboarding"
                  : "Atualizar PAR-Q"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
