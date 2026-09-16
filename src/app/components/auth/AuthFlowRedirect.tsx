import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { getPostLoginRedirect } from "../../services/memberService";

const AUTH_HANDOFF_PATHS = new Set(["/"]);

function hasAuthCallback(search: string, hash: string) {
  const params = new URLSearchParams(search);
  const hashParams = new URLSearchParams(hash.replace(/^#/, ""));
  return (
    params.has("code") ||
    params.has("token_hash") ||
    params.has("type") ||
    hashParams.has("access_token") ||
    hashParams.has("refresh_token")
  );
}

export function AuthFlowRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, profile, loading } = useAuth();

  useEffect(() => {
    if (loading || !session || !profile) return;
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
    location.pathname,
    location.search,
    location.hash,
    navigate,
  ]);

  return null;
}
