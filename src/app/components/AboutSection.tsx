import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BRAND_NAME, BRAND_SIGNUP_PATH } from "../constants/brand";

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { label: "Seu método", value: "Na nuvem" },
    { label: "Seus alunos", value: "No painel" },
    { label: "Sua videoaula", value: "Na ficha" },
    { label: "O treino", value: "No bolso deles" },
  ];

  return (
    <section
      ref={ref}
      className="relative py-32 bg-neutral-950 overflow-hidden"
      id="quem-somos"
    >
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-orange-500 text-xs font-semibold uppercase tracking-widest mb-4"
          >
            Como funciona
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl font-black uppercase leading-tight max-w-4xl"
          >
            Você já treina gente.{" "}
            <span className="text-yellow-400">Agora treine o negócio</span> também.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-8"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-neutral-050 text-base leading-relaxed"
            >
              Planilha, WhatsApp e print de treino não escalam. O {BRAND_NAME} nasceu
              para o personal que quer um painel só seu: cadastrar aluno, montar a
              ficha e colar a URL da videoaula que você gravou.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-neutral-050 text-base leading-relaxed"
            >
              O aluno entra no portal e vê exatamente o que você prescreveu — séries,
              descanso e o movimento no seu vídeo. Sem catálogo genérico. Sem perder
              o método que te diferencia.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-white text-lg font-medium"
            >
              Você não aluga um sistema de academia.{" "}
              <span className="text-yellow-400">Você opera o seu estúdio digital.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={BRAND_SIGNUP_PATH}
                className="inline-block bg-yellow-400 text-yellow-900 px-8 py-4 rounded font-bold uppercase text-sm tracking-wide transition-colors hover:bg-yellow-300"
              >
                Começar a gerir meus alunos →
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-3 relative"
          >
            <div className="relative aspect-[3/4] rounded-none overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop"
                alt="Personal trainer em sessão"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent" />
            </div>
          </motion.div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.15 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 p-8 rounded-md hover:border-yellow-400/50 transition-all"
              >
                <div className="text-orange-500 text-xs font-semibold uppercase tracking-widest mb-4">
                  {stat.label}
                </div>
                <div className="font-display text-3xl md:text-4xl font-black text-white">
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
