import { motion } from "motion/react";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Mail, RefreshCw, ShieldCheck } from "lucide-react";
import { FormInput } from "../components/FormInput";
import { useAuth } from "../contexts/AuthContext";
import {
  getDevVerificationCode,
  resendVerificationCode,
  verifyMemberCode,
} from "../services/memberService";

export function VerifyAccountPage() {
  const navigate = useNavigate();
  const { session, profile, loading, refreshProfile } = useAuth();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [devCode, setDevCode] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!session || !profile) {
      navigate("/cadastro", { replace: true });
      return;
    }

    if (profile.emailVerified && profile.status !== "pendente_verificacao") {
      navigate("/portal/onboarding", { replace: true });
      return;
    }

    const loadCode = async () => {
      const fetched = await getDevVerificationCode(profile.email);
      if (fetched) setDevCode(fetched);
      else if (profile.verificationCode) setDevCode(profile.verificationCode);
    };

    loadCode();
  }, [loading, navigate, profile, session]);

  if (loading || !profile || !session) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await verifyMemberCode(session.user.id, code);

    setIsLoading(false);

    if (!result.success) {
      setError(result.error ?? "Erro na verificação.");
      return;
    }

    await refreshProfile();
    navigate("/portal/onboarding");
  };

  const handleResend = async () => {
    setResendMessage("");
    setError("");
    setIsResending(true);

    const result = await resendVerificationCode(session.user.id);
    setIsResending(false);

    if (!result.success) {
      setError(result.error ?? "Não foi possível reenviar.");
      return;
    }

    setDevCode(result.code ?? "");
    setResendMessage(
      "Novo código registrado no Supabase. Válido por 15 minutos."
    );
    await refreshProfile();
  };

  const minutesLeft = profile.verificationCodeExpiresAt
    ? Math.max(
        0,
        Math.ceil((profile.verificationCodeExpiresAt - Date.now()) / 60000)
      )
    : 0;

  const displayCode = devCode || profile.verificationCode;

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="w-16 h-16 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <ShieldCheck className="text-yellow-400" size={32} />
        </div>

        <h1 className="font-display text-4xl font-black uppercase text-white text-center mb-3">
          Verificar <span className="text-yellow-400">conta</span>
        </h1>
        <p className="text-neutral-400 text-sm text-center mb-8">
          Código de verificação para{" "}
          <strong className="text-white">{profile.email}</strong>. Confirme em até
          15 minutos.
        </p>

        {displayCode && (
          <div className="bg-neutral-900 border border-neutral-700 rounded-md p-4 mb-6 text-sm">
            <div className="flex items-center gap-2 text-neutral-400 mb-2">
              <Mail size={16} />
              <span>Código (Supabase — ambiente dev)</span>
            </div>
            <p className="text-yellow-400 font-mono text-lg tracking-widest">
              {displayCode}
            </p>
            {minutesLeft > 0 && (
              <p className="text-neutral-500 text-xs mt-2">
                Expira em ~{minutesLeft} min
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            label="Código de verificação"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            error={error}
            placeholder="000000"
            maxLength={6}
          />

          {resendMessage && (
            <p className="text-green-400 text-sm">{resendMessage}</p>
          )}

          <button
            type="submit"
            disabled={isLoading || code.length < 6}
            className="w-full bg-yellow-400 text-yellow-900 py-4 rounded-md font-bold uppercase text-sm tracking-wider hover:bg-yellow-300 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Verificando..." : "Confirmar código"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="w-full mt-4 flex items-center justify-center gap-2 text-neutral-400 hover:text-yellow-400 text-sm py-3 transition-colors"
        >
          <RefreshCw size={16} className={isResending ? "animate-spin" : ""} />
          Reenviar código ({profile.verificationResendCount}/{5} hoje)
        </button>
      </motion.div>
    </div>
  );
}
