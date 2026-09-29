-- Biblioteca de videoaulas do personal (URL própria). Copiada para a ficha do aluno.
-- Rollback: DROP TABLE gym_academy.staff_exercise_library;

CREATE TABLE IF NOT EXISTS gym_academy.staff_exercise_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid NOT NULL REFERENCES gym_academy.staff_profiles (id) ON DELETE CASCADE,
  name text NOT NULL,
  video_url text NOT NULL CHECK (video_url ~* '^https?://'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (staff_id, name)
);

CREATE INDEX IF NOT EXISTS staff_exercise_library_staff_idx
  ON gym_academy.staff_exercise_library (staff_id, name);

DROP TRIGGER IF EXISTS staff_exercise_library_updated_at ON gym_academy.staff_exercise_library;
CREATE TRIGGER staff_exercise_library_updated_at
  BEFORE UPDATE ON gym_academy.staff_exercise_library
  FOR EACH ROW EXECUTE FUNCTION gym_academy.set_updated_at();

ALTER TABLE gym_academy.staff_exercise_library ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS staff_exercise_library_own ON gym_academy.staff_exercise_library;
CREATE POLICY staff_exercise_library_own ON gym_academy.staff_exercise_library
  FOR ALL TO authenticated
  USING (staff_id = auth.uid() AND gym_academy.is_staff())
  WITH CHECK (staff_id = auth.uid() AND gym_academy.is_staff());

GRANT SELECT, INSERT, UPDATE, DELETE ON gym_academy.staff_exercise_library TO authenticated;

NOTIFY pgrst, 'reload schema';
