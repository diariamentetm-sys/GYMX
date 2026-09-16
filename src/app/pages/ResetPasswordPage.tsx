import { motion } from "motion/react";
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, KeyRound } from "lucide-react";
import { FormInput } from "../components/FormInput";
import { useAuth } from "../contexts/AuthContext";
import { updateMemberPassword } from "../services/memberService";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { session, loading, isPasswordRecovery, signOut, clearPasswordRecovery } =
    useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const waitingCallback =
    window.location.hash.includes("access_token") ||
    new URLSearchParams(window.location.search).has("code") ||
    new URLSearchParams(window.location.search).get("type") === "recovery";

  useEffect(() => {
    if (loading) return;
    if (session) return;
    if (waitingCallback) return;
    setError("Link inválido ou expirado. Solicite um novo e-mail de recuperação.");
  }, [loading, session, waitingCallback]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (!session) {
      setError("Link inválido ou expirado. Solicite um novo e-mail de recuperação.");
      return;
    }

    setIsSaving(true);
    const result = await updateMemberPassword(password);
    setIsSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    clearPasswordRecovery();
    await signOut();
    navigate("/login?senha=ok", { replace: true });
  };

  const canSubmit = Boolean(session) && !loading;

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <header className="border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16 h-20 flex items-center justify-between">
          <Link
            to="/"
            className="font-display text-3xl font-black tracking-tight text-white hover:text-yellow-400 transition-colors"
          >
            GYMX
          </Link>
          <Link
            to="/login"
            className="hidden md:flex items-center gap-2 text-neutral-300 hover:text-yellow-400 transition-colors font-medium text-sm uppercase tracking-wider"
          >
            <ArrowLeft size={16} />
            Voltar ao login
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="w-16 h-16 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <KeyRound className="text-yellow-400" size={32} />
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-black uppercase text-white text-center mb-3">
            Nova <span className="text-yellow-400">senha</span>
          </h1>
          <p className="text-neutral-400 text-sm text-center mb-10">
            {isPasswordRecovery || session
              ? "Defina uma senha nova para a sua conta GYMX."
              : "Aguardando validação do link enviado por e-mail."}
          </p>

          {(loading || (!session && waitingCallback)) && !error ? (
            <div className="flex justify-center">
              <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <FormInput
                label="Nova senha"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon="password"
                autoComplete="new-password"
                disabled={!canSubmit}
              />
              <FormInput
                label="Confirmar senha"
                type="password"
                placeholder="Repita a nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={error}
                icon="password"
                autoComplete="new-password"
                disabled={!canSubmit}
              />

              <button
                type="submit"
                disabled={isSaving || !canSubmit}
                className="w-full bg-yellow-400 text-yellow-900 py-4 rounded-md font-bold uppercase text-sm tracking-wider hover:bg-yellow-300 transition-colors disabled:opacity-50"
              >
                {isSaving ? "Salvando..." : "Salvar senha"}
              </button>
            </form>
          )}

          {!canSubmit && error ? (
            <Link
              to="/recuperar-senha"
              className="mt-6 block w-full text-center py-4 border-2 border-neutral-700 text-neutral-300 rounded-md font-bold uppercase text-sm tracking-wider hover:border-yellow-400 hover:text-yellow-400 transition-all"
            >
              Solicitar novo link
            </Link>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}
