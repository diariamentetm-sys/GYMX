-- Perfil administrativo pode promover a conta e entrar na visão demonstrativa do aluno.
-- Não altera fichas reais (is_demo = false e status ativo).

ALTER TABLE gym_academy.member_profiles
  ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS member_profiles_is_demo_idx
  ON gym_academy.member_profiles (is_demo)
  WHERE is_demo = true;

CREATE OR REPLACE FUNCTION gym_academy.bootstrap_staff_profile()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = gym_academy
AS $fn$
DECLARE
  v_user uuid := auth.uid();
  v_name text;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Não autenticado.');
  END IF;

  IF EXISTS (SELECT 1 FROM staff_profiles WHERE id = v_user) THEN
    RETURN jsonb_build_object('success', true, 'already', true);
  END IF;

  IF EXISTS (SELECT 1 FROM staff_profiles) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cadastro da equipe fechado. Peça acesso a um administrador.');
  END IF;

  SELECT coalesce(nullif(full_name, ''), split_part(email, '@', 1))
  INTO v_name
  FROM member_profiles
  WHERE id = v_user;

  IF v_name IS NULL THEN
    SELECT coalesce(
      nullif(raw_user_meta_data->>'full_name', ''),
      nullif(raw_user_meta_data->>'name', ''),
      split_part(email, '@', 1)
    )
    INTO v_name
    FROM auth.users
    WHERE id = v_user;
  END IF;

  INSERT INTO staff_profiles (id, full_name, role)
  VALUES (v_user, coalesce(v_name, 'Administrador'), 'admin');

  RETURN jsonb_build_object('success', true);
END;
$fn$;

CREATE OR REPLACE FUNCTION gym_academy.ensure_staff_demo_member(p_mode text DEFAULT 'portal')
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = gym_academy
AS $fn$
DECLARE
  v_user uuid := auth.uid();
  v_staff gym_academy.staff_profiles%ROWTYPE;
  v_member gym_academy.member_profiles%ROWTYPE;
  v_email text;
  v_trainer uuid;
  v_program uuid;
  v_now timestamptz := now();
