import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Link } from "react-router";
import { BRAND_SIGNUP_PATH } from "../constants/brand";

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    {
      text: "Saí do WhatsApp bagunçado. Cadastro o aluno, colo a URL da minha videoaula e ele já vê o movimento no portal. Meu método continua meu — só ficou organizado.",
      author: "Marina Alves",
      cred: "CREF 012345-G/SP",
      role: "Personal · hipertrofia",
    },
    {
      text: "Eu perdia aluno porque a ficha vivia desatualizada. Agora altero o treino no painel e no mesmo dia ele treina certo. Parece que contratei uma recepção digital.",
      author: "Rafael Costa",
      cred: "CREF 098761-G/RJ",
      role: "Personal · emagrecimento",
    },
    {
      text: "Atendo em condomínio e online. O aluno não precisa me mandar 'qual o treino de hoje?'. Abre o Personal GYMX e está lá, com o meu vídeo.",
      author: "Camila Duarte",
      cred: "CREF 055210-G/MG",
      role: "Personal · atendimento híbrido",
    },
    {
      text: "O PAR-Q e a lista de alunos no mesmo lugar me deram segurança. Pareço mais profissional sem virar uma academia de 200 m².",
      author: "Bruno Teixeira",
      cred: "CREF 033440-G/PR",
      role: "Personal · estúdio próprio",
    },
  ];

  return (
    <section ref={ref} id="depoimentos" className="relative py-32 bg-neutral-900">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="text-orange-500 text-xs font-semibold uppercase tracking-widest">
            Quem já opera o próprio estúdio
          </div>
          <h2 className="text-5xl md:text-6xl font-black uppercase">
            Personais que pararam de{" "}
            <span className="text-yellow-400">improvisar</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-neutral-950 to-neutral-800 border border-neutral-700 p-8 rounded-md hover:border-yellow-400/50 transition-all"
            >
              <div className="mb-6">
                <span className="text-yellow-400 text-6xl font-display leading-none">
                  "
                </span>
                <p className="text-neutral-050 text-base leading-relaxed mt-2">
                  {testimonial.text}
                </p>
              </div>

              <div className="border-t border-neutral-700 pt-4">
                <p className="text-white font-semibold">{testimonial.author}</p>
                <p className="text-neutral-300 text-sm italic">{testimonial.role}</p>
                <p className="text-neutral-500 text-xs mt-1">{testimonial.cred}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to={BRAND_SIGNUP_PATH}
              className="inline-block bg-yellow-400 text-yellow-900 px-10 py-4 rounded font-bold uppercase text-sm tracking-wide transition-colors hover:bg-yellow-300"
            >
              Quero o mesmo controle →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
