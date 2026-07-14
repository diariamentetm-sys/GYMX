import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";
import { isAuthenticated } from "../../utils/auth";

interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  useEffect(() => {
    if (!authenticated) {
      navigate("/login", { replace: true });
    }
  }, [authenticated, navigate]);

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}
