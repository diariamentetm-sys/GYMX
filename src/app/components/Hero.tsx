import { motion } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BRAND_LOGIN_PATH, BRAND_SIGNUP_PATH } from "../constants/brand";

export function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-neutral-950 pt-24 md:pt-28 lg:pt-32">
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop"
          alt="Personal trainer acompanhando aluno"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/50 to-neutral-950/85" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <span className="text-yellow-400 text-sm font-semibold uppercase tracking-[0.2em]">
            Feito para quem treina os outros.
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-4"
        >
          <motion.h1 className="text-[44px] md:text-[64px] lg:text-[84px] leading-[0.95] font-black uppercase tracking-tight max-w-5xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="block text-white"
            >
              Seus alunos. Sua ficha.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="block text-white"
            >
              Seu <span className="text-yellow-400">método</span>
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="block text-white"
            >
              em um só lugar.
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="text-neutral-050 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mt-8"
          >
            O Personal GYMX é a plataforma para o personal trainer gerir alunos,
            prescrever treinos e entregar a própria videoaula — direto no celular de quem treina com você.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={BRAND_SIGNUP_PATH}
                className="inline-block bg-yellow-400 text-yellow-900 px-10 py-5 rounded font-bold uppercase text-sm tracking-wide hover:bg-yellow-300 transition-colors"
              >
                Cadastrar meu estúdio →
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={BRAND_LOGIN_PATH}
                className="inline-block bg-transparent border-2 border-white text-white px-10 py-5 rounded font-bold uppercase text-sm tracking-wide hover:bg-white hover:text-neutral-950 transition-all"
              >
                Já tenho conta
              </Link>
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="text-neutral-300 text-sm mt-6"
          >
            Monte a primeira ficha em minutos. O aluno vê o treino e o seu vídeo no portal.
          </motion.p>
        </motion.div>

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
