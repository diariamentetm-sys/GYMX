CREATE OR REPLACE FUNCTION gym_academy.slugify_personal_name(p_text text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = gym_academy
AS $$
  SELECT COALESCE(
    NULLIF(
      trim(both '-' FROM regexp_replace(lower(coalesce(p_text, '')), '[^a-z0-9]+', '-', 'g')),
      ''
    ),
    'personal'
  );
$$;
