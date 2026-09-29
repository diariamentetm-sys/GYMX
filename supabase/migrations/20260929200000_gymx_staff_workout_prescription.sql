-- Equipe prescreve treino por aluno. O portal lê a mesma ficha.
-- Rollback: DROP POLICY/FUNCTION abaixo; DROP bucket exercise-videos.

INSERT INTO storage.buckets (id, name, public)
VALUES ('exercise-videos', 'exercise-videos', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS gymx_exercise_videos_staff_read ON storage.objects;
CREATE POLICY gymx_exercise_videos_staff_read ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'exercise-videos'
    AND gym_academy.is_staff()
  );

DROP POLICY IF EXISTS gymx_exercise_videos_member_read ON storage.objects;
CREATE POLICY gymx_exercise_videos_member_read ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'exercise-videos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS gymx_exercise_videos_staff_write ON storage.objects;
CREATE POLICY gymx_exercise_videos_staff_write ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'exercise-videos'
    AND gym_academy.is_staff()
  );

DROP POLICY IF EXISTS gymx_exercise_videos_staff_update ON storage.objects;
CREATE POLICY gymx_exercise_videos_staff_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'exercise-videos'
    AND gym_academy.is_staff()
  );

DROP POLICY IF EXISTS gymx_exercise_videos_staff_delete ON storage.objects;
CREATE POLICY gymx_exercise_videos_staff_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'exercise-videos'
    AND gym_academy.is_staff()
  );

DROP POLICY IF EXISTS member_workout_programs_staff ON gym_academy.member_workout_programs;
CREATE POLICY member_workout_programs_staff ON gym_academy.member_workout_programs
  FOR ALL TO authenticated
  USING (gym_academy.is_staff())
  WITH CHECK (gym_academy.is_staff());

DROP POLICY IF EXISTS member_workout_exercises_staff ON gym_academy.member_workout_exercises;
CREATE POLICY member_workout_exercises_staff ON gym_academy.member_workout_exercises
  FOR ALL TO authenticated
  USING (gym_academy.is_staff())
  WITH CHECK (gym_academy.is_staff());

GRANT SELECT, INSERT, UPDATE, DELETE ON gym_academy.member_workout_programs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON gym_academy.member_workout_exercises TO authenticated;

CREATE OR REPLACE FUNCTION gym_academy.staff_ensure_member_program(
  p_member_id uuid,
  p_label text,
  p_division text DEFAULT '',
  p_modality text DEFAULT 'musculacao',
  p_objective text DEFAULT ''
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = gym_academy
AS $fn$
DECLARE
  v_trainer uuid;
  v_program gym_academy.member_workout_programs%ROWTYPE;
  v_label text := nullif(trim(p_label), '');
  v_modality text := coalesce(nullif(trim(p_modality), ''), 'musculacao');
BEGIN
  IF auth.uid() IS NULL OR NOT gym_academy.is_staff() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Acesso restrito à equipe.');
  END IF;

  IF v_label IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Informe o nome da ficha.');
  END IF;

  IF v_modality NOT IN ('musculacao', 'funcional', 'cardio', 'mobilidade') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Modalidade inválida.');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM member_profiles WHERE id = p_member_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Aluno não encontrado.');
  END IF;

  SELECT id INTO v_trainer FROM gym_trainers ORDER BY created_at LIMIT 1;
  IF v_trainer IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cadastre um professor na academia antes de prescrever.');
  END IF;

  SELECT * INTO v_program
  FROM member_workout_programs
  WHERE member_id = p_member_id AND status = 'ativo'
  ORDER BY created_at DESC
  LIMIT 1
  FOR UPDATE;

  IF FOUND THEN
    UPDATE member_workout_programs
    SET
      label = v_label,
      division = coalesce(nullif(trim(p_division), ''), division),
      modality = v_modality,
      objective = coalesce(nullif(trim(p_objective), ''), objective),
      updated_at = now()
    WHERE id = v_program.id
    RETURNING * INTO v_program;
  ELSE
    INSERT INTO member_workout_programs (
      member_id, trainer_id, original_author_id, approved_by,
      modality, objective, label, division, prescription_type,
      status, valid_from, valid_until, cycle_weeks, approved_at
    ) VALUES (
      p_member_id, v_trainer, v_trainer, v_trainer,
      v_modality,
      coalesce(nullif(trim(p_objective), ''), 'Prescrição da equipe'),
      v_label,
      coalesce(nullif(trim(p_division), ''), 'Full body'),
      'manual',
      'ativo',
      CURRENT_DATE,
      CURRENT_DATE + 56,
      8,
      now()
    )
    RETURNING * INTO v_program;
  END IF;

  RETURN jsonb_build_object('success', true, 'program_id', v_program.id);
