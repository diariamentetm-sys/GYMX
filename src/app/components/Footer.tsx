import { motion } from "motion/react";

export function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16 py-16">
        {/* Top Section - Tagline */}
        <div className="mb-12 pb-12 border-b border-neutral-800">
          <p className="text-neutral-500 text-sm uppercase tracking-widest">
            GymX — Treinamento de alto padrão desde 2014
          </p>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1 - Navigation */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase mb-6 text-white tracking-wider">
              Links Rápidos
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Início", href: "#inicio" },
                { label: "Quem Somos", href: "#quem-somos" },
                { label: "Estrutura", href: "#estrutura" },
                { label: "Planos", href: "#planos" },
                { label: "Coaches", href: "#coaches" },
                { label: "FAQ", href: "#faq" },
                { label: "Contato", href: "#contato" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-neutral-300 text-sm hover:text-yellow-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 - Modalidades */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase mb-6 text-white tracking-wider">
              Modalidades
            </h4>
            <ul className="space-y-3">
              {[
                "Força",
                "Condicionamento",
                "Funcional",
                "Levantamento Olímpico",
                "Hipertrofia",
                "Mobilidade",
              ].map((service) => (
                <li key={service}>
                  <a
                    href="#"
                    className="text-neutral-300 text-sm hover:text-yellow-400 transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Contact Info */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase mb-6 text-white tracking-wider">
              Contato
            </h4>
            <ul className="space-y-3 text-neutral-300 text-sm">
              <li>Rua Augusta, 2690</li>
              <li>Cerqueira César</li>
              <li>São Paulo, SP — CEP 01413-000</li>
              <li className="pt-4">+55 11 98765-4321</li>
              <li>contato@gymx.com.br</li>
            </ul>
          </div>

          {/* Column 4 - Redes Sociais */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase mb-6 text-white tracking-wider">
              Redes Sociais
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Instagram", handle: "@gymx" },
                { name: "YouTube", handle: "GymX" },
                { name: "WhatsApp", handle: "(11) 98765-4321" },
              ].map((social) => (
                <li key={social.name}>
                  <a
                    href="#"
                    className="text-neutral-300 text-sm hover:text-yellow-400 transition-colors flex items-baseline gap-2"
                  >
                    <span>{social.name}</span>
                    <span className="text-neutral-500 text-xs">
                      {social.handle}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <p className="text-neutral-500 text-sm">
              © 2026 GymX. Todos os direitos reservados.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-neutral-500 text-sm hover:text-yellow-400 transition-colors"
              >
                Termos & Condições
              </a>
              <a
                href="#"
                className="text-neutral-500 text-sm hover:text-yellow-400 transition-colors"
              >
                Política de Privacidade
              </a>
            </div>
          </div>

          {/* Legal Note */}
          <p className="text-neutral-600 text-xs text-center">
            CREF Responsável Técnico: Lucas Andrade · CREF 012345-G/SP
          </p>
        </div>
      </div>
    </footer>
  );
}
