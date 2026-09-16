-- GymX verifica o aluno com código de 6 dígitos. O "Confirm email" do Auth
-- bloqueia signInWithPassword e o login parece senha errada.
-- Auto-confirma só cadastro com CPF no metadata (não mexe em outros apps).

CREATE OR REPLACE FUNCTION gym_academy.confirm_member_auth_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth
AS $fn$
BEGIN
  IF NEW.email_confirmed_at IS NULL
     AND nullif(NEW.raw_user_meta_data->>'cpf', '') IS NOT NULL THEN
    UPDATE auth.users
    SET email_confirmed_at = now()
    WHERE id = NEW.id
      AND email_confirmed_at IS NULL;
  END IF;
  RETURN NEW;
END;
$fn$;

DROP TRIGGER IF EXISTS gym_academy_confirm_member_auth_email ON auth.users;
CREATE TRIGGER gym_academy_confirm_member_auth_email
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION gym_academy.confirm_member_auth_email();

REVOKE ALL ON FUNCTION gym_academy.confirm_member_auth_email() FROM PUBLIC, anon, authenticated;

UPDATE auth.users AS u
SET email_confirmed_at = now()
WHERE u.email_confirmed_at IS NULL
  AND EXISTS (
    SELECT 1 FROM gym_academy.member_profiles AS p WHERE p.id = u.id
  );
