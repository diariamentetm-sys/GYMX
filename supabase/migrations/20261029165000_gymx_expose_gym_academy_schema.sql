-- Expõe gym_academy na API do Projetos sem remover os schemas dos outros produtos.

ALTER ROLE authenticator SET pgrst.db_schemas =
  'public, graphql_public, storage, brecho_limeira, rodolfo_bellarosa, gym_academy';

NOTIFY pgrst, 'reload config';
NOTIFY pgrst, 'reload schema';
