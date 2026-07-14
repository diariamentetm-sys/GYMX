import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AlertTriangle, CheckCircle2, FileUp, HeartPulse } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { completeOnboarding } from "../../services/memberService";
import { uploadMemberDocument } from "../../services/storageService";
import {
  TermsConsentForm,
  canProceedWithTerms,
} from "../../components/member/TermsConsentForm";
import {
  ParQForm,
  emptyParQAnswers,
  isParQComplete,
  toParQAnswers,
} from "../../components/member/ParQForm";
import type { ParQFormState } from "../../components/member/ParQForm";

export function OnboardingPage() {
  const navigate = useNavigate();
  const { session, profile, loading, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [healthConsent, setHealthConsent] = useState(false);
  const [biometricConsent, setBiometricConsent] = useState(false);
  const [parQAnswers, setParQAnswers] = useState<ParQFormState>(emptyParQAnswers());
  const [documentStoragePath, setDocumentStoragePath] = useState<string | null>(null);
  const [documentFileName, setDocumentFileName] = useState("");
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!session || !profile) {
      navigate("/login", { replace: true });
      return;
    }

    if (!profile.emailVerified) {
      navigate("/cadastro/verificacao", { replace: true });
      return;
    }

    if (profile.onboardingCompleted && profile.status === "ativo") {
      navigate("/portal", { replace: true });
    }
  }, [loading, navigate, profile, session]);

  if (loading || !profile || !session) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session) return;

    setError("");
    setIsUploadingDocument(true);

    const result = await uploadMemberDocument(session.user.id, file);

    setIsUploadingDocument(false);

    if (result.error || !result.path) {
      setError(result.error ?? "Falha ao enviar documento.");
      return;
    }

    setDocumentStoragePath(result.path);
    setDocumentFileName(file.name);
  };

  const handleFinish = async () => {
    setError("");

    if (!canProceedWithTerms(termsAccepted, privacyAccepted, healthConsent)) {
      setError("Aceite todos os termos obrigatórios antes de concluir.");
      return;
    }

    if (!isParQComplete(parQAnswers)) {
      setError("Responda todas as perguntas do PAR-Q.");
      return;
    }

    setIsLoading(true);

    const result = await completeOnboarding(session.user.id, {
      termsAccepted: termsAccepted && privacyAccepted,
      healthConsent,
      biometricConsent,
      parQ: toParQAnswers(parQAnswers),
      documentStoragePath: documentStoragePath ?? undefined,
    });

    setIsLoading(false);

    if (!result.success) {
      setError(result.error ?? "Erro ao concluir onboarding.");
      return;
    }

    await refreshProfile();
    navigate("/portal");
  };

  const hasParQRisk = Object.values(toParQAnswers(parQAnswers)).some((v) => v);

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-4xl font-black uppercase text-white mb-3">
            Onboarding <span className="text-yellow-400">GYMX</span>
          </h1>
          <p className="text-neutral-400 text-sm">
            Dados persistidos no Supabase com RLS ativo.
          </p>

          <div className="flex justify-center gap-2 mt-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-16 rounded-full ${
                  step >= s ? "bg-yellow-400" : "bg-neutral-700"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <TermsConsentForm
              termsAccepted={termsAccepted}
              privacyAccepted={privacyAccepted}
              healthConsent={healthConsent}
              biometricConsent={biometricConsent}
              onTermsChange={setTermsAccepted}
              onPrivacyChange={setPrivacyAccepted}
              onHealthChange={setHealthConsent}
              onBiometricChange={setBiometricConsent}
            />

            <button
              type="button"
              disabled={!canProceedWithTerms(termsAccepted, privacyAccepted, healthConsent)}
              onClick={() => setStep(2)}
              className="w-full bg-yellow-400 text-yellow-900 py-4 rounded-md font-bold uppercase text-sm tracking-wider hover:bg-yellow-300 transition-colors disabled:opacity-50"
            >
              Continuar para PAR-Q
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <HeartPulse className="text-yellow-400" size={22} />
              <h2 className="text-white font-bold uppercase text-sm tracking-wide">
                Questionário PAR-Q (tabela segregada member_par_q)
              </h2>
            </div>

            <ParQForm answers={parQAnswers} onChange={setParQAnswers} />

            {isParQComplete(parQAnswers) && hasParQRisk && (
              <div className="flex items-start gap-3 bg-orange-500/10 border border-orange-500/30 rounded-md p-4">
                <AlertTriangle className="text-orange-400 shrink-0 mt-0.5" size={18} />
                <p className="text-orange-300 text-sm">
                  Liberação automática de treino bloqueada. Check-in e aulas permanecem
                  disponíveis.
                </p>
              </div>
            )}

            {isParQComplete(parQAnswers) && !hasParQRisk && (
              <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/30 rounded-md p-4">
                <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={18} />
                <p className="text-green-300 text-sm">
                  PAR-Q sem indicadores de risco. Treino padrão poderá ser liberado.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border border-neutral-700 text-neutral-300 py-4 rounded-md font-bold uppercase text-sm tracking-wider hover:border-neutral-600"
              >
                Voltar
              </button>
              <button
                type="button"
                disabled={!isParQComplete(parQAnswers)}
                onClick={() => setStep(3)}
                className="flex-1 bg-yellow-400 text-yellow-900 py-4 rounded-md font-bold uppercase text-sm tracking-wider hover:bg-yellow-300 transition-colors disabled:opacity-50"
              >
                Continuar
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <FileUp className="text-yellow-400" size={22} />
              <h2 className="text-white font-bold uppercase text-sm tracking-wide">
                Documento de identidade (opcional)
              </h2>
            </div>

            <label className={`block border-2 border-dashed rounded-md p-8 text-center transition-colors ${
              isUploadingDocument
                ? "border-yellow-400/50 cursor-wait"
                : "border-neutral-700 cursor-pointer hover:border-yellow-400/50"
            }`}>
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                disabled={isUploadingDocument}
                onChange={handleDocumentUpload}
              />
              <FileUp className="text-neutral-500 mx-auto mb-3" size={32} />
              <p className="text-neutral-300 text-sm">
                {isUploadingDocument
                  ? "Enviando para Supabase Storage..."
                  : documentStoragePath
                    ? `Documento enviado: ${documentFileName}`
                    : "Clique para enviar RG ou CNH (JPG, PNG, WEBP ou PDF — máx. 10MB)"}
              </p>
              {documentStoragePath && (
                <p className="text-green-400 text-xs mt-2">
                  Armazenado de forma privada · aguardando validação da recepção
                </p>
              )}
            </label>

            {error && <p className="text-orange-500 text-sm">{error}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 border border-neutral-700 text-neutral-300 py-4 rounded-md font-bold uppercase text-sm tracking-wider hover:border-neutral-600"
              >
                Voltar
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleFinish}
                className="flex-1 bg-yellow-400 text-yellow-900 py-4 rounded-md font-bold uppercase text-sm tracking-wider hover:bg-yellow-300 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Salvando no Supabase..." : "Concluir onboarding"}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
