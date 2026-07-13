import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface FormSectionHeaderProps {
  number: number;
  title: string;
  icon: LucideIcon;
  subtitle?: string;
  delay?: number;
}

export function FormSectionHeader({
  number,
  title,
  icon: Icon,
  subtitle,
  delay = 0,
}: FormSectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex items-center gap-4 pb-4 border-b-2 border-yellow-400 mb-6"
    >
      {/* Number Circle */}
      <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-yellow-900 font-display text-2xl font-black">
          {number}
        </span>
      </div>

      {/* Icon */}
      <div className="w-10 h-10 bg-yellow-400/10 rounded-md flex items-center justify-center flex-shrink-0">
        <Icon className="text-yellow-400" size={20} strokeWidth={2.5} />
      </div>

      {/* Title */}
      <div className="flex-1">
        <h2 className="font-display text-2xl font-black uppercase text-white tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-neutral-500 text-sm mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
