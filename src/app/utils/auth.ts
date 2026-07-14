const AUTH_SESSION_KEY = "gymx_admin_session";

export interface AuthSession {
  email: string;
  loggedInAt: number;
}

/** Sessão mock do painel admin (equipe). Área do aluno usa Supabase Auth. */
export function setAuthSession(email: string) {
  const session: AuthSession = {
    email,
    loggedInAt: Date.now(),
  };
  sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function getAuthSession(): AuthSession | null {
  const raw = sessionStorage.getItem(AUTH_SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function isAuthenticated() {
  return getAuthSession() !== null;
}

export function clearAuthSession() {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
}
