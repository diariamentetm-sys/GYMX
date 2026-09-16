import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { needsTermsReacceptance } from "../../services/memberService";
import { canAccessWorkoutPrescription } from "../../utils/parq";

interface RequireMemberAccessProps {
  children: ReactNode;
  requireActive?: boolean;
  requireParQ?: boolean;
}

export function RequireMemberAccess({
  children,
  requireActive = true,
  requireParQ = false,
}: RequireMemberAccessProps) {
  const navigate = useNavigate();
  const { session, profile, staffProfile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!session) {
      navigate("/login", { replace: true });
      return;
    }

    if (staffProfile) {
      navigate("/dashboard", { replace: true });
      return;
    }

    if (!profile) {
      navigate("/cadastro", { replace: true });
      return;
    }

    if (profile.status === "pendente_verificacao" || !profile.emailVerified) {
      navigate("/cadastro/verificacao", { replace: true });
      return;
    }

    if (needsTermsReacceptance(profile)) {
      navigate("/portal/termos", { replace: true });
      return;
    }

    if (
      requireActive &&
      (!profile.onboardingCompleted || profile.status === "onboarding_pendente")
    ) {
      navigate("/portal/onboarding", { replace: true });
      return;
    }

    if (requireParQ && !canAccessWorkoutPrescription(profile.parQStatus)) {
      navigate("/portal/onboarding", { replace: true });
    }
  }, [loading, session, profile, staffProfile, navigate, requireActive, requireParQ]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || !profile) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
