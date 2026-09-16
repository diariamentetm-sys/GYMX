-- GymX schema on shared Projetos instance (public is empty; other apps use dedicated schemas).
-- Rollback: drop gymx triggers/functions/tables/buckets listed below. Do not drop brecho/rodolfo objects.

CREATE OR REPLACE FUNCTION public.gymx_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.member_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name text NOT NULL,
  cpf text,
  birth_date date,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  emergency_contact text NOT NULL DEFAULT '',
  emergency_phone text NOT NULL DEFAULT '',
  photo_url text,
  status text NOT NULL DEFAULT 'pendente_verificacao'
    CHECK (status IN (
      'incompleto',
      'pendente_verificacao',
      'pendente_correcao',
      'onboarding_pendente',
      'ativo',
      'encerramento_solicitado'
    )),
  guardian jsonb,
  terms_accepted_at timestamptz,
  terms_version text NOT NULL DEFAULT '2026.07.1',
  health_consent_at timestamptz,
  biometric_consent_at timestamptz,
  email_verified boolean NOT NULL DEFAULT false,
  pending_email text,
  pending_email_code text,
  document_status text NOT NULL DEFAULT 'nao_enviado'
    CHECK (document_status IN ('nao_enviado', 'pendente', 'aprovado', 'rejeitado')),
  document_rejection_reason text,
  document_storage_path text,
  document_uploaded_at timestamptz,
  par_q_status text NOT NULL DEFAULT 'nao_preenchido'
    CHECK (par_q_status IN (
      'nao_preenchido',
      'apto',
      'apto_com_restricao',
      'encaminhar_avaliacao',
      'expirado'
    )),
  par_q_completed_at timestamptz,
  onboarding_completed boolean NOT NULL DEFAULT false,
  verification_resend_count integer NOT NULL DEFAULT 0,
  verification_resend_date date,
  verification_code text,
  verification_code_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS member_profiles_email_key
  ON public.member_profiles (lower(email));
CREATE UNIQUE INDEX IF NOT EXISTS member_profiles_cpf_key
  ON public.member_profiles (cpf)
  WHERE cpf IS NOT NULL AND cpf <> '';

