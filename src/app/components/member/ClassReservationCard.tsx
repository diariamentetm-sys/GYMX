import { motion } from "motion/react";
import { Calendar, Clock, Loader2, MapPin, User } from "lucide-react";
import type { ClassReservation } from "../../types/class";
import {
  CLASS_MODALITY_COLORS,
  CLASS_MODALITY_LABELS,
  RESERVATION_STATUS_LABELS,
} from "../../constants/classes";
import { formatClassDate, formatClassTime } from "../../utils/classCalculations";

interface ClassReservationCardProps {
  reservation: ClassReservation;
  loading?: boolean;
  onCancel?: () => void;
  onCheckIn?: () => void;
  showCheckIn?: boolean;
  showCancel?: boolean;
}

export function ClassReservationCard({
  reservation,
  loading,
  onCancel,
  onCheckIn,
  showCheckIn,
  showCancel,
}: ClassReservationCardProps) {
  const session = reservation.session;
  if (!session) return null;

  const statusLabel = RESERVATION_STATUS_LABELS[reservation.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-900 border border-neutral-800 rounded-md p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span
            className={`text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded ${CLASS_MODALITY_COLORS[session.modality]}`}
          >
            {CLASS_MODALITY_LABELS[session.modality]}
          </span>
          <h3 className="text-white font-bold text-sm uppercase tracking-wide mt-2">
            {session.title}
          </h3>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded shrink-0 ${
            reservation.status === "confirmed"
              ? "text-emerald-400 bg-emerald-400/10"
              : reservation.status === "attended"
                ? "text-blue-400 bg-blue-400/10"
                : reservation.status === "no_show"
                  ? "text-red-400 bg-red-400/10"
                  : "text-neutral-400 bg-neutral-800"
          }`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="mt-3 space-y-1.5 text-xs text-neutral-400">
        <p className="flex items-center gap-1.5">
          <Calendar size={12} className="text-yellow-400" />
          {formatClassDate(session.startsAt)}
        </p>
        <p className="flex items-center gap-1.5">
          <Clock size={12} className="text-yellow-400" />
          {formatClassTime(session.startsAt)} – {formatClassTime(session.endsAt)}
        </p>
        <p className="flex items-center gap-1.5">
          <MapPin size={12} className="text-yellow-400" />
          {session.room}
        </p>
        {session.instructor && (
          <p className="flex items-center gap-1.5">
            <User size={12} className="text-yellow-400" />
            {session.instructor.fullName}
          </p>
        )}
      </div>

      {(showCheckIn || showCancel) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {showCheckIn && onCheckIn && (
            <button
              type="button"
              disabled={loading}
              onClick={onCheckIn}
              className="text-xs bg-yellow-400 text-yellow-900 font-bold uppercase tracking-wider px-4 py-1.5 rounded-md hover:bg-yellow-300 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : "Check-in"}
            </button>
          )}
          {showCancel && onCancel && (
            <button
              type="button"
              disabled={loading}
              onClick={onCancel}
              className="text-xs border border-neutral-600 text-neutral-300 px-4 py-1.5 rounded-md hover:border-red-400/50 hover:text-red-400 transition-colors disabled:opacity-50"
            >
              Cancelar reserva
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
