import { Link } from "react-router";
import { BRAND_LOGIN_PATH, BRAND_NAME, BRAND_SIGNUP_PATH } from "../constants/brand";

export function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16 py-16">
        <div className="mb-12 pb-12 border-b border-neutral-800">
          <p className="text-neutral-500 text-sm uppercase tracking-widest">
            {BRAND_NAME} — a plataforma do personal trainer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h4 className="font-display text-sm font-bold uppercase mb-6 text-white tracking-wider">
              Links rápidos
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Início", href: "#inicio" },
                { label: "Como funciona", href: "#quem-somos" },
                { label: "Planos", href: "#planos" },
                { label: "Personais", href: "#depoimentos" },
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

          <div>
            <h4 className="font-display text-sm font-bold uppercase mb-6 text-white tracking-wider">
              Para o personal
            </h4>
            <ul className="space-y-3">
              {[
                "Fichas de treino",
                "Videoaulas com a sua URL",
                "Portal do aluno",
                "PAR-Q e check-in",
                "Biblioteca de exercícios",
                "Gestão de alunos",
              ].map((service) => (
                <li key={service}>
                  <span className="text-neutral-300 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase mb-6 text-white tracking-wider">
              Contato
            </h4>
            <ul className="space-y-3 text-neutral-300 text-sm">
              <li>Atendimento digital</li>
              <li>São Paulo, SP</li>
              <li className="pt-4">+55 11 98765-4321</li>
              <li>contato@gymx.com.br</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase mb-6 text-white tracking-wider">
              Conta
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to={BRAND_SIGNUP_PATH}
                  className="text-neutral-300 text-sm hover:text-yellow-400 transition-colors"
                >
                  Criar conta de personal
                </Link>
              </li>
              <li>
                <Link
                  to={BRAND_LOGIN_PATH}
                  className="text-neutral-300 text-sm hover:text-yellow-400 transition-colors"
                >
                  Entrar
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-neutral-300 text-sm hover:text-yellow-400 transition-colors"
                >
                  Instagram @personalgymx
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <p className="text-neutral-500 text-sm">
              © 2026 {BRAND_NAME}. Todos os direitos reservados.
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

          <p className="text-neutral-600 text-xs text-center">
            Plataforma de gestão para personais. A prescrição de treino é de
            responsabilidade do profissional CREF.
          </p>
        </div>
      </div>
    </footer>
  );
}
