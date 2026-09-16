import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Shield } from "lucide-react";
import { FormInput } from "../components/FormInput";
import { useAuth } from "../contexts/AuthContext";
import { isStaffBootstrapOpen } from "../services/staffService";
import { scrollToPageTop } from "../utils/scroll";

export function StaffAccessPage() {
  const navigate = useNavigate();
  const { session, profile, staffProfile, loading, signIn, signUpStaff, signOut } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [bootstrapOpen, setBootstrapOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && staffProfile) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, staffProfile, navigate]);

  useEffect(() => {
    let active = true;
    isStaffBootstrapOpen().then((open) => {
      if (!active) return;
      setBootstrapOpen(open);
      if (open) setMode("register");
    });
    return () => {
      active = false;
    };
  }, []);

  const handleGoHome = () => {
    navigate("/");
    requestAnimationFrame(() => scrollToPageTop());
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Informe um e-mail válido.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (mode === "register" && fullName.trim().length < 3) {
      setError("Informe o nome completo do administrador.");
      return;
    }

    setSubmitting(true);
    const result =
      mode === "register"
        ? await signUpStaff({ fullName, email, password })
        : await signIn(email, password);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if ("staff" in result && result.staff) {
      navigate("/dashboard", { replace: true });
      return;
    }

    if ("profile" in result && result.profile) {
      setError("Esta conta é de aluno. Use outro e-mail para o perfil da equipe.");
      await signOut();
      return;
    }

    setError("Não foi possível acessar o painel da equipe.");
  };

  if (!loading && session && profile && !staffProfile) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-md p-8 text-center">
          <Shield className="mx-auto text-yellow-400 mb-4" size={36} />
          <h1 className="font-display text-3xl font-black uppercase text-white mb-3">
            Conta de aluno
          </h1>
          <p className="text-neutral-400 text-sm mb-6">
            O perfil de administrador é separado da ficha do aluno. Saia desta conta e
            crie o acesso da equipe com outro e-mail.
          </p>
          <button
            type="button"
            onClick={() => signOut()}
            className="w-full py-3 bg-yellow-400 text-yellow-900 rounded-md font-bold uppercase text-sm tracking-wider hover:bg-yellow-300"
          >
            Sair e criar perfil da equipe
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <header className="border-b border-neutral-800">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16 h-20 flex items-center justify-between">
          <button
            type="button"
            onClick={handleGoHome}
            className="font-display text-3xl font-black tracking-tight text-white hover:text-yellow-400 transition-colors"
          >
            GYMX
          </button>
          <Link
            to="/login"
            className="text-neutral-400 text-sm uppercase tracking-wider hover:text-yellow-400"
          >
            Área do aluno
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-yellow-400 rounded-md flex items-center justify-center">
              <Shield className="text-yellow-900" size={24} />
            </div>
            <div>
              <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wider">
                Administração de alunos
              </p>
              <h1 className="font-display text-3xl font-black uppercase text-white">
                Acesso da equipe
              </h1>
            </div>
          </div>

          <p className="text-neutral-400 text-sm mb-8">
            {bootstrapOpen
              ? "Crie o primeiro perfil de administrador. Use um e-mail diferente da conta de aluno."
              : "Entre com o perfil da equipe para revisar PAR-Q e gerenciar alunos."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <FormInput
                label="Nome completo"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                autoComplete="name"
              />
            )}
            <FormInput
              label="E-mail da equipe"
              type="email"
              icon="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
            <FormInput
              label="Senha"
              type="password"
              icon="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === "register" ? "new-password" : "current-password"}
            />

            {error ? <p className="text-orange-500 text-sm">{error}</p> : null}

            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 rounded-md font-bold uppercase text-sm tracking-wider disabled:opacity-60"
            >
              {submitting
                ? "Aguarde..."
                : mode === "register"
                  ? "Criar administrador"
                  : "Entrar no painel"}
            </button>
          </form>

          {bootstrapOpen && (
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
              className="w-full mt-4 text-neutral-500 text-sm hover:text-yellow-400"
            >
              {mode === "register" ? "Já tenho perfil da equipe" : "Criar o primeiro administrador"}
            </button>
          )}

          <button
            type="button"
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 w-full mt-8 text-neutral-500 hover:text-yellow-400 text-sm"
          >
            <ArrowLeft size={14} />
            Voltar para o site
          </button>
        </motion.div>
      </div>
    </div>
  );
}
