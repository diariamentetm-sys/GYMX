import type { AccountStatus, ParQAnswers, ParQStatus } from "./member";

export type StaffRole = "admin" | "recepcao" | "professor";

export interface StaffProfile {
  id: string;
  fullName: string;
  role: StaffRole;
  active: boolean;
}

export interface StaffMemberListItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: AccountStatus;
  parQStatus: ParQStatus;
  parQCompletedAt?: number;
  onboardingCompleted: boolean;
  planName: string;
}

export interface PendingParQReview {
  memberId: string;
  parQId: string;
  fullName: string;
  email: string;
  phone: string;
  status: AccountStatus;
  answers: ParQAnswers;
  completedAt: number;
  reviewNotes: string;
}

export type ParQReviewDecision = "apto" | "apto_com_restricao" | "encaminhar_avaliacao";
