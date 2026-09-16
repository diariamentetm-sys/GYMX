import { supabase } from "../lib/supabase";
import { CURRENT_TERMS_VERSION } from "../constants/terms";
import type {
  Guardian,
  LgpdRequest,
  LgpdRequestType,
  MemberProfile,
  ParQAnswers,
  ParQStatus,
  RegisterFormData,
} from "../types/member";
import {
  MAX_VERIFICATION_RESENDS_PER_DAY,
  VERIFICATION_CODE_TTL_MS,
  evaluateParQ,
  getParQStatus,
} from "../utils/parq";
import { stripCpf } from "../utils/cpf";

interface MemberProfileRow {
  id: string;
  full_name: string;
  cpf: string;
  birth_date: string;
  email: string;
  phone: string;
  address: string;
  emergency_contact: string;
  emergency_phone: string;
  photo_url: string | null;
  status: MemberProfile["status"];
  guardian: Guardian | null;
  terms_accepted_at: string | null;
  terms_version: string;
  health_consent_at: string | null;
  biometric_consent_at: string | null;
  email_verified: boolean;
  pending_email: string | null;
  pending_email_code: string | null;
  document_status: MemberProfile["documentStatus"];
  document_rejection_reason: string | null;
  document_storage_path: string | null;
  document_uploaded_at: string | null;
  par_q_status: ParQStatus;
  par_q_completed_at: string | null;
  onboarding_completed: boolean;
  verification_resend_count: number;
  verification_resend_date: string | null;
  verification_code: string | null;
  verification_code_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ParQRow {
  answers: ParQAnswers;
  status: ParQStatus;
  completed_at: string;
}

interface LgpdRow {
  id: string;
  type: LgpdRequestType;
  description: string;
  status: LgpdRequest["status"];
  created_at: string;
  deadline_at: string;
}

function toTimestamp(value: string | null | undefined): number | undefined {
  if (!value) return undefined;
  return new Date(value).getTime();
}

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

async function fetchParQ(memberId: string): Promise<{
  answers?: ParQAnswers;
  completedAt?: number;
}> {
  const { data } = await supabase
    .from("member_par_q")
    .select("answers, completed_at")
    .eq("member_id", memberId)
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return {};

  const row = data as ParQRow;
  return {
    answers: row.answers,
    completedAt: toTimestamp(row.completed_at),
  };
}

async function fetchLgpdRequests(memberId: string): Promise<LgpdRequest[]> {
  const { data } = await supabase
    .from("member_lgpd_requests")
    .select("id, type, description, status, created_at, deadline_at")
    .eq("member_id", memberId)
    .order("created_at", { ascending: false });

  if (!data) return [];

  return (data as LgpdRow[]).map((row) => ({
    id: row.id,
    type: row.type,
    description: row.description,
    status: row.status,
    createdAt: toTimestamp(row.created_at) ?? Date.now(),
    deadlineAt: toTimestamp(row.deadline_at) ?? Date.now(),
  }));
}

function mapRowToProfile(
  row: MemberProfileRow,
  extras?: {
    parQ?: ParQAnswers;
    parQCompletedAt?: number;
    lgpdRequests?: LgpdRequest[];
  }
): MemberProfile {
  return {
    id: row.id,
    fullName: row.full_name,
    cpf: row.cpf,
    birthDate: row.birth_date,
    email: row.email,
    phone: row.phone,
    address: row.address,
    emergencyContact: row.emergency_contact,
    emergencyPhone: row.emergency_phone,
    photoUrl: row.photo_url ?? undefined,
    status: row.status,
    guardian: row.guardian ?? undefined,
    termsAcceptedAt: toTimestamp(row.terms_accepted_at),
    termsVersion: row.terms_version,
    healthConsentAt: toTimestamp(row.health_consent_at),
    biometricConsentAt: toTimestamp(row.biometric_consent_at),
    emailVerified: row.email_verified,
    pendingEmail: row.pending_email ?? undefined,
    pendingEmailCode: row.pending_email_code ?? undefined,
    documentStatus: row.document_status,
    documentRejectionReason: row.document_rejection_reason ?? undefined,
    documentStoragePath: row.document_storage_path ?? undefined,
    documentUploadedAt: toTimestamp(row.document_uploaded_at),
    parQ: extras?.parQ,
    parQStatus: row.par_q_status,
    parQCompletedAt:
      extras?.parQCompletedAt ?? toTimestamp(row.par_q_completed_at),
    onboardingCompleted: row.onboarding_completed,
    verificationCode: row.verification_code ?? undefined,
    verificationCodeExpiresAt: toTimestamp(row.verification_code_expires_at),
    verificationResendCount: row.verification_resend_count,
    verificationResendDate: row.verification_resend_date ?? todayKey(),
    lgpdRequests: extras?.lgpdRequests ?? [],
    createdAt: toTimestamp(row.created_at) ?? Date.now(),
    updatedAt: toTimestamp(row.updated_at) ?? Date.now(),
  };
}

export async function loadMemberProfile(
  userId: string
): Promise<MemberProfile | null> {
  const { data, error } = await supabase
    .from("member_profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;

  const [parQData, lgpdRequests] = await Promise.all([
    fetchParQ(userId),
    fetchLgpdRequests(userId),
  ]);

  return mapRowToProfile(data as MemberProfileRow, {
    parQ: parQData.answers,
    parQCompletedAt: parQData.completedAt,
    lgpdRequests,
  });
}

export async function checkRegistrationAvailable(
  email: string,
  cpf: string
): Promise<{ emailAvailable: boolean; cpfAvailable: boolean }> {
  const { data, error } = await supabase.rpc("check_registration_available", {
    p_email: email,
    p_cpf: cpf,
  });

  if (error || !data) {
    return { emailAvailable: true, cpfAvailable: true };
  }

  const result = data as {
    email_available: boolean;
    cpf_available: boolean;
  };

  return {
    emailAvailable: result.email_available,
    cpfAvailable: result.cpf_available,
  };
}

export async function registerMember(
  data: RegisterFormData
): Promise<{ profile: MemberProfile | null; sessionCreated?: boolean; error?: string }> {
  const availability = await checkRegistrationAvailable(data.email, data.cpf);

  if (!availability.emailAvailable) {
    return {
      profile: null,
      error:
        "Este e-mail já possui conta ativa. Recupere sua senha ou fale com a recepção.",
    };
  }

  if (!availability.cpfAvailable) {
    return {
      profile: null,
      error:
        "Este CPF já está cadastrado. Recupere sua senha ou fale com a recepção.",
    };
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email.trim().toLowerCase(),
    password: data.password,
    options: {
      emailRedirectTo: getMemberVerificationUrl(),
      data: {
        full_name: data.fullName.trim(),
        cpf: stripCpf(data.cpf),
        birth_date: data.birthDate,
        phone: data.phone.trim(),
        guardian: data.guardian ?? null,
      },
    },
  });

  if (authError) {
    if (authError.message.toLowerCase().includes("already registered")) {
      return {
        profile: null,
        error:
          "Este e-mail já possui conta ativa. Recupere sua senha ou fale com a recepção.",
      };
    }
    return { profile: null, error: authError.message };
  }

  if (!authData.user) {
    return { profile: null, error: "Falha ao criar conta." };
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  const profile = await loadMemberProfile(authData.user.id);

  return { profile, sessionCreated: Boolean(authData.session) };
}

export async function signInWithGoogle(): Promise<{ error?: string }> {
  const redirectTo = `${window.location.origin}/login`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error) {
    return { error: "Não foi possível iniciar o login com Google." };
  }

  return {};
}

export async function signInMember(
  email: string,
  password: string
): Promise<{ profile: MemberProfile | null; error?: string }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("not confirmed") || error.code === "email_not_confirmed") {
      return {
        profile: null,
        error:
          "A conta existe, mas o e-mail ainda não foi liberado no Auth. Tente de novo em instantes ou fale com a recepção.",
      };
    }
    return { profile: null, error: "E-mail ou senha incorretos." };
  }

  if (!data.user) {
    return { profile: null, error: "Falha ao autenticar." };
  }

  const profile = await loadMemberProfile(data.user.id);

  if (profile?.status === "encerramento_solicitado") {
    await supabase.auth.signOut();
    return { profile: null, error: "Conta em processo de encerramento." };
  }

  return { profile };
}

