import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  History,
  Loader2,
  Ticket,
} from "lucide-react";
import { MemberLayout } from "../../components/member/MemberLayout";
import { RequireMemberAccess } from "../../components/auth/RequireMemberAccess";
import { ClassFiltersBar } from "../../components/member/ClassFiltersBar";
import { ClassHistoryPanel } from "../../components/member/ClassHistoryPanel";
import { ClassLimitsBanner } from "../../components/member/ClassLimitsBanner";
import { ClassReservationCard } from "../../components/member/ClassReservationCard";
import { ClassSessionCard } from "../../components/member/ClassSessionCard";
import { useAuth } from "../../contexts/AuthContext";
import { fetchMemberSubscription } from "../../services/subscriptionService";
import {
  bookClassSession,
  cancelClassReservation,
  checkinClassReservation,
  fetchBookingContext,
  fetchClassSessions,
  fetchInstructors,
  fetchMemberReservations,
  joinClassWaitlist,
  leaveClassWaitlist,
} from "../../services/classService";
import type {
  ClassBookingContext,
  ClassModality,
  ClassReservation,
  ClassSessionView,
  DayPeriod,
} from "../../types/class";
import {
  enrichSessionView,
  filterSessionsByPeriod,
  formatClassDate,
  getWeekEndDate,
  getWeekStartDate,
  groupSessionsByDay,
  isCheckinWindowOpen,
  canCancelReservation,
} from "../../utils/classCalculations";

type Tab = "grade" | "reservations" | "history";

