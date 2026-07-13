import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface MetricCardProps {
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  alert?: boolean;
  delay?: number;
}

export function MetricCard({
  icon: Icon,
  iconColor = "text-yellow-400",
  iconBg = "bg-yellow-400/10",
  label,
  value,
  subtitle,
  trend,
  alert = false,
  delay = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className={`
        relative
        bg-gradient-to-br from-neutral-900 to-neutral-800
        border
        ${alert ? "border-orange-500/50 bg-orange-500/5" : "border-neutral-700"}
        rounded-md
        p-6
        hover:border-yellow-400/50
        transition-all duration-300
      `}
    >
      {/* Ícone */}
      <div className={`w-12 h-12 ${iconBg} rounded-md flex items-center justify-center mb-4`}>
        <Icon className={iconColor} size={24} strokeWidth={2} />
      </div>

      {/* Label */}
      <div className="text-neutral-500 text-xs uppercase tracking-wider font-semibold mb-2">
        {label}
      </div>

      {/* Value */}
      <div className="font-display text-5xl font-black text-white mb-2">
        {value}
      </div>

      {/* Subtitle ou Trend */}
      {subtitle && (
        <p className="text-neutral-400 text-sm">{subtitle}</p>
      )}

      {trend && (
        <div className="flex items-center gap-2 mt-2">
          <span
            className={`text-sm font-semibold ${
              trend.isPositive ? "text-green-400" : "text-orange-500"
            }`}
          >
            {trend.isPositive ? "↑" : "↓"} {trend.value}
          </span>
          <span className="text-neutral-500 text-xs">vs mês anterior</span>
        </div>
      )}

      {/* Alert indicator */}
      {alert && (
        <div className="absolute top-4 right-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-orange-500 rounded-full"
          />
        </div>
      )}
    </motion.div>
  );
}
