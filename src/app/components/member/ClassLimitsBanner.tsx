import { AlertTriangle, Ban, Info } from "lucide-react";
import type { ClassBookingContext } from "../../types/class";
import {
  countActiveReservations,
  getPlanClassLimits,
} from "../../utils/classCalculations";

interface ClassLimitsBannerProps {
  context: ClassBookingContext;
  subscriptionStatus: string;
}

export function ClassLimitsBanner({
  context,
  subscriptionStatus,
}: ClassLimitsBannerProps) {
  const limits = getPlanClassLimits(context.planSlug);
  const activeCount = countActiveReservations(context.activeReservations);
  const canBook = subscriptionStatus === "ativo";

  if (context.bookingBlockedUntil) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4 flex items-start gap-3">
        <Ban className="text-red-400 shrink-0 mt-0.5" size={18} />
        <div>
          <p className="text-red-300 text-sm font-medium">
            Agendamentos bloqueados por excesso de no-shows
          </p>
          <p className="text-red-400/80 text-xs mt-1">
            Você acumulou {context.noShowCount} no-shows em{" "}
            {context.settings.noShowPeriodDays} dias. Novos agendamentos liberados
            em {new Date(context.bookingBlockedUntil).toLocaleDateString("pt-BR")}.
          </p>
        </div>
      </div>
    );
  }

  if (!canBook) {
    return (
      <div className="bg-orange-500/10 border border-orange-500/30 rounded-md p-4 flex items-start gap-3">
        <AlertTriangle className="text-orange-400 shrink-0 mt-0.5" size={18} />
        <div>
          <p className="text-orange-300 text-sm font-medium">
            Agendamento indisponível
          </p>
          <p className="text-orange-400/80 text-xs mt-1">
            {subscriptionStatus === "inadimplente"
              ? "Regularize seu plano para agendar aulas coletivas."
              : subscriptionStatus === "congelado"
                ? "Seu plano está congelado. Você pode visualizar a grade, mas não agendar."
                : "É necessário um plano ativo e adimplente para reservar aulas."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-md p-4 flex items-start gap-3">
      <Info className="text-yellow-400 shrink-0 mt-0.5" size={18} />
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-neutral-400">
        <span>
          Reservas ativas:{" "}
          <strong className="text-white">
            {activeCount}/{limits.maxActiveReservations}
          </strong>
        </span>
        {limits.maxClassesPerMonth !== null && (
          <span>
            Aulas no mês:{" "}
            <strong className="text-white">
              {context.monthlyBookingsCount}/{limits.maxClassesPerMonth}
            </strong>
          </span>
        )}
        {context.noShowCount > 0 && (
          <span>
            No-shows:{" "}
            <strong className="text-orange-400">
              {context.noShowCount}/{context.settings.maxNoShowsPeriod}
            </strong>
          </span>
        )}
        <span>
          Cancelamento sem penalidade até{" "}
          <strong className="text-white">
            {context.settings.cancelLimitHours}h
          </strong>{" "}
          antes
        </span>
      </div>
    </div>
  );
}
