export const INTERNAL_PATH = "/interno";
export const INTERNAL_LOGIN_PATH = "/interno/entrar";
export const INTERNAL_IMMERSAO_PATH = "/interno/imersao";
export const INTERNAL_IDEACAO_PATH = "/interno/ideacao";
export const INTERNAL_MELHORIA_PATH = "/interno/melhoria";

export function canAccessInternalArea(account: {
  operator?: { active?: boolean } | null;
  staff?: { active?: boolean } | null;
}) {
  return Boolean(account.operator || account.staff);
}
