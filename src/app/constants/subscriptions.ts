export const CANCELLATION_NOTICE_DAYS = 60;
export const PENDING_PAYMENT_HOURS = 24;
export const FREEZE_DAYS_PER_CYCLE = 60;
export const RENEWAL_NOTICE_DAYS = 5;
export const DEFAULT_PENALTY_PERCENT = 20;

export const SUBSCRIPTION_STATUS_LABELS: Record<string, string> = {
  pendente_pagamento: "Pendente de pagamento",
  ativo: "Ativo",
  congelado: "Congelado",
  cancelamento_agendado: "Cancelamento agendado",
  cancelado: "Cancelado",
  inadimplente: "Inadimplente",
};
