import { motion } from "motion/react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  Loader2,
} from "lucide-react";
import type { ClassSessionView } from "../../types/class";
import {
  CLASS_MODALITY_COLORS,
  CLASS_MODALITY_LABELS,
  DISPLAY_STATUS_LABELS,
} from "../../constants/classes";
import {
  formatClassTime,
  getPlanClassLimits,
  isModalityAllowed,
} from "../../utils/classCalculations";

interface ClassSessionCardProps {
  session: ClassSessionView;
  planSlug: string;
  loading?: boolean;
  onBook: () => void;
  onJoinWaitlist: () => void;
  onLeaveWaitlist: () => void;
  onCancel: () => void;
  onCheckIn: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  open: "text-emerald-400 bg-emerald-400/10",
  full: "text-red-400 bg-red-400/10",
  waitlist: "text-amber-400 bg-amber-400/10",
  booking_closed: "text-neutral-400 bg-neutral-800",
  booking_not_open: "text-blue-400 bg-blue-400/10",
  in_progress: "text-yellow-400 bg-yellow-400/10",
  ended: "text-neutral-500 bg-neutral-800",
  cancelled: "text-red-400 bg-red-400/10 line-through",
};

export function ClassSessionCard({
  session,
  planSlug,
  loading,
  onBook,
  onJoinWaitlist,
  onLeaveWaitlist,
  onCancel,
  onCheckIn,
}: ClassSessionCardProps) {
  const limits = getPlanClassLimits(planSlug);
  const modalityAllowed = isModalityAllowed(session.modality, limits);
  const isCancelled = session.displayStatus === "cancelled";
  const hasReservation = !!session.userReservationId;
  const onWaitlist = !!session.userWaitlistId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-neutral-900 to-neutral-800 border rounded-md p-4 ${
        isCancelled ? "border-red-500/30 opacity-75" : "border-neutral-700"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded ${CLASS_MODALITY_COLORS[session.modality]}`}
            >
              {CLASS_MODALITY_LABELS[session.modality]}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded ${STATUS_STYLES[session.displayStatus] ?? STATUS_STYLES.ended}`}
            >
              {DISPLAY_STATUS_LABELS[session.displayStatus]}
            </span>
            {!modalityAllowed && (
              <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded">
                Indisponível no plano
              </span>
            )}
          </div>

          <h3 className="text-white font-bold text-sm uppercase tracking-wide">
            {session.title}
          </h3>

          {session.description && (
            <p className="text-neutral-500 text-xs mt-1 line-clamp-2">
              {session.description}
            </p>
          )}
        </div>

        <div className="text-right shrink-0">
          <p className="text-white font-bold text-lg">
            {session.bookedCount}/{session.capacity}
          </p>
          <p className="text-neutral-500 text-[10px] uppercase tracking-wider flex items-center gap-1 justify-end">
            <Users size={10} />
            vagas
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-neutral-400">
        <span className="flex items-center gap-1.5">
          <Clock size={12} className="text-yellow-400" />
          {formatClassTime(session.startsAt)} – {formatClassTime(session.endsAt)}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin size={12} className="text-yellow-400" />
          {session.room}
        </span>
        {session.instructor && (
          <span className="flex items-center gap-1.5 col-span-2">
            <User size={12} className="text-yellow-400" />
            {session.instructor.fullName}
            {session.intensity && (
              <span className="text-neutral-600">· {session.intensity}</span>
            )}
          </span>
        )}
      </div>

      {session.bookingMessage && !hasReservation && !onWaitlist && (
        <p className="mt-3 text-xs text-neutral-500 flex items-center gap-1">
          <Calendar size={11} />
          {session.bookingMessage}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {hasReservation && (
          <>
            <span className="text-xs text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-md">
              Você está inscrito
            </span>
            {session.canCheckIn && (
              <button
                type="button"
                disabled={loading}
                onClick={onCheckIn}
                className="text-xs bg-yellow-400 text-yellow-900 font-bold uppercase tracking-wider px-3 py-1.5 rounded-md hover:bg-yellow-300 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : "Check-in"}
              </button>
            )}
            {session.canCancel && (
              <button
                type="button"
                disabled={loading}
                onClick={onCancel}
                className="text-xs border border-neutral-600 text-neutral-300 px-3 py-1.5 rounded-md hover:border-red-400/50 hover:text-red-400 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            )}
          </>
        )}

        {onWaitlist && (
          <>
            <span className="text-xs text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-md">
              Na lista de espera
            </span>
            <button
              type="button"
              disabled={loading}
              onClick={onLeaveWaitlist}
              className="text-xs border border-neutral-600 text-neutral-300 px-3 py-1.5 rounded-md hover:border-red-400/50 hover:text-red-400 transition-colors disabled:opacity-50"
            >
              Sair da fila
            </button>
          </>
        )}

        {!hasReservation && !onWaitlist && !isCancelled && (
          <>
            {session.canBook && modalityAllowed && (
              <button
                type="button"
                disabled={loading}
                onClick={onBook}
                className="text-xs bg-yellow-400 text-yellow-900 font-bold uppercase tracking-wider px-4 py-1.5 rounded-md hover:bg-yellow-300 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : "Reservar"}
              </button>
            )}
            {session.canJoinWaitlist && modalityAllowed && (
              <button
                type="button"
                disabled={loading}
                onClick={onJoinWaitlist}
                className="text-xs border border-amber-400/50 text-amber-400 px-4 py-1.5 rounded-md hover:bg-amber-400/10 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : "Lista de espera"}
              </button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