CREATE TABLE IF NOT EXISTS public.member_par_q (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.member_profiles (id) ON DELETE CASCADE,
  answers jsonb NOT NULL,
  status text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.member_lgpd_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.member_profiles (id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('acesso', 'correcao', 'portabilidade', 'exclusao')),
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'aberto'
    CHECK (status IN ('aberto', 'em_processamento', 'concluido')),
  created_at timestamptz NOT NULL DEFAULT now(),
  deadline_at timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS public.member_verification_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.member_profiles (id) ON DELETE CASCADE,
  code text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gym_plans (
  id text PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  badge text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  monthly_price numeric(10, 2) NOT NULL,
  loyalty_months integer NOT NULL DEFAULT 3,
  penalty_percent numeric(5, 2) NOT NULL DEFAULT 0,
  freeze_days_per_cycle integer NOT NULL DEFAULT 0,
  checkins_per_month integer,
  schedule_label text NOT NULL DEFAULT '',
  benefits text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.member_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.member_profiles (id) ON DELETE CASCADE,
  plan_id text NOT NULL REFERENCES public.gym_plans (id),
  status text NOT NULL DEFAULT 'pendente_pagamento'
    CHECK (status IN (
      'pendente_pagamento',
      'ativo',
      'congelado',
      'cancelamento_agendado',
      'cancelado',
      'inadimplente'
    )),
  monthly_price numeric(10, 2) NOT NULL,
  loyalty_start date,
  loyalty_end date,
  cycle_start date,
  cycle_end date,
  next_billing_date date,
  auto_renew boolean NOT NULL DEFAULT true,
  pending_payment_expires_at timestamptz,
  scheduled_plan_id text REFERENCES public.gym_plans (id),
  scheduled_change_at timestamptz,
  cancellation_requested_at timestamptz,
  cancellation_effective_at date,
  cancellation_reason text,
  penalty_amount numeric(10, 2),
  outstanding_balance numeric(10, 2) NOT NULL DEFAULT 0,
  freeze_start date,
  freeze_end date,
  freeze_days_used_cycle integer NOT NULL DEFAULT 0,
  freeze_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subscription_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL REFERENCES public.member_subscriptions (id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES public.member_profiles (id) ON DELETE CASCADE,
  amount numeric(10, 2) NOT NULL,
  payment_type text NOT NULL CHECK (payment_type IN ('contratacao', 'upgrade', 'renovacao', 'multa')),
  status text NOT NULL DEFAULT 'pendente'
    CHECK (status IN ('pendente', 'aprovado', 'recusado', 'estornado')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gym_trainers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  cref text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  photo_url text,
  specialties text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gym_class_settings (
  id text PRIMARY KEY,
  unit_name text NOT NULL,
  booking_open_days integer NOT NULL DEFAULT 7,
  booking_close_minutes integer NOT NULL DEFAULT 30,
  cancel_limit_hours integer NOT NULL DEFAULT 8,
  checkin_before_minutes integer NOT NULL DEFAULT 30,
  checkin_after_minutes integer NOT NULL DEFAULT 15,
  max_no_shows_period integer NOT NULL DEFAULT 3,
  no_show_period_days integer NOT NULL DEFAULT 30,
  booking_block_days integer NOT NULL DEFAULT 7,
  waitlist_confirm_minutes integer NOT NULL DEFAULT 30,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gym_class_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id text NOT NULL DEFAULT 'main',
  modality text NOT NULL CHECK (modality IN ('spinning', 'funcional', 'yoga', 'pilates', 'muay_thai')),
  title text NOT NULL,
  description text,
  instructor_id uuid NOT NULL REFERENCES public.gym_trainers (id),
  room text NOT NULL DEFAULT '',
  intensity text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  capacity integer NOT NULL DEFAULT 12,
  booked_count integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'cancelled', 'completed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS gym_class_sessions_starts_at_idx
  ON public.gym_class_sessions (starts_at);

CREATE TABLE IF NOT EXISTS public.member_class_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.member_profiles (id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES public.gym_class_sessions (id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'confirmed'
    CHECK (status IN ('confirmed', 'cancelled', 'late_cancel', 'attended', 'no_show')),
  reserved_at timestamptz NOT NULL DEFAULT now(),
  cancelled_at timestamptz,
  checked_in_at timestamptz
);

CREATE INDEX IF NOT EXISTS member_class_reservations_member_idx
  ON public.member_class_reservations (member_id, status);

CREATE TABLE IF NOT EXISTS public.member_class_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.member_profiles (id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES public.gym_class_sessions (id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'waiting'
    CHECK (status IN ('waiting', 'promoted', 'left', 'expired')),
  joined_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.member_workout_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.member_profiles (id) ON DELETE CASCADE,
  trainer_id uuid NOT NULL REFERENCES public.gym_trainers (id),
  supervisor_trainer_id uuid REFERENCES public.gym_trainers (id),
  original_author_id uuid REFERENCES public.gym_trainers (id),
  approved_by uuid REFERENCES public.gym_trainers (id),
  modality text NOT NULL CHECK (modality IN ('musculacao', 'funcional', 'cardio', 'mobilidade')),
  objective text NOT NULL DEFAULT '',
  label text NOT NULL,
  division text NOT NULL DEFAULT '',
  prescription_type text NOT NULL DEFAULT 'manual'
    CHECK (prescription_type IN ('manual', 'ia', 'hibrido')),
  status text NOT NULL DEFAULT 'ativo'
    CHECK (status IN ('ativo', 'expirado', 'arquivado', 'pendente_aprovacao')),
  version_number integer NOT NULL DEFAULT 1,
  parent_program_id uuid REFERENCES public.member_workout_programs (id),
  valid_from date NOT NULL DEFAULT current_date,
  valid_until date NOT NULL,
  cycle_weeks integer NOT NULL DEFAULT 4,
  ai_generated boolean NOT NULL DEFAULT false,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.member_workout_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES public.member_workout_programs (id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  name text NOT NULL,
  sets integer NOT NULL DEFAULT 3,
  reps text NOT NULL DEFAULT '10',
  load_kg numeric(6, 2),
  rest_seconds integer NOT NULL DEFAULT 60,
  notes text,
  video_url text
);

CREATE TABLE IF NOT EXISTS public.workout_program_edits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES public.member_workout_programs (id) ON DELETE CASCADE,
  editor_trainer_id uuid NOT NULL REFERENCES public.gym_trainers (id),
  original_author_id uuid REFERENCES public.gym_trainers (id),
  edit_type text NOT NULL CHECK (edit_type IN ('criacao', 'edicao', 'aprovacao_ia')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.member_workout_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.member_profiles (id) ON DELETE CASCADE,
  modality text NOT NULL CHECK (modality IN ('musculacao', 'funcional', 'cardio', 'mobilidade')),
  notes text,
  status text NOT NULL DEFAULT 'pendente'
    CHECK (status IN ('pendente', 'atribuido', 'concluido')),
  assigned_trainer_id uuid REFERENCES public.gym_trainers (id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.member_workout_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.member_profiles (id) ON DELETE CASCADE,
  program_id uuid NOT NULL REFERENCES public.member_workout_programs (id) ON DELETE CASCADE,
  trainer_id uuid NOT NULL REFERENCES public.gym_trainers (id),
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  status text NOT NULL DEFAULT 'em_andamento'
    CHECK (status IN ('em_andamento', 'concluido', 'parcial')),
  feedback_pain text,
  wearable_hr_avg numeric,
  wearable_calories numeric
);

CREATE TABLE IF NOT EXISTS public.member_workout_session_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.member_workout_sessions (id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES public.member_workout_exercises (id) ON DELETE CASCADE,
  set_number integer NOT NULL,
  prescribed_sets integer NOT NULL,
  prescribed_reps text NOT NULL,
  prescribed_load_kg numeric(6, 2),
  executed_reps integer,
  executed_load_kg numeric(6, 2),
  rpe numeric,
  skipped boolean NOT NULL DEFAULT false,
  divergence_flag boolean NOT NULL DEFAULT false
);

DROP TRIGGER IF EXISTS member_profiles_updated_at ON public.member_profiles;
CREATE TRIGGER member_profiles_updated_at
  BEFORE UPDATE ON public.member_profiles
  FOR EACH ROW EXECUTE FUNCTION public.gymx_set_updated_at();

DROP TRIGGER IF EXISTS gym_plans_updated_at ON public.gym_plans;
CREATE TRIGGER gym_plans_updated_at
  BEFORE UPDATE ON public.gym_plans
  FOR EACH ROW EXECUTE FUNCTION public.gymx_set_updated_at();

DROP TRIGGER IF EXISTS member_subscriptions_updated_at ON public.member_subscriptions;
CREATE TRIGGER member_subscriptions_updated_at
  BEFORE UPDATE ON public.member_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.gymx_set_updated_at();

DROP TRIGGER IF EXISTS gym_trainers_updated_at ON public.gym_trainers;
CREATE TRIGGER gym_trainers_updated_at
  BEFORE UPDATE ON public.gym_trainers
  FOR EACH ROW EXECUTE FUNCTION public.gymx_set_updated_at();

DROP TRIGGER IF EXISTS member_workout_programs_updated_at ON public.member_workout_programs;
CREATE TRIGGER member_workout_programs_updated_at
  BEFORE UPDATE ON public.member_workout_programs
  FOR EACH ROW EXECUTE FUNCTION public.gymx_set_updated_at();
