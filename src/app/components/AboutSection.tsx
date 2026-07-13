import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { label: "Alunos ativos", value: "+1.200" },
    { label: "Taxa de frequência", value: "94%" },
    { label: "Anos de operação", value: "12 anos" },
    { label: "Coaches certificados", value: "18" },
  ];

  return (
    <section
      ref={ref}
      className="relative py-32 bg-neutral-950 overflow-hidden"
      id="quem-somos"
    >
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        {/* Section Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-orange-500 text-xs font-semibold uppercase tracking-widest mb-4"
          >
            Nossa história
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl font-black uppercase leading-tight max-w-4xl"
          >
            Não somos uma academia.{" "}
            <span className="text-yellow-400">Somos um sistema</span> de evolução.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column - Text */}
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
              A GymX nasceu da insatisfação com o que o mercado oferecia: espaços
              barulhentos, superlotados e sem direção. Criamos um ambiente onde
              cada metro quadrado, cada equipamento e cada profissional existe
              com um único propósito — levar você ao seu melhor desempenho possível.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-neutral-050 text-base leading-relaxed"
            >
              Desde o primeiro dia, a nossa premissa foi clara: treinamento de
              alto padrão não é luxo, é método. É estrutura. É acompanhamento
              real de pessoas que entendem de corpo, performance e resultado.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-white text-lg font-medium"
            >
              Aqui, você não é mais um aluno.{" "}
              <span className="text-yellow-400">
                Você é um objetivo em movimento.
              </span>
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-400 text-yellow-900 px-8 py-4 rounded font-bold uppercase text-sm tracking-wide transition-colors hover:bg-yellow-300"
            >
              Conhecer nossa história →
            </motion.button>
          </motion.div>

          {/* Center Column - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-4 relative"
          >
            <div className="relative aspect-[3/4] rounded-none overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop"
                alt="Athlete training"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent" />
            </div>
          </motion.div>

          {/* Right Column - Stats Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-6">
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
                <div className="font-display text-5xl font-black text-white">
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
