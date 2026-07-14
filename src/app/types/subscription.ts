export type SubscriptionStatus =
  | "pendente_pagamento"
  | "ativo"
  | "congelado"
  | "cancelamento_agendado"
  | "cancelado"
  | "inadimplente";

export type PaymentType = "contratacao" | "upgrade" | "renovacao" | "multa";
export type PaymentStatus = "pendente" | "aprovado" | "recusado" | "estornado";

export interface GymPlan {
  id: string;
  name: string;
  slug: string;
  badge: string;
  description: string;
  monthlyPrice: number;
  loyaltyMonths: number;
  penaltyPercent: number;
  freezeDaysPerCycle: number;
  checkinsPerMonth: number | null;
  scheduleLabel: string;
  benefits: string[];
  sortOrder: number;
}

export interface MemberSubscription {
  id: string;
  memberId: string;
  planId: string;
  status: SubscriptionStatus;
  monthlyPrice: number;
  loyaltyStart?: string;
  loyaltyEnd?: string;
  cycleStart?: string;
  cycleEnd?: string;
  nextBillingDate?: string;
  autoRenew: boolean;
  pendingPaymentExpiresAt?: number;
  scheduledPlanId?: string;
  scheduledChangeAt?: string;
  cancellationRequestedAt?: number;
  cancellationEffectiveAt?: string;
  cancellationReason?: string;
  penaltyAmount?: number;
  outstandingBalance: number;
  freezeStart?: string;
  freezeEnd?: string;
  freezeDaysUsedCycle: number;
  freezeReason?: string;
  createdAt: number;
  updatedAt: number;
  plan?: GymPlan;
  scheduledPlan?: GymPlan;
}

export interface SubscriptionPayment {
  id: string;
  subscriptionId: string;
  memberId: string;
  amount: number;
  paymentType: PaymentType;
  status: PaymentStatus;
  createdAt: number;
}
