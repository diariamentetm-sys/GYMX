import { supabase } from "../lib/supabase";
import type { AccountStatus, ParQAnswers, ParQStatus } from "../types/member";
import type {
  ParQReviewDecision,
  PendingParQReview,
  StaffMemberListItem,
  StaffProfile,
  StaffRole,
} from "../types/staff";

const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  admin: "Administrador",
  recepcao: "Recepção",
  professor: "Professor",
};

function mapStaff(row: {
  id: string;
  full_name: string;
  role: string;
  active: boolean;
}): StaffProfile {
  return {
    id: row.id,
    fullName: row.full_name,
    role: row.role as StaffRole,
    active: row.active,
  };
}

function mapAnswers(raw: unknown): ParQAnswers {
  const answers = (raw ?? {}) as Partial<ParQAnswers>;
  return {
    q1: Boolean(answers.q1),
    q2: Boolean(answers.q2),
    q3: Boolean(answers.q3),
    q4: Boolean(answers.q4),
    q5: Boolean(answers.q5),
    q6: Boolean(answers.q6),
    q7: Boolean(answers.q7),
  };
}

export function getStaffRoleLabel(role: StaffRole): string {
  return STAFF_ROLE_LABELS[role];
}

export function getNameInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export async function loadStaffProfile(userId: string): Promise<StaffProfile | null> {
  const { data, error } = await supabase
    .from("staff_profiles")
    .select("id, full_name, role, active")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data || data.active === false) {
    return null;
  }

  return mapStaff(data);
}

export async function isStaffBootstrapOpen(): Promise<boolean> {
  const { data, error } = await supabase.rpc("staff_bootstrap_open");
  if (error) return false;
  return Boolean(data);
}

export async function registerStaffAccount(input: {
  fullName: string;
  email: string;
  password: string;
}): Promise<{ staff: StaffProfile | null; error?: string }> {
  const open = await isStaffBootstrapOpen();
  if (!open) {
    return { staff: null, error: "Cadastro da equipe fechado. Peça acesso a um administrador." };
  }

  const { data, error } = await supabase.auth.signUp({
    email: input.email.trim().toLowerCase(),
    password: input.password,
    options: {
      data: {
        account_type: "staff",
        full_name: input.fullName.trim(),
      },
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { staff: null, error: "Este e-mail já está cadastrado. Entre com a senha da equipe." };
    }
    return { staff: null, error: error.message };
  }

  if (!data.user) {
    return { staff: null, error: "Não foi possível criar o perfil da equipe." };
  }

  if (!data.session) {
    const signedIn = await supabase.auth.signInWithPassword({
      email: input.email.trim().toLowerCase(),
      password: input.password,
    });
    if (signedIn.error) {
      return {
        staff: null,
        error: "Perfil criado. Entre agora com o e-mail e a senha da equipe.",
      };
    }
  }

  const staff = await loadStaffProfile(data.user.id);
  if (!staff) {
    return {
      staff: null,
      error:
        "Conta criada, mas o perfil da equipe ainda não apareceu. Entre de novo em instantes.",
    };
  }

  return { staff };
}

export async function listStaffMembers(): Promise<{
  members: StaffMemberListItem[];
  error?: string;
}> {
  const { data, error } = await supabase
    .from("member_profiles")
    .select(
      "id, full_name, email, phone, status, par_q_status, par_q_completed_at, onboarding_completed, member_subscriptions(status, plan_id)"
    )
    .order("full_name", { ascending: true });

  if (error) {
    return { members: [], error: "Não foi possível carregar os alunos." };
  }

  const { data: plans } = await supabase.from("gym_plans").select("id, name");
  const planNames = new Map((plans ?? []).map((plan) => [plan.id as string, plan.name as string]));

  const members: StaffMemberListItem[] = (data ?? []).map((row) => {
    const subscriptions = (Array.isArray(row.member_subscriptions)
      ? row.member_subscriptions
      : []) as Array<{ status: string; plan_id: string }>;
    const activePlan = subscriptions.find((item) => item.status === "ativo");
    const anyPlan = activePlan ?? subscriptions[0];

    return {
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone || "—",
      status: row.status as AccountStatus,
      parQStatus: row.par_q_status as ParQStatus,
      parQCompletedAt: row.par_q_completed_at
        ? new Date(row.par_q_completed_at).getTime()
        : undefined,
      onboardingCompleted: Boolean(row.onboarding_completed),
      planName: (anyPlan ? planNames.get(anyPlan.plan_id) : undefined) || "Sem plano",
    };
  });

  return { members };
}

export async function listPendingParQReviews(): Promise<{
  reviews: PendingParQReview[];
  error?: string;
}> {
  const { data: profiles, error: profileError } = await supabase
    .from("member_profiles")
    .select("id, full_name, email, phone, status")
    .eq("par_q_status", "encaminhar_avaliacao")
    .order("full_name", { ascending: true });

  if (profileError) {
    return { reviews: [], error: "Não foi possível carregar as avaliações pendentes." };
  }

  if (!profiles?.length) {
    return { reviews: [] };
  }

  const ids = profiles.map((profile) => profile.id);
  const { data: parQRows, error: parQError } = await supabase
    .from("member_par_q")
    .select("id, member_id, answers, completed_at, review_notes")
    .in("member_id", ids)
    .order("completed_at", { ascending: false });

  if (parQError) {
    return { reviews: [], error: "Não foi possível carregar as respostas do PAR-Q." };
  }

  const latestByMember = new Map<string, (typeof parQRows)[number]>();
  for (const row of parQRows ?? []) {
    if (!latestByMember.has(row.member_id)) {
      latestByMember.set(row.member_id, row);
    }
  }

  const reviews = profiles.flatMap((profile) => {
    const parQ = latestByMember.get(profile.id);
    if (!parQ) return [];
    return [
      {
        memberId: profile.id,
        parQId: parQ.id,
        fullName: profile.full_name,
        email: profile.email,
        phone: profile.phone || "—",
        status: profile.status as AccountStatus,
        answers: mapAnswers(parQ.answers),
        completedAt: new Date(parQ.completed_at).getTime(),
        reviewNotes: parQ.review_notes ?? "",
      } satisfies PendingParQReview,
    ];
  });

  return { reviews };
}

export async function reviewMemberParQ(input: {
  memberId: string;
  decision: ParQReviewDecision;
  notes: string;
}): Promise<{ success: boolean; error?: string }> {
  const { data, error } = await supabase.rpc("review_member_par_q", {
    p_member_id: input.memberId,
    p_decision: input.decision,
    p_notes: input.notes.trim(),
  });

  if (error) {
    return { success: false, error: "Não foi possível registrar a avaliação." };
  }

  const payload = data as { success?: boolean; error?: string } | null;
  if (!payload?.success) {
    return { success: false, error: payload?.error ?? "Não foi possível registrar a avaliação." };
  }

  return { success: true };
}
