-- Perfil próprio da equipe (admin de alunos) + revisão profissional do PAR-Q.
-- Conta de aluno continua em member_profiles. Equipe não gera ficha de aluno.

CREATE TABLE IF NOT EXISTS gym_academy.staff_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'admin'
    CHECK (role IN ('admin', 'recepcao', 'professor')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS staff_profiles_set_updated_at ON gym_academy.staff_profiles;
CREATE TRIGGER staff_profiles_set_updated_at
  BEFORE UPDATE ON gym_academy.staff_profiles
  FOR EACH ROW EXECUTE FUNCTION gym_academy.set_updated_at();

ALTER TABLE gym_academy.member_par_q
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES gym_academy.staff_profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS review_notes text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS review_decision text;

ALTER TABLE gym_academy.member_par_q
  DROP CONSTRAINT IF EXISTS member_par_q_review_decision_check;

ALTER TABLE gym_academy.member_par_q
  ADD CONSTRAINT member_par_q_review_decision_check
  CHECK (
    review_decision IS NULL
    OR review_decision IN ('apto', 'apto_com_restricao', 'encaminhar_avaliacao')
  );

CREATE INDEX IF NOT EXISTS member_par_q_member_completed_idx
  ON gym_academy.member_par_q (member_id, completed_at DESC);

CREATE INDEX IF NOT EXISTS member_profiles_par_q_status_idx
  ON gym_academy.member_profiles (par_q_status);

CREATE OR REPLACE FUNCTION gym_academy.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = gym_academy
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM staff_profiles
    WHERE id = auth.uid()
      AND active = true
  );
$$;

CREATE OR REPLACE FUNCTION gym_academy.staff_bootstrap_open()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = gym_academy
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM staff_profiles WHERE active = true
  );
$$;

CREATE OR REPLACE FUNCTION gym_academy.confirm_member_auth_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth
AS $fn$
BEGIN
  IF NEW.email_confirmed_at IS NULL
     AND (
       nullif(NEW.raw_user_meta_data->>'cpf', '') IS NOT NULL
       OR NEW.raw_user_meta_data->>'account_type' = 'staff'
     ) THEN
    UPDATE auth.users
    SET email_confirmed_at = now()
    WHERE id = NEW.id
      AND email_confirmed_at IS NULL;
  END IF;
  RETURN NEW;
END;
$fn$;

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

CREATE OR REPLACE FUNCTION gym_academy.review_member_par_q(
  p_member_id uuid,
  p_decision text,
  p_notes text DEFAULT ''
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = gym_academy
AS $fn$
DECLARE
  v_staff uuid := auth.uid();
  v_parq gym_academy.member_par_q%ROWTYPE;
BEGIN
  IF v_staff IS NULL OR NOT gym_academy.is_staff() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Acesso restrito à equipe.');
  END IF;

  IF p_decision NOT IN ('apto', 'apto_com_restricao', 'encaminhar_avaliacao') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Decisão inválida.');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM member_profiles WHERE id = p_member_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Aluno não encontrado.');
  END IF;

  SELECT * INTO v_parq
  FROM member_par_q
  WHERE member_id = p_member_id
  ORDER BY completed_at DESC
  LIMIT 1
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'PAR-Q não encontrado.');
  END IF;

  UPDATE member_par_q
  SET
    status = p_decision,
    reviewed_at = now(),
    reviewed_by = v_staff,
    review_notes = coalesce(trim(p_notes), ''),
    review_decision = p_decision
  WHERE id = v_parq.id;

  UPDATE member_profiles
  SET
    par_q_status = p_decision,
    updated_at = now()
  WHERE id = p_member_id;

  RETURN jsonb_build_object('success', true, 'status', p_decision);
END;
$fn$;

ALTER TABLE gym_academy.staff_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS staff_profiles_select_own ON gym_academy.staff_profiles;
CREATE POLICY staff_profiles_select_own ON gym_academy.staff_profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS staff_profiles_select_team ON gym_academy.staff_profiles;
CREATE POLICY staff_profiles_select_team ON gym_academy.staff_profiles
  FOR SELECT TO authenticated
  USING (gym_academy.is_staff());

DROP POLICY IF EXISTS member_profiles_select_staff ON gym_academy.member_profiles;
CREATE POLICY member_profiles_select_staff ON gym_academy.member_profiles
  FOR SELECT TO authenticated
  USING (gym_academy.is_staff());

DROP POLICY IF EXISTS member_par_q_select_staff ON gym_academy.member_par_q;
CREATE POLICY member_par_q_select_staff ON gym_academy.member_par_q
  FOR SELECT TO authenticated
  USING (gym_academy.is_staff());

DROP POLICY IF EXISTS member_subscriptions_select_staff ON gym_academy.member_subscriptions;
CREATE POLICY member_subscriptions_select_staff ON gym_academy.member_subscriptions
  FOR SELECT TO authenticated
  USING (gym_academy.is_staff());

GRANT SELECT ON gym_academy.staff_profiles TO authenticated;

REVOKE ALL ON FUNCTION gym_academy.is_staff() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION gym_academy.review_member_par_q(uuid, text, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION gym_academy.staff_bootstrap_open() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION gym_academy.is_staff() TO authenticated;
GRANT EXECUTE ON FUNCTION gym_academy.review_member_par_q(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION gym_academy.staff_bootstrap_open() TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
