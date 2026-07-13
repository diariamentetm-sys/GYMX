import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState } from "react";

export function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Preciso ter experiência em academia para treinar aqui?",
      answer:
        "Não. Recebemos alunos de todos os níveis — do iniciante ao atleta avançado. O protocolo é montado de acordo com onde você está, não onde achamos que você deveria estar.",
    },
    {
      question: "Como funciona a avaliação física?",
      answer:
        "A avaliação acontece antes do seu primeiro treino e dura aproximadamente 60 minutos. Incluímos análise postural, composição corporal por bioimpedância, testes de força e mobilidade e uma conversa aprofundada sobre seus objetivos e histórico.",
    },
    {
      question: "Posso trazer acompanhante na visita?",
      answer:
        "Sim. Incentivamos isso. A visita gratuita é para você conhecer o espaço, a equipe e tirar todas as dúvidas com calma — com quem você quiser ao lado.",
    },
    {
      question: "Os horários são flexíveis?",
      answer:
        "Dependendo do plano, você tem acesso em horário comercial, horário completo ou 24h. Detalhamos isso durante a visita de acordo com a sua rotina.",
    },
    {
      question: "Existe contrato de fidelidade?",
      answer:
        "Sim, temos fidelidade mínima de 3 meses. Isso não é burocracia — é porque resultados reais levam tempo, e queremos que você se comprometa com o processo.",
    },
    {
      question: "O que acontece se eu precisar pausar o treino por motivo de saúde?",
      answer:
        "Tratamos isso caso a caso, com humanidade. Se houver atestado médico, trabalhamos para preservar o vínculo do aluno de forma justa.",
    },
    {
      question: "Vocês têm estacionamento?",
      answer:
        "Sim. Alunos têm acesso a estacionamento exclusivo adjacente à academia. Plano Elite tem vaga reservada.",
    },
  ];

  return (
    <section ref={ref} className="relative py-32 bg-neutral-900">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="text-orange-500 text-xs font-semibold uppercase tracking-widest">
            Dúvidas
          </div>
          <h2 className="text-5xl md:text-6xl font-black uppercase">
            Respondendo o que você{" "}
            <span className="text-yellow-400">provavelmente</span> quer saber
          </h2>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="bg-gradient-to-br from-neutral-950 to-neutral-800 border border-neutral-700 rounded-md overflow-hidden hover:border-yellow-400/50 transition-all"
            >
              {/* Question */}
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 flex items-center justify-between gap-4 group"
              >
                <span className="text-white font-semibold text-lg pr-4">
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-yellow-400 text-2xl font-bold flex-shrink-0"
                >
                  {openIndex === index ? "−" : "+"}
                </motion.span>
              </button>

              {/* Answer */}
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 pt-0">
                  <p className="text-neutral-050 text-base leading-relaxed border-t border-neutral-700 pt-4">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-transparent border-2 border-neutral-700 text-white px-10 py-4 rounded font-bold uppercase text-sm tracking-wide hover:border-yellow-400 hover:text-yellow-400 transition-all"
          >
            Ainda tem dúvida? Falar com especialista →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
