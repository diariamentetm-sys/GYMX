import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { HeartPulse, Mail, Phone, Radio, Search, UserPlus } from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { ParQReviewModal } from "../components/dashboard/ParQReviewModal";
import {
  getNameInitials,
  listPendingParQReviews,
  listStaffMembers,
} from "../services/staffService";
import type { PendingParQReview, StaffMemberListItem } from "../types/staff";
import type { ParQStatus } from "../types/member";

type StudentFilter = "all" | "active" | "inactive" | "parq";

const PARQ_LABELS: Record<ParQStatus, string> = {
  nao_preenchido: "PAR-Q pendente",
  apto: "Apto",
  apto_com_restricao: "Apto com restrição",
  encaminhar_avaliacao: "Avaliar PAR-Q",
  expirado: "PAR-Q expirado",
};

function isActiveMember(member: StaffMemberListItem) {
  return member.status === "ativo";
}

export default function AlunosPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<StudentFilter>("all");
  const [members, setMembers] = useState<StaffMemberListItem[]>([]);
  const [pendingReviews, setPendingReviews] = useState<PendingParQReview[]>([]);
  const [selectedReview, setSelectedReview] = useState<PendingParQReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setError("");
    const [membersResult, reviewsResult] = await Promise.all([
      listStaffMembers(),
      listPendingParQReviews(),
    ]);

    if (membersResult.error) setError(membersResult.error);
    setMembers(membersResult.members);
    setPendingReviews(reviewsResult.reviews);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredStudents = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterStatus === "all" ||
        (filterStatus === "active" && isActiveMember(member)) ||
        (filterStatus === "inactive" && !isActiveMember(member)) ||
        (filterStatus === "parq" && member.parQStatus === "encaminhar_avaliacao");

      return matchesSearch && matchesFilter;
    });
  }, [filterStatus, members, searchQuery]);

  const activeCount = members.filter(isActiveMember).length;
  const inactiveCount = members.length - activeCount;

  const openReview = (memberId: string) => {
    const review = pendingReviews.find((item) => item.memberId === memberId);
    if (review) setSelectedReview(review);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex">
      <Sidebar />

      <main className="flex-1 lg:ml-64">
        <div className="lg:hidden sticky top-0 z-40 bg-neutral-900 border-b border-neutral-800 px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="font-display text-xl font-black text-white"
          >
            GYMX
          </button>
          <span className="text-neutral-400 text-xs uppercase tracking-wider">Alunos</span>
        </div>
        <div className="bg-neutral-900 border-b border-neutral-800 px-6 lg:px-8 py-6">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display text-4xl lg:text-5xl font-black uppercase text-white mb-2">
                  ALUNOS
                </h1>
                <p className="text-neutral-500 text-sm">
                  Administração de alunos e avaliação PAR-Q
                </p>
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => navigate("/modo-recepcao")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-400 text-white rounded-md font-bold text-sm uppercase tracking-wide transition-colors shadow-lg shadow-orange-500/20"
                >
                  <Radio size={18} strokeWidth={2.5} />
                  Ativar Recepção
                </motion.button>
                <motion.button
                  onClick={() => navigate("/dashboard/alunos/novo")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 rounded-md font-bold text-sm uppercase tracking-wide transition-colors"
                >
                  <UserPlus size={18} strokeWidth={2.5} />
                  Novo Aluno
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 rounded-md p-4">
                <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">
                  Total de Alunos
                </p>
                <p className="text-white font-display text-3xl font-black">{members.length}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-neutral-900 border border-green-500/30 rounded-md p-4">
                <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Ativos</p>
                <p className="text-green-400 font-display text-3xl font-black">{activeCount}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500/10 to-neutral-900 border border-orange-500/30 rounded-md p-4">
                <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Inativos</p>
                <p className="text-orange-500 font-display text-3xl font-black">{inactiveCount}</p>
              </div>
              <button
                type="button"
                onClick={() => setFilterStatus("parq")}
                className="text-left bg-gradient-to-br from-orange-500/10 to-neutral-900 border border-orange-500/40 rounded-md p-4 hover:border-orange-400 transition-colors"
              >
                <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">
                  PAR-Q para avaliar
                </p>
                <p className="text-orange-400 font-display text-3xl font-black">
                  {pendingReviews.length}
                </p>
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 lg:px-8 py-6 max-w-[1600px] mx-auto">
          {pendingReviews.length > 0 && filterStatus !== "parq" && (
            <div className="mb-6 bg-orange-500/10 border border-orange-500/30 rounded-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <HeartPulse className="text-orange-400 mt-0.5" size={20} />
                <div>
                  <p className="text-white font-semibold">
                    {pendingReviews.length} aluno(s) aguardando aprovação do PAR-Q
                  </p>
                  <p className="text-neutral-400 text-sm">
                    Abra a avaliação para liberar ou manter o bloqueio de treino.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReview(pendingReviews[0])}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-md font-bold uppercase text-xs tracking-wide"
              >
                Avaliar agora
              </button>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Buscar por nome ou e-mail..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full bg-neutral-900 border-2 border-neutral-700 rounded-md pl-12 pr-4 py-3 text-white text-sm placeholder:text-neutral-500 focus:border-yellow-400 focus:outline-none transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["all", "Todos"],
                  ["active", "Ativos"],
                  ["inactive", "Inativos"],
                  ["parq", "PAR-Q"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilterStatus(value)}
                  className={`px-4 py-3 rounded-md border-2 text-sm font-semibold uppercase tracking-wide transition-all ${
                    filterStatus === value
                      ? "bg-yellow-400 border-yellow-400 text-yellow-900"
                      : "bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-yellow-400/50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {error ? <p className="text-orange-500 text-sm mb-4">{error}</p> : null}

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredStudents.map((student, index) => {
                const needsReview = student.parQStatus === "encaminhar_avaliacao";
                return (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.04, 0.3) }}
                    className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-4"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-yellow-900 font-bold text-lg">
                            {getNameInitials(student.fullName)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-white font-bold text-lg">{student.fullName}</h3>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                                isActiveMember(student)
                                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                  : "bg-orange-500/20 text-orange-500 border border-orange-500/30"
                              }`}
                            >
                              {isActiveMember(student) ? "Ativo" : "Inativo"}
                            </span>
                            <span className="px-2 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-xs font-semibold text-neutral-300 uppercase">
                              {student.planName}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                                needsReview
                                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                  : student.parQStatus === "apto"
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : "bg-neutral-800 border border-neutral-700 text-neutral-300"
                              }`}
                            >
                              {PARQ_LABELS[student.parQStatus]}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                            <div className="flex items-center gap-2">
                              <Phone size={14} />
                              <span>{student.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail size={14} />
                              <span>{student.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {needsReview && pendingReviews.some((item) => item.memberId === student.id) && (
                        <button
                          type="button"
                          onClick={() => openReview(student.id)}
                          className="px-4 py-3 bg-orange-500 hover:bg-orange-400 text-white rounded-md font-bold uppercase text-xs tracking-wide"
                        >
                          Avaliar PAR-Q
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {!loading && filteredStudents.length === 0 && (
            <div className="text-center py-16">
              <p className="text-neutral-500 text-lg mb-2">Nenhum aluno encontrado</p>
              <p className="text-neutral-600 text-sm">
                Os alunos reais aparecem aqui depois do cadastro no portal.
              </p>
            </div>
          )}
        </div>
      </main>

      <ParQReviewModal
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
        onReviewed={() => {
          setSelectedReview(null);
          loadData();
        }}
      />
    </div>
  );
}
