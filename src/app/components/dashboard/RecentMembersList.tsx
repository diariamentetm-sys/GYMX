import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { User, ArrowRight } from "lucide-react";

const recentMembers = [
  { name: "Maria Santos", plan: "Elite", joinedDays: 2, avatar: "MS" },
  { name: "João Silva", plan: "Premium", joinedDays: 3, avatar: "JS" },
  { name: "Ana Costa", plan: "Básico", joinedDays: 5, avatar: "AC" },
  { name: "Pedro Alves", plan: "Elite", joinedDays: 7, avatar: "PA" },
  { name: "Carla Souza", plan: "Premium", joinedDays: 8, avatar: "CS" },
];

export function RecentMembersList() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-6 hover:border-yellow-400/50 transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display text-2xl font-black uppercase text-white">
            ALUNOS RECENTES
          </h3>
          <p className="text-neutral-500 text-sm">
            Últimas matrículas realizadas
          </p>
        </div>
        <div className="w-10 h-10 bg-yellow-400/10 rounded-md flex items-center justify-center">
          <User className="text-yellow-400" size={20} strokeWidth={2.5} />
        </div>
      </div>

      {/* Lista de membros */}
      <div className="space-y-3">
        {recentMembers.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            className="flex items-center gap-4 p-3 bg-neutral-800/50 rounded border border-neutral-700/50 hover:border-yellow-400/30 transition-all"
          >
            {/* Avatar */}
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-yellow-900 font-bold text-sm">
                {member.avatar}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">
                {member.name}
              </p>
              <p className="text-neutral-500 text-xs uppercase tracking-wider">
                Plano {member.plan}
              </p>
            </div>

            {/* Days */}
            <div className="text-right flex-shrink-0">
              <p className="text-yellow-400 font-bold text-sm">
                {member.joinedDays}d
              </p>
              <p className="text-neutral-500 text-xs">atrás</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-neutral-800">
        <button
          onClick={() => navigate("/dashboard/alunos")}
          className="w-full flex items-center justify-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-semibold uppercase tracking-wide"
        >
          Ver todos os alunos
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </motion.div>
  );
}
