import { supabase } from "../lib/supabase";
import { PENDING_PAYMENT_HOURS, CANCELLATION_NOTICE_DAYS } from "../constants/subscriptions";
import type {
  GymPlan,
  MemberSubscription,
  PaymentType,
  SubscriptionPayment,
  SubscriptionStatus,
} from "../types/subscription";
import {
  calculateUpgradeProrata,
  simulateCancellation,
} from "../utils/subscriptionCalculations";

interface GymPlanRow {
  id: string;
  name: string;
  slug: string;
  badge: string;
  description: string;
  monthly_price: number;
  loyalty_months: number;
  penalty_percent: number;
  freeze_days_per_cycle: number;
  checkins_per_month: number | null;
  schedule_label: string;
  benefits: string[];
  sort_order: number;
}

interface SubscriptionRow {
  id: string;
  member_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  monthly_price: number;
  loyalty_start: string | null;
  loyalty_end: string | null;
  cycle_start: string | null;
  cycle_end: string | null;
  next_billing_date: string | null;
  auto_renew: boolean;
  pending_payment_expires_at: string | null;
  scheduled_plan_id: string | null;
  scheduled_change_at: string | null;
  cancellation_requested_at: string | null;
  cancellation_effective_at: string | null;
  cancellation_reason: string | null;
  penalty_amount: number | null;
  outstanding_balance: number;
  freeze_start: string | null;
  freeze_end: string | null;
  freeze_days_used_cycle: number;
  freeze_reason: string | null;
  created_at: string;
  updated_at: string;
}

function mapPlan(row: GymPlanRow): GymPlan {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    badge: row.badge,
    description: row.description,
    monthlyPrice: Number(row.monthly_price),
    loyaltyMonths: row.loyalty_months,
    penaltyPercent: Number(row.penalty_percent),
    freezeDaysPerCycle: row.freeze_days_per_cycle,
    checkinsPerMonth: row.checkins_per_month,
    scheduleLabel: row.schedule_label,
    benefits: row.benefits ?? [],
    sortOrder: row.sort_order,
  };
}

function mapSubscription(
  row: SubscriptionRow,
  plan?: GymPlan,
  scheduledPlan?: GymPlan
): MemberSubscription {
  return {
    id: row.id,
    memberId: row.member_id,
    planId: row.plan_id,
    status: row.status,
    monthlyPrice: Number(row.monthly_price),
    loyaltyStart: row.loyalty_start ?? undefined,
    loyaltyEnd: row.loyalty_end ?? undefined,
    cycleStart: row.cycle_start ?? undefined,
    cycleEnd: row.cycle_end ?? undefined,
    nextBillingDate: row.next_billing_date ?? undefined,
    autoRenew: row.auto_renew,
    pendingPaymentExpiresAt: row.pending_payment_expires_at
      ? new Date(row.pending_payment_expires_at).getTime()
      : undefined,
    scheduledPlanId: row.scheduled_plan_id ?? undefined,
    scheduledChangeAt: row.scheduled_change_at ?? undefined,
    cancellationRequestedAt: row.cancellation_requested_at
      ? new Date(row.cancellation_requested_at).getTime()
      : undefined,
    cancellationEffectiveAt: row.cancellation_effective_at ?? undefined,
    cancellationReason: row.cancellation_reason ?? undefined,
    penaltyAmount: row.penalty_amount ? Number(row.penalty_amount) : undefined,
    outstandingBalance: Number(row.outstanding_balance),
    freezeStart: row.freeze_start ?? undefined,
    freezeEnd: row.freeze_end ?? undefined,
    freezeDaysUsedCycle: row.freeze_days_used_cycle,
    freezeReason: row.freeze_reason ?? undefined,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
    plan,
    scheduledPlan,
  };
}

