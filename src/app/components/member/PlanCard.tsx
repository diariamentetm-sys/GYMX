import { motion } from "motion/react";
import { Check, CreditCard } from "lucide-react";
import type { GymPlan } from "../../types/subscription";
import { formatCurrency } from "../../utils/subscriptionCalculations";

interface PlanCardProps {
  plan: GymPlan;
  featured?: boolean;
  actionLabel: string;
  onSelect: () => void;
  disabled?: boolean;
  current?: boolean;
}

export function PlanCard({
  plan,
  featured,
  actionLabel,
  onSelect,
  disabled,
  current,
}: PlanCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-gradient-to-br from-neutral-900 to-neutral-800 border rounded-md p-6 flex flex-col ${
        featured ? "border-yellow-400 border-2" : "border-neutral-700"
      } ${current ? "ring-2 ring-green-500/50" : ""}`}
    >
      <div
        className={`absolute -top-3 left-6 px-3 py-1 rounded text-xs font-bold uppercase ${
          featured ? "bg-yellow-400 text-yellow-900" : "bg-neutral-700 text-white"
        }`}
      >
        {plan.badge}
      </div>

      <h3 className="font-display text-2xl font-black text-white mt-4 mb-1">
        {plan.name.toUpperCase()}
      </h3>
      <p className="text-neutral-400 text-sm mb-4">{plan.description}</p>

      <div className="mb-4">
        <span className="text-yellow-400 font-display text-4xl font-black">
          {formatCurrency(plan.monthlyPrice)}
        </span>
        <span className="text-neutral-500 text-sm">/mês</span>
      </div>

      <p className="text-neutral-500 text-xs mb-3">
        Fidelidade: {plan.loyaltyMonths} meses · {plan.scheduleLabel}
      </p>

      <ul className="space-y-2 mb-6 flex-1">
        {plan.benefits.slice(0, 5).map((benefit) => (
          <li key={benefit} className="flex items-start gap-2 text-neutral-300 text-sm">
            <Check size={14} className="text-yellow-400 mt-0.5 shrink-0" />
            {benefit}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onSelect}
        disabled={disabled || current}
        className={`w-full py-3 rounded-md font-bold uppercase text-sm tracking-wider transition-colors disabled:opacity-50 ${
          featured
            ? "bg-yellow-400 text-yellow-900 hover:bg-yellow-300"
            : "bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-600"
        }`}
      >
        {current ? "Plano atual" : actionLabel}
      </button>
    </motion.div>
  );
}

interface PaymentModalProps {
  amount: number;
  title: string;
  description: string;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
  isLoading: boolean;
}

export function PaymentModal({
  amount,
  title,
  description,
  onApprove,
  onReject,
  onClose,
  isLoading,
}: PaymentModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-neutral-900 border border-neutral-700 rounded-md p-6 max-w-md w-full"
      >
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="text-yellow-400" size={24} />
          <h3 className="text-white font-bold uppercase text-sm">{title}</h3>
        </div>

        <p className="text-neutral-400 text-sm mb-4">{description}</p>

        <p className="text-yellow-400 font-display text-3xl font-black mb-6">
          {formatCurrency(amount)}
        </p>

        <p className="text-neutral-500 text-xs mb-6">
          Simulação de pagamento (integração com gateway no módulo 3).
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={onApprove}
            className="flex-1 bg-yellow-400 text-yellow-900 py-3 rounded-md font-bold uppercase text-sm hover:bg-yellow-300 disabled:opacity-50"
          >
            Aprovar pagamento
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onReject}
            className="flex-1 border border-orange-500/50 text-orange-400 py-3 rounded-md font-bold uppercase text-sm hover:bg-orange-500/10 disabled:opacity-50"
          >
            Recusar
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-3 text-neutral-500 text-sm py-2 hover:text-white"
        >
          Fechar
        </button>
      </motion.div>
    </div>
  );
}
