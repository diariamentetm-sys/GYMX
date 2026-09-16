CREATE OR REPLACE FUNCTION public.gymx_handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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

  INSERT INTO public.member_profiles (
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
    INSERT INTO public.member_verification_codes (member_id, code, expires_at)
    VALUES (NEW.id, v_code, now() + interval '24 hours');
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_gymx ON auth.users;
CREATE TRIGGER on_auth_user_created_gymx
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.gymx_handle_new_user();

CREATE OR REPLACE FUNCTION public.check_registration_available(p_email text, p_cpf text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN jsonb_build_object(
    'email_available', NOT EXISTS (
      SELECT 1 FROM public.member_profiles
      WHERE lower(email) = lower(trim(p_email))
    ),
    'cpf_available', (
      nullif(trim(p_cpf), '') IS NULL
      OR NOT EXISTS (
        SELECT 1 FROM public.member_profiles
        WHERE cpf = regexp_replace(p_cpf, '\D', '', 'g')
      )
    )
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_dev_verification_code(p_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code text;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT verification_code INTO v_code
  FROM public.member_profiles
  WHERE lower(email) = lower(trim(p_email))
    AND id = auth.uid();

  RETURN v_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.book_class_session(p_session_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_session public.gym_class_sessions%ROWTYPE;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Não autenticado.');
  END IF;

  SELECT * INTO v_session
  FROM public.gym_class_sessions
  WHERE id = p_session_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Aula não encontrada.');
  END IF;

  IF v_session.status <> 'scheduled' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Aula indisponível.');
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.member_class_reservations
    WHERE member_id = v_user AND session_id = p_session_id AND status = 'confirmed'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Você já reservou esta aula.');
  END IF;

  IF v_session.booked_count >= v_session.capacity THEN
    RETURN jsonb_build_object('success', false, 'waitlist', true, 'error', 'Aula lotada.');
  END IF;

  INSERT INTO public.member_class_reservations (member_id, session_id, status)
  VALUES (v_user, p_session_id, 'confirmed');

  UPDATE public.gym_class_sessions
  SET booked_count = booked_count + 1
  WHERE id = p_session_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.cancel_class_reservation(p_reservation_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_res public.member_class_reservations%ROWTYPE;
  v_session public.gym_class_sessions%ROWTYPE;
  v_settings public.gym_class_settings%ROWTYPE;
  v_status text;
  v_waitlist public.member_class_waitlist%ROWTYPE;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Não autenticado.');
  END IF;

  SELECT * INTO v_res FROM public.member_class_reservations
  WHERE id = p_reservation_id AND member_id = v_user;

  IF NOT FOUND OR v_res.status <> 'confirmed' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Reserva não encontrada.');
  END IF;

  SELECT * INTO v_session FROM public.gym_class_sessions WHERE id = v_res.session_id FOR UPDATE;
  SELECT * INTO v_settings FROM public.gym_class_settings WHERE id = 'main';

  v_status := CASE
    WHEN v_session.starts_at - now() < make_interval(hours => coalesce(v_settings.cancel_limit_hours, 8))
      THEN 'late_cancel'
    ELSE 'cancelled'
  END;

  UPDATE public.member_class_reservations
  SET status = v_status, cancelled_at = now()
  WHERE id = p_reservation_id;

  UPDATE public.gym_class_sessions
  SET booked_count = greatest(booked_count - 1, 0)
  WHERE id = v_res.session_id;

  SELECT * INTO v_waitlist
  FROM public.member_class_waitlist
  WHERE session_id = v_res.session_id AND status = 'waiting'
  ORDER BY joined_at
  LIMIT 1;

  IF FOUND THEN
    UPDATE public.member_class_waitlist SET status = 'promoted' WHERE id = v_waitlist.id;
    INSERT INTO public.member_class_reservations (member_id, session_id, status)
    VALUES (v_waitlist.member_id, v_res.session_id, 'confirmed');
    UPDATE public.gym_class_sessions
    SET booked_count = booked_count + 1
    WHERE id = v_res.session_id;
  END IF;

  RETURN jsonb_build_object('success', true, 'status', v_status);
END;
$$;

CREATE OR REPLACE FUNCTION public.join_class_waitlist(p_session_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Não autenticado.');
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.member_class_waitlist
    WHERE member_id = v_user AND session_id = p_session_id AND status = 'waiting'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Você já está na lista.');
  END IF;

  INSERT INTO public.member_class_waitlist (member_id, session_id, status)
  VALUES (v_user, p_session_id, 'waiting');

  RETURN jsonb_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.leave_class_waitlist(p_session_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Não autenticado.');
  END IF;

  UPDATE public.member_class_waitlist
  SET status = 'left'
  WHERE member_id = auth.uid() AND session_id = p_session_id AND status = 'waiting';

  RETURN jsonb_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.checkin_class_reservation(p_reservation_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_res public.member_class_reservations%ROWTYPE;
  v_session public.gym_class_sessions%ROWTYPE;
  v_settings public.gym_class_settings%ROWTYPE;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Não autenticado.');
  END IF;

  SELECT * INTO v_res FROM public.member_class_reservations
  WHERE id = p_reservation_id AND member_id = v_user;

  IF NOT FOUND OR v_res.status <> 'confirmed' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Reserva não encontrada.');
  END IF;

  SELECT * INTO v_session FROM public.gym_class_sessions WHERE id = v_res.session_id;
  SELECT * INTO v_settings FROM public.gym_class_settings WHERE id = 'main';

  IF now() < v_session.starts_at - make_interval(mins => coalesce(v_settings.checkin_before_minutes, 30))
     OR now() > v_session.starts_at + make_interval(mins => coalesce(v_settings.checkin_after_minutes, 15)) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Fora da janela de check-in.');
  END IF;

  UPDATE public.member_class_reservations
  SET status = 'attended', checked_in_at = now()
  WHERE id = p_reservation_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_registration_available(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_dev_verification_code(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.book_class_session(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_class_reservation(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.join_class_waitlist(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.leave_class_waitlist(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.checkin_class_reservation(uuid) TO authenticated;
