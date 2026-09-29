import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Link } from "react-router";
import { BRAND_SIGNUP_PATH } from "../constants/brand";

export function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const plans = [
    {
      badge: "Para começar",
      title: "START",
      subtitle: "Você, seus alunos e a primeira ficha profissional",
      price: "97",
      period: "/mês",
      features: [
        "Até 20 alunos ativos",
        "Fichas de treino com séries, reps e descanso",
        "URL da sua videoaula em cada exercício",
        "Portal do aluno com Meu Treino",
        "PAR-Q e revisão de saúde",
        "1 personal no painel",
      ],
    },
    {
      badge: "Mais escolhido",
      title: "PRO",
      subtitle: "Para quem vive de personal e não quer teto de alunos",
      price: "197",
      period: "/mês",
      features: [
        "Alunos ilimitados",
        "Biblioteca das suas videoaulas",
        "Prescrição e detalhe por exercício",
        "Check-in e acompanhamento",
        "Visão do aluno em demonstração",
        "Suporte prioritário",
        "Marca Personal GYMX no portal do aluno",
      ],
      featured: true,
    },
    {
      badge: "Estúdio",
      title: "STUDIO",
      subtitle: "Quando o negócio já tem equipe e muitos horários",
      price: "397",
      period: "/mês",
      features: [
        "Tudo do Pro",
        "Vários personais no mesmo painel",
        "Gestão de alunos por profissional",
        "Relatórios de frequência",
        "Onboarding guiado da equipe",
        "Canal direto com o time Personal GYMX",
      ],
    },
  ];

  return (
    <section ref={ref} className="relative py-32 bg-neutral-950" id="planos">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="text-orange-500 text-xs font-semibold uppercase tracking-widest">
              Planos
            </div>
            <h2 className="text-5xl md:text-6xl font-black uppercase">
              Invista no que{" "}
              <span className="text-yellow-400">paga</span> o seu mês
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-neutral-050 text-base max-w-md"
          >
            Todos os planos incluem cadastro de alunos, ficha com a sua videoaula
            e portal para quem treina com você.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
              whileHover={{ y: -10 }}
              className={`relative bg-gradient-to-br from-neutral-900 to-neutral-800 border rounded-md p-8 transition-all duration-300 ${
                plan.featured
                  ? "border-yellow-400 border-2 shadow-lg shadow-yellow-400/20 lg:scale-105"
                  : "border-neutral-700 hover:border-neutral-500"
              }`}
            >
              <div
                className={`absolute -top-3 left-8 px-4 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                  plan.featured
                    ? "bg-yellow-400 text-yellow-900"
                    : "bg-neutral-700 text-white"
                }`}
              >
                {plan.badge}
              </div>

              <h3 className="font-display text-2xl font-black uppercase mb-2 text-white mt-4">
                {plan.title}
              </h3>

              <p className="text-neutral-300 text-sm mb-6">{plan.subtitle}</p>

              <div className="flex items-end gap-2 mb-8 pb-6 border-b border-neutral-700">
                <span className="text-neutral-500 text-sm">A partir de</span>
                <span className="font-display text-5xl font-black text-white">
                  R$ {plan.price}
                </span>
                <span className="text-neutral-300 text-lg mb-2">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-neutral-050 text-sm"
                  >
                    <span className="text-yellow-400 mt-1">→</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={BRAND_SIGNUP_PATH}
                  className={`block w-full py-4 rounded font-bold uppercase text-sm tracking-wide transition-colors text-center ${
                    plan.featured
                      ? "bg-yellow-400 text-yellow-900 hover:bg-yellow-300"
                      : "bg-transparent border-2 border-neutral-700 text-white hover:border-yellow-400 hover:text-yellow-400"
                  }`}
                >
                  Começar no {plan.title}
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-center space-y-4"
        >
          <p className="text-neutral-500 text-sm max-w-3xl mx-auto">
            Cancele quando quiser. Sem fidelidade de academia. O aluno continua
            vendo só o que você prescreveu enquanto a conta estiver ativa.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
