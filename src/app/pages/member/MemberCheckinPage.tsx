import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AlertTriangle, ClipboardCheck, QrCode } from "lucide-react";
import { MemberLayout } from "../../components/member/MemberLayout";
import { RequireMemberAccess } from "../../components/auth/RequireMemberAccess";
import { useAuth } from "../../contexts/AuthContext";
import { fetchMemberSubscription } from "../../services/subscriptionService";
import { isCheckinBlocked } from "../../utils/subscriptionCalculations";
import { SUBSCRIPTION_STATUS_LABELS } from "../../constants/subscriptions";

export default function MemberCheckinPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [blocked, setBlocked] = useState(true);
  const [statusLabel, setStatusLabel] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const memberId = session?.user.id;
    if (!memberId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchMemberSubscription(memberId).then((sub) => {
      setBlocked(isCheckinBlocked(sub));
      setStatusLabel(sub ? SUBSCRIPTION_STATUS_LABELS[sub.status] : "Sem plano");
      setLoading(false);
    });
  }, [session?.user.id]);

  return (
    <RequireMemberAccess>
      <MemberLayout
        title="Check-in"
        subtitle="Registre sua entrada via QR Code ou proximidade"
      >
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : blocked ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-orange-500/30 rounded-md p-8"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="text-orange-400 shrink-0" size={32} />
              <div>
                <h2 className="font-display text-2xl font-black uppercase text-white mb-2">
                  Check-in indisponível
                </h2>
                <p className="text-neutral-300 text-sm mb-4">
                  Status do plano: <strong>{statusLabel}</strong>. É necessário um plano
                  ativo e adimplente para registrar entrada na academia.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/portal/plano")}
                  className="bg-yellow-400 text-yellow-900 px-6 py-3 rounded-md font-bold uppercase text-sm tracking-wider hover:bg-yellow-300"
                >
                  Ir para Meu Plano
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-green-500/30 rounded-md p-8 text-center"
          >
            <div className="w-48 h-48 bg-white rounded-md mx-auto mb-6 flex items-center justify-center">
              <QrCode className="text-neutral-900" size={120} />
            </div>
            <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
              <ClipboardCheck size={20} />
              <span className="font-semibold uppercase text-sm">Plano ativo</span>
            </div>
            <p className="text-neutral-400 text-sm">
              Apresente este QR Code na catraca. Token renovado a cada 60 segundos (módulo 4).
            </p>
          </motion.div>
        )}
      </MemberLayout>
    </RequireMemberAccess>
  );
}
