import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { CONTACT_SECTION_HREF } from "../constants/anchors";
import { BRAND_NAME } from "../constants/brand";

export function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "O Personal GYMX é uma academia?",
      answer:
        "Não. É a plataforma do personal trainer. Você cadastra os seus alunos, monta as fichas e cola a URL da videoaula que você gravou. O aluno acessa o portal com o seu treino — não um catálogo genérico da marca.",
    },
    {
      question: "De onde vêm os vídeos dos exercícios?",
      answer:
        "De você. Cole o link do YouTube, Vimeo ou Loom na ficha do aluno. A URL fica naquele treino e aparece em Meu Treino. Dá para reutilizar da sua biblioteca nas próximas prescrições.",
    },
    {
      question: "Meu aluno também precisa de conta?",
      answer:
        "Sim. Cada aluno entra no portal com o próprio login. Lá ele vê só a ficha que você prescreveu, faz check-in e acompanha o plano. Você continua no painel de personal.",
    },
    {
      question: "Consigo começar sozinho, sem equipe?",
      answer:
        "Sim. O plano Start é para o personal autônomo. Studio entra quando você já tem outros profissionais no mesmo estúdio.",
    },
    {
      question: "Preciso ter CREF para me cadastrar?",
      answer:
        "O cadastro na plataforma é do personal responsável pelos alunos. A prescrição de treino segue a regulamentação profissional do CREF na sua atuação. O sistema organiza o método — não substitui a sua formação.",
    },
    {
      question: "E se o aluno treinar em outra academia?",
      answer:
        "Sem problema. O {BRAND_NAME} não depende da catraca de uma unidade. O treino e a sua videoaula vão com o aluno para onde ele for treinar.",
    },
    {
      question: "Posso cancelar depois?",
      answer:
        "Sim. Não há fidelidade de 12 meses de academia. Enquanto a conta estiver ativa, alunos veem a ficha vigente. Se cancelar, o acesso ao painel e ao portal segue a regra do plano contratado.",
    },
  ].map((item) => ({
    ...item,
    answer: item.answer.replaceAll("{BRAND_NAME}", BRAND_NAME),
  }));

  return (
    <section ref={ref} id="faq" className="relative py-32 bg-neutral-900">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
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
            O que personais{" "}
            <span className="text-yellow-400">perguntam</span> antes de entrar
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="bg-gradient-to-br from-neutral-950 to-neutral-800 border border-neutral-700 rounded-md overflow-hidden hover:border-yellow-400/50 transition-all"
            >
              <button
                type="button"
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <motion.a
            href={CONTACT_SECTION_HREF}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-transparent border-2 border-neutral-700 text-white px-10 py-4 rounded font-bold uppercase text-sm tracking-wide hover:border-yellow-400 hover:text-yellow-400 transition-all"
          >
            Ainda tem dúvida? Falar com a gente →
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
