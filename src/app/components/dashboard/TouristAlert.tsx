import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { AlertTriangle, ArrowRight } from "lucide-react";

const touristMembers = [
  { name: "Carlos Mendes", lastCheckin: 12, plan: "Premium", avatar: "CM" },
  { name: "Juliana Lima", lastCheckin: 15, plan: "Básico", avatar: "JL" },
  { name: "Roberto Dias", lastCheckin: 18, plan: "Elite", avatar: "RD" },
  { name: "Fernanda Rocha", lastCheckin: 21, plan: "Premium", avatar: "FR" },
  { name: "Lucas Martins", lastCheckin: 25, plan: "Básico", avatar: "LM" },
];

export function TouristAlert() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-gradient-to-br from-orange-500/5 to-neutral-900 border border-orange-500/50 rounded-md p-6 hover:border-orange-500/70 transition-all relative overflow-hidden"
    >
      {/* Pulsing indicator */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute top-4 right-4 w-3 h-3 bg-orange-500 rounded-full"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-display text-2xl font-black uppercase text-white">
              TURISTAS
            </h3>
            <div className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded">
              <span className="text-orange-500 font-bold text-sm">
                {touristMembers.length}
              </span>
            </div>
          </div>
          <p className="text-neutral-500 text-sm">
            Alunos sem check-in há 10+ dias
          </p>
        </div>
        <div className="w-10 h-10 bg-orange-500/10 rounded-md flex items-center justify-center">
          <AlertTriangle className="text-orange-500" size={20} strokeWidth={2.5} />
        </div>
      </div>

      {/* Lista de turistas */}
      <div className="space-y-3">
        {touristMembers.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
            className="flex items-center gap-4 p-3 bg-neutral-900/80 rounded border border-orange-500/20 hover:border-orange-500/40 transition-all"
          >
            {/* Avatar */}
            <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center flex-shrink-0 border border-orange-500/30">
              <span className="text-orange-500 font-bold text-sm">
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
              <p className="text-orange-500 font-bold text-sm">
                {member.lastCheckin}d
              </p>
              <p className="text-neutral-500 text-xs">sem check-in</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-neutral-800">
        <button
          onClick={() => navigate("/dashboard/alunos?filter=turistas")}
          className="w-full flex items-center justify-center gap-2 text-orange-500 hover:text-orange-400 transition-colors text-sm font-semibold uppercase tracking-wide"
        >
          Enviar notificação em lote
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </motion.div>
  );
}
