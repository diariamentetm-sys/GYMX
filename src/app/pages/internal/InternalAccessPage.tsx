import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Shield } from "lucide-react";
import { FormInput } from "../../components/FormInput";
import { BrandMark } from "../../components/BrandMark";
import { useAuth } from "../../contexts/AuthContext";
import { canAccessInternalArea, INTERNAL_PATH } from "../../constants/internal";
import { scrollToPageTop } from "../../utils/scroll";

export function InternalAccessPage() {
  const navigate = useNavigate();
  const { session, operatorProfile, staffProfile, profile, loading, signIn, signOut } =
    useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const allowed = canAccessInternalArea({
    operator: operatorProfile,
    staff: staffProfile,
  });

  useEffect(() => {
    if (loading) return;
    if (allowed) {
      navigate(INTERNAL_PATH, { replace: true });
    }
  }, [loading, allowed, navigate]);

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

    setSubmitting(true);
    const result = await signIn(email, password);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (canAccessInternalArea({ operator: result.operator, staff: result.staff })) {
      navigate(INTERNAL_PATH, { replace: true });
      return;
    }

    setError("Esta conta é de aluno. Entre com o e-mail e a senha do personal.");
  };

  const handleGoHome = () => {
    navigate("/");
    requestAnimationFrame(() => scrollToPageTop());
  };

  if (!loading && session && !allowed && profile) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-md p-8 text-center">
          <Shield className="mx-auto text-yellow-400 mb-4" size={36} />
          <h1 className="font-display text-3xl font-black uppercase text-white mb-3">
            Área <span className="text-yellow-400">restrita</span>
          </h1>
          <p className="text-neutral-400 text-sm mb-6">
            O controle interno usa a conta de personal. Esta sessão é de aluno.
          </p>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => navigate("/portal")}
              className="w-full py-3 bg-yellow-400 text-yellow-900 rounded-md font-bold uppercase text-sm tracking-wider hover:bg-yellow-300"
            >
              Ir ao portal do aluno
            </button>
            <button
              type="button"
              onClick={() => signOut()}
              className="w-full py-3 border border-neutral-700 text-neutral-300 rounded-md font-bold uppercase text-sm tracking-wider hover:border-yellow-400 hover:text-yellow-400"
            >
              Sair desta conta
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <header className="border-b border-neutral-800">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16 h-20 flex items-center justify-between">
          <button type="button" onClick={handleGoHome} className="group">
            <BrandMark className="text-2xl md:text-3xl" />
          </button>
          <Link
            to="/acesso-equipe"
            className="text-neutral-400 text-sm uppercase tracking-wider hover:text-yellow-400"
          >
            Painel do personal
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
                Controle interno
              </p>
              <h1 className="font-display text-3xl font-black uppercase text-white">
                Operação <span className="text-yellow-400">GYMX</span>
              </h1>
            </div>
          </div>
          <p className="text-neutral-400 text-sm mb-8">
            Entre com o e-mail e a senha da sua conta de personal. Ainda não existe
            um login administrativo separado.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="E-mail do personal"
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
              autoComplete="current-password"
            />
            {error ? <p className="text-orange-500 text-sm">{error}</p> : null}
            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 rounded-md font-bold uppercase text-sm tracking-wider disabled:opacity-60"
            >
              {submitting ? "Aguarde..." : "Entrar na operação"}
            </button>
          </form>
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
