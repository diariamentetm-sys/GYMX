-- Operadores da plataforma GYMX (controle interno).
-- Não confundir com staff_profiles: staff = personal trainer; operator = time GYMX.

CREATE TABLE IF NOT EXISTS gym_academy.platform_operators (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS platform_operators_active_idx
  ON gym_academy.platform_operators (active)
  WHERE active = true;

ALTER TABLE gym_academy.platform_operators ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE gym_academy.platform_operators FROM PUBLIC, anon;
GRANT SELECT ON TABLE gym_academy.platform_operators TO authenticated;

DROP POLICY IF EXISTS platform_operators_select_self ON gym_academy.platform_operators;
CREATE POLICY platform_operators_select_self
  ON gym_academy.platform_operators
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND active = true);

CREATE OR REPLACE FUNCTION gym_academy.is_platform_operator()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = gym_academy
AS $$
  SELECT EXISTS (
    SELECT 1 FROM platform_operators
    WHERE user_id = auth.uid() AND active = true
  );
$$;

REVOKE ALL ON FUNCTION gym_academy.is_platform_operator() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION gym_academy.is_platform_operator() TO authenticated;

INSERT INTO gym_academy.platform_operators (user_id, full_name)
SELECT p.staff_id, coalesce(nullif(sp.full_name, ''), 'Operação GYMX')
FROM gym_academy.personal_public_profiles p
JOIN gym_academy.staff_profiles sp ON sp.id = p.staff_id
WHERE p.slug = 'equipe-gymx'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO gym_academy.platform_operators (user_id, full_name)
SELECT sp.id, sp.full_name
FROM gym_academy.staff_profiles sp
WHERE sp.active = true
  AND NOT EXISTS (SELECT 1 FROM gym_academy.platform_operators)
ORDER BY sp.created_at ASC
LIMIT 1
ON CONFLICT (user_id) DO NOTHING;
