import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router";
import { Copy, Check, Globe } from "lucide-react";
import { FormInput } from "../FormInput";
import {
  fetchOwnPublicProfile,
  updateOwnPublicProfile,
} from "../../services/personalDirectoryService";
import { personalPublicPath } from "../../types/personal";
import { formatCurrency } from "../../utils/subscriptionCalculations";

function parseSpecialties(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}

export function PublicProfileSettings() {
  const [slug, setSlug] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [cref, setCref] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [price, setPrice] = useState("297");
  const [listed, setListed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchOwnPublicProfile().then((result) => {
      if (result.profile) {
        setSlug(result.profile.slug);
        setHeadline(result.profile.headline);
        setBio(result.profile.bio);
        setCref(result.profile.cref);
        setSpecialties(result.profile.specialties.join(", "));
        setPrice(String(result.profile.studentMonthlyPrice));
        setListed(result.profile.listed);
      }
      if (result.error) setError(result.error);
      setLoading(false);
    });
  }, []);

  const publicUrl =
    typeof window !== "undefined" && slug
      ? `${window.location.origin}${personalPublicPath(slug)}`
      : slug
        ? personalPublicPath(slug)
        : "";

  const handleCopy = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Não foi possível copiar o link.");
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const normalizedSlug = slug.trim().toLowerCase();
    const monthly = Number(price.replace(",", "."));
    if (!normalizedSlug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlug)) {
      setError("A URL deve ter só letras minúsculas, números e hífen.");
      return;
    }
    if (!Number.isFinite(monthly) || monthly <= 0) {
      setError("Informe a mensalidade que o aluno paga.");
      return;
    }

    setSaving(true);
    const result = await updateOwnPublicProfile({
      slug: normalizedSlug,
      headline: headline.trim() || "Personal trainer",
      bio: bio.trim(),
      cref: cref.trim(),
      specialties: parseSpecialties(specialties),
      studentMonthlyPrice: monthly,
      listed,
    });
    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    setSlug(normalizedSlug);
    setMessage("Página pública atualizada.");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-6 lg:p-8 space-y-6"
    >
      <div>
        <h2 className="font-display text-2xl font-black uppercase text-white mb-2">
          Página pública
        </h2>
        <p className="text-neutral-500 text-sm">
          Esta é a URL que você compartilha. O aluno vê seu trabalho na landing e contrata por aqui.
        </p>
      </div>

      {publicUrl ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <code className="flex-1 text-xs text-neutral-300 bg-neutral-950 border border-neutral-700 rounded px-3 py-3 break-all">
            {publicUrl}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-2 bg-neutral-800 text-yellow-400 px-4 py-3 rounded font-bold uppercase text-xs border border-neutral-700"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copiado" : "Copiar URL"}
          </button>
          <Link
            to={personalPublicPath(slug)}
            className="inline-flex items-center justify-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-3 rounded font-bold uppercase text-xs"
          >
            <Globe size={16} />
            Ver página
          </Link>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Endereço da página (slug)"
          type="text"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          placeholder="seu-nome"
        />
        <FormInput
          label="Nome na vitrine"
          type="text"
          value={headline}
          onChange={(event) => setHeadline(event.target.value)}
          placeholder="Seu nome profissional"
        />
      </div>

      <div>
        <label className="block text-neutral-400 text-xs uppercase tracking-wider mb-2">
          Sobre o seu trabalho
        </label>
        <textarea
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          rows={5}
          className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-4 py-3 text-white text-sm focus:border-yellow-400 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="CREF"
          type="text"
          value={cref}
          onChange={(event) => setCref(event.target.value)}
          placeholder="000000-G/SP"
        />
        <FormInput
          label="Mensalidade do aluno (R$)"
          type="text"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        />
      </div>

      <FormInput
        label="Especialidades (separadas por vírgula)"
        type="text"
        value={specialties}
        onChange={(event) => setSpecialties(event.target.value)}
        placeholder="hipertrofia, emagrecimento"
      />

      <label className="flex items-center gap-3 text-sm text-neutral-300">
        <input
          type="checkbox"
          checked={listed}
          onChange={(event) => setListed(event.target.checked)}
          className="w-4 h-4 accent-yellow-400"
        />
        Listar na landing pública
      </label>

      {error ? <p className="text-orange-500 text-sm">{error}</p> : null}
      {message ? <p className="text-green-400 text-sm">{message}</p> : null}

      <p className="text-neutral-500 text-xs">
        A mensalidade é cobrada do aluno. Um percentual fica com o Personal GYMX; o restante é
        seu. Preview: {formatCurrency(Number(price.replace(",", ".")) || 0)}/mês.
      </p>

      <button
        type="submit"
        disabled={saving}
        className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 px-6 py-3 rounded font-bold uppercase text-sm disabled:opacity-60"
      >
        {saving ? "Salvando..." : "Salvar página pública"}
      </button>
    </form>
  );
}
