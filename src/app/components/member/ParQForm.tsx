import { motion } from "motion/react";
import { PARQ_QUESTIONS } from "../../utils/parq";
import type { ParQAnswers } from "../../types/member";

export type ParQFormState = {
  [K in keyof ParQAnswers]: boolean | null;
};
interface ParQFormProps {
  answers: ParQFormState;
  onChange: (answers: ParQFormState) => void;
  disabled?: boolean;
}

export function toParQAnswers(state: ParQFormState): ParQAnswers {
  return {
    q1: state.q1 ?? false,
    q2: state.q2 ?? false,
    q3: state.q3 ?? false,
    q4: state.q4 ?? false,
    q5: state.q5 ?? false,
    q6: state.q6 ?? false,
    q7: state.q7 ?? false,
  };
}

export function ParQForm({ answers, onChange, disabled }: ParQFormProps) {
  const setAnswer = (key: keyof ParQAnswers, value: boolean) => {
    onChange({ ...answers, [key]: value });
  };

  return (
    <div className="space-y-4">
      {PARQ_QUESTIONS.map((question, index) => (
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04 }}
          className="bg-neutral-900 border border-neutral-700 rounded-md p-4"
        >
          <p className="text-neutral-200 text-sm mb-3">
            {index + 1}. {question.text}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              disabled={disabled}
              onClick={() => setAnswer(question.id, false)}
              className={`flex-1 py-2.5 rounded-md text-sm font-semibold uppercase tracking-wide transition-colors ${
                answers[question.id] === false
                  ? "bg-green-500/20 text-green-400 border border-green-500/40"
                  : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:border-neutral-600"
              }`}
            >
              Não
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => setAnswer(question.id, true)}
              className={`flex-1 py-2.5 rounded-md text-sm font-semibold uppercase tracking-wide transition-colors ${
                answers[question.id] === true
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                  : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:border-neutral-600"
              }`}
            >
              Sim
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function isParQComplete(answers: ParQFormState): boolean {
  return PARQ_QUESTIONS.every(
    (question) => answers[question.id] !== null
  );
}

export const emptyParQAnswers = (): ParQFormState => ({
  q1: null,
  q2: null,
  q3: null,
  q4: null,
  q5: null,
  q6: null,
  q7: null,
});
