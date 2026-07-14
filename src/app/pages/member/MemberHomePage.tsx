import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Dumbbell,
  ClipboardCheck,
  CalendarDays,
  CreditCard,
  Flame,
  ChevronRight,
} from "lucide-react";
import { MemberLayout } from "../../components/member/MemberLayout";
import { RequireMemberAccess } from "../../components/auth/RequireMemberAccess";
import { useAuth } from "../../contexts/AuthContext";
import { fetchMemberSubscription } from "../../services/subscriptionService";
import { formatDateBR } from "../../utils/subscriptionCalculations";
import { SUBSCRIPTION_STATUS_LABELS } from "../../constants/subscriptions";
export default function MemberHomePage() {
  const navigate = useNavigate();
  const { profile, session } = useAuth();
  const [planLabel, setPlanLabel] = useState("Nenhum plano contratado");

  useEffect(() => {
    if (!session?.user.id) return;
    fetchMemberSubscription(session.user.id).then((sub) => {
      if (!sub) {
        setPlanLabel("Contrate um plano");
        return;
      }
      const name = sub.plan?.name ?? sub.planId;
      const status = SUBSCRIPTION_STATUS_LABELS[sub.status];
      const renewal = sub.nextBillingDate
        ? ` · Renova ${formatDateBR(sub.nextBillingDate)}`
        : "";
      setPlanLabel(`${name} · ${status}${renewal}`);
    });
  }, [session?.user.id]);

  const quickActions = [
    {
      icon: Dumbbell,
      title: "Meu Treino",
      description: "Ficha A — Peito e Tríceps",
      path: "/portal/treino",
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
    {
      icon: ClipboardCheck,
      title: "Check-in",
      description: "Registrar entrada na academia",
      path: "/portal/check-in",
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      icon: CalendarDays,
      title: "Próxima Aula",
      description: "HIIT — Hoje às 19h",
      path: "/portal/aulas",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      icon: CreditCard,
      title: "Meu Plano",
      description: planLabel,
      path: "/portal/plano",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  const firstName =
    profile?.fullName.split(" ")[0] ??
    profile?.email.split("@")[0]?.split(".")[0] ??
    "atleta";

  return (
    <RequireMemberAccess>
      <MemberLayout
        title="Bem-vindo de volta"
        subtitle="Seu painel de treinos, check-ins e evolução"
      >
        {profile?.parQStatus === "encaminhar_avaliacao" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-orange-500/10 border border-orange-500/30 rounded-md p-4 text-sm text-orange-300"
          >
            Seu PAR-Q indica necessidade de avaliação profissional. Treinos automáticos
            estão bloqueados até liberação da equipe. Check-in e aulas seguem disponíveis.
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-neutral-300 text-lg capitalize">
            Olá, <span className="text-yellow-400 font-semibold">{firstName}</span>.
            Pronto para treinar hoje?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-yellow-400/30 rounded-md p-6 mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-500/20 rounded-full flex items-center justify-center">
              <Flame className="text-orange-500" size={28} />
            </div>
            <div>
              <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">
                Sequência ativa
              </p>
              <p className="text-white font-display text-3xl font-black">
                12 <span className="text-lg text-neutral-400">dias</span>
              </p>
            </div>
          </div>
          <p className="text-neutral-400 text-sm hidden sm:block">
            Continue assim para desbloquear o badge &quot;Disciplina de Ferro&quot;
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;

            return (
              <motion.button
                key={action.title}
                type="button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
                onClick={() => navigate(action.path)}
                className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-6 text-left hover:border-yellow-400/50 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 ${action.bg} rounded-md flex items-center justify-center mb-4`}>
                    <Icon className={action.color} size={24} />
                  </div>
                  <ChevronRight
                    size={20}
                    className="text-neutral-600 group-hover:text-yellow-400 transition-colors"
                  />
                </div>
                <h3 className="text-white font-bold uppercase text-sm tracking-wide mb-1">
                  {action.title}
                </h3>
                <p className="text-neutral-400 text-sm">{action.description}</p>
              </motion.button>
            );
          })}
        </div>
      </MemberLayout>
    </RequireMemberAccess>
  );
}
