import { motion } from "motion/react";
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, LogOut, Shield } from "lucide-react";
import { FormInput } from "../components/FormInput";
import { GoogleAuthButton } from "../components/auth/GoogleAuthButton";
import { getPostLoginRedirect } from "../services/memberService";
import { useAuth } from "../contexts/AuthContext";
import { scrollToPageTop } from "../utils/scroll";

export function LoginPage() {
  const navigate = useNavigate();
  const { session, profile, loading, signIn, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && session && profile) {
      navigate(getPostLoginRedirect(profile), { replace: true });
    }
  }, [loading, session, profile, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("error_description") ?? params.get("error");
    if (!oauthError) return;

    setErrors((current) => ({
      ...current,
      password: decodeURIComponent(oauthError.replace(/\+/g, " ")),
    }));
  }, []);

  const handleGoHome = () => {
    navigate("/");
    requestAnimationFrame(() => scrollToPageTop());
  };

  const handleLogout = async () => {
    await signOut();
    setEmail("");
    setPassword("");
    setErrors({ email: "", password: "" });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({ email: "", password: "" });

    let hasError = false;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email é obrigatório";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email inválido";
      hasError = true;
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória";
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter no mínimo 6 caracteres";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    const result = await signIn(email, password);
    setIsLoading(false);

    if (result.error || !result.profile) {
      setErrors({
        email: "",
        password: result.error ?? "E-mail ou senha incorretos.",
      });
      return;
    }

    navigate(getPostLoginRedirect(result.profile));
  };

  const hasActiveSession = !!session;

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md"
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16 h-20 flex items-center justify-between">
          <motion.button
            type="button"
            onClick={handleGoHome}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-display text-3xl font-black tracking-tight text-white hover:text-yellow-400 transition-colors"
            aria-label="Voltar ao topo da página inicial"
          >
            GYMX
          </motion.button>

          <div className="flex items-center gap-4">
            {hasActiveSession && (
              <motion.button
                type="button"
                onClick={handleLogout}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="hidden md:flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors font-medium text-sm uppercase tracking-wider"
              >
                <LogOut size={16} />
                Sair
              </motion.button>
            )}

            <motion.button
              type="button"
              onClick={handleGoHome}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden md:flex items-center gap-2 text-neutral-300 hover:text-yellow-400 transition-colors font-medium text-sm uppercase tracking-wider"
            >
              <ArrowLeft size={16} />
              Voltar para o site
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
            className="w-16 h-16 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl flex items-center justify-center mx-auto mb-8"
          >
            <Shield className="text-yellow-400" size={32} strokeWidth={1.5} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-5xl md:text-6xl font-black uppercase text-white mb-4 tracking-tight">
              Área do <span className="text-yellow-400">Membro</span>
            </h1>
            <p className="text-neutral-300 text-base leading-relaxed">
              Acesse seu painel de treinos e acompanhamento
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <FormInput
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon="email"
              autoComplete="email"
            />

            <FormInput
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon="password"
              autoComplete="current-password"
            />

            <div className="flex justify-end">
              <a
                href="/recuperar-senha"
                className="text-sm text-neutral-400 hover:text-yellow-400 transition-colors font-medium"
              >
                Esqueci minha senha
              </a>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading || loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-yellow-400 text-yellow-900 py-4 rounded-md font-bold uppercase text-sm tracking-wider transition-all duration-300 hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-400/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-yellow-900 border-t-transparent rounded-full"
                  />
                  Entrando...
                </>
              ) : (
                <>
                  <Shield size={18} strokeWidth={2} />
                  Acessar Área do Membro
                </>
              )}
            </motion.button>
          </motion.form>

          {hasActiveSession && !profile && !loading && (
            <p className="mt-4 text-center text-orange-500 text-sm">
              Conta Google autenticada, mas o perfil do aluno ainda não existe. Conclua o
              cadastro ou fale com a recepção.
            </p>
          )}

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-neutral-950 text-neutral-500 uppercase tracking-wider text-xs font-semibold">
                ou
              </span>
            </div>
          </div>

          <GoogleAuthButton disabled={isLoading || loading} />

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-neutral-950 text-neutral-500 uppercase tracking-wider text-xs font-semibold">
                Ainda não é membro?
              </span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-3"
          >
            <Link
              to="/cadastro"
              className="block w-full text-center py-4 bg-neutral-800 border-2 border-neutral-700 text-white rounded-md font-bold uppercase text-sm tracking-wider hover:border-yellow-400 hover:text-yellow-400 transition-all"
            >
              Criar conta de aluno
            </Link>
            <a
              href="/#planos"
              className="block w-full text-center py-4 border-2 border-neutral-700 text-neutral-400 rounded-md font-bold uppercase text-sm tracking-wider hover:border-yellow-400 hover:text-yellow-400 transition-all"
            >
              Conhecer os Planos
            </a>
          </motion.div>

          <div className="md:hidden flex flex-col items-center gap-4 mt-8">
            {hasActiveSession && (
              <motion.button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 text-orange-500 hover:text-orange-400 transition-colors text-sm"
              >
                <LogOut size={14} />
                Sair da conta
              </motion.button>
            )}

            <motion.button
              type="button"
              onClick={handleGoHome}
              className="flex items-center justify-center gap-2 text-neutral-500 hover:text-yellow-400 transition-colors text-sm"
            >
              <ArrowLeft size={14} />
              Voltar para o site
            </motion.button>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-neutral-600 text-xs mt-8 uppercase tracking-wider"
          >
            Acesso seguro via Supabase Auth
          </motion.p>
        </motion.div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-yellow-400/5 to-transparent pointer-events-none" />
    </div>
  );
}
