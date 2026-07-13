import { motion } from "motion/react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Badge({ children, variant = "primary", size = "md" }: BadgeProps) {
  const variants = {
    primary: "bg-yellow-400 text-yellow-900",
    secondary: "bg-orange-500 text-white",
    outline: "bg-transparent border-2 border-yellow-400 text-yellow-400",
  };

  const sizes = {
    sm: "px-2 py-1 text-[10px]",
    md: "px-3 py-1.5 text-xs",
    lg: "px-4 py-2 text-sm",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center justify-center font-semibold uppercase tracking-widest rounded ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </motion.div>
  );
}