BEGIN
  IF v_user IS NULL OR NOT gym_academy.is_staff() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Acesso restrito à equipe.');
  END IF;

  IF p_mode NOT IN ('portal', 'onboarding') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Modo inválido.');
  END IF;

  SELECT * INTO v_staff FROM staff_profiles WHERE id = v_user;
  SELECT * INTO v_member FROM member_profiles WHERE id = v_user;
  SELECT email INTO v_email FROM auth.users WHERE id = v_user;
  v_email := lower(coalesce(nullif(v_email, ''), v_user::text || '@demo.gymx.local'));

  IF v_member.id IS NOT NULL AND v_member.status = 'ativo' AND v_member.is_demo = false THEN
    RETURN jsonb_build_object('success', true, 'mode', p_mode, 'view_only', true);
  END IF;

  IF v_member.id IS NULL THEN
    INSERT INTO member_profiles (
      id, full_name, email, phone, status, email_verified,
      onboarding_completed, par_q_status, is_demo, terms_version
    ) VALUES (
      v_user,
      v_staff.full_name,
      v_email,
      '',
      'onboarding_pendente',
      true,
      false,
      'nao_preenchido',
      true,
      '2026.09.1'
    )
    RETURNING * INTO v_member;
  ELSE
    UPDATE member_profiles
    SET
      is_demo = true,
      email_verified = true,
      verification_code = NULL,
      verification_code_expires_at = NULL
    WHERE id = v_user
    RETURNING * INTO v_member;
  END IF;

  IF p_mode = 'onboarding' THEN
    UPDATE member_profiles
    SET
      status = 'onboarding_pendente',
      onboarding_completed = false,
      par_q_status = 'nao_preenchido',
      par_q_completed_at = NULL,
      terms_accepted_at = NULL,
      health_consent_at = NULL,
      biometric_consent_at = NULL,
      updated_at = v_now
    WHERE id = v_user;

    RETURN jsonb_build_object('success', true, 'mode', 'onboarding');
  END IF;

  UPDATE member_profiles
  SET
    status = 'ativo',
    onboarding_completed = true,
    par_q_status = 'apto',
    par_q_completed_at = v_now,
    terms_accepted_at = coalesce(terms_accepted_at, v_now),
    terms_version = '2026.09.1',
    health_consent_at = coalesce(health_consent_at, v_now),
    updated_at = v_now
  WHERE id = v_user;

  IF NOT EXISTS (
    SELECT 1 FROM member_par_q WHERE member_id = v_user AND status = 'apto'
  ) THEN
    INSERT INTO member_par_q (member_id, answers, status, completed_at)
    VALUES (
      v_user,
      jsonb_build_object(
        'q1', false, 'q2', false, 'q3', false, 'q4', false,
        'q5', false, 'q6', false, 'q7', false
      ),
      'apto',
      v_now
    );
  END IF;

  IF EXISTS (SELECT 1 FROM member_subscriptions WHERE member_id = v_user) THEN
    UPDATE member_subscriptions
    SET
      plan_id = 'elite',
      status = 'ativo',
      monthly_price = 890,
      loyalty_start = CURRENT_DATE,
      loyalty_end = CURRENT_DATE + 90,
      cycle_start = CURRENT_DATE,
      cycle_end = (CURRENT_DATE + interval '1 month')::date,
      next_billing_date = (CURRENT_DATE + interval '1 month')::date,
      auto_renew = true,
      updated_at = v_now
    WHERE member_id = v_user;
  ELSE
    INSERT INTO member_subscriptions (
      member_id, plan_id, status, monthly_price,
      loyalty_start, loyalty_end, cycle_start, cycle_end, next_billing_date, auto_renew
    ) VALUES (
      v_user, 'elite', 'ativo', 890,
      CURRENT_DATE, CURRENT_DATE + 90, CURRENT_DATE,
      (CURRENT_DATE + interval '1 month')::date,
      (CURRENT_DATE + interval '1 month')::date,
      true
    );
  END IF;

  SELECT id INTO v_trainer FROM gym_trainers ORDER BY created_at LIMIT 1;

  IF v_trainer IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM member_workout_programs
    WHERE member_id = v_user AND status = 'ativo'
  ) THEN
    INSERT INTO member_workout_programs (
      member_id, trainer_id, original_author_id, approved_by,
      modality, objective, label, division, prescription_type,
      status, valid_from, valid_until, cycle_weeks, approved_at
    ) VALUES (
      v_user, v_trainer, v_trainer, v_trainer,
      'musculacao', 'Demonstração administrativa', 'Treino A — Demo',
      'Full body', 'manual',
      'ativo', CURRENT_DATE, CURRENT_DATE + 56, 8, v_now
    )
    RETURNING id INTO v_program;

    INSERT INTO member_workout_exercises (program_id, sort_order, name, sets, reps, rest_seconds, notes)
    VALUES
      (v_program, 1, 'Agachamento livre', 4, '10', 90, 'Demonstração — ajuste a carga com o professor.'),
      (v_program, 2, 'Supino reto', 4, '8', 90, NULL),
      (v_program, 3, 'Remada curvada', 3, '10', 75, NULL),
      (v_program, 4, 'Prancha', 3, '40s', 45, 'Manter o quadril alinhado.');
  END IF;

  RETURN jsonb_build_object('success', true, 'mode', 'portal');
END;
$fn$;

REVOKE ALL ON FUNCTION gym_academy.bootstrap_staff_profile() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION gym_academy.ensure_staff_demo_member(text) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION gym_academy.bootstrap_staff_profile() TO authenticated;
GRANT EXECUTE ON FUNCTION gym_academy.ensure_staff_demo_member(text) TO authenticated;

NOTIFY pgrst, 'reload schema';
