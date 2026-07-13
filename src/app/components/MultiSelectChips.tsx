import { motion } from "motion/react";

interface ChipOption {
  value: string;
  label: string;
}

interface MultiSelectChipsProps {
  label: string;
  options: ChipOption[];
  value: string[];
  onChange: (values: string[]) => void;
  required?: boolean;
}

export function MultiSelectChips({
  label,
  options,
  value,
  onChange,
  required,
}: MultiSelectChipsProps) {
  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-neutral-400 text-xs uppercase tracking-wider font-semibold">
        {label}
        {required && <span className="text-yellow-400 ml-1">*</span>}
      </label>
      <div className="flex gap-3 flex-wrap">
        {options.map((option) => {
          const isSelected = value.includes(option.value);
          return (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => toggleOption(option.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-5 py-3 rounded-md border-2 text-sm font-semibold uppercase tracking-wide
                transition-all duration-200
                ${
                  isSelected
                    ? "bg-yellow-400 border-yellow-400 text-yellow-900"
                    : "bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-yellow-400/50 hover:bg-neutral-800"
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
