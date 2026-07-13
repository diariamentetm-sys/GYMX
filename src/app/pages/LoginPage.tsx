import { motion } from "motion/react";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import { FormInput } from "../components/FormInput";
import { ArrowLeft, Shield } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({ email: "", password: "" });

    // Basic validation
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

    // Simulate login and redirect to dashboard
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md"
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16 h-20 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="/"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-display text-3xl font-black tracking-tight text-white hover:text-yellow-400 transition-colors"
          >
            GYMX
          </motion.a>

          {/* Back Button - Desktop */}
          <motion.a
            href="/"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden md:flex items-center gap-2 text-neutral-300 hover:text-yellow-400 transition-colors font-medium text-sm uppercase tracking-wider"
          >
            <ArrowLeft size={16} />
            Voltar para o site
          </motion.a>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Icon Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
            className="w-16 h-16 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl flex items-center justify-center mx-auto mb-8"
          >
            <Shield className="text-yellow-400" size={32} strokeWidth={1.5} />
          </motion.div>

          {/* Heading */}
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

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Email Input */}
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

            {/* Password Input */}
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

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <a
                href="/recuperar-senha"
                className="text-sm text-neutral-400 hover:text-yellow-400 transition-colors font-medium"
              >
                Esqueci minha senha
              </a>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full bg-yellow-400 text-yellow-900 py-4 rounded-md
                font-bold uppercase text-sm tracking-wider
                transition-all duration-300
                hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-400/20
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              `}
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

          {/* Divider */}
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

          {/* Sign Up Link */}
          <motion.a
            href="/#planos"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="block w-full text-center py-4 border-2 border-neutral-700 text-white rounded-md font-bold uppercase text-sm tracking-wider hover:border-yellow-400 hover:text-yellow-400 transition-all"
          >
            Conhecer os Planos
          </motion.a>

          {/* Back to Home - Mobile */}
          <motion.a
            href="/"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="md:hidden flex items-center justify-center gap-2 text-neutral-500 hover:text-yellow-400 transition-colors text-sm mt-8"
          >
            <ArrowLeft size={14} />
            Voltar para o site
          </motion.a>

          {/* Footer Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-neutral-600 text-xs mt-8 uppercase tracking-wider"
          >
            Acesso seguro e protegido
          </motion.p>
        </motion.div>
      </div>

      {/* Gradient Overlay */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-yellow-400/5 to-transparent pointer-events-none" />
    </div>
  );
}
