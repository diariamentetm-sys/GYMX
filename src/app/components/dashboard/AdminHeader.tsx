import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Radio } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-neutral-900 border-b border-neutral-800 px-6 lg:px-8 py-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl lg:text-5xl font-black uppercase text-white mb-2">
              {title}
            </h1>
            <p className="text-neutral-500 text-sm">{subtitle}</p>
          </motion.div>

          {/* Ativar Recepção Button */}
          <motion.button
            onClick={() => navigate("/modo-recepcao")}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-400 text-white rounded-md font-bold text-sm uppercase tracking-wide transition-colors shadow-lg shadow-orange-500/20"
          >
            <Radio size={18} strokeWidth={2.5} />
            Ativar Recepção
          </motion.button>
        </div>
      </div>
    </div>
  );
}
