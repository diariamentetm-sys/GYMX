import type { ClassModality, PlanClassLimits } from "../types/class";

export const CLASS_MODALITY_LABELS: Record<ClassModality, string> = {
  spinning: "Spinning",
  funcional: "Funcional",
  yoga: "Yoga",
  pilates: "Pilates",
  muay_thai: "Muay Thai",
};

export const CLASS_MODALITY_COLORS: Record<ClassModality, string> = {
  spinning: "text-red-400 bg-red-400/10",
  funcional: "text-orange-400 bg-orange-400/10",
  yoga: "text-emerald-400 bg-emerald-400/10",
  pilates: "text-purple-400 bg-purple-400/10",
  muay_thai: "text-yellow-400 bg-yellow-400/10",
};

export const RESERVATION_STATUS_LABELS = {
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  late_cancel: "Cancelamento tardio",
  attended: "Presença",
  no_show: "No-show",
} as const;

export const DISPLAY_STATUS_LABELS = {
  open: "Aberta",
  full: "Lotada",
  waitlist: "Lista de espera",
  booking_closed: "Agendamento encerrado",
  booking_not_open: "Em breve",
  in_progress: "Em andamento",
  ended: "Encerrada",
  cancelled: "Cancelada",
} as const;

export const DAY_PERIOD_LABELS = {
  all: "Todo o dia",
  morning: "Manhã (até 12h)",
  afternoon: "Tarde (12h–18h)",
  evening: "Noite (após 18h)",
} as const;

export const PLAN_CLASS_LIMITS: Record<string, PlanClassLimits> = {
  livre: {
    maxActiveReservations: 1,
    maxClassesPerMonth: 4,
    allowedModalities: ["funcional"],
    multiUnit: false,
  },
  plus: {
    maxActiveReservations: 3,
    maxClassesPerMonth: 12,
    allowedModalities: ["spinning", "funcional", "yoga", "pilates"],
    multiUnit: false,
  },
  elite: {
    maxActiveReservations: 3,
    maxClassesPerMonth: null,
    allowedModalities: ["spinning", "funcional", "yoga", "pilates", "muay_thai"],
    multiUnit: true,
  },
};

export const DEFAULT_PLAN_LIMITS = PLAN_CLASS_LIMITS.plus;
