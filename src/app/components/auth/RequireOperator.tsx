import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { canAccessInternalArea, INTERNAL_LOGIN_PATH } from "../../constants/internal";

interface RequireOperatorProps {
  children: ReactNode;
}

export function RequireOperator({ children }: RequireOperatorProps) {
  const navigate = useNavigate();
  const { session, operatorProfile, staffProfile, loading } = useAuth();
  const allowed = canAccessInternalArea({
    operator: operatorProfile,
    staff: staffProfile,
  });

  useEffect(() => {
    if (loading) return;
    if (!session || !allowed) {
      navigate(INTERNAL_LOGIN_PATH, { replace: true });
    }
  }, [loading, session, allowed, navigate]);

  if (loading || !session || !allowed) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
