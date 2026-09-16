import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Shield } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { reacceptTerms } from "../../services/memberService";
import {
  TermsConsentForm,
  canProceedWithTerms,
} from "../../components/member/TermsConsentForm";

export default function TermsReacceptPage() {
  const navigate = useNavigate();
  const { session, profile, loading, refreshProfile } = useAuth();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [healthConsent, setHealthConsent] = useState(false);
  const [biometricConsent, setBiometricConsent] = useState(false);

  useEffect(() => {
    if (!loading && (!session || !profile)) {
      navigate("/login", { replace: true });
    }
  }, [loading, navigate, profile, session]);

  if (loading || !profile || !session) return null;

  const handleSubmit = async () => {
    if (!canProceedWithTerms(termsAccepted, privacyAccepted, healthConsent)) {
      return;
    }

    await reacceptTerms(session.user.id);
    await refreshProfile();
    navigate("/portal");
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        <div className="w-16 h-16 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <Shield className="text-yellow-400" size={32} />
        </div>

        <h1 className="font-display text-3xl font-black uppercase text-white text-center mb-3">
          Termos <span className="text-yellow-400">atualizados</span>
        </h1>
        <p className="text-neutral-400 text-sm text-center mb-8">
          Novo aceite obrigatório antes de acessar a área logada.
        </p>

        <TermsConsentForm
          termsAccepted={termsAccepted}
          privacyAccepted={privacyAccepted}
          healthConsent={healthConsent}
          biometricConsent={biometricConsent}
          onTermsChange={setTermsAccepted}
          onPrivacyChange={setPrivacyAccepted}
          onHealthChange={setHealthConsent}
          onBiometricChange={setBiometricConsent}
          showBiometric={false}
        />

        <button
          type="button"
          disabled={!canProceedWithTerms(termsAccepted, privacyAccepted, healthConsent)}
          onClick={handleSubmit}
          className="w-full mt-6 bg-yellow-400 text-yellow-900 py-4 rounded-md font-bold uppercase text-sm tracking-wider hover:bg-yellow-300 transition-colors disabled:opacity-50"
        >
          Aceitar e continuar
        </button>
      </motion.div>
    </div>
  );
}
