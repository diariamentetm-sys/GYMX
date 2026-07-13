import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CONTACT_SECTION_HREF } from "../constants/anchors";

export function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-neutral-950 pt-24 md:pt-28 lg:pt-32">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
          alt="Athletes training"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-neutral-950/40 to-neutral-950/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-8 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <span className="text-yellow-400 text-sm font-semibold uppercase tracking-[0.2em]">
            Alto padrão. Resultado real.
          </span>
        </motion.div>

        {/* Animated Headline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-4"
        >
          <motion.h1
            className="text-[56px] md:text-[72px] lg:text-[90px] leading-[0.95] font-black uppercase tracking-tight max-w-5xl mx-auto"
          >
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="block text-white"
            >
              Seu corpo é o{" "}
              <span className="text-yellow-400">projeto</span>
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="block text-white"
            >
              mais importante
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="block text-white"
            >
              que você vai tocar na vida.
            </motion.span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="text-neutral-050 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mt-8"
          >
            Treinamento de alta performance para quem leva a sério o que faz —
            dentro e fora da academia.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
          >
            <motion.a
              href={CONTACT_SECTION_HREF}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-400 text-yellow-900 px-10 py-5 rounded font-bold uppercase text-sm tracking-wide hover:bg-yellow-300 transition-colors"
            >
              Agendar visita gratuita →
            </motion.a>
            <motion.a
              href={CONTACT_SECTION_HREF}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-white text-white px-10 py-5 rounded font-bold uppercase text-sm tracking-wide hover:bg-white hover:text-neutral-950 transition-all"
            >
              Falar com um especialista
            </motion.a>
          </motion.div>

          {/* Nota de suporte */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="text-neutral-300 text-sm mt-6"
          >
            Sem compromisso. Sem pressão. Só uma conversa.
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-yellow-400 rounded-full flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
