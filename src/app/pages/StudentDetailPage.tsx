import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  CreditCard,
  Dumbbell,
  Mail,
  Phone,
  ChevronRight,
} from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { InfoCard } from "../components/InfoCard";
import { getNameInitials, getStaffMember } from "../services/staffService";
import { fetchStaffMemberProgram } from "../services/staffWorkoutService";
import type { StaffMemberListItem } from "../types/staff";
import type { WorkoutProgram } from "../types/workout";
import { MODALITY_LABELS } from "../constants/workouts";
import { hasAssignedTrainerVideo } from "../utils/video";

const STATUS_LABEL: Record<StaffMemberListItem["status"], string> = {
  incompleto: "Incompleto",
  pendente_verificacao: "Pendente",
  pendente_correcao: "Correção",
  onboarding_pendente: "Onboarding",
  ativo: "Ativo",
  encerramento_solicitado: "Encerramento",
};

export default function StudentDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [member, setMember] = useState<StaffMemberListItem | null>(null);
  const [program, setProgram] = useState<WorkoutProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!id) return;
    const [memberResult, currentProgram] = await Promise.all([
      getStaffMember(id),
      fetchStaffMemberProgram(id),
    ]);
    setError(memberResult.error ?? "");
    setMember(memberResult.member);
    setProgram(currentProgram);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

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
          <p className="text-neutral-400">{error || "Aluno não encontrado."}</p>
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
          <div className="max-w-[1200px] mx-auto">
            <button
              type="button"
              onClick={() => navigate("/dashboard/alunos")}
              className="flex items-center gap-2 text-neutral-400 hover:text-yellow-400 text-sm font-semibold uppercase tracking-wide"
            >
              <ArrowLeft size={16} />
              Voltar para lista
            </button>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <div className="max-w-[1200px] mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-yellow-900 font-bold text-xl">
                      {getNameInitials(member.fullName)}
                    </span>
                  </div>
                  <div>
                    <h1 className="font-display text-3xl font-black uppercase text-white">
                      {member.fullName}
                    </h1>
                    <p className="text-neutral-500 text-sm">{STATUS_LABEL[member.status]}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/alunos/${member.id}/treino`)}
                  className="flex items-center gap-2 px-5 py-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 rounded-md font-bold text-sm uppercase tracking-wide"
                >
                  <Dumbbell size={18} />
                  {program ? "Editar treino" : "Cadastrar treino"}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoCard label="Email" value={member.email} icon={Mail} />
                <InfoCard label="Telefone" value={member.phone} icon={Phone} />
                <InfoCard label="Plano" value={member.planName} icon={CreditCard} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-6"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="font-display text-2xl font-black uppercase text-white">
                  Lista de exercícios
                </h2>
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/alunos/${member.id}/treino`)}
                  className="text-yellow-400 text-xs font-bold uppercase tracking-wide"
                >
                  Gerenciar
                </button>
              </div>
              {!program ? (
                <p className="text-neutral-500 text-sm">
                  Este aluno ainda não tem ficha. Cadastre os exercícios para eles aparecerem em Meu Treino.
                </p>
              ) : (
                <div className="space-y-3">
                  <p className="text-neutral-400 text-sm">
                    {program.label} · {MODALITY_LABELS[program.modality]} · {exercises.length} exercício(s)
                  </p>
                  {exercises.map((exercise) => (
                    <button
                      key={exercise.id}
                      type="button"
                      onClick={() =>
                        navigate(`/dashboard/alunos/${member.id}/treino/${exercise.id}`)
                      }
                      className="w-full text-left bg-neutral-800/60 border border-neutral-700 rounded-md p-4 hover:border-yellow-400/40 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-white font-semibold">{exercise.name}</p>
                        <p className="text-neutral-500 text-xs">
                          {exercise.sets}×{exercise.reps}
                          {hasAssignedTrainerVideo(exercise) ? " · com videoaula" : " · sem URL"}
                        </p>
                      </div>
                      <ChevronRight className="text-neutral-600" size={18} />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
