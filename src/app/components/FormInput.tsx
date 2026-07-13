import { motion } from "motion/react";
import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: "email" | "password";
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, type, icon, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = type === "password" && showPassword ? "text" : type;

    const IconComponent = icon === "email" ? Mail : icon === "password" ? Lock : null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full space-y-2"
      >
        {/* Label */}
        <label className="block text-neutral-300 text-xs font-semibold uppercase tracking-[0.1em] font-body">
          {label}
        </label>

        {/* Input Container */}
        <div className="relative">
          {/* Icon */}
          {IconComponent && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
              <IconComponent size={20} strokeWidth={1.5} />
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={inputType}
            className={`
              w-full bg-neutral-900 border border-neutral-700
              rounded-md px-4 py-3.5
              ${IconComponent ? "pl-12" : ""}
              ${type === "password" ? "pr-12" : ""}
              text-neutral-050 text-base font-body
              placeholder:text-neutral-500
              focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400
              transition-all duration-300
              hover:border-neutral-600
              ${error ? "border-orange-500 focus:border-orange-500 focus:ring-orange-500" : ""}
              ${className}
            `}
            {...props}
          />

          {/* Password Toggle */}
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-yellow-400 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff size={20} strokeWidth={1.5} />
              ) : (
                <Eye size={20} strokeWidth={1.5} />
              )}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-orange-500 text-sm font-medium"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

FormInput.displayName = "FormInput";
