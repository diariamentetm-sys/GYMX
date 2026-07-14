import {
  DEFAULT_PLAN_LIMITS,
  PLAN_CLASS_LIMITS,
} from "../constants/classes";
import type {
  ClassBookingContext,
  ClassDisplayStatus,
  ClassModality,
  ClassReservation,
  ClassSession,
  ClassSessionView,
  ClassSettings,
  ClassWaitlistEntry,
  DayPeriod,
  PlanClassLimits,
} from "../types/class";

export function canBookClasses(subscriptionStatus: string): boolean {
  return subscriptionStatus === "ativo";
}

export function getPlanClassLimits(planSlug?: string): PlanClassLimits {
  if (!planSlug) return DEFAULT_PLAN_LIMITS;
  return PLAN_CLASS_LIMITS[planSlug] ?? DEFAULT_PLAN_LIMITS;
}

export function isModalityAllowed(
  modality: ClassModality,
  limits: PlanClassLimits
): boolean {
  return limits.allowedModalities.includes(modality);
}

function parseDate(iso: string): Date {
  return new Date(iso);
}

export function getBookingWindow(
  session: ClassSession,
  settings: ClassSettings
): { opensAt: Date; closesAt: Date } {
  const startsAt = parseDate(session.startsAt);
  const opensAt = new Date(startsAt);
  opensAt.setDate(opensAt.getDate() - settings.bookingOpenDays);
  const closesAt = new Date(startsAt);
  closesAt.setMinutes(closesAt.getMinutes() - settings.bookingCloseMinutes);
  return { opensAt, closesAt };
}

export function isWithinBookingWindow(
  session: ClassSession,
  settings: ClassSettings,
  now = new Date()
): boolean {
  if (session.status === "cancelled") return false;
  const { opensAt, closesAt } = getBookingWindow(session, settings);
  return now >= opensAt && now <= closesAt && now < parseDate(session.startsAt);
}

export function isCheckinWindowOpen(
  session: ClassSession,
  settings: ClassSettings,
  now = new Date()
): boolean {
  const startsAt = parseDate(session.startsAt);
  const windowStart = new Date(startsAt);
  windowStart.setMinutes(windowStart.getMinutes() - settings.checkinBeforeMinutes);
  const windowEnd = new Date(startsAt);
  windowEnd.setMinutes(windowEnd.getMinutes() + settings.checkinAfterMinutes);
  return now >= windowStart && now <= windowEnd;
}

export function canCancelReservation(
  session: ClassSession,
  settings: ClassSettings,
  now = new Date()
): boolean {
  if (now >= parseDate(session.startsAt)) return false;
  return true;
}

