export type ClassModality =
  | "spinning"
  | "funcional"
  | "yoga"
  | "pilates"
  | "muay_thai";

export type ClassSessionStatus = "scheduled" | "cancelled" | "completed";

export type ClassReservationStatus =
  | "confirmed"
  | "cancelled"
  | "late_cancel"
  | "attended"
  | "no_show";

export type ClassWaitlistStatus = "waiting" | "promoted" | "left" | "expired";

export type ClassDisplayStatus =
  | "open"
  | "full"
  | "waitlist"
  | "booking_closed"
  | "booking_not_open"
  | "in_progress"
  | "ended"
  | "cancelled";

export type DayPeriod = "all" | "morning" | "afternoon" | "evening";

export interface ClassSettings {
  id: string;
  unitName: string;
  bookingOpenDays: number;
  bookingCloseMinutes: number;
  cancelLimitHours: number;
  checkinBeforeMinutes: number;
  checkinAfterMinutes: number;
  maxNoShowsPeriod: number;
  noShowPeriodDays: number;
  bookingBlockDays: number;
  waitlistConfirmMinutes: number;
}

export interface ClassInstructor {
  id: string;
  fullName: string;
  photoUrl?: string;
}

export interface ClassSession {
  id: string;
  unitId: string;
  modality: ClassModality;
  title: string;
  description?: string;
  instructorId: string;
  instructor?: ClassInstructor;
  room: string;
  intensity?: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  bookedCount: number;
  status: ClassSessionStatus;
}

export interface ClassReservation {
  id: string;
  memberId: string;
  sessionId: string;
  status: ClassReservationStatus;
  reservedAt: string;
  cancelledAt?: string;
  checkedInAt?: string;
  session?: ClassSession;
}

export interface ClassWaitlistEntry {
  id: string;
  memberId: string;
  sessionId: string;
  status: ClassWaitlistStatus;
  joinedAt: string;
  position?: number;
}

export interface ClassBookingContext {
  settings: ClassSettings;
  planSlug: string;
  subscriptionStatus: string;
  activeReservations: ClassReservation[];
  waitlistEntries: ClassWaitlistEntry[];
  monthlyBookingsCount: number;
  noShowCount: number;
  bookingBlockedUntil?: string;
}

export interface ClassSessionView extends ClassSession {
  displayStatus: ClassDisplayStatus;
  spotsAvailable: number;
  bookingMessage?: string;
  userReservationId?: string;
  userWaitlistId?: string;
  canBook: boolean;
  canJoinWaitlist: boolean;
  canCancel: boolean;
  canCheckIn: boolean;
}

export interface PlanClassLimits {
  maxActiveReservations: number;
  maxClassesPerMonth: number | null;
  allowedModalities: ClassModality[];
  multiUnit: boolean;
}
