import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CONTACT_SECTION_HREF } from "../constants/anchors";
import { BRAND_SIGNUP_PATH } from "../constants/brand";

export function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden"
      id="proximo-passo"
    >
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
          alt="Personal trainer pronto para o próximo aluno"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/50 to-neutral-950/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-yellow-400/10 mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-orange-500 text-xs font-semibold uppercase tracking-[0.2em]"
          >
            O próximo passo
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.95] max-w-4xl mx-auto"
          >
            <span className="block text-white">Você já tem o método.</span>
            <span className="block text-yellow-400 mt-2">Falta o sistema.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-3xl mx-auto space-y-4"
          >
            <p className="text-neutral-050 text-lg leading-relaxed">
              A maioria dos personais vai continuar mandando treino por conversa.
              Quem se cadastra hoje entrega ficha, vídeo e acompanhamento como um
              negócio — não como um favor.
            </p>
            <p className="text-white text-xl font-medium mt-6">
              Crie a conta. Cadastre o primeiro aluno.{" "}
              <span className="text-yellow-400">Cole a URL da sua aula.</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={BRAND_SIGNUP_PATH}
                className="inline-block bg-yellow-400 text-yellow-900 px-12 py-5 rounded font-bold uppercase text-base tracking-wider shadow-2xl shadow-yellow-400/30 transition-all duration-300 hover:bg-yellow-300"
              >
                Cadastrar agora →
              </Link>
            </motion.div>
            <motion.a
              href={CONTACT_SECTION_HREF}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-white text-white px-12 py-5 rounded font-bold uppercase text-base tracking-wider hover:bg-white hover:text-neutral-950 transition-all"
            >
              Quero uma demonstração
            </motion.a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-neutral-400 text-sm pt-4"
          >
            Resposta em até 2 horas em dias úteis · Sem pressão · Feito para CREF
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.4 }}
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent z-10"
      />
    </section>
  );
}