export function isLateCancellation(
  session: ClassSession,
  settings: ClassSettings,
  now = new Date()
): boolean {
  const startsAt = parseDate(session.startsAt);
  const hoursUntil = (startsAt.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursUntil < settings.cancelLimitHours;
}

export function hasTimeConflict(
  session: ClassSession,
  reservations: ClassReservation[],
  sessionsById: Map<string, ClassSession>
): ClassSession | null {
  const start = parseDate(session.startsAt).getTime();
  const end = parseDate(session.endsAt).getTime();

  for (const reservation of reservations) {
    if (reservation.status !== "confirmed") continue;
    if (reservation.sessionId === session.id) continue;

    const other = sessionsById.get(reservation.sessionId);
    if (!other) continue;

    const otherStart = parseDate(other.startsAt).getTime();
    const otherEnd = parseDate(other.endsAt).getTime();

    if (start < otherEnd && end > otherStart) {
      return other;
    }
  }

  return null;
}

export function countActiveReservations(reservations: ClassReservation[]): number {
  return reservations.filter((r) => r.status === "confirmed").length;
}

export function getDisplayStatus(
  session: ClassSession,
  settings: ClassSettings,
  now = new Date()
): ClassDisplayStatus {
  if (session.status === "cancelled") return "cancelled";

  const startsAt = parseDate(session.startsAt);
  const endsAt = parseDate(session.endsAt);

  if (now >= endsAt || session.status === "completed") return "ended";
  if (now >= startsAt) return "in_progress";

  const { opensAt, closesAt } = getBookingWindow(session, settings);

  if (now < opensAt) return "booking_not_open";
  if (now > closesAt) return "booking_closed";

  const spots = session.capacity - session.bookedCount;
  if (spots <= 0) return "full";

  return "open";
}

export function getBookingMessage(
  session: ClassSession,
  settings: ClassSettings,
  displayStatus: ClassDisplayStatus
): string | undefined {
  const { opensAt, closesAt } = getBookingWindow(session, settings);

  switch (displayStatus) {
    case "booking_not_open":
      return `Reservas abrem em ${opensAt.toLocaleDateString("pt-BR")} às ${opensAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
    case "booking_closed":
      return `Agendamento encerrado (${settings.bookingCloseMinutes} min antes do início)`;
    case "full":
      return "Aula lotada — entre na lista de espera";
    case "cancelled":
      return "Aula cancelada pela academia";
    case "ended":
      return "Aula encerrada";
    case "in_progress":
      return "Aula em andamento";
    default:
      return undefined;
  }
}

export function enrichSessionView(
  session: ClassSession,
  context: ClassBookingContext,
  now = new Date()
): ClassSessionView {
  const limits = getPlanClassLimits(context.planSlug);
  const displayStatus = getDisplayStatus(session, context.settings, now);
  const spotsAvailable = Math.max(0, session.capacity - session.bookedCount);
  const bookingMessage = getBookingMessage(session, context.settings, displayStatus);

  const userReservation = context.activeReservations.find(
    (r) => r.sessionId === session.id && r.status === "confirmed"
  );
  const userWaitlist = context.waitlistEntries.find(
    (w) => w.sessionId === session.id && w.status === "waiting"
  );

  const canBookBase =
    context.subscriptionStatus === "ativo" &&
    isModalityAllowed(session.modality, limits) &&
    isWithinBookingWindow(session, context.settings, now) &&
    displayStatus === "open" &&
    !userReservation &&
    !userWaitlist &&
    !context.bookingBlockedUntil;

  const activeCount = countActiveReservations(context.activeReservations);
  const withinActiveLimit = activeCount < limits.maxActiveReservations;
  const withinMonthlyLimit =
    limits.maxClassesPerMonth === null ||
    context.monthlyBookingsCount < limits.maxClassesPerMonth;

  const sessionsById = new Map([[session.id, session]]);
  for (const r of context.activeReservations) {
    if (r.session) sessionsById.set(r.sessionId, r.session);
  }
  const conflict = hasTimeConflict(session, context.activeReservations, sessionsById);

  let canBook = canBookBase && withinActiveLimit && withinMonthlyLimit && !conflict;
  let canJoinWaitlist =
    context.subscriptionStatus === "ativo" &&
    isModalityAllowed(session.modality, limits) &&
    (displayStatus === "full" || displayStatus === "waitlist") &&
    isWithinBookingWindow(session, context.settings, now) &&
    !userReservation &&
    !userWaitlist &&
    withinActiveLimit &&
    withinMonthlyLimit &&
    !conflict &&
    !context.bookingBlockedUntil;

  if (displayStatus === "full" && canJoinWaitlist) {
    // display as waitlist-available
  }

  return {
    ...session,
    displayStatus: displayStatus === "full" && canJoinWaitlist ? "waitlist" : displayStatus,
    spotsAvailable,
    bookingMessage,
    userReservationId: userReservation?.id,
    userWaitlistId: userWaitlist?.id,
    canBook,
    canJoinWaitlist: displayStatus === "full" && canJoinWaitlist,
    canCancel: !!userReservation && canCancelReservation(session, context.settings, now),
    canCheckIn:
      !!userReservation &&
      userReservation.status === "confirmed" &&
      isCheckinWindowOpen(session, context.settings, now),
  };
}

export function filterSessionsByPeriod(
  sessions: ClassSession[],
  period: DayPeriod
): ClassSession[] {
  if (period === "all") return sessions;

  return sessions.filter((session) => {
    const hour = parseDate(session.startsAt).getHours();
    if (period === "morning") return hour < 12;
    if (period === "afternoon") return hour >= 12 && hour < 18;
    return hour >= 18;
  });
}

export function groupSessionsByDay(sessions: ClassSession[]): Record<string, ClassSession[]> {
  return sessions.reduce<Record<string, ClassSession[]>>((acc, session) => {
    const key = parseDate(session.startsAt).toLocaleDateString("pt-BR");
    if (!acc[key]) acc[key] = [];
    acc[key].push(session);
    return acc;
  }, {});
}

export function formatClassTime(iso: string): string {
  return parseDate(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatClassDate(iso: string): string {
  return parseDate(iso).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

export function getWeekStartDate(offsetWeeks = 0): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff + offsetWeeks * 7);
  return monday;
}

export function getWeekEndDate(weekStart: Date): Date {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}
