import { motion } from "motion/react";
import { FormEvent, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, KeyRound, Mail } from "lucide-react";
import { FormInput } from "../components/FormInput";
import { requestPasswordReset } from "../services/memberService";
import { scrollToPageTop } from "../utils/scroll";

export function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setError("E-mail é obrigatório");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(trimmed)) {
      setError("E-mail inválido");
      return;
    }

    setIsLoading(true);
    const result = await requestPasswordReset(trimmed);
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSent(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <header className="border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16 h-20 flex items-center justify-between">
          <Link
            to="/"
            onClick={() => requestAnimationFrame(() => scrollToPageTop())}
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
            Recuperar <span className="text-yellow-400">senha</span>
          </h1>
          <p className="text-neutral-400 text-sm text-center mb-10">
            Informe o e-mail da conta. Se estiver cadastrado, enviamos um link para
            criar uma nova senha.
          </p>

          {sent ? (
            <div className="bg-neutral-900 border border-yellow-400/30 rounded-md p-6 text-center space-y-4">
              <Mail className="text-yellow-400 mx-auto" size={28} />
              <p className="text-white text-sm leading-relaxed">
                Se <strong>{email.trim().toLowerCase()}</strong> tiver conta na GYMX,
                o e-mail já saiu. Abra o link em até 1 hora.
              </p>
              <p className="text-neutral-500 text-xs">
                Não chegou? Confira spam e lixo eletrônico.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full bg-yellow-400 text-yellow-900 py-4 rounded-md font-bold uppercase text-sm tracking-wider hover:bg-yellow-300 transition-colors"
              >
                Voltar ao login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                icon="email"
                autoComplete="email"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-400 text-yellow-900 py-4 rounded-md font-bold uppercase text-sm tracking-wider hover:bg-yellow-300 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Enviando..." : "Enviar link"}
              </button>
            </form>
          )}

          <Link
            to="/login"
            className="mt-8 flex md:hidden items-center justify-center gap-2 text-neutral-500 hover:text-yellow-400 text-sm"
          >
            <ArrowLeft size={14} />
            Voltar ao login
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
