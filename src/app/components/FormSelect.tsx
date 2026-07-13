import { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function FormSelect({
  label,
  error,
  options,
  className = "",
  required,
  ...props
}: FormSelectProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-neutral-400 text-xs uppercase tracking-wider font-semibold">
        {label}
        {required && <span className="text-yellow-400 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          {...props}
          className={`
            w-full bg-neutral-900 border-2 rounded-md px-4 py-3
            text-white text-sm
            appearance-none cursor-pointer
            transition-all duration-200
            ${
              error
                ? "border-orange-500 focus:border-orange-500"
                : "border-neutral-700 focus:border-yellow-400"
            }
            focus:outline-none focus:ring-0
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
          size={18}
        />
      </div>
      {error && (
        <span className="text-orange-500 text-xs font-medium">{error}</span>
      )}
    </div>
  );
}
