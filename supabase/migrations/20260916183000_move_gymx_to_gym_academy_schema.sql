-- Isolate GymX like brecho_limeira / rodolfo_bellarosa.
-- Rollback: move tables back to public, drop schema gym_academy, restore pgrst.db_schemas without gym_academy.

CREATE SCHEMA IF NOT EXISTS gym_academy;

GRANT USAGE ON SCHEMA gym_academy TO postgres, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA gym_academy TO supabase_auth_admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA gym_academy GRANT ALL ON TABLES TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA gym_academy GRANT ALL ON SEQUENCES TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA gym_academy GRANT ALL ON FUNCTIONS TO postgres, service_role;

ALTER TABLE IF EXISTS public.member_workout_session_sets SET SCHEMA gym_academy;
ALTER TABLE IF EXISTS public.member_workout_sessions SET SCHEMA gym_academy;
ALTER TABLE IF EXISTS public.member_workout_requests SET SCHEMA gym_academy;
ALTER TABLE IF EXISTS public.workout_program_edits SET SCHEMA gym_academy;
ALTER TABLE IF EXISTS public.member_workout_exercises SET SCHEMA gym_academy;
ALTER TABLE IF EXISTS public.member_workout_programs SET SCHEMA gym_academy;
ALTER TABLE IF EXISTS public.member_class_waitlist SET SCHEMA gym_academy;
ALTER TABLE IF EXISTS public.member_class_reservations SET SCHEMA gym_academy;
ALTER TABLE IF EXISTS public.gym_class_sessions SET SCHEMA gym_academy;
ALTER TABLE IF EXISTS public.gym_class_settings SET SCHEMA gym_academy;
ALTER TABLE IF EXISTS public.subscription_payments SET SCHEMA gym_academy;
ALTER TABLE IF EXISTS public.member_subscriptions SET SCHEMA gym_academy;
ALTER TABLE IF EXISTS public.gym_plans SET SCHEMA gym_academy;
ALTER TABLE IF EXISTS public.member_verification_codes SET SCHEMA gym_academy;
ALTER TABLE IF EXISTS public.member_lgpd_requests SET SCHEMA gym_academy;
ALTER TABLE IF EXISTS public.member_par_q SET SCHEMA gym_academy;
ALTER TABLE IF EXISTS public.member_profiles SET SCHEMA gym_academy;
ALTER TABLE IF EXISTS public.gym_trainers SET SCHEMA gym_academy;

