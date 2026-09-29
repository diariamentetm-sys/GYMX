-- GymX compartilha Auth com outros apps no mesmo projeto.
-- Só cria ficha em gym_academy quando o cadastro é da academia.

CREATE OR REPLACE FUNCTION gym_academy.is_gymx_signup(p_meta jsonb)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT
    coalesce(p_meta->>'app', '') = 'gymx'
    OR coalesce(p_meta->>'account_type', '') = 'staff'
    OR nullif(p_meta->>'cpf', '') IS NOT NULL;
$$;

CREATE OR REPLACE FUNCTION gym_academy.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = gym_academy
AS $fn$
DECLARE
  v_code text;
  v_verified boolean;
  v_status text;
  v_name text;
  v_cpf text;
BEGIN
  IF NOT gym_academy.is_gymx_signup(NEW.raw_user_meta_data) THEN
    RETURN NEW;
  END IF;

  v_name := coalesce(
    nullif(NEW.raw_user_meta_data->>'full_name', ''),
    nullif(NEW.raw_user_meta_data->>'name', ''),
    split_part(NEW.email, '@', 1)
  );

  IF NEW.raw_user_meta_data->>'account_type' = 'staff' THEN
    IF EXISTS (SELECT 1 FROM staff_profiles) THEN
      RAISE EXCEPTION 'Cadastro da equipe fechado. Peça acesso a um administrador.';
    END IF;

    INSERT INTO staff_profiles (id, full_name, role)
    VALUES (NEW.id, v_name, 'admin');

    RETURN NEW;
  END IF;

  v_verified := NEW.email_confirmed_at IS NOT NULL;
  v_status := CASE WHEN v_verified THEN 'onboarding_pendente' ELSE 'pendente_verificacao' END;
  v_cpf := nullif(NEW.raw_user_meta_data->>'cpf', '');
  v_code := CASE WHEN v_verified THEN NULL ELSE lpad((floor(random() * 900000) + 100000)::int::text, 6, '0') END;

  INSERT INTO member_profiles (
    id, full_name, cpf, birth_date, email, phone, guardian,
    status, email_verified, verification_code, verification_code_expires_at
  ) VALUES (
    NEW.id,
    v_name,
    v_cpf,
    nullif(NEW.raw_user_meta_data->>'birth_date', '')::date,
    lower(NEW.email),
    coalesce(NEW.raw_user_meta_data->>'phone', ''),
    CASE
      WHEN NEW.raw_user_meta_data->'guardian' IS NULL THEN NULL
      WHEN NEW.raw_user_meta_data->>'guardian' IN ('null', '') THEN NULL
      ELSE NEW.raw_user_meta_data->'guardian'
    END,
    v_status,
    v_verified,
    v_code,
    CASE WHEN v_code IS NULL THEN NULL ELSE now() + interval '24 hours' END
  );

  IF v_code IS NOT NULL THEN
    INSERT INTO member_verification_codes (member_id, code, expires_at)
    VALUES (NEW.id, v_code, now() + interval '24 hours');
  END IF;

  RETURN NEW;
END;
$fn$;

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
  WHERE id = v_user
    AND (
      cpf IS NOT NULL
      OR is_demo = true
    );

  IF v_name IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error',
      'Esta conta não é do Gym Academy. Crie o administrador em Acesso da equipe com um e-mail da academia.'
    );
  END IF;

  INSERT INTO staff_profiles (id, full_name, role)
  VALUES (v_user, v_name, 'admin');

  RETURN jsonb_build_object('success', true);
END;
$fn$;

-- Remove fichas do GymX criadas por cadastro de outro produto (Auth compartilhado).
-- Não apaga auth.users.
DELETE FROM gym_academy.member_workout_session_sets
WHERE session_id IN (
  SELECT s.id
  FROM gym_academy.member_workout_sessions s
  JOIN gym_academy.member_profiles p ON p.id = s.member_id
  WHERE p.email ILIKE '%rodolfobellarosa%'
);

DELETE FROM gym_academy.member_workout_sessions
WHERE member_id IN (
  SELECT id FROM gym_academy.member_profiles WHERE email ILIKE '%rodolfobellarosa%'
);

DELETE FROM gym_academy.member_workout_exercises
WHERE program_id IN (
  SELECT pr.id
  FROM gym_academy.member_workout_programs pr
  JOIN gym_academy.member_profiles p ON p.id = pr.member_id
  WHERE p.email ILIKE '%rodolfobellarosa%'
);

DELETE FROM gym_academy.workout_program_edits
WHERE program_id IN (
  SELECT pr.id
  FROM gym_academy.member_workout_programs pr
  JOIN gym_academy.member_profiles p ON p.id = pr.member_id
  WHERE p.email ILIKE '%rodolfobellarosa%'
);

DELETE FROM gym_academy.member_workout_programs
WHERE member_id IN (
  SELECT id FROM gym_academy.member_profiles WHERE email ILIKE '%rodolfobellarosa%'
);

DELETE FROM gym_academy.member_workout_requests
WHERE member_id IN (
  SELECT id FROM gym_academy.member_profiles WHERE email ILIKE '%rodolfobellarosa%'
);

DELETE FROM gym_academy.subscription_payments
WHERE member_id IN (
  SELECT id FROM gym_academy.member_profiles WHERE email ILIKE '%rodolfobellarosa%'
);

DELETE FROM gym_academy.member_subscriptions
WHERE member_id IN (
  SELECT id FROM gym_academy.member_profiles WHERE email ILIKE '%rodolfobellarosa%'
);

DELETE FROM gym_academy.member_class_reservations
WHERE member_id IN (
  SELECT id FROM gym_academy.member_profiles WHERE email ILIKE '%rodolfobellarosa%'
);

DELETE FROM gym_academy.member_class_waitlist
WHERE member_id IN (
  SELECT id FROM gym_academy.member_profiles WHERE email ILIKE '%rodolfobellarosa%'
);

DELETE FROM gym_academy.member_par_q
WHERE member_id IN (
  SELECT id FROM gym_academy.member_profiles WHERE email ILIKE '%rodolfobellarosa%'
);

DELETE FROM gym_academy.member_lgpd_requests
WHERE member_id IN (
  SELECT id FROM gym_academy.member_profiles WHERE email ILIKE '%rodolfobellarosa%'
);

DELETE FROM gym_academy.member_verification_codes
WHERE member_id IN (
  SELECT id FROM gym_academy.member_profiles WHERE email ILIKE '%rodolfobellarosa%'
);

DELETE FROM gym_academy.member_profiles
WHERE email ILIKE '%rodolfobellarosa%';

REVOKE ALL ON FUNCTION gym_academy.is_gymx_signup(jsonb) FROM PUBLIC, anon, authenticated;

NOTIFY pgrst, 'reload schema';
