import { motion } from "motion/react";
import { ReactNode } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}

export function AnimatedButton({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  fullWidth = false,
}: AnimatedButtonProps) {
  const variants = {
    primary: "bg-yellow-400 text-yellow-900 hover:bg-yellow-300",
    secondary: "bg-orange-500 text-white hover:bg-orange-700",
    outline:
      "bg-transparent border-2 border-neutral-700 text-white hover:border-yellow-400 hover:text-yellow-400",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-8 py-4 text-sm",
    lg: "px-12 py-5 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        rounded font-semibold uppercase tracking-wide
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
