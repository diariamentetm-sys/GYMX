import { useEffect, useState } from "react";
import { X, HeartPulse } from "lucide-react";
import type { ParQReviewDecision, PendingParQReview } from "../../types/staff";
import { PARQ_QUESTIONS } from "../../utils/parq";
import { reviewMemberParQ } from "../../services/staffService";

interface ParQReviewModalProps {
  review: PendingParQReview | null;
  onClose: () => void;
  onReviewed: () => void;
}

export function ParQReviewModal({ review, onClose, onReviewed }: ParQReviewModalProps) {
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState<ParQReviewDecision | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setNotes(review?.reviewNotes ?? "");
    setError("");
    setSubmitting(null);
  }, [review]);

  if (!review) return null;

  const handleDecision = async (decision: ParQReviewDecision) => {
    setError("");
    setSubmitting(decision);
    const result = await reviewMemberParQ({
      memberId: review.memberId,
      decision,
      notes,
    });
    setSubmitting(null);

    if (!result.success) {
      setError(result.error ?? "Não foi possível salvar a avaliação.");
      return;
    }

    onReviewed();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <button
        type="button"
        aria-label="Fechar avaliação"
        onClick={onClose}
        className="absolute inset-0 bg-black/70"
      />
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-neutral-900 border border-neutral-700 rounded-t-2xl sm:rounded-md p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center shrink-0">
              <HeartPulse className="text-orange-400" size={22} />
            </div>
            <div>
              <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider mb-1">
                Aprovar avaliação PAR-Q
              </p>
              <h2 className="font-display text-2xl font-black uppercase text-white">
                {review.fullName}
              </h2>
              <p className="text-neutral-500 text-sm">
                {review.email} · {review.phone}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-neutral-400 text-sm mb-4">
          O aluno respondeu SIM em pelo menos uma questão de risco. Revise as respostas e
          libere o treino só depois da avaliação profissional.
        </p>

        <div className="space-y-3 mb-6">
          {PARQ_QUESTIONS.map((question) => {
            const yes = review.answers[question.id];
            return (
              <div
                key={question.id}
                className={`rounded-md border p-4 ${
                  yes
                    ? "border-orange-500/40 bg-orange-500/10"
                    : "border-neutral-800 bg-neutral-950"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-neutral-200 text-sm">{question.text}</p>
                  <span
                    className={`shrink-0 text-xs font-bold uppercase tracking-wider ${
                      yes ? "text-orange-400" : "text-green-400"
                    }`}
                  >
                    {yes ? "Sim" : "Não"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <label className="block text-neutral-300 text-xs font-semibold uppercase tracking-wider mb-2">
          Observações da avaliação
        </label>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={4}
          placeholder="Restrições, encaminhamento médico ou liberação condicionada..."
          className="w-full bg-neutral-950 border-2 border-neutral-700 rounded-md p-3 text-white text-sm placeholder:text-neutral-600 focus:border-yellow-400 focus:outline-none mb-4"
        />

        {error ? <p className="text-orange-500 text-sm mb-4">{error}</p> : null}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            disabled={Boolean(submitting)}
            onClick={() => handleDecision("apto")}
            className="py-3 rounded-md bg-green-500 hover:bg-green-400 text-neutral-950 font-bold uppercase text-xs tracking-wide disabled:opacity-60"
          >
            {submitting === "apto" ? "Salvando..." : "Liberar apto"}
          </button>
          <button
            type="button"
            disabled={Boolean(submitting)}
            onClick={() => handleDecision("apto_com_restricao")}
            className="py-3 rounded-md bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold uppercase text-xs tracking-wide disabled:opacity-60"
          >
            {submitting === "apto_com_restricao" ? "Salvando..." : "Apto com restrição"}
          </button>
          <button
            type="button"
            disabled={Boolean(submitting)}
            onClick={() => handleDecision("encaminhar_avaliacao")}
            className="py-3 rounded-md bg-neutral-800 hover:bg-neutral-700 text-white font-bold uppercase text-xs tracking-wide disabled:opacity-60"
          >
            {submitting === "encaminhar_avaliacao" ? "Salvando..." : "Manter bloqueio"}
          </button>
        </div>
      </div>
    </div>
  );
}
