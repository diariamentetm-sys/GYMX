import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CONTACT_SECTION_HREF } from "../constants/anchors";

export function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden"
      id="proximo-passo"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"
          alt="Ready to join"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/50 to-neutral-950/90" />

        {/* Colored smoke effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-yellow-400/10 mix-blend-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-orange-500 text-xs font-semibold uppercase tracking-[0.2em]"
          >
            O próximo passo
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.95] max-w-4xl mx-auto"
          >
            <span className="block text-white">
              Você chegou até aqui.
            </span>
            <span className="block text-yellow-400 mt-2">
              Isso já diz algo sobre você.
            </span>
          </motion.h2>

          {/* Body Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-3xl mx-auto space-y-4"
          >
            <p className="text-neutral-050 text-lg leading-relaxed">
              A maioria das pessoas que vê essa página vai fechar o navegador e
              continuar como estava. Você não parece ser essa pessoa.
            </p>
            <p className="text-neutral-050 text-lg leading-relaxed">
              O que muda quando você começa aqui não é só o corpo. É a
              disciplina que transborda pro trabalho. É a clareza mental que vem
              do treino consistente. É a confiança de saber que você está
              investindo no único ativo que vai com você para todo lugar.
            </p>
            <p className="text-white text-xl font-medium mt-6">
              A visita é gratuita. O papo é sem pressão.{" "}
              <span className="text-yellow-400">O resultado, esse é seu.</span>
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <motion.a
              href={CONTACT_SECTION_HREF}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-400 text-yellow-900 px-12 py-5 rounded font-bold uppercase text-base tracking-wider shadow-2xl shadow-yellow-400/30 transition-all duration-300 hover:bg-yellow-300"
            >
              Agendar minha visita gratuita →
            </motion.a>
            <motion.a
              href={CONTACT_SECTION_HREF}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-white text-white px-12 py-5 rounded font-bold uppercase text-base tracking-wider hover:bg-white hover:text-neutral-950 transition-all"
            >
              Prefiro falar com especialista
            </motion.a>
          </motion.div>

          {/* Support Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-neutral-400 text-sm pt-4"
          >
            Resposta em até 2 horas em dias úteis · Sem compromisso · Sem pressão
          </motion.p>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.4 }}
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent z-10"
      />
    </section>
  );
}
