import type { ClassReservation } from "../../types/class";
import { ClassReservationCard } from "./ClassReservationCard";
import { RESERVATION_STATUS_LABELS } from "../../constants/classes";
import { formatClassDate } from "../../utils/classCalculations";

interface ClassHistoryPanelProps {
  reservations: ClassReservation[];
}

export function ClassHistoryPanel({ reservations }: ClassHistoryPanelProps) {
  if (reservations.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500">
        <p className="text-sm">Nenhuma aula no histórico ainda.</p>
        <p className="text-xs mt-1">
          Presenças, cancelamentos e no-shows aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reservations.map((reservation) => (
        <div key={reservation.id} className="relative">
          <ClassReservationCard reservation={reservation} />
          <p className="text-[10px] text-neutral-600 mt-1 px-1">
            {reservation.status === "cancelled" || reservation.status === "late_cancel"
              ? `Cancelada em ${reservation.cancelledAt ? formatClassDate(reservation.cancelledAt) : "—"}`
              : reservation.status === "attended" && reservation.checkedInAt
                ? `Check-in em ${new Date(reservation.checkedInAt).toLocaleString("pt-BR")}`
                : `${RESERVATION_STATUS_LABELS[reservation.status]} · reservada em ${new Date(reservation.reservedAt).toLocaleDateString("pt-BR")}`}
          </p>
        </div>
      ))}
    </div>
  );
}
