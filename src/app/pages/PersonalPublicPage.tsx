import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BrandMark } from "../components/BrandMark";
import { fetchPersonalBySlug, contractPersonalService } from "../services/personalDirectoryService";
import { fetchMemberSubscription } from "../services/subscriptionService";
import { useAuth } from "../contexts/AuthContext";
import { rememberPendingPersonalSlug, clearPendingPersonalSlug } from "../utils/pendingPersonal";
import { personalPublicPath } from "../types/personal";
import { formatCurrency } from "../utils/subscriptionCalculations";
import { BRAND_STUDENT_SIGNUP_PATH, BRAND_LOGIN_PATH } from "../constants/brand";
import type { PublicPersonalProfile } from "../types/personal";

function initialsFromName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function PersonalPublicPage() {
  const navigate = useNavigate();
  const { slug = "" } = useParams();
  const { session, profile, staffProfile, loading: authLoading } = useAuth();
  const [personal, setPersonal] = useState<PublicPersonalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [contracting, setContracting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [alreadyContracted, setAlreadyContracted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchPersonalBySlug(slug).then((row) => {
      if (!active) return;
      setPersonal(row);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!session?.user.id || !personal) return;
    fetchMemberSubscription(session.user.id).then((sub) => {
      setAlreadyContracted(sub?.personalId === personal.staffId);
    });
  }, [session?.user.id, personal]);

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${personalPublicPath(slug)}`
      : personalPublicPath(slug);

  const isOwnPage = Boolean(staffProfile && personal && staffProfile.id === personal.staffId);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Não foi possível copiar o link.");
    }
  };

  const handleContract = async (event: FormEvent) => {
    event.preventDefault();
    if (!personal) return;
    rememberPendingPersonalSlug(personal.slug);
    setError("");
    setMessage("");

    if (!session || !profile) {
      navigate(`${BRAND_STUDENT_SIGNUP_PATH}?personal=${encodeURIComponent(personal.slug)}`);
      return;
    }

    setContracting(true);
    const result = await contractPersonalService(personal.staffId);
    setContracting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setMessage("Contrato iniciado. Confirme o pagamento em Meu Plano.");
    setAlreadyContracted(true);
    clearPendingPersonalSlug();
    navigate("/portal/plano");
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!personal) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <Header />
        <main className="pt-32 px-6 text-center">
          <h1 className="font-display text-4xl font-black uppercase text-white mb-4">
            Personal não encontrado
          </h1>
          <p className="text-neutral-400 mb-8">Este link não está disponível na vitrine.</p>
          <Link to="/#personais" className="text-yellow-400 font-semibold uppercase text-sm">
            Ver personais
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <Header />
      <main className="flex-1 pt-28 pb-20 px-6 md:px-8">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/#personais"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-yellow-400 text-sm mb-8"
          >
            <ArrowLeft size={16} />
            Voltar à lista
          </Link>

          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-6 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center overflow-hidden shrink-0">
                {personal.photoUrl ? (
                  <img src={personal.photoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-yellow-400 font-bold text-lg">
                    {initialsFromName(personal.fullName)}
                  </span>
                )}
              </div>
              <div>
                <p className="text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-1">
                  Personal trainer
                </p>
                <h1 className="font-display text-3xl md:text-4xl font-black uppercase text-white">
                  {personal.fullName}
                </h1>
                {personal.cref ? (
                  <p className="text-neutral-500 text-sm mt-1">CREF {personal.cref}</p>
                ) : null}
              </div>
            </div>

            <p className="text-neutral-200 leading-relaxed mb-6">{personal.bio}</p>

            {personal.specialties.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-8">
                {personal.specialties.map((item) => (
                  <span
                    key={item}
                    className="text-[11px] uppercase tracking-wider text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="border-t border-neutral-700 pt-6 mb-6">
              <p className="text-neutral-500 text-xs uppercase tracking-widest mb-1">
                Mensalidade do aluno
              </p>
              <p className="font-display font-black text-4xl text-white">
                {formatCurrency(personal.studentMonthlyPrice)}
                <span className="text-base text-neutral-500 font-body font-medium"> /mês</span>
              </p>
              <p className="text-neutral-400 text-sm mt-2">
                Cobrança mensal pela plataforma. Um percentual fica com o Personal GYMX; o restante
                vai para este profissional.
              </p>
            </div>

            {error ? <p className="text-orange-500 text-sm mb-4">{error}</p> : null}
            {message ? <p className="text-green-400 text-sm mb-4">{message}</p> : null}

            {isOwnPage ? (
              <div className="space-y-3">
                <p className="text-neutral-300 text-sm">Esta é a sua página pública. Compartilhe o link:</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <code className="flex-1 text-xs text-neutral-300 bg-neutral-950 border border-neutral-700 rounded px-3 py-3 break-all">
                    {publicUrl}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center justify-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-3 rounded font-bold uppercase text-xs"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? "Copiado" : "Copiar URL"}
                  </button>
                </div>
              </div>
            ) : alreadyContracted ? (
              <Link
                to="/portal/plano"
                className="inline-flex bg-yellow-400 text-yellow-900 px-6 py-3 rounded font-bold uppercase text-sm"
              >
                Ver meu acompanhamento
              </Link>
            ) : (
              <form onSubmit={handleContract} className="space-y-3">
                <button
                  type="submit"
                  disabled={contracting}
                  className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-yellow-900 px-8 py-4 rounded font-bold uppercase text-sm disabled:opacity-60"
                >
                  {contracting
                    ? "Contratando..."
                    : session
                      ? "Contratar este personal"
                      : "Criar conta e contratar"}
                </button>
                {!session ? (
                  <p className="text-neutral-500 text-xs">
                    Já tem conta?{" "}
                    <Link
                      to={`${BRAND_LOGIN_PATH}?personal=${encodeURIComponent(personal.slug)}`}
                      className="text-yellow-400"
                    >
                      Entrar
                    </Link>
                  </p>
                ) : null}
              </form>
            )}
          </div>

          <div className="mt-8 flex items-center gap-2 text-neutral-500 text-xs">
            <BrandMark className="text-sm" />
            <span>Contrato e cobrança acontecem na plataforma.</span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
