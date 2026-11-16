-- Religa o GymX ao Auth compartilhado de Projetos sem substituir o trigger do Brechó.
-- Cadastro só cria ficha gym_academy quando metadata é GYMX (app=gymx, staff ou CPF).

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
       OR coalesce(NEW.raw_user_meta_data->>'app', '') = 'gymx'
     ) THEN
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

DROP TRIGGER IF EXISTS on_auth_user_created_gymx ON auth.users;
CREATE TRIGGER on_auth_user_created_gymx
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION gym_academy.handle_new_user();

REVOKE ALL ON FUNCTION gym_academy.confirm_member_auth_email() FROM PUBLIC, anon, authenticated;
