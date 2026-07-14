export type AccountStatus =
  | "incompleto"
  | "pendente_verificacao"
  | "pendente_correcao"
  | "onboarding_pendente"
  | "ativo"
  | "encerramento_solicitado";

export type ParQStatus =
  | "nao_preenchido"
  | "apto"
  | "apto_com_restricao"
  | "encaminhar_avaliacao"
  | "expirado";

export type DocumentStatus = "nao_enviado" | "pendente" | "aprovado" | "rejeitado";

export type LgpdRequestType =
  | "acesso"
  | "correcao"
  | "portabilidade"
  | "exclusao";

export interface Guardian {
  fullName: string;
  cpf: string;
  email: string;
  termsAccepted: boolean;
}

export interface ParQAnswers {
  q1: boolean;
  q2: boolean;
  q3: boolean;
  q4: boolean;
  q5: boolean;
  q6: boolean;
  q7: boolean;
}

export interface LgpdRequest {
  id: string;
  type: LgpdRequestType;
  description: string;
  status: "aberto" | "em_processamento" | "concluido";
  createdAt: number;
  deadlineAt: number;
}

export interface MemberProfile {
  id: string;
  fullName: string;
  cpf: string;
  birthDate: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  photoUrl?: string;
  status: AccountStatus;
  guardian?: Guardian;
  termsAcceptedAt?: number;
  termsVersion: string;
  healthConsentAt?: number;
  biometricConsentAt?: number;
  verificationCode?: string;
  verificationCodeExpiresAt?: number;
  verificationResendCount: number;
  verificationResendDate: string;
  emailVerified: boolean;
  pendingEmail?: string;
  pendingEmailCode?: string;
  documentStatus: DocumentStatus;
  documentRejectionReason?: string;
  documentStoragePath?: string;
  documentUploadedAt?: number;
  parQ?: ParQAnswers;
  parQStatus: ParQStatus;
  parQCompletedAt?: number;
  onboardingCompleted: boolean;
  lgpdRequests: LgpdRequest[];
  createdAt: number;
  updatedAt: number;
}

export interface RegisterFormData {
  fullName: string;
  cpf: string;
  birthDate: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  guardian?: Guardian;
}
