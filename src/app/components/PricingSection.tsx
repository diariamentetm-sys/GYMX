import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { CONTACT_SECTION_HREF } from "../constants/anchors";

export function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const plans = [
    {
      badge: "Essencial",
      title: "PLANO LIVRE",
      subtitle: "Para quem quer autonomia com estrutura",
      price: "290",
      period: "/mês",
      features: [
        "Acesso à academia em horário comercial",
        "Avaliação física de entrada",
        "Protocolo de treino inicial",
        "Acesso a toda a área de equipamentos",
        "App de acompanhamento de treino",
        "1 revisão de protocolo por trimestre",
      ],
    },
    {
      badge: "Mais escolhido",
      title: "PLANO PLUS",
      subtitle: "Para quem quer resultado com acompanhamento",
      price: "490",
      period: "/mês",
      features: [
        "Acesso à academia em horário completo",
        "Avaliação física completa",
        "Protocolo individual personalizado",
        "4 sessões mensais com coach dedicado",
        "Acesso a todas as aulas em grupo",
        "App de acompanhamento com histórico",
        "Revisão de protocolo a cada 6 semanas",
        "Acesso prioritário em horário nobre",
      ],
      featured: true,
    },
    {
      badge: "Alto desempenho",
      title: "PLANO ELITE",
      subtitle: "Para quem não aceita menos que o máximo",
      price: "890",
      period: "/mês",
      features: [
        "Acesso 24h à academia",
        "Avaliação física e funcional completa",
        "Protocolo de periodização avançada",
        "Acompanhamento ilimitado com coach",
        "Coach exclusivo para as suas sessões",
        "Análise de bioimpedância mensal",
        "Relatório de performance trimestral",
        "Área de recuperação VIP",
        "Estacionamento reservado",
      ],
    },
  ];

  return (
    <section ref={ref} className="relative py-32 bg-neutral-950" id="planos">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        {/* Section Header */}
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
              Escolha o plano que{" "}
              <span className="text-yellow-400">combina</span> com você
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-neutral-050 text-base max-w-md"
          >
            Todos os planos incluem avaliação física, protocolo individual e
            acesso a toda a estrutura da academia.
          </motion.p>
        </div>

        {/* Pricing Cards */}
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
              {/* Badge */}
              <div
                className={`absolute -top-3 left-8 px-4 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                  plan.featured
                    ? "bg-yellow-400 text-yellow-900"
                    : "bg-neutral-700 text-white"
                }`}
              >
                {plan.badge}
              </div>

              {/* Title */}
              <h3 className="font-display text-2xl font-black uppercase mb-2 text-white mt-4">
                {plan.title}
              </h3>

              {/* Subtitle */}
              <p className="text-neutral-300 text-sm mb-6">{plan.subtitle}</p>

              {/* Price */}
              <div className="flex items-end gap-2 mb-8 pb-6 border-b border-neutral-700">
                <span className="text-neutral-500 text-sm">A partir de</span>
                <span className="font-display text-5xl font-black text-white">
                  R$ {plan.price}
                </span>
                <span className="text-neutral-300 text-lg mb-2">
                  {plan.period}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-neutral-050 text-sm"
                  >
                    <span className="text-yellow-400 mt-1">→</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <motion.a
                href={CONTACT_SECTION_HREF}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`block w-full py-4 rounded font-bold uppercase text-sm tracking-wide transition-colors text-center ${
                  plan.featured
                    ? "bg-yellow-400 text-yellow-900 hover:bg-yellow-300"
                    : "bg-transparent border-2 border-neutral-700 text-white hover:border-yellow-400 hover:text-yellow-400"
                }`}
              >
                Escolher {plan.title.split(" ")[1]}
              </motion.a>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-center space-y-4"
        >
          <p className="text-neutral-500 text-sm max-w-3xl mx-auto">
            Todos os planos têm fidelidade mínima de 3 meses. Pagamento mensal,
            trimestral ou anual (com desconto). Matrículas abertas com vagas
            limitadas por turno.
          </p>
          <motion.a
            href={CONTACT_SECTION_HREF}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-transparent border-2 border-neutral-700 text-white px-8 py-3 rounded font-semibold uppercase text-sm tracking-wide hover:border-yellow-400 hover:text-yellow-400 transition-all mt-4"
          >
            Não sabe qual escolher? Falar com um especialista →
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
