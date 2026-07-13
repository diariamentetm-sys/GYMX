import { motion } from "motion/react";
import { CONTACT_SECTION_HREF } from "../constants/anchors";

export function Header() {
  const navItems = [
    { label: "Início", href: "#inicio" },
    { label: "Quem Somos", href: "#quem-somos" },
    { label: "Estrutura", href: "#estrutura" },
    { label: "Planos", href: "#planos" },
    { label: "Coaches", href: "#coaches" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-700/50"
    >
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16 h-20 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="font-display text-3xl font-black tracking-tight text-white"
        >
          GYMX
        </motion.div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item, index) => (
            <motion.a
              key={item.label}
              href={item.href}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
              className={`font-body text-sm font-medium uppercase tracking-wider transition-colors hover:text-yellow-400 ${
                index === 0 ? "text-yellow-400" : "text-neutral-050"
              }`}
            >
              {item.label}
            </motion.a>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          {/* Sou Membro Link */}
          <motion.a
            href="/login"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="hidden md:block text-neutral-050 hover:text-yellow-400 transition-colors font-medium text-sm uppercase tracking-wider"
          >
            Sou Membro
          </motion.a>

          {/* Agendar Visita Button */}
          <motion.a
            href={CONTACT_SECTION_HREF}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-400 text-yellow-900 px-6 py-3 rounded font-semibold uppercase text-sm tracking-wide transition-colors hover:bg-yellow-300"
          >
            Agendar Visita
          </motion.a>
        </div>
      </div>
    </motion.header>
  );
}
