import type { GymPlan, MemberSubscription } from "../types/subscription";
import {
  CANCELLATION_NOTICE_DAYS,
  DEFAULT_PENALTY_PERCENT,
  FREEZE_DAYS_PER_CYCLE,
} from "../constants/subscriptions";

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function daysBetween(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function monthsBetween(start: Date, end: Date): number {
  return (
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth()) +
    (end.getDate() >= start.getDate() ? 0 : -1)
  );
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDateBR(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date + "T12:00:00") : date;
  return d.toLocaleDateString("pt-BR");
}

export function calculateUpgradeProrata(
  currentPrice: number,
  newPrice: number,
  cycleEnd: string
): number {
  const today = new Date();
  const end = new Date(cycleEnd + "T12:00:00");
  const daysLeft = daysBetween(today, end);

  if (daysLeft <= 0) return Math.max(0, newPrice - currentPrice);

  const dailyCurrent = currentPrice / 30;
  const dailyNew = newPrice / 30;

  return Math.max(0, Math.round((dailyNew - dailyCurrent) * daysLeft * 100) / 100);
}

export interface CancellationSimulation {
  withinLoyalty: boolean;
  loyaltyEnd: string;
  monthsUsed: number;
  monthsRemaining: number;
  contractTotal: number;
  amountUsed: number;
  remainingBalance: number;
  penaltyPercent: number;
  penaltyAmount: number;
  outstandingBalance: number;
  noticeDays: number;
  effectiveDate: string;
  totalDue: number;
}

export function simulateCancellation(
  subscription: MemberSubscription,
  plan: GymPlan,
  outstandingBalance = 0
): CancellationSimulation {
  const today = new Date();
  const loyaltyStart = subscription.loyaltyStart
    ? new Date(subscription.loyaltyStart + "T12:00:00")
    : today;
  const loyaltyEnd = subscription.loyaltyEnd
    ? new Date(subscription.loyaltyEnd + "T12:00:00")
    : addMonths(loyaltyStart, plan.loyaltyMonths);

  const withinLoyalty = today < loyaltyEnd;
  const monthsUsed = Math.max(0, monthsBetween(loyaltyStart, today));
  const monthsRemaining = Math.max(0, monthsBetween(today, loyaltyEnd));

  const contractTotal = plan.monthlyPrice * plan.loyaltyMonths;
  const amountUsed = plan.monthlyPrice * monthsUsed;
  const remainingBalance = Math.max(0, contractTotal - amountUsed);

  const penaltyPercent = plan.penaltyPercent ?? DEFAULT_PENALTY_PERCENT;
  const penaltyAmount = withinLoyalty
    ? Math.round(remainingBalance * (penaltyPercent / 100) * 100) / 100
    : 0;

  const effectiveDate = addDays(today, CANCELLATION_NOTICE_DAYS);
  const totalDue = penaltyAmount + outstandingBalance;

  return {
    withinLoyalty,
    loyaltyEnd: loyaltyEnd.toISOString().slice(0, 10),
    monthsUsed,
    monthsRemaining,
    contractTotal,
    amountUsed,
    remainingBalance,
    penaltyPercent,
    penaltyAmount,
    outstandingBalance,
    noticeDays: CANCELLATION_NOTICE_DAYS,
    effectiveDate: effectiveDate.toISOString().slice(0, 10),
    totalDue,
  };
}

export function getFreezeDaysAvailable(
  subscription: MemberSubscription,
  plan: GymPlan
): number {
  const limit = plan.freezeDaysPerCycle ?? FREEZE_DAYS_PER_CYCLE;
  return Math.max(0, limit - subscription.freezeDaysUsedCycle);
}

export function canAccessGymFeatures(subscription: MemberSubscription | null): boolean {
  if (!subscription) return false;
  return subscription.status === "ativo" || subscription.status === "cancelamento_agendado";
}

export function isCheckinBlocked(subscription: MemberSubscription | null): boolean {
  if (!subscription) return true;
  if (subscription.status === "congelado") return true;
  if (subscription.status === "inadimplente") return true;
  if (subscription.status === "pendente_pagamento") return true;
  if (subscription.status === "cancelado") return true;
  return false;
}