function addMonthsISO(date: Date, months: number): string {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

function addDaysISO(date: Date, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export async function fetchGymPlans(): Promise<GymPlan[]> {
  const { data, error } = await supabase
    .from("gym_plans")
    .select("*")
    .eq("active", true)
    .order("sort_order");

  if (error || !data) return [];
  return (data as GymPlanRow[]).map(mapPlan);
}

export async function fetchMemberSubscription(
  memberId: string
): Promise<MemberSubscription | null> {
  const { data, error } = await supabase
    .from("member_subscriptions")
    .select("*")
    .eq("member_id", memberId)
    .not("status", "eq", "cancelado")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as SubscriptionRow;
  const plans = await fetchGymPlans();
  const plan = plans.find((p) => p.id === row.plan_id);
  const scheduledPlan = row.scheduled_plan_id
    ? plans.find((p) => p.id === row.scheduled_plan_id)
    : undefined;

  const subscription = mapSubscription(row, plan, scheduledPlan);

  if (
    subscription.status === "pendente_pagamento" &&
    subscription.pendingPaymentExpiresAt &&
    Date.now() > subscription.pendingPaymentExpiresAt
  ) {
    await supabase
      .from("member_subscriptions")
      .update({ status: "cancelado" })
      .eq("id", subscription.id);
    return null;
  }

  return subscription;
}

async function createPayment(
  subscriptionId: string,
  memberId: string,
  amount: number,
  paymentType: PaymentType
): Promise<SubscriptionPayment | null> {
  const { data, error } = await supabase
    .from("subscription_payments")
    .insert({
      subscription_id: subscriptionId,
      member_id: memberId,
      amount,
      payment_type: paymentType,
      status: "pendente",
    })
    .select("*")
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    subscriptionId: data.subscription_id,
    memberId: data.member_id,
    amount: Number(data.amount),
    paymentType: data.payment_type,
    status: data.status,
    createdAt: new Date(data.created_at).getTime(),
  };
}

export async function contractPlan(
  memberId: string,
  planId: string
): Promise<{ subscription?: MemberSubscription; payment?: SubscriptionPayment; error?: string }> {
  const existing = await fetchMemberSubscription(memberId);

  if (
    existing &&
    ["ativo", "congelado", "cancelamento_agendado", "inadimplente", "pendente_pagamento"].includes(
      existing.status
    )
  ) {
    return {
      error:
        "Você já possui um plano vigente ou pendente. Use upgrade ou downgrade.",
    };
  }

  const plans = await fetchGymPlans();
  const plan = plans.find((p) => p.id === planId);
  if (!plan) return { error: "Plano não encontrado." };

  const expiresAt = new Date(Date.now() + PENDING_PAYMENT_HOURS * 60 * 60 * 1000);

  const { data, error } = await supabase
    .from("member_subscriptions")
    .insert({
      member_id: memberId,
      plan_id: planId,
      status: "pendente_pagamento",
      monthly_price: plan.monthlyPrice,
      pending_payment_expires_at: expiresAt.toISOString(),
      auto_renew: true,
    })
    .select("*")
    .single();

  if (error || !data) {
    if (error?.code === "23505") {
      return { error: "Já existe uma assinatura ativa ou pendente." };
    }
    return { error: error?.message ?? "Erro ao contratar plano." };
  }

  const payment = await createPayment(
    data.id,
    memberId,
    plan.monthlyPrice,
    "contratacao"
  );

  return {
    subscription: mapSubscription(data as SubscriptionRow, plan),
    payment: payment ?? undefined,
  };
}

export async function processPayment(
  paymentId: string,
  approved: boolean
): Promise<{ success: boolean; error?: string }> {
  const { data: payment, error: payError } = await supabase
    .from("subscription_payments")
    .select("*")
    .eq("id", paymentId)
    .single();

  if (payError || !payment) return { success: false, error: "Pagamento não encontrado." };

  if (!approved) {
    await supabase
      .from("subscription_payments")
      .update({ status: "recusado", processed_at: new Date().toISOString() })
      .eq("id", paymentId);

    if (payment.payment_type === "upgrade") {
      await supabase
        .from("member_subscriptions")
        .update({ scheduled_plan_id: null })
        .eq("id", payment.subscription_id);
    }

    return { success: true };
  }

  await supabase
    .from("subscription_payments")
    .update({ status: "aprovado", processed_at: new Date().toISOString() })
    .eq("id", paymentId);

  const { data: sub } = await supabase
    .from("member_subscriptions")
    .select("*")
    .eq("id", payment.subscription_id)
    .single();

  if (!sub) return { success: false, error: "Assinatura não encontrada." };

  const row = sub as SubscriptionRow;
  const today = new Date();

  if (payment.payment_type === "contratacao" && row.status === "pendente_pagamento") {
    const plans = await fetchGymPlans();
    const plan = plans.find((p) => p.id === row.plan_id);

    await supabase
      .from("member_subscriptions")
      .update({
        status: "ativo",
        loyalty_start: today.toISOString().slice(0, 10),
        loyalty_end: plan ? addMonthsISO(today, plan.loyaltyMonths) : null,
        cycle_start: today.toISOString().slice(0, 10),
        cycle_end: addMonthsISO(today, 1),
        next_billing_date: addMonthsISO(today, 1),
        pending_payment_expires_at: null,
      })
      .eq("id", row.id);
  }

  if (payment.payment_type === "upgrade") {
    const { data: subRow } = await supabase
      .from("member_subscriptions")
      .select("scheduled_plan_id")
      .eq("id", payment.subscription_id)
      .single();

    const targetPlanId = subRow?.scheduled_plan_id;
    if (targetPlanId) {
      const plans = await fetchGymPlans();
      const newPlan = plans.find((p) => p.id === targetPlanId);
      if (newPlan) {
        await supabase
          .from("member_subscriptions")
          .update({
            plan_id: newPlan.id,
            monthly_price: newPlan.monthlyPrice,
            scheduled_plan_id: null,
            scheduled_change_at: null,
          })
          .eq("id", payment.subscription_id);
      }
    }
  }

  return { success: true };
}

export async function requestUpgrade(
  memberId: string,
  newPlanId: string
): Promise<{
  subscription?: MemberSubscription;
  payment?: SubscriptionPayment;
  prorata?: number;
  error?: string;
}> {
  const subscription = await fetchMemberSubscription(memberId);
  if (!subscription || subscription.status !== "ativo") {
    return { error: "É necessário um plano ativo para upgrade." };
  }

  const plans = await fetchGymPlans();
  const currentPlan = plans.find((p) => p.id === subscription.planId);
  const newPlan = plans.find((p) => p.id === newPlanId);

  if (!currentPlan || !newPlan) return { error: "Plano não encontrado." };
  if (newPlan.monthlyPrice <= currentPlan.monthlyPrice) {
    return { error: "Selecione um plano superior para upgrade." };
  }

  const prorata = calculateUpgradeProrata(
    subscription.monthlyPrice,
    newPlan.monthlyPrice,
    subscription.cycleEnd ?? addMonthsISO(new Date(), 1)
  );

  const payment = await createPayment(subscription.id, memberId, prorata, "upgrade");

  if (!payment) return { error: "Erro ao gerar cobrança de upgrade." };

  await supabase
    .from("member_subscriptions")
    .update({ scheduled_plan_id: newPlanId })
    .eq("id", subscription.id);

  return { subscription, payment, prorata };
}

export async function requestDowngrade(
  memberId: string,
  newPlanId: string
): Promise<{ success: boolean; error?: string; effectiveDate?: string }> {
  const subscription = await fetchMemberSubscription(memberId);
  if (!subscription || !["ativo", "cancelamento_agendado"].includes(subscription.status)) {
    return { success: false, error: "É necessário um plano ativo para downgrade." };
  }

  const plans = await fetchGymPlans();
  const currentPlan = plans.find((p) => p.id === subscription.planId);
  const newPlan = plans.find((p) => p.id === newPlanId);

  if (!currentPlan || !newPlan) return { success: false, error: "Plano não encontrado." };
  if (newPlan.monthlyPrice >= currentPlan.monthlyPrice) {
    return { success: false, error: "Selecione um plano inferior para downgrade." };
  }

  const effectiveDate =
    subscription.nextBillingDate ?? addMonthsISO(new Date(), 1);

  const { error } = await supabase
    .from("member_subscriptions")
    .update({
      scheduled_plan_id: newPlanId,
      scheduled_change_at: effectiveDate,
    })
    .eq("id", subscription.id);

  if (error) return { success: false, error: error.message };

  return { success: true, effectiveDate };
}

export async function requestFreeze(
  memberId: string,
  days: number,
  reason: string,
  medicalCertificate = false
): Promise<{ success: boolean; error?: string }> {
  const subscription = await fetchMemberSubscription(memberId);
  if (!subscription || subscription.status !== "ativo") {
    return { success: false, error: "Apenas planos ativos podem ser congelados." };
  }

  const plan = subscription.plan;
  if (!plan) return { success: false, error: "Plano não encontrado." };

  const available = plan.freezeDaysPerCycle - subscription.freezeDaysUsedCycle;

  if (days > available && !medicalCertificate) {
    return {
      success: false,
      error: `Saldo de congelamento insuficiente (${available} dias restantes). Solicite análise manual na recepção ou anexe atestado médico.`,
    };
  }

  if (days < 1 || days > 60) {
    return { success: false, error: "Informe entre 1 e 60 dias de trancamento." };
  }

  const today = new Date();
  const freezeEnd = addDaysISO(today, days);

  const { error } = await supabase
    .from("member_subscriptions")
    .update({
      status: "congelado",
      freeze_start: today.toISOString().slice(0, 10),
      freeze_end: freezeEnd,
      freeze_days_used_cycle: subscription.freezeDaysUsedCycle + days,
      freeze_reason: reason,
    })
    .eq("id", subscription.id);

  if (error) return { success: false, error: error.message };

  return { success: true };
}

export async function requestCancellation(
  memberId: string,
  reason: string
): Promise<{ success: boolean; simulation?: ReturnType<typeof simulateCancellation>; error?: string }> {
  const subscription = await fetchMemberSubscription(memberId);
  if (!subscription || !["ativo", "congelado", "inadimplente"].includes(subscription.status)) {
    return { success: false, error: "Nenhum plano elegível para cancelamento." };
  }

  const plan = subscription.plan;
  if (!plan) return { success: false, error: "Plano não encontrado." };

  const simulation = simulateCancellation(subscription, plan, subscription.outstandingBalance);
  const today = new Date();

  const { error } = await supabase
    .from("member_subscriptions")
    .update({
      status: "cancelamento_agendado",
      cancellation_requested_at: today.toISOString(),
      cancellation_effective_at: simulation.effectiveDate,
      cancellation_reason: reason,
      penalty_amount: simulation.penaltyAmount,
      auto_renew: false,
    })
    .eq("id", subscription.id);

  if (error) return { success: false, error: error.message };

  return { success: true, simulation };
}

export async function toggleAutoRenew(
  memberId: string,
  enabled: boolean
): Promise<{ success: boolean; error?: string }> {
  const subscription = await fetchMemberSubscription(memberId);
  if (!subscription) return { success: false, error: "Assinatura não encontrada." };

  const { error } = await supabase
    .from("member_subscriptions")
    .update({ auto_renew: enabled })
    .eq("id", subscription.id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function fetchPendingPayment(
  memberId: string
): Promise<SubscriptionPayment | null> {
  const { data } = await supabase
    .from("subscription_payments")
    .select("*")
    .eq("member_id", memberId)
    .eq("status", "pendente")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.id,
    subscriptionId: data.subscription_id,
    memberId: data.member_id,
    amount: Number(data.amount),
    paymentType: data.payment_type,
    status: data.status,
    createdAt: new Date(data.created_at).getTime(),
  };
}

export { simulateCancellation };
