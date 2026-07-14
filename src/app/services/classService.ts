import { supabase } from "../lib/supabase";
import type {
  ClassBookingContext,
  ClassInstructor,
  ClassModality,
  ClassReservation,
  ClassReservationStatus,
  ClassSession,
  ClassSettings,
  ClassWaitlistEntry,
} from "../types/class";

interface SettingsRow {
  id: string;
  unit_name: string;
  booking_open_days: number;
  booking_close_minutes: number;
  cancel_limit_hours: number;
  checkin_before_minutes: number;
  checkin_after_minutes: number;
  max_no_shows_period: number;
  no_show_period_days: number;
  booking_block_days: number;
  waitlist_confirm_minutes: number;
}

interface SessionRow {
  id: string;
  unit_id: string;
  modality: ClassModality;
  title: string;
  description: string | null;
  instructor_id: string;
  room: string;
  intensity: string | null;
  starts_at: string;
  ends_at: string;
  capacity: number;
  booked_count: number;
  status: ClassSession["status"];
  gym_trainers: { id: string; full_name: string; photo_url: string | null } | null;
}

interface ReservationRow {
  id: string;
  member_id: string;
  session_id: string;
  status: ClassReservationStatus;
  reserved_at: string;
  cancelled_at: string | null;
  checked_in_at: string | null;
  gym_class_sessions: SessionRow | null;
}

interface WaitlistRow {
  id: string;
  member_id: string;
  session_id: string;
  status: ClassWaitlistEntry["status"];
  joined_at: string;
}

function mapSettings(row: SettingsRow): ClassSettings {
  return {
    id: row.id,
    unitName: row.unit_name,
    bookingOpenDays: row.booking_open_days,
    bookingCloseMinutes: row.booking_close_minutes,
    cancelLimitHours: row.cancel_limit_hours,
    checkinBeforeMinutes: row.checkin_before_minutes,
    checkinAfterMinutes: row.checkin_after_minutes,
    maxNoShowsPeriod: row.max_no_shows_period,
    noShowPeriodDays: row.no_show_period_days,
    bookingBlockDays: row.booking_block_days,
    waitlistConfirmMinutes: row.waitlist_confirm_minutes,
  };
}

function mapInstructor(
  row: SessionRow["gym_trainers"]
): ClassInstructor | undefined {
  if (!row) return undefined;
  return {
    id: row.id,
    fullName: row.full_name,
    photoUrl: row.photo_url ?? undefined,
  };
}

function mapSession(row: SessionRow): ClassSession {
  const instructor = mapInstructor(row.gym_trainers);
  return {
    id: row.id,
    unitId: row.unit_id,
    modality: row.modality,
    title: row.title,
    description: row.description ?? undefined,
    instructorId: row.instructor_id,
    instructor,
    room: row.room,
    intensity: row.intensity ?? undefined,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    capacity: row.capacity,
    bookedCount: row.booked_count,
    status: row.status,
  };
}

function mapReservation(row: ReservationRow): ClassReservation {
  const session = row.gym_class_sessions
    ? mapSession(row.gym_class_sessions)
    : undefined;
  return {
    id: row.id,
    memberId: row.member_id,
    sessionId: row.session_id,
    status: row.status,
    reservedAt: row.reserved_at,
    cancelledAt: row.cancelled_at ?? undefined,
    checkedInAt: row.checked_in_at ?? undefined,
    session,
  };
}

function mapWaitlist(row: WaitlistRow): ClassWaitlistEntry {
  return {
    id: row.id,
    memberId: row.member_id,
    sessionId: row.session_id,
    status: row.status,
    joinedAt: row.joined_at,
  };
}

export async function fetchClassSettings(): Promise<ClassSettings | null> {
  const { data, error } = await supabase
    .from("gym_class_settings")
    .select("*")
    .eq("id", "main")
    .maybeSingle();

  if (error || !data) return null;
  return mapSettings(data as SettingsRow);
}

export async function fetchClassSessions(
  from: Date,
  to: Date
): Promise<ClassSession[]> {
  const { data, error } = await supabase
    .from("gym_class_sessions")
    .select("*, gym_trainers(id, full_name, photo_url)")
    .gte("starts_at", from.toISOString())
    .lte("starts_at", to.toISOString())
    .order("starts_at", { ascending: true });

  if (error || !data) return [];
  return (data as SessionRow[]).map(mapSession);
}

