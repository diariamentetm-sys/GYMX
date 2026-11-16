-- Vitrine pública do personal + contrato do aluno amarrado ao profissional.
-- Anon lê só personal_public_profiles listados. staff_profiles continua privado.

INSERT INTO gym_academy.gym_plans (
  id, name, slug, badge, description, monthly_price, loyalty_months,
  penalty_percent, freeze_days_per_cycle, checkins_per_month, schedule_label,
  benefits, sort_order, active
)
VALUES (
  'personal-service',
  'Acompanhamento com personal',
  'acompanhamento-personal',
  'Marketplace',
  'Mensalidade do serviço contratado com um personal na plataforma.',
  0,
  0,
  0,
  0,
  NULL,
  'Combinado com o personal',
  ARRAY['Ficha de treino', 'Videoaulas do personal', 'Portal do aluno'],
  0,
  true
)
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  active = true;

CREATE TABLE IF NOT EXISTS gym_academy.personal_public_profiles (
  staff_id uuid PRIMARY KEY REFERENCES gym_academy.staff_profiles (id) ON DELETE CASCADE,
  slug text NOT NULL,
  headline text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  photo_url text,
  cref text NOT NULL DEFAULT '',
  specialties text[] NOT NULL DEFAULT '{}',
  student_monthly_price numeric(10, 2) NOT NULL DEFAULT 297
    CHECK (student_monthly_price > 0),
  listed boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT personal_public_profiles_slug_format
    CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' AND char_length(slug) BETWEEN 3 AND 60)
);

CREATE UNIQUE INDEX IF NOT EXISTS personal_public_profiles_slug_uidx
  ON gym_academy.personal_public_profiles (slug);

CREATE INDEX IF NOT EXISTS personal_public_profiles_listed_idx
  ON gym_academy.personal_public_profiles (listed)
  WHERE listed = true;

DROP TRIGGER IF EXISTS personal_public_profiles_set_updated_at
  ON gym_academy.personal_public_profiles;
CREATE TRIGGER personal_public_profiles_set_updated_at
  BEFORE UPDATE ON gym_academy.personal_public_profiles
  FOR EACH ROW EXECUTE FUNCTION gym_academy.set_updated_at();

