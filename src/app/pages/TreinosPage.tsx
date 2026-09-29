import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ChevronRight, Dumbbell } from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { getNameInitials, listStaffMembers } from "../services/staffService";
import { fetchStaffMemberProgram } from "../services/staffWorkoutService";
import type { StaffMemberListItem } from "../types/staff";

interface MemberWorkoutRow {
  member: StaffMemberListItem;
  exerciseCount: number;
  programLabel?: string;
}

export default function TreinosPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<MemberWorkoutRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    const result = await listStaffMembers();
    if (result.error) {
      setError(result.error);
      setRows([]);
      setLoading(false);
      return;
    }

    const withPrograms = await Promise.all(
      result.members.map(async (member) => {
        const program = await fetchStaffMemberProgram(member.id);
        return {
          member,
          exerciseCount: program?.exercises?.length ?? 0,
          programLabel: program?.label,
        };
      })
    );
    setRows(withPrograms);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen bg-neutral-950 flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <div className="bg-neutral-900 border-b border-neutral-800 px-6 lg:px-8 py-6">
          <div className="max-w-[1600px] mx-auto">
            <h1 className="font-display text-4xl lg:text-5xl font-black uppercase text-white mb-2">
              TREINOS
            </h1>
            <p className="text-neutral-500 text-sm">
              Fichas por aluno. No detalhe de cada exercício, inclua a videoaula do movimento.
            </p>
          </div>
        </div>
        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
          {error ? <p className="text-orange-500 text-sm mb-4">{error}</p> : null}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : rows.length === 0 ? (
            <p className="text-neutral-500">Nenhum aluno cadastrado ainda.</p>
          ) : (
            <div className="space-y-3">
              {rows.map(({ member, exerciseCount, programLabel }) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => navigate(`/dashboard/alunos/${member.id}/treino`)}
                  className="w-full text-left bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 hover:border-yellow-400/40 rounded-md p-4 flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-yellow-900 font-bold">
                      {getNameInitials(member.fullName)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold truncate">{member.fullName}</p>
                    <p className="text-neutral-500 text-xs">
                      {programLabel
                        ? `${programLabel} · ${exerciseCount} exercício(s)`
                        : "Sem ficha — cadastrar lista"}
                    </p>
                  </div>
                  <Dumbbell className="text-yellow-400 shrink-0" size={18} />
                  <ChevronRight className="text-neutral-600" size={18} />
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
