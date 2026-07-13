import { motion } from "motion/react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "white";
}

export function LoadingSpinner({
  size = "md",
  color = "primary",
}: LoadingSpinnerProps) {
  const sizes = {
    sm: "w-6 h-6 border-2",
    md: "w-12 h-12 border-3",
    lg: "w-16 h-16 border-4",
  };

  const colors = {
    primary: "border-yellow-400 border-t-transparent",
    secondary: "border-orange-500 border-t-transparent",
    white: "border-white border-t-transparent",
  };

  return (
    <motion.div
      className={`rounded-full ${sizes[size]} ${colors[color]}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}
