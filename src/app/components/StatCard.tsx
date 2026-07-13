import { motion } from "motion/react";
import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  delay?: number;
}

export function StatCard({ label, value, icon, trend, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 p-6 rounded-md hover:border-yellow-400/50 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-orange-500 text-xs font-semibold uppercase tracking-widest">
          {label}
        </div>
        {icon && <div className="text-yellow-400">{icon}</div>}
      </div>

      <div className="font-display text-4xl font-black text-white mb-2">
        {value}
      </div>

      {trend && (
        <div
          className={`text-xs font-medium ${
            trend.isPositive ? "text-green-400" : "text-red-400"
          }`}
        >
          {trend.isPositive ? "↑" : "↓"} {trend.value}
        </div>
      )}
    </motion.div>
  );
}
