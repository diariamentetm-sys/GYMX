import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

interface RequireStaffProps {
  children: ReactNode;
}

export function RequireStaff({ children }: RequireStaffProps) {
  const navigate = useNavigate();
  const { session, staffProfile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!session || !staffProfile) {
      navigate("/acesso-equipe", { replace: true });
    }
  }, [loading, session, staffProfile, navigate]);

  if (loading || !session || !staffProfile) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
