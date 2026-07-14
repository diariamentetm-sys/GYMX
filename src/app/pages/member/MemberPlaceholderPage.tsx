import { motion } from "motion/react";
import { Construction } from "lucide-react";
import { MemberLayout } from "../../components/member/MemberLayout";
import { RequireMemberAccess } from "../../components/auth/RequireMemberAccess";

interface MemberPlaceholderPageProps {
  title: string;
  subtitle: string;
}

export default function MemberPlaceholderPage({
  title,
  subtitle,
}: MemberPlaceholderPageProps) {
  return (
    <RequireMemberAccess>
      <MemberLayout title={title} subtitle={subtitle}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-12 text-center"
        >
          <div className="w-20 h-20 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Construction className="text-yellow-400" size={40} strokeWidth={2} />
          </div>
          <h2 className="font-display text-3xl font-black uppercase text-white mb-3">
            Em breve
          </h2>
          <p className="text-neutral-500 text-base max-w-md mx-auto">
            Esta funcionalidade está sendo desenvolvida conforme as regras de
            negócio da área do aluno GYMX.
          </p>
        </motion.div>
      </MemberLayout>
    </RequireMemberAccess>
  );
}