DROP TRIGGER IF EXISTS on_auth_user_created_gymx ON auth.users;
DROP FUNCTION IF EXISTS public.gymx_handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.gymx_set_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.book_class_session(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.cancel_class_reservation(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.join_class_waitlist(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.leave_class_waitlist(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.checkin_class_reservation(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.check_registration_available(text, text) CASCADE;
DROP FUNCTION IF EXISTS public.get_dev_verification_code(text) CASCADE;

CREATE OR REPLACE FUNCTION gym_academy.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = gym_academy
AS $fn$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$fn$;

DROP TRIGGER IF EXISTS member_profiles_updated_at ON gym_academy.member_profiles;
CREATE TRIGGER member_profiles_updated_at
  BEFORE UPDATE ON gym_academy.member_profiles
  FOR EACH ROW EXECUTE FUNCTION gym_academy.set_updated_at();

DROP TRIGGER IF EXISTS gym_plans_updated_at ON gym_academy.gym_plans;
CREATE TRIGGER gym_plans_updated_at
  BEFORE UPDATE ON gym_academy.gym_plans
  FOR EACH ROW EXECUTE FUNCTION gym_academy.set_updated_at();

DROP TRIGGER IF EXISTS member_subscriptions_updated_at ON gym_academy.member_subscriptions;
CREATE TRIGGER member_subscriptions_updated_at
  BEFORE UPDATE ON gym_academy.member_subscriptions
  FOR EACH ROW EXECUTE FUNCTION gym_academy.set_updated_at();

DROP TRIGGER IF EXISTS gym_trainers_updated_at ON gym_academy.gym_trainers;
CREATE TRIGGER gym_trainers_updated_at
  BEFORE UPDATE ON gym_academy.gym_trainers
  FOR EACH ROW EXECUTE FUNCTION gym_academy.set_updated_at();

DROP TRIGGER IF EXISTS member_workout_programs_updated_at ON gym_academy.member_workout_programs;
CREATE TRIGGER member_workout_programs_updated_at
  BEFORE UPDATE ON gym_academy.member_workout_programs
  FOR EACH ROW EXECUTE FUNCTION gym_academy.set_updated_at();

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
  v_verified := NEW.email_confirmed_at IS NOT NULL;
  v_status := CASE WHEN v_verified THEN 'onboarding_pendente' ELSE 'pendente_verificacao' END;
  v_name := coalesce(
    nullif(NEW.raw_user_meta_data->>'full_name', ''),
    nullif(NEW.raw_user_meta_data->>'name', ''),
    split_part(NEW.email, '@', 1)
  );
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

CREATE TRIGGER on_auth_user_created_gym_academy
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION gym_academy.handle_new_user();

CREATE OR REPLACE FUNCTION gym_academy.check_registration_available(p_email text, p_cpf text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = gym_academy
AS $fn$
BEGIN
  RETURN jsonb_build_object(
    'email_available', NOT EXISTS (
      SELECT 1 FROM member_profiles WHERE lower(email) = lower(trim(p_email))
    ),
    'cpf_available', (
      nullif(trim(p_cpf), '') IS NULL
      OR NOT EXISTS (
        SELECT 1 FROM member_profiles WHERE cpf = regexp_replace(p_cpf, '\D', '', 'g')
      )
    )
  );
END;
$fn$;

CREATE OR REPLACE FUNCTION gym_academy.get_dev_verification_code(p_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = gym_academy
AS $fn$
DECLARE
  v_code text;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT verification_code INTO v_code
  FROM member_profiles
  WHERE lower(email) = lower(trim(p_email))
    AND id = auth.uid();

  RETURN v_code;
END;
$fn$;

CREATE OR REPLACE FUNCTION gym_academy.book_class_session(p_session_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = gym_academy
AS $fn$
DECLARE
  v_user uuid := auth.uid();
  v_session gym_class_sessions%ROWTYPE;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Não autenticado.');
  END IF;

  SELECT * INTO v_session FROM gym_class_sessions WHERE id = p_session_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Aula não encontrada.');
  END IF;
  IF v_session.status <> 'scheduled' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Aula indisponível.');
  END IF;
  IF EXISTS (
    SELECT 1 FROM member_class_reservations
    WHERE member_id = v_user AND session_id = p_session_id AND status = 'confirmed'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Você já reservou esta aula.');
  END IF;
  IF v_session.booked_count >= v_session.capacity THEN
    RETURN jsonb_build_object('success', false, 'waitlist', true, 'error', 'Aula lotada.');
  END IF;

  INSERT INTO member_class_reservations (member_id, session_id, status)
  VALUES (v_user, p_session_id, 'confirmed');
  UPDATE gym_class_sessions SET booked_count = booked_count + 1 WHERE id = p_session_id;
  RETURN jsonb_build_object('success', true);
END;
$fn$;

CREATE OR REPLACE FUNCTION gym_academy.cancel_class_reservation(p_reservation_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = gym_academy
AS $fn$
DECLARE
  v_user uuid := auth.uid();
  v_res member_class_reservations%ROWTYPE;
  v_session gym_class_sessions%ROWTYPE;
  v_settings gym_class_settings%ROWTYPE;
  v_status text;
  v_waitlist member_class_waitlist%ROWTYPE;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Não autenticado.');
  END IF;

  SELECT * INTO v_res FROM member_class_reservations
  WHERE id = p_reservation_id AND member_id = v_user;
  IF NOT FOUND OR v_res.status <> 'confirmed' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Reserva não encontrada.');
  END IF;

  SELECT * INTO v_session FROM gym_class_sessions WHERE id = v_res.session_id FOR UPDATE;
  SELECT * INTO v_settings FROM gym_class_settings WHERE id = 'main';
  v_status := CASE
    WHEN v_session.starts_at - now() < make_interval(hours => coalesce(v_settings.cancel_limit_hours, 8))
      THEN 'late_cancel'
    ELSE 'cancelled'
  END;

  UPDATE member_class_reservations SET status = v_status, cancelled_at = now() WHERE id = p_reservation_id;
  UPDATE gym_class_sessions SET booked_count = greatest(booked_count - 1, 0) WHERE id = v_res.session_id;

  SELECT * INTO v_waitlist
  FROM member_class_waitlist
  WHERE session_id = v_res.session_id AND status = 'waiting'
  ORDER BY joined_at
  LIMIT 1;

  IF FOUND THEN
    UPDATE member_class_waitlist SET status = 'promoted' WHERE id = v_waitlist.id;
    INSERT INTO member_class_reservations (member_id, session_id, status)
    VALUES (v_waitlist.member_id, v_res.session_id, 'confirmed');
    UPDATE gym_class_sessions SET booked_count = booked_count + 1 WHERE id = v_res.session_id;
  END IF;

  RETURN jsonb_build_object('success', true, 'status', v_status);
END;
$fn$;

CREATE OR REPLACE FUNCTION gym_academy.join_class_waitlist(p_session_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = gym_academy
AS $fn$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Não autenticado.');
  END IF;
  IF EXISTS (
    SELECT 1 FROM member_class_waitlist
    WHERE member_id = auth.uid() AND session_id = p_session_id AND status = 'waiting'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Você já está na lista.');
  END IF;
  INSERT INTO member_class_waitlist (member_id, session_id, status)
  VALUES (auth.uid(), p_session_id, 'waiting');
  RETURN jsonb_build_object('success', true);
END;
$fn$;

CREATE OR REPLACE FUNCTION gym_academy.leave_class_waitlist(p_session_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = gym_academy
AS $fn$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Não autenticado.');
  END IF;
  UPDATE member_class_waitlist
  SET status = 'left'
  WHERE member_id = auth.uid() AND session_id = p_session_id AND status = 'waiting';
  RETURN jsonb_build_object('success', true);
END;
$fn$;

CREATE OR REPLACE FUNCTION gym_academy.checkin_class_reservation(p_reservation_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = gym_academy
AS $fn$
DECLARE
  v_user uuid := auth.uid();
  v_res member_class_reservations%ROWTYPE;
  v_session gym_class_sessions%ROWTYPE;
  v_settings gym_class_settings%ROWTYPE;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Não autenticado.');
  END IF;

  SELECT * INTO v_res FROM member_class_reservations
  WHERE id = p_reservation_id AND member_id = v_user;
  IF NOT FOUND OR v_res.status <> 'confirmed' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Reserva não encontrada.');
  END IF;

  SELECT * INTO v_session FROM gym_class_sessions WHERE id = v_res.session_id;
  SELECT * INTO v_settings FROM gym_class_settings WHERE id = 'main';

  IF now() < v_session.starts_at - make_interval(mins => coalesce(v_settings.checkin_before_minutes, 30))
     OR now() > v_session.starts_at + make_interval(mins => coalesce(v_settings.checkin_after_minutes, 15)) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Fora da janela de check-in.');
  END IF;

  UPDATE member_class_reservations
  SET status = 'attended', checked_in_at = now()
  WHERE id = p_reservation_id;

  RETURN jsonb_build_object('success', true);
END;
$fn$;

REVOKE ALL ON FUNCTION gym_academy.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION gym_academy.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION gym_academy.book_class_session(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION gym_academy.cancel_class_reservation(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION gym_academy.join_class_waitlist(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION gym_academy.leave_class_waitlist(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION gym_academy.checkin_class_reservation(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION gym_academy.get_dev_verification_code(text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION gym_academy.check_registration_available(text, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION gym_academy.check_registration_available(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION gym_academy.get_dev_verification_code(text) TO authenticated;
GRANT EXECUTE ON FUNCTION gym_academy.book_class_session(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION gym_academy.cancel_class_reservation(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION gym_academy.join_class_waitlist(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION gym_academy.leave_class_waitlist(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION gym_academy.checkin_class_reservation(uuid) TO authenticated;

ALTER ROLE authenticator SET pgrst.db_schemas = 'public, graphql_public, storage, brecho_limeira, gym_academy';
NOTIFY pgrst, 'reload config';
NOTIFY pgrst, 'reload schema';