export async function signOutMember(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getDevVerificationCode(
  email: string
): Promise<string | null> {
  const { data, error } = await supabase.rpc("get_dev_verification_code", {
    p_email: email,
  });

  if (error) return null;
  return data as string | null;
}

export async function verifyMemberCode(
  userId: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  const profile = await loadMemberProfile(userId);
  if (!profile) {
    return { success: false, error: "Conta não encontrada." };
  }

  if (!profile.verificationCode || !profile.verificationCodeExpiresAt) {
    return { success: false, error: "Nenhum código ativo. Solicite um novo envio." };
  }

  if (Date.now() > profile.verificationCodeExpiresAt) {
    return { success: false, error: "Código expirado. Solicite um novo envio." };
  }

  if (profile.verificationCode !== code.trim()) {
    return { success: false, error: "Código inválido. Verifique e tente novamente." };
  }

  const { error } = await supabase
    .from("member_profiles")
    .update({
      email_verified: true,
      status: "onboarding_pendente",
      verification_code: null,
      verification_code_expires_at: null,
    })
    .eq("id", userId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function resendVerificationCode(
  userId: string
): Promise<{ success: boolean; code?: string; error?: string }> {
  const profile = await loadMemberProfile(userId);
  if (!profile) {
    return { success: false, error: "Conta não encontrada." };
  }

  const today = todayKey();
  let resendCount = profile.verificationResendCount;

  if (profile.verificationResendDate !== today) {
    resendCount = 0;
  }

  if (resendCount >= MAX_VERIFICATION_RESENDS_PER_DAY) {
    return {
      success: false,
      error: "Limite de 5 reenvios por dia atingido. Tente novamente amanhã.",
    };
  }

  const code = generateCode();
  const expiresAt = new Date(Date.now() + VERIFICATION_CODE_TTL_MS).toISOString();

  const { error } = await supabase
    .from("member_profiles")
    .update({
      verification_code: code,
      verification_code_expires_at: expiresAt,
      verification_resend_count: resendCount + 1,
      verification_resend_date: today,
    })
    .eq("id", userId);

  if (error) {
    return { success: false, error: error.message };
  }

  await supabase.from("member_verification_codes").insert({
    member_id: userId,
    code,
    expires_at: expiresAt,
  });

  return { success: true, code };
}

export async function completeOnboarding(
  userId: string,
  data: {
    termsAccepted: boolean;
    healthConsent: boolean;
    biometricConsent: boolean;
    parQ: ParQAnswers;
    documentStoragePath?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  if (!data.termsAccepted) {
    return { success: false, error: "Aceite dos Termos de Uso é obrigatório." };
  }

  if (!data.healthConsent) {
    return {
      success: false,
      error: "Consentimento específico para dados de saúde é obrigatório.",
    };
  }

  const parQStatus = evaluateParQ(data.parQ);
  const now = new Date().toISOString();

  const { error: parQError } = await supabase.from("member_par_q").insert({
    member_id: userId,
    answers: data.parQ,
    status: parQStatus,
    completed_at: now,
  });

  if (parQError) {
    return { success: false, error: parQError.message };
  }

  const profile = await loadMemberProfile(userId);

  const { error } = await supabase
    .from("member_profiles")
    .update({
      terms_accepted_at: now,
      terms_version: CURRENT_TERMS_VERSION,
      health_consent_at: now,
      biometric_consent_at: data.biometricConsent ? now : null,
      par_q_status: parQStatus,
      par_q_completed_at: now,
      document_status: data.documentStoragePath
        ? "pendente"
        : profile?.documentStatus ?? "nao_enviado",
      document_storage_path: data.documentStoragePath ?? profile?.documentStoragePath ?? null,
      document_uploaded_at: data.documentStoragePath
        ? now
        : profile?.documentUploadedAt
          ? new Date(profile.documentUploadedAt).toISOString()
          : null,
      onboarding_completed: true,
      status: "ativo",
    })
    .eq("id", userId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export function needsTermsReacceptance(profile: MemberProfile): boolean {
  return (
    !!profile.termsAcceptedAt &&
    profile.termsVersion !== CURRENT_TERMS_VERSION
  );
}

export async function reacceptTerms(userId: string): Promise<void> {
  await supabase
    .from("member_profiles")
    .update({
      terms_accepted_at: new Date().toISOString(),
      terms_version: CURRENT_TERMS_VERSION,
    })
    .eq("id", userId);
}

export async function updateEditableProfile(
  userId: string,
  data: Partial<
    Pick<
      MemberProfile,
      "phone" | "address" | "emergencyContact" | "emergencyPhone" | "photoUrl"
    >
  >
): Promise<MemberProfile | null> {
  const payload: Record<string, string | null> = {};

  if (data.phone !== undefined) payload.phone = data.phone;
  if (data.address !== undefined) payload.address = data.address;
  if (data.emergencyContact !== undefined) {
    payload.emergency_contact = data.emergencyContact;
  }
  if (data.emergencyPhone !== undefined) {
    payload.emergency_phone = data.emergencyPhone;
  }
  if (data.photoUrl !== undefined) payload.photo_url = data.photoUrl ?? null;

  const { error } = await supabase
    .from("member_profiles")
    .update(payload)
    .eq("id", userId);

  if (error) return null;

  return loadMemberProfile(userId);
}

export async function updateMemberDocument(
  userId: string,
  storagePath: string
): Promise<MemberProfile | null> {
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("member_profiles")
    .update({
      document_storage_path: storagePath,
      document_uploaded_at: now,
      document_status: "pendente",
      document_rejection_reason: null,
    })
    .eq("id", userId);

  if (error) return null;

  return loadMemberProfile(userId);
}

export async function requestEmailChange(
  userId: string,
  newEmail: string
): Promise<{ success: boolean; code?: string; error?: string }> {
  const normalized = newEmail.trim().toLowerCase();

  const { data: existing } = await supabase
    .from("member_profiles")
    .select("id")
    .eq("email", normalized)
    .neq("id", userId)
    .maybeSingle();

  if (existing) {
    return { success: false, error: "Este e-mail já está em uso." };
  }

  const code = generateCode();

  const { error } = await supabase
    .from("member_profiles")
    .update({
      pending_email: normalized,
      pending_email_code: code,
    })
    .eq("id", userId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, code };
}

export async function confirmEmailChange(
  userId: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  const profile = await loadMemberProfile(userId);

  if (!profile?.pendingEmail || !profile.pendingEmailCode) {
    return { success: false, error: "Nenhuma alteração de e-mail pendente." };
  }

  if (profile.pendingEmailCode !== code.trim()) {
    return { success: false, error: "Código inválido." };
  }

  const { error: authError } = await supabase.auth.updateUser({
    email: profile.pendingEmail,
  });

  if (authError) {
    return { success: false, error: authError.message };
  }

  const { error } = await supabase
    .from("member_profiles")
    .update({
      email: profile.pendingEmail,
      pending_email: null,
      pending_email_code: null,
    })
    .eq("id", userId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function submitParQ(
  userId: string,
  answers: ParQAnswers
): Promise<{ success: boolean; status: ParQStatus }> {
  const status = evaluateParQ(answers);
  const now = new Date().toISOString();

  await supabase.from("member_par_q").insert({
    member_id: userId,
    answers,
    status,
    completed_at: now,
  });

  await supabase
    .from("member_profiles")
    .update({
      par_q_status: status,
      par_q_completed_at: now,
    })
    .eq("id", userId);

  return { success: true, status };
}

export async function refreshParQStatus(
  profile: MemberProfile
): Promise<ParQStatus> {
  const status = getParQStatus(profile.parQ, profile.parQCompletedAt);

  if (status !== profile.parQStatus) {
    await supabase
      .from("member_profiles")
      .update({ par_q_status: status })
      .eq("id", profile.id);
  }

  return status;
}

export async function createLgpdRequest(
  userId: string,
  type: LgpdRequestType,
  description: string
): Promise<LgpdRequest | null> {
  const deadline = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("member_lgpd_requests")
    .insert({
      member_id: userId,
      type,
      description,
      status: "aberto",
      deadline_at: deadline,
    })
    .select("id, type, description, status, created_at, deadline_at")
    .single();

  if (error || !data) return null;

  const row = data as LgpdRow;
  return {
    id: row.id,
    type: row.type,
    description: row.description,
    status: row.status,
    createdAt: toTimestamp(row.created_at) ?? Date.now(),
    deadlineAt: toTimestamp(row.deadline_at) ?? Date.now(),
  };
}

export async function requestAccountDeletion(userId: string): Promise<void> {
  await supabase
    .from("member_profiles")
    .update({ status: "encerramento_solicitado" })
    .eq("id", userId);
}

export function getMemberVerificationUrl(): string {
  return `${window.location.origin}/cadastro/verificacao`;
}

export function getPostLoginRedirect(profile: MemberProfile): string {
  if (profile.status === "pendente_verificacao" || !profile.emailVerified) {
    return "/cadastro/verificacao";
  }

  if (needsTermsReacceptance(profile)) {
    return "/portal/termos";
  }

  if (!profile.onboardingCompleted || profile.status === "onboarding_pendente") {
    return "/portal/onboarding";
  }

  if (profile.status === "pendente_correcao") {
    return "/portal/onboarding";
  }

  return "/portal";
}
