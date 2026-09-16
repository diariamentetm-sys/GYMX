import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { getPostLoginRedirect } from "../../services/memberService";

const AUTH_HANDOFF_PATHS = new Set(["/"]);
const PASSWORD_RESET_PATHS = new Set(["/recuperar-senha", "/redefinir-senha"]);

function queryAndHash(search: string, hash: string) {
  return {
    params: new URLSearchParams(search),
    hashParams: new URLSearchParams(hash.replace(/^#/, "")),
  };
}

function hasAuthCallback(search: string, hash: string) {
  const { params, hashParams } = queryAndHash(search, hash);
  return (
    params.has("code") ||
    params.has("token_hash") ||
    params.has("type") ||
    hashParams.has("access_token") ||
    hashParams.has("refresh_token")
  );
}

function isRecoveryCallback(search: string, hash: string) {
  const { params, hashParams } = queryAndHash(search, hash);
  return params.get("type") === "recovery" || hashParams.get("type") === "recovery";
}

export function AuthFlowRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, profile, staffProfile, loading, isPasswordRecovery } = useAuth();

  useEffect(() => {
    if (PASSWORD_RESET_PATHS.has(location.pathname)) return;

    if (isRecoveryCallback(location.search, location.hash) || isPasswordRecovery) {
      navigate(`/redefinir-senha${location.search}${location.hash}`, { replace: true });
      return;
    }

    if (loading || !session) return;

    if (staffProfile) {
      const staffStay =
        location.pathname.startsWith("/dashboard") ||
        location.pathname.startsWith("/modo-recepcao") ||
        location.pathname === "/acesso-equipe";
      if (staffStay) return;

      const shouldHandoffStaff =
        AUTH_HANDOFF_PATHS.has(location.pathname) ||
        location.pathname === "/login" ||
        location.pathname.startsWith("/portal") ||
        location.pathname.startsWith("/cadastro") ||
        hasAuthCallback(location.search, location.hash);

      if (shouldHandoffStaff) {
        navigate("/dashboard", { replace: true });
      }
      return;
    }

    if (!profile) return;
    if (
      location.pathname.startsWith("/dashboard") ||
      location.pathname.startsWith("/modo-recepcao")
    ) {
      return;
    }

    const target = getPostLoginRedirect(profile);
    if (location.pathname === target) return;

    const shouldHandoff =
      AUTH_HANDOFF_PATHS.has(location.pathname) ||
      hasAuthCallback(location.search, location.hash);

    if (shouldHandoff) {
      navigate(target, { replace: true });
    }
  }, [
    loading,
    session,
    profile,
    staffProfile,
    isPasswordRecovery,
    location.pathname,
    location.search,
    location.hash,
    navigate,
  ]);

  return null;
}
