import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";
import { CONTACT_SECTION_HREF, HOME_TOP_HREF } from "../constants/anchors";
import { scrollToPageTop } from "../utils/scroll";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Início", href: "#inicio" },
    { label: "Quem Somos", href: "#quem-somos" },
    { label: "Estrutura", href: "#estrutura" },
    { label: "Planos", href: "#planos" },
    { label: "Coaches", href: "#coaches" },
    { label: "Contato", href: "#contato" },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);

    if (href === HOME_TOP_HREF) {
      scrollToPageTop();
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-700/50"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-16 h-20 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href={HOME_TOP_HREF}
          onClick={(event) => {
            event.preventDefault();
            scrollToPageTop();
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="font-display text-3xl font-black tracking-tight text-white hover:text-yellow-400 transition-colors cursor-pointer"
          aria-label="Voltar ao topo da página"
        >
          GYMX
        </motion.a>

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
        <div className="flex items-center gap-3 md:gap-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <Link
              to="/login"
              className="hidden md:block text-neutral-050 hover:text-yellow-400 transition-colors font-medium text-sm uppercase tracking-wider"
            >
              Sou Membro
            </Link>
          </motion.div>

          <motion.a
            href={CONTACT_SECTION_HREF}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:inline-flex bg-yellow-400 text-yellow-900 px-6 py-3 rounded font-semibold uppercase text-sm tracking-wide transition-colors hover:bg-yellow-300"
          >
            Agendar Visita
          </motion.a>

          {/* Mobile Menu Toggle */}
          <motion.button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="md:hidden w-10 h-10 flex items-center justify-center text-white hover:text-yellow-400 transition-colors"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-neutral-800 bg-neutral-950/95 backdrop-blur-md"
          >
            <nav className="px-6 py-4 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="block px-4 py-3 rounded-md text-neutral-050 hover:text-yellow-400 hover:bg-neutral-900 font-medium text-sm uppercase tracking-wider transition-colors"
                >
                  {item.label}
                </a>
              ))}

              <div className="pt-4 mt-2 border-t border-neutral-800 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-md text-neutral-050 hover:text-yellow-400 hover:bg-neutral-900 font-medium text-sm uppercase tracking-wider transition-colors"
                >
                  Sou Membro
                </Link>
                <a
                  href={CONTACT_SECTION_HREF}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-yellow-400 text-yellow-900 px-4 py-3 rounded font-semibold uppercase text-sm tracking-wide transition-colors hover:bg-yellow-300"
                >
                  Agendar Visita
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
