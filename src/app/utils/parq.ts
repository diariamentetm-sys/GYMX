import type { ParQAnswers, ParQStatus } from "../types/member";

export const PARQ_QUESTIONS = [
  {
    id: "q1" as const,
    text: "Algum médico já disse que você possui problema cardíaco e recomendou atividade física apenas sob supervisão médica?",
  },
  {
    id: "q2" as const,
    text: "Você sente dor no peito durante atividades físicas?",
  },
  {
    id: "q3" as const,
    text: "No último mês, sentiu dor no peito mesmo sem atividade física?",
  },
  {
    id: "q4" as const,
    text: "Você perde o equilíbrio por tontura ou já perdeu a consciência?",
  },
  {
    id: "q5" as const,
    text: "Possui algum problema ósseo ou articular que possa piorar com exercício?",
  },
  {
    id: "q6" as const,
    text: "Seu médico está prescrevendo medicamentos para pressão arterial ou coração?",
  },
  {
    id: "q7" as const,
    text: "Sabe de alguma outra razão pela qual não deveria praticar atividade física?",
  },
];

export const PARQ_REVALIDATION_MONTHS = 12;
export const VERIFICATION_CODE_TTL_MS = 15 * 60 * 1000;
export const MAX_VERIFICATION_RESENDS_PER_DAY = 5;

export function evaluateParQ(answers: ParQAnswers): ParQStatus {
  const hasRisk = Object.values(answers).some((value) => value === true);

  if (hasRisk) {
    return "encaminhar_avaliacao";
  }

  return "apto";
}

export function isParQExpired(completedAt?: number): boolean {
  if (!completedAt) return true;

  const expiry = new Date(completedAt);
  expiry.setMonth(expiry.getMonth() + PARQ_REVALIDATION_MONTHS);

  return Date.now() > expiry.getTime();
}

export function getParQStatus(
  answers?: ParQAnswers,
  completedAt?: number
): ParQStatus {
  if (!answers || !completedAt) {
    return "nao_preenchido";
  }

  if (isParQExpired(completedAt)) {
    return "expirado";
  }

  return evaluateParQ(answers);
}

export function canAccessWorkoutPrescription(parQStatus: ParQStatus): boolean {
  return parQStatus === "apto";
}
