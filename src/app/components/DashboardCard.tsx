import { motion } from "motion/react";
import { ReactNode } from "react";

interface DashboardCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  delay?: number;
}

export function DashboardCard({
  title,
  children,
  className = "",
  hoverable = true,
  delay = 0,
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hoverable ? { y: -5 } : {}}
      className={`
        bg-gradient-to-br from-neutral-900 to-neutral-800
        border border-neutral-700
        rounded-md
        p-6
        transition-all duration-300
        ${hoverable ? "hover:border-yellow-400/50" : ""}
        ${className}
      `}
    >
      {title && (
        <h3 className="font-display text-xl font-bold uppercase mb-4 text-white tracking-wide">
          {title}
        </h3>
      )}
      {children}
    </motion.div>
  );
}