export async function fetchMemberReservations(
  memberId: string,
  options?: { upcoming?: boolean; history?: boolean }
): Promise<ClassReservation[]> {
  let query = supabase
    .from("member_class_reservations")
    .select("*, gym_class_sessions(*, gym_trainers(id, full_name, photo_url))")
    .eq("member_id", memberId)
    .order("reserved_at", { ascending: false });

  if (options?.upcoming) {
    query = query.in("status", ["confirmed"]);
  }

  if (options?.history) {
    query = query.in("status", [
      "cancelled",
      "late_cancel",
      "attended",
      "no_show",
    ]);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return (data as ReservationRow[]).map(mapReservation);
}

export async function fetchMemberWaitlist(
  memberId: string
): Promise<ClassWaitlistEntry[]> {
  const { data, error } = await supabase
    .from("member_class_waitlist")
    .select("*")
    .eq("member_id", memberId)
    .eq("status", "waiting");

  if (error || !data) return [];
  return (data as WaitlistRow[]).map(mapWaitlist);
}

export async function countMonthlyBookings(
  memberId: string,
  cycleStart?: string
): Promise<number> {
  const start = cycleStart
    ? new Date(cycleStart + "T00:00:00")
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const { count, error } = await supabase
    .from("member_class_reservations")
    .select("*", { count: "exact", head: true })
    .eq("member_id", memberId)
    .in("status", ["confirmed", "attended", "no_show", "late_cancel"])
    .gte("reserved_at", start.toISOString());

  if (error) return 0;
  return count ?? 0;
}

export async function countNoShows(
  memberId: string,
  periodDays: number
): Promise<number> {
  const since = new Date();
  since.setDate(since.getDate() - periodDays);

  const { count, error } = await supabase
    .from("member_class_reservations")
    .select("*", { count: "exact", head: true })
    .eq("member_id", memberId)
    .eq("status", "no_show")
    .gte("reserved_at", since.toISOString());

  if (error) return 0;
  return count ?? 0;
}

export async function fetchBookingContext(
  memberId: string,
  planSlug: string,
  subscriptionStatus: string,
  cycleStart?: string
): Promise<ClassBookingContext | null> {
  const settings = await fetchClassSettings();
  if (!settings) return null;

  const [activeReservations, waitlistEntries, monthlyBookingsCount, noShowCount] =
    await Promise.all([
      fetchMemberReservations(memberId, { upcoming: true }),
      fetchMemberWaitlist(memberId),
      countMonthlyBookings(memberId, cycleStart),
      countNoShows(memberId, settings.noShowPeriodDays),
    ]);

  const bookingBlockedUntil =
    noShowCount >= settings.maxNoShowsPeriod
      ? new Date(Date.now() + settings.bookingBlockDays * 86400000).toISOString()
      : undefined;

  return {
    settings,
    planSlug,
    subscriptionStatus,
    activeReservations,
    waitlistEntries,
    monthlyBookingsCount,
    noShowCount,
    bookingBlockedUntil,
  };
}

interface RpcResult {
  success: boolean;
  error?: string;
  waitlist?: boolean;
  status?: string;
}

export async function bookClassSession(
  sessionId: string
): Promise<{ ok: boolean; message: string; waitlist?: boolean }> {
  const { data, error } = await supabase.rpc("book_class_session", {
    p_session_id: sessionId,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  const result = data as RpcResult;
  if (!result.success) {
    return {
      ok: false,
      message: result.error ?? "Não foi possível reservar.",
      waitlist: result.waitlist,
    };
  }

  return { ok: true, message: "Reserva confirmada!" };
}

export async function cancelClassReservation(
  reservationId: string
): Promise<{ ok: boolean; message: string; late?: boolean }> {
  const { data, error } = await supabase.rpc("cancel_class_reservation", {
    p_reservation_id: reservationId,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  const result = data as RpcResult;
  if (!result.success) {
    return { ok: false, message: result.error ?? "Não foi possível cancelar." };
  }

  const late = result.status === "late_cancel";
  return {
    ok: true,
    message: late
      ? "Cancelamento registrado. Esta aula conta no seu limite mensal."
      : "Reserva cancelada com sucesso.",
    late,
  };
}

export async function joinClassWaitlist(
  sessionId: string
): Promise<{ ok: boolean; message: string }> {
  const { data, error } = await supabase.rpc("join_class_waitlist", {
    p_session_id: sessionId,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  const result = data as RpcResult;
  if (!result.success) {
    return { ok: false, message: result.error ?? "Não foi possível entrar na lista." };
  }

  return { ok: true, message: "Você entrou na lista de espera." };
}

export async function leaveClassWaitlist(
  sessionId: string
): Promise<{ ok: boolean; message: string }> {
  const { data, error } = await supabase.rpc("leave_class_waitlist", {
    p_session_id: sessionId,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: "Você saiu da lista de espera." };
}

export async function checkinClassReservation(
  reservationId: string
): Promise<{ ok: boolean; message: string }> {
  const { data, error } = await supabase.rpc("checkin_class_reservation", {
    p_reservation_id: reservationId,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  const result = data as RpcResult;
  if (!result.success) {
    return { ok: false, message: result.error ?? "Check-in indisponível." };
  }

  return { ok: true, message: "Check-in realizado! Boa aula." };
}

export async function fetchInstructors(): Promise<ClassInstructor[]> {
  const { data, error } = await supabase
    .from("gym_trainers")
    .select("id, full_name, photo_url")
    .order("full_name");

  if (error || !data) return [];
  return data.map((row) => ({
    id: row.id,
    fullName: row.full_name,
    photoUrl: row.photo_url ?? undefined,
  }));
}
