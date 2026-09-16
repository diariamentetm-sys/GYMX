import { motion } from "motion/react";
import { FormEvent, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, UserPlus } from "lucide-react";
import { FormInput } from "../components/FormInput";
import { GoogleAuthButton, isGoogleAuthEnabled } from "../components/auth/GoogleAuthButton";
import { formatCpf, isMinor, isValidCpf, stripCpf } from "../utils/cpf";
import { checkRegistrationAvailable } from "../services/memberService";
import { useAuth } from "../contexts/AuthContext";

export function RegisterPage() {
  const navigate = useNavigate();
  const { signUp, session, profile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianCpf, setGuardianCpf] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [guardianTerms, setGuardianTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const showGuardian = birthDate ? isMinor(birthDate) : false;

  useEffect(() => {
    if (session && profile?.emailVerified) {
      navigate("/portal/onboarding", { replace: true });
    } else if (session && profile) {
      navigate("/cadastro/verificacao", { replace: true });
    }
  }, [session, profile, navigate]);

  const handleCpfChange = (value: string) => {
    setCpf(formatCpf(value));
  };

  const handleGuardianCpfChange = (value: string) => {
    setGuardianCpf(formatCpf(value));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!fullName.trim()) nextErrors.fullName = "Nome completo é obrigatório";
    if (!cpf.trim()) nextErrors.cpf = "CPF é obrigatório";
    else if (!isValidCpf(cpf)) nextErrors.cpf = "CPF inválido. Verifique os dígitos.";
    if (!birthDate) nextErrors.birthDate = "Data de nascimento é obrigatória";
    if (!email.trim()) nextErrors.email = "E-mail é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(email)) nextErrors.email = "E-mail inválido";
    if (!phone.trim()) nextErrors.phone = "Telefone/WhatsApp é obrigatório";
    if (!password) nextErrors.password = "Senha é obrigatória";
    else if (password.length < 6) nextErrors.password = "Mínimo de 6 caracteres";
    if (password !== confirmPassword) {
      nextErrors.confirmPassword = "As senhas não coincidem";
    }

    if (showGuardian) {
      if (!guardianName.trim()) nextErrors.guardianName = "Nome do responsável é obrigatório";
      if (!guardianCpf.trim()) nextErrors.guardianCpf = "CPF do responsável é obrigatório";
      else if (!isValidCpf(guardianCpf)) {
        nextErrors.guardianCpf = "CPF do responsável inválido";
      }
      if (!guardianEmail.trim()) nextErrors.guardianEmail = "E-mail do responsável é obrigatório";
      else if (!/\S+@\S+\.\S+/.test(guardianEmail)) {
        nextErrors.guardianEmail = "E-mail do responsável inválido";
      }
      if (!guardianTerms) {
        nextErrors.guardianTerms = "Aceite dos termos do responsável é obrigatório";
      }
    }

    const availability = await checkRegistrationAvailable(email, cpf);
    if (!availability.emailAvailable) {
      nextErrors.email =
        "Este e-mail já possui conta ativa. Recupere sua senha ou fale com a recepção.";
    }
    if (!availability.cpfAvailable) {
      nextErrors.cpf =
        "Este CPF já está cadastrado. Recupere sua senha ou fale com a recepção.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsLoading(true);

    const result = await signUp({
      fullName,
      cpf: stripCpf(cpf),
      birthDate,
      email,
      phone,
      password,
      confirmPassword,
      guardian: showGuardian
        ? {
            fullName: guardianName,
            cpf: stripCpf(guardianCpf),
            email: guardianEmail,
            termsAccepted: guardianTerms,
          }
        : undefined,
    });

    setIsLoading(false);

    if (result.error) {
      setErrors({ email: result.error });
      return;
    }

    if (result.sessionCreated) {
      navigate("/cadastro/verificacao");
      return;
    }

    navigate("/login?criado=1");
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <header className="border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16 h-20 flex items-center justify-between">
          <Link
            to="/login"
            className="flex items-center gap-2 text-neutral-300 hover:text-yellow-400 transition-colors text-sm uppercase tracking-wider"
          >
            <ArrowLeft size={16} />
            Voltar ao login
          </Link>
          <span className="font-display text-2xl font-black text-white">GYMX</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <UserPlus className="text-yellow-400" size={32} />
          </div>
          <h1 className="font-display text-4xl font-black uppercase text-white mb-3">
            Criar <span className="text-yellow-400">conta</span>
          </h1>
          <p className="text-neutral-400 text-sm">
            Preencha os dados e clique em continuar. Na próxima tela você confirma um
            código de 6 dígitos — ainda não é o login do Google.
          </p>
        </motion.div>

        {isGoogleAuthEnabled ? (
          <div className="mb-8 space-y-6">
            <GoogleAuthButton disabled={isLoading} />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-neutral-950 text-neutral-500 uppercase tracking-wider text-xs font-semibold">
                  ou cadastre com e-mail
                </span>
              </div>
            </div>
          </div>
        ) : null}

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-5 bg-neutral-900/50 border border-neutral-800 rounded-md p-6"
        >
          <FormInput
            label="Nome completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
            placeholder="Seu nome completo"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormInput
              label="CPF"
              value={cpf}
              onChange={(e) => handleCpfChange(e.target.value)}
              error={errors.cpf}
              placeholder="000.000.000-00"
              maxLength={14}
            />
            <FormInput
              label="Data de nascimento"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              error={errors.birthDate}
            />
          </div>

          <FormInput
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="seu@email.com"
            icon="email"
          />

          <FormInput
            label="Telefone / WhatsApp"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            placeholder="(00) 00000-0000"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormInput
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon="password"
            />
            <FormInput
              label="Confirmar senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              icon="password"
            />
          </div>

          {showGuardian && (
            <div className="border border-orange-500/30 bg-orange-500/5 rounded-md p-5 space-y-4">
              <h3 className="text-orange-400 font-bold uppercase text-sm tracking-wide">
                Responsável legal (menor de 18 anos)
              </h3>
              <FormInput
                label="Nome do responsável"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                error={errors.guardianName}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormInput
                  label="CPF do responsável"
                  value={guardianCpf}
                  onChange={(e) => handleGuardianCpfChange(e.target.value)}
                  error={errors.guardianCpf}
                  maxLength={14}
                />
                <FormInput
                  label="E-mail do responsável"
                  type="email"
                  value={guardianEmail}
                  onChange={(e) => setGuardianEmail(e.target.value)}
                  error={errors.guardianEmail}
                />
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={guardianTerms}
                  onChange={(e) => setGuardianTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-yellow-400"
                />
                <span className="text-neutral-300 text-sm">
                  O responsável legal aceita os Termos de Uso em nome do menor
                </span>
              </label>
              {errors.guardianTerms && (
                <p className="text-orange-500 text-sm">{errors.guardianTerms}</p>
              )}
            </div>
          )}

          {(errors.email?.includes("Recupere") || errors.cpf?.includes("Recupere")) && (
            <div className="bg-neutral-800 border border-neutral-700 rounded-md p-4 text-sm">
              <p className="text-neutral-300 mb-2">Já possui conta?</p>
              <Link to="/login" className="text-yellow-400 hover:underline font-semibold">
                Recuperar senha / Fazer login
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-400 text-yellow-900 py-4 rounded-md font-bold uppercase text-sm tracking-wider hover:bg-yellow-300 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Criando conta..." : "Continuar para verificação"}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