CREATE OR REPLACE FUNCTION gym_academy.slugify_personal_name(p_text text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT COALESCE(
    NULLIF(
      trim(both '-' FROM regexp_replace(lower(coalesce(p_text, '')), '[^a-z0-9]+', '-', 'g')),
      ''
    ),
    'personal'
  );
$$;

CREATE OR REPLACE FUNCTION gym_academy.ensure_personal_public_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = gym_academy
AS $fn$
DECLARE
  v_base text;
  v_slug text;
  v_i integer := 0;
BEGIN
  v_base := gym_academy.slugify_personal_name(NEW.full_name);
  v_slug := v_base;

  WHILE EXISTS (
    SELECT 1 FROM personal_public_profiles WHERE slug = v_slug AND staff_id <> NEW.id
  ) LOOP
    v_i := v_i + 1;
    v_slug := v_base || '-' || v_i::text;
  END LOOP;

  INSERT INTO personal_public_profiles (
    staff_id, slug, headline, bio, student_monthly_price, listed
  ) VALUES (
    NEW.id,
    v_slug,
    'Personal trainer no Personal GYMX',
    'Treino acompanhado, ficha com a minha videoaula e mensalidade cobrada pela plataforma.',
    297,
    true
  )
  ON CONFLICT (staff_id) DO NOTHING;

  RETURN NEW;
END;
$fn$;

DROP TRIGGER IF EXISTS staff_profiles_ensure_public_profile ON gym_academy.staff_profiles;
CREATE TRIGGER staff_profiles_ensure_public_profile
  AFTER INSERT ON gym_academy.staff_profiles
  FOR EACH ROW EXECUTE FUNCTION gym_academy.ensure_personal_public_profile();

INSERT INTO gym_academy.personal_public_profiles (
  staff_id, slug, headline, bio, cref, specialties, student_monthly_price, listed
)
SELECT
  sp.id,
  gym_academy.slugify_personal_name(sp.full_name),
  'Equipe Personal GYMX',
  'Acompanhamento profissional com ficha de treino e videoaula do movimento. Contrate pela plataforma — a mensalidade é cobrada todo mês.',
  '',
  ARRAY['hipertrofia', 'emagrecimento', 'atendimento híbrido'],
  297,
  true
FROM gym_academy.staff_profiles sp
WHERE sp.active = true
ON CONFLICT (staff_id) DO NOTHING;

ALTER TABLE gym_academy.member_subscriptions
  ADD COLUMN IF NOT EXISTS personal_id uuid REFERENCES gym_academy.staff_profiles (id) ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS member_subscriptions_personal_idx
  ON gym_academy.member_subscriptions (personal_id, status);

CREATE UNIQUE INDEX IF NOT EXISTS member_subscriptions_one_open_per_member
  ON gym_academy.member_subscriptions (member_id)
  WHERE status IN (
    'pendente_pagamento',
    'ativo',
    'congelado',
    'cancelamento_agendado',
    'inadimplente'
  );

CREATE OR REPLACE FUNCTION gym_academy.link_demo_subscription_to_staff()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = gym_academy
AS $fn$
BEGIN
  IF NEW.personal_id IS NULL
     AND EXISTS (
       SELECT 1 FROM gym_academy.staff_profiles WHERE id = NEW.member_id
     ) THEN
    NEW.personal_id := NEW.member_id;
  END IF;
  RETURN NEW;
END;
$fn$;

DROP TRIGGER IF EXISTS member_subscriptions_link_demo ON gym_academy.member_subscriptions;
CREATE TRIGGER member_subscriptions_link_demo
  BEFORE INSERT OR UPDATE OF personal_id, member_id
  ON gym_academy.member_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION gym_academy.link_demo_subscription_to_staff();

UPDATE gym_academy.member_subscriptions ms
SET personal_id = sp.id
FROM gym_academy.staff_profiles sp
WHERE ms.personal_id IS NULL
  AND sp.id = ms.member_id;

UPDATE gym_academy.member_subscriptions
SET plan_id = 'personal-service'
WHERE personal_id IS NOT NULL
  AND plan_id IS DISTINCT FROM 'personal-service';

ALTER TABLE gym_academy.personal_public_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS personal_public_profiles_select_listed ON gym_academy.personal_public_profiles;
CREATE POLICY personal_public_profiles_select_listed ON gym_academy.personal_public_profiles
  FOR SELECT TO anon, authenticated
  USING (listed = true);

DROP POLICY IF EXISTS personal_public_profiles_select_own ON gym_academy.personal_public_profiles;
CREATE POLICY personal_public_profiles_select_own ON gym_academy.personal_public_profiles
  FOR SELECT TO authenticated
  USING (staff_id = auth.uid() AND gym_academy.is_staff());

DROP POLICY IF EXISTS personal_public_profiles_update_own ON gym_academy.personal_public_profiles;
CREATE POLICY personal_public_profiles_update_own ON gym_academy.personal_public_profiles
  FOR UPDATE TO authenticated
  USING (staff_id = auth.uid() AND gym_academy.is_staff())
  WITH CHECK (staff_id = auth.uid() AND gym_academy.is_staff());

GRANT SELECT ON gym_academy.personal_public_profiles TO anon, authenticated;
GRANT UPDATE ON gym_academy.personal_public_profiles TO authenticated;

DROP POLICY IF EXISTS member_subscriptions_select_staff ON gym_academy.member_subscriptions;
CREATE POLICY member_subscriptions_select_staff ON gym_academy.member_subscriptions
  FOR SELECT TO authenticated
  USING (gym_academy.is_staff() AND personal_id = auth.uid());

DROP POLICY IF EXISTS member_profiles_select_staff ON gym_academy.member_profiles;
CREATE POLICY member_profiles_select_staff ON gym_academy.member_profiles
  FOR SELECT TO authenticated
  USING (
    gym_academy.is_staff()
    AND EXISTS (
      SELECT 1
      FROM gym_academy.member_subscriptions s
      WHERE s.member_id = member_profiles.id
        AND s.personal_id = auth.uid()
        AND s.status IS DISTINCT FROM 'cancelado'
    )
  );

DROP POLICY IF EXISTS member_par_q_select_staff ON gym_academy.member_par_q;
CREATE POLICY member_par_q_select_staff ON gym_academy.member_par_q
  FOR SELECT TO authenticated
  USING (
    gym_academy.is_staff()
    AND EXISTS (
      SELECT 1
      FROM gym_academy.member_subscriptions s
      WHERE s.member_id = member_par_q.member_id
        AND s.personal_id = auth.uid()
        AND s.status IS DISTINCT FROM 'cancelado'
    )
  );

CREATE OR REPLACE FUNCTION gym_academy.contract_personal_service(p_staff_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = gym_academy
AS $fn$
DECLARE
  v_user uuid := auth.uid();
  v_price numeric(10, 2);
  v_sub_id uuid;
  v_expires timestamptz := now() + interval '24 hours';
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Entre na sua conta de aluno para contratar.');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM member_profiles WHERE id = v_user) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Crie uma conta de aluno para contratar um personal.');
  END IF;

  IF gym_academy.is_staff() AND NOT EXISTS (
    SELECT 1 FROM member_profiles WHERE id = v_user AND is_demo = true
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Contas de personal não contratam acompanhamento.');
  END IF;

  SELECT p.student_monthly_price
  INTO v_price
  FROM personal_public_profiles p
  JOIN staff_profiles s ON s.id = p.staff_id
  WHERE p.staff_id = p_staff_id
    AND p.listed = true
    AND s.active = true;

  IF v_price IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Este personal não está disponível para contratação.');
  END IF;

  IF EXISTS (
    SELECT 1
    FROM member_subscriptions
    WHERE member_id = v_user
      AND status IN (
        'pendente_pagamento',
        'ativo',
        'congelado',
        'cancelamento_agendado',
        'inadimplente'
      )
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Você já possui um acompanhamento vigente. Cancele o atual antes de trocar de personal.'
    );
  END IF;

  INSERT INTO member_subscriptions (
    member_id,
    plan_id,
    personal_id,
    status,
    monthly_price,
    pending_payment_expires_at,
    auto_renew
  ) VALUES (
    v_user,
    'personal-service',
    p_staff_id,
    'pendente_pagamento',
    v_price,
    v_expires,
    true
  )
  RETURNING id INTO v_sub_id;

  INSERT INTO subscription_payments (
    subscription_id, member_id, amount, payment_type, status
  ) VALUES (
    v_sub_id, v_user, v_price, 'contratacao', 'pendente'
  );

  RETURN jsonb_build_object('success', true, 'subscription_id', v_sub_id);
END;
$fn$;

REVOKE ALL ON FUNCTION gym_academy.contract_personal_service(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION gym_academy.contract_personal_service(uuid) TO authenticated;

NOTIFY pgrst, 'reload schema';
