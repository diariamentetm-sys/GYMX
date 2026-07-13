import { motion } from "motion/react";

interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleButtonsProps {
  question: string;
  options: ToggleOption[];
  value?: string;
  onChange: (value: string) => void;
  name: string;
}

export function ToggleButtons({
  question,
  options,
  value,
  onChange,
  name,
}: ToggleButtonsProps) {
  return (
    <div className="bg-neutral-900/50 border border-neutral-700/50 rounded-md p-4 hover:border-neutral-600/50 transition-all">
      <p className="text-white text-sm mb-3">{question}</p>
      <div className="flex gap-2 flex-wrap">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-4 py-2 rounded border-2 text-sm font-semibold uppercase tracking-wide
                transition-all duration-200
                ${
                  isSelected
                    ? "bg-yellow-400 border-yellow-400 text-yellow-900"
                    : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-yellow-400/50"
                }
              `}
            >
              {option.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