END;
$fn$;

CREATE OR REPLACE FUNCTION gym_academy.staff_save_exercise(
  p_program_id uuid,
  p_name text,
  p_exercise_id uuid DEFAULT NULL,
  p_sets integer DEFAULT 3,
  p_reps text DEFAULT '10',
  p_load_kg numeric DEFAULT NULL,
  p_rest_seconds integer DEFAULT 60,
  p_notes text DEFAULT NULL,
  p_video_url text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = gym_academy
AS $fn$
DECLARE
  v_name text := nullif(trim(p_name), '');
  v_sets integer := greatest(coalesce(p_sets, 3), 1);
  v_reps text := coalesce(nullif(trim(p_reps), ''), '10');
  v_rest integer := greatest(coalesce(p_rest_seconds, 60), 0);
  v_sort integer;
  v_id uuid;
BEGIN
  IF auth.uid() IS NULL OR NOT gym_academy.is_staff() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Acesso restrito à equipe.');
  END IF;

  IF v_name IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Informe o nome do exercício.');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM member_workout_programs WHERE id = p_program_id
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Ficha de treino não encontrada.');
  END IF;

  IF p_exercise_id IS NOT NULL THEN
    UPDATE member_workout_exercises
    SET
      name = v_name,
      sets = v_sets,
      reps = v_reps,
      load_kg = p_load_kg,
      rest_seconds = v_rest,
      notes = nullif(trim(p_notes), ''),
      video_url = nullif(trim(p_video_url), '')
    WHERE id = p_exercise_id AND program_id = p_program_id
    RETURNING id INTO v_id;

    IF v_id IS NULL THEN
      RETURN jsonb_build_object('success', false, 'error', 'Exercício não encontrado nesta ficha.');
    END IF;
  ELSE
    SELECT coalesce(max(sort_order), 0) + 1
    INTO v_sort
    FROM member_workout_exercises
    WHERE program_id = p_program_id;

    INSERT INTO member_workout_exercises (
      program_id, sort_order, name, sets, reps, load_kg, rest_seconds, notes, video_url
    ) VALUES (
      p_program_id, v_sort, v_name, v_sets, v_reps, p_load_kg, v_rest,
      nullif(trim(p_notes), ''),
      nullif(trim(p_video_url), '')
    )
    RETURNING id INTO v_id;
  END IF;

  UPDATE member_workout_programs SET updated_at = now() WHERE id = p_program_id;

  RETURN jsonb_build_object('success', true, 'exercise_id', v_id);
END;
$fn$;

CREATE OR REPLACE FUNCTION gym_academy.staff_delete_exercise(p_exercise_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = gym_academy
AS $fn$
DECLARE
  v_program uuid;
BEGIN
  IF auth.uid() IS NULL OR NOT gym_academy.is_staff() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Acesso restrito à equipe.');
  END IF;

  DELETE FROM member_workout_exercises
  WHERE id = p_exercise_id
  RETURNING program_id INTO v_program;

  IF v_program IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Exercício não encontrado.');
  END IF;

  UPDATE member_workout_programs SET updated_at = now() WHERE id = v_program;

  RETURN jsonb_build_object('success', true);
END;
$fn$;

REVOKE ALL ON FUNCTION gym_academy.staff_ensure_member_program(uuid, text, text, text, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION gym_academy.staff_save_exercise(uuid, text, uuid, integer, text, numeric, integer, text, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION gym_academy.staff_delete_exercise(uuid) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION gym_academy.staff_ensure_member_program(uuid, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION gym_academy.staff_save_exercise(uuid, text, uuid, integer, text, numeric, integer, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION gym_academy.staff_delete_exercise(uuid) TO authenticated;

NOTIFY pgrst, 'reload schema';
