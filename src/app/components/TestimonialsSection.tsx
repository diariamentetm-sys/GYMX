import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { CONTACT_SECTION_HREF } from "../constants/anchors";

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    {
      text: "Treinei em vários lugares antes. Nenhum chegou perto do nível de acompanhamento que tenho aqui. Em 6 meses, perdi 14kg e ganhei uma força que nunca pensei que teria.",
      author: "Rafael Mendes",
      age: 38,
      role: "Executivo",
    },
    {
      text: "O ambiente é diferente. Não tem bagunça, não tem fila, não tem desculpa. Os coaches sabem exatamente o que estão fazendo e me empurram além do que eu me empurraria sozinha.",
      author: "Camila Torres",
      age: 31,
      role: "Médica",
    },
    {
      text: "Voltei a treinar depois de 5 anos parado. Achei que seria difícil me adaptar. Em duas semanas já estava no ritmo. A equipe faz toda a diferença.",
      author: "Bruno Cavalcanti",
      age: 44,
      role: "Empresário",
    },
    {
      text: "Vim pela estrutura. Fiquei pelo resultado. Hoje indico para todo mundo que conheço que quer treinar de verdade.",
      author: "Juliana Ferraz",
      age: 27,
      role: "Arquiteta",
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
            O que dizem nossos alunos
          </div>
          <h2 className="text-5xl md:text-6xl font-black uppercase">
            Palavras de quem já{" "}
            <span className="text-yellow-400">chegou lá</span>
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-neutral-950 to-neutral-800 border border-neutral-700 p-8 rounded-md hover:border-yellow-400/50 transition-all"
            >
              {/* Quote */}
              <div className="mb-6">
                <span className="text-yellow-400 text-6xl font-display leading-none">
                  "
                </span>
                <p className="text-neutral-050 text-base leading-relaxed mt-2">
                  {testimonial.text}
                </p>
              </div>

              {/* Author */}
              <div className="border-t border-neutral-700 pt-4">
                <p className="text-white font-semibold">
                  {testimonial.author}, {testimonial.age} anos
                </p>
                <p className="text-neutral-300 text-sm italic">
                  {testimonial.role}
                </p>
              </div>
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
          <motion.a
            href={CONTACT_SECTION_HREF}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-yellow-400 text-yellow-900 px-10 py-4 rounded font-bold uppercase text-sm tracking-wide transition-colors hover:bg-yellow-300"
          >
            Agendar minha visita gratuita →
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
