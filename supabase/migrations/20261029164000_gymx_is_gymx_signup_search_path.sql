CREATE OR REPLACE FUNCTION gym_academy.is_gymx_signup(p_meta jsonb)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = gym_academy
AS $$
  SELECT
    coalesce(p_meta->>'app', '') = 'gymx'
    OR coalesce(p_meta->>'account_type', '') = 'staff'
    OR nullif(p_meta->>'cpf', '') IS NOT NULL;
$$;