export default function MemberClassesPage() {
  const { session } = useAuth();
  const memberId = session?.user.id;

  const [tab, setTab] = useState<Tab>("grade");
  const [weekOffset, setWeekOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSessionId, setActionSessionId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [modality, setModality] = useState<ClassModality | "all">("all");
  const [instructorId, setInstructorId] = useState("all");
  const [period, setPeriod] = useState<DayPeriod>("all");

  const [context, setContext] = useState<ClassBookingContext | null>(null);
  const [sessions, setSessions] = useState<ClassSessionView[]>([]);
  const [upcomingReservations, setUpcomingReservations] = useState<ClassReservation[]>([]);
  const [historyReservations, setHistoryReservations] = useState<ClassReservation[]>([]);
  const [instructors, setInstructors] = useState<Awaited<ReturnType<typeof fetchInstructors>>>([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState("");

  const weekStart = useMemo(() => getWeekStartDate(weekOffset), [weekOffset]);
  const weekEnd = useMemo(() => getWeekEndDate(weekStart), [weekStart]);

  const loadData = useCallback(async () => {
    if (!memberId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const subscription = await fetchMemberSubscription(memberId);
      const planSlug = subscription?.plan?.slug ?? "plus";
      const status = subscription?.status ?? "cancelado";
      setSubscriptionStatus(status);

      const bookingContext = await fetchBookingContext(
        memberId,
        planSlug,
        status,
        subscription?.cycleStart
      );

      const [rawSessions, instructorsList, upcoming, history] = await Promise.all([
        fetchClassSessions(weekStart, weekEnd),
        fetchInstructors(),
        fetchMemberReservations(memberId, { upcoming: true }),
        fetchMemberReservations(memberId, { history: true }),
      ]);

      setContext(bookingContext);
      setInstructors(instructorsList);

      const enriched = bookingContext
        ? rawSessions.map((s) => enrichSessionView(s, bookingContext))
        : rawSessions.map((s) => ({ ...s, displayStatus: "open" as const, spotsAvailable: s.capacity - s.bookedCount, canBook: false, canJoinWaitlist: false, canCancel: false, canCheckIn: false }));

      setSessions(enriched);
      setUpcomingReservations(
        upcoming
          .filter((r) => r.session && new Date(r.session.startsAt) >= new Date())
          .sort(
            (a, b) =>
              new Date(a.session!.startsAt).getTime() -
              new Date(b.session!.startsAt).getTime()
          )
      );
      setHistoryReservations(history);
    } catch {
      setError("Não foi possível carregar as aulas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [memberId, weekStart, weekEnd]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredSessions = useMemo(() => {
    let list = sessions;

    if (modality !== "all") {
      list = list.filter((s) => s.modality === modality);
    }
    if (instructorId !== "all") {
      list = list.filter((s) => s.instructorId === instructorId);
    }
    list = filterSessionsByPeriod(list, period) as ClassSessionView[];

    return list;
  }, [sessions, modality, instructorId, period]);

  const groupedByDay = useMemo(
    () => groupSessionsByDay(filteredSessions),
    [filteredSessions]
  );

  const runAction = async (
    sessionId: string,
    action: () => Promise<{ ok: boolean; message: string; waitlist?: boolean }>
  ) => {
    setActionSessionId(sessionId);
    setActionLoading(true);
    setMessage("");
    setError("");

    const result = await action();

    setActionLoading(false);
    setActionSessionId(null);

    if (result.ok) {
      setMessage(result.message);
      await loadData();
    } else {
      setError(result.message);
      if (result.waitlist) {
        setMessage("Aula lotada. Você pode entrar na lista de espera.");
      }
    }
  };

  const handleBook = (sessionId: string) =>
    runAction(sessionId, () => bookClassSession(sessionId));

  const handleJoinWaitlist = (sessionId: string) =>
    runAction(sessionId, () => joinClassWaitlist(sessionId));

  const handleLeaveWaitlist = (sessionId: string) =>
    runAction(sessionId, () => leaveClassWaitlist(sessionId));

  const handleCancel = (reservationId: string, sessionId: string) =>
    runAction(sessionId, () => cancelClassReservation(reservationId));

  const handleCheckIn = (reservationId: string, sessionId: string) =>
    runAction(sessionId, () => checkinClassReservation(reservationId));

  const weekLabel = `${weekStart.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} – ${weekEnd.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}`;

  const tabs: { id: Tab; label: string; icon: typeof CalendarDays }[] = [
    { id: "grade", label: "Grade", icon: CalendarDays },
    { id: "reservations", label: "Minhas reservas", icon: Ticket },
    { id: "history", label: "Histórico", icon: History },
  ];

  return (
    <RequireMemberAccess>
      <MemberLayout
        title="Aulas"
        subtitle="Agende aulas coletivas e gerencie suas reservas"
      >
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="text-yellow-400 animate-spin" size={32} />
          </div>
        ) : (
          <div className="space-y-6">
            {context && (
              <ClassLimitsBanner
                context={context}
                subscriptionStatus={subscriptionStatus}
              />
            )}

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm rounded-md px-4 py-3"
              >
                {message}
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-md px-4 py-3"
              >
                {error}
              </motion.div>
            )}

            <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium uppercase tracking-wider rounded-t-md transition-colors ${
                    tab === id
                      ? "text-yellow-400 border-b-2 border-yellow-400 -mb-px"
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            {tab === "grade" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setWeekOffset((w) => w - 1)}
                    className="p-2 text-neutral-400 hover:text-white border border-neutral-800 rounded-md transition-colors"
                    aria-label="Semana anterior"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <p className="text-white text-sm font-medium uppercase tracking-wider">
                    {weekLabel}
                  </p>
                  <button
                    type="button"
                    onClick={() => setWeekOffset((w) => w + 1)}
                    className="p-2 text-neutral-400 hover:text-white border border-neutral-800 rounded-md transition-colors"
                    aria-label="Próxima semana"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                <ClassFiltersBar
                  modality={modality}
                  instructorId={instructorId}
                  period={period}
                  instructors={instructors}
                  onModalityChange={setModality}
                  onInstructorChange={setInstructorId}
                  onPeriodChange={setPeriod}
                />

                {Object.keys(groupedByDay).length === 0 ? (
                  <div className="text-center py-16 text-neutral-500">
                    <CalendarDays size={40} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm">Nenhuma aula nesta semana com os filtros selecionados.</p>
                  </div>
                ) : (
                  Object.entries(groupedByDay).map(([day, daySessions]) => (
                    <section key={day}>
                      <h2 className="text-neutral-400 text-xs uppercase tracking-widest mb-3 capitalize">
                        {formatClassDate(daySessions[0].startsAt)}
                      </h2>
                      <div className="grid gap-3 md:grid-cols-2">
                        {(daySessions as ClassSessionView[]).map((classSession) => (
                          <ClassSessionCard
                            key={classSession.id}
                            session={classSession}
                            planSlug={context?.planSlug ?? "plus"}
                            loading={
                              actionLoading && actionSessionId === classSession.id
                            }
                            onBook={() => handleBook(classSession.id)}
                            onJoinWaitlist={() => handleJoinWaitlist(classSession.id)}
                            onLeaveWaitlist={() => handleLeaveWaitlist(classSession.id)}
                            onCancel={() =>
                              classSession.userReservationId &&
                              handleCancel(
                                classSession.userReservationId,
                                classSession.id
                              )
                            }
                            onCheckIn={() =>
                              classSession.userReservationId &&
                              handleCheckIn(
                                classSession.userReservationId,
                                classSession.id
                              )
                            }
                          />
                        ))}
                      </div>
                    </section>
                  ))
                )}
              </div>
            )}

            {tab === "reservations" && (
              <div className="space-y-3">
                {upcomingReservations.length === 0 ? (
                  <div className="text-center py-16 text-neutral-500">
                    <Ticket size={40} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm">Você não tem reservas futuras.</p>
                    <button
                      type="button"
                      onClick={() => setTab("grade")}
                      className="mt-4 text-yellow-400 text-sm hover:underline"
                    >
                      Ver grade de aulas
                    </button>
                  </div>
                ) : (
                  upcomingReservations.map((reservation) => {
                    const sess = reservation.session!;
                    const settings = context?.settings;
                    const showCheckIn =
                      settings &&
                      reservation.status === "confirmed" &&
                      isCheckinWindowOpen(sess, settings);
                    const showCancel =
                      settings &&
                      reservation.status === "confirmed" &&
                      canCancelReservation(sess, settings);

                    return (
                      <ClassReservationCard
                        key={reservation.id}
                        reservation={reservation}
                        loading={
                          actionLoading &&
                          actionSessionId === reservation.sessionId
                        }
                        showCheckIn={showCheckIn}
                        showCancel={showCancel}
                        onCheckIn={() =>
                          handleCheckIn(reservation.id, reservation.sessionId)
                        }
                        onCancel={() =>
                          handleCancel(reservation.id, reservation.sessionId)
                        }
                      />
                    );
                  })
                )}
              </div>
            )}

            {tab === "history" && (
              <ClassHistoryPanel reservations={historyReservations} />
            )}
          </div>
        )}
      </MemberLayout>
    </RequireMemberAccess>
  );
}
