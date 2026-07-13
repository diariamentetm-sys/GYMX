import { motion, useInView } from "motion/react";
import { useRef, useState, FormEvent } from "react";
import { Calendar, Mail, Phone, User } from "lucide-react";
import { FormInput } from "./FormInput";
import { FormSelect } from "./FormSelect";
import { CONTACT_SECTION_ID } from "../constants/anchors";

const planOptions = [
  { value: "", label: "Selecione um plano (opcional)" },
  { value: "livre", label: "Plano Livre" },
  { value: "plus", label: "Plano Plus" },
  { value: "elite", label: "Plano Elite" },
  { value: "indefinido", label: "Ainda não sei" },
];

const timeOptions = [
  { value: "", label: "Melhor horário para contato" },
  { value: "manha", label: "Manhã (8h – 12h)" },
  { value: "tarde", label: "Tarde (12h – 18h)" },
  { value: "noite", label: "Noite (18h – 21h)" },
  { value: "flexivel", label: "Horário flexível" },
];

export function ContactFormSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <section
      ref={ref}
      id={CONTACT_SECTION_ID}
      className="relative py-32 bg-neutral-950 scroll-mt-20"
    >
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="text-orange-500 text-xs font-semibold uppercase tracking-widest">
            Agende sua visita
          </div>
          <h2 className="text-5xl md:text-6xl font-black uppercase">
            Vamos conversar{" "}
            <span className="text-yellow-400">sem pressão</span>
          </h2>
          <p className="text-neutral-300 text-lg max-w-2xl mx-auto">
            Preencha o formulário e nossa equipe entra em contato em até 2 horas
            em dias úteis para agendar sua visita gratuita.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start"
        >
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-8">
              <h3 className="font-display text-xl font-bold uppercase text-white mb-6">
                O que esperar
              </h3>
              <ul className="space-y-4">
                {[
                  "Tour completo pela estrutura",
                  "Conversa com um coach sobre seus objetivos",
                  "Indicação de plano alinhado à sua rotina",
                  "Zero compromisso na visita",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-neutral-050 text-sm"
                  >
                    <span className="text-yellow-400 mt-0.5">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 text-neutral-300 text-sm">
              <p className="flex items-center gap-3">
                <Phone size={18} className="text-yellow-400 shrink-0" />
                +55 11 98765-4321
              </p>
              <p className="flex items-center gap-3">
                <Mail size={18} className="text-yellow-400 shrink-0" />
                contato@gymx.com.br
              </p>
              <p className="flex items-center gap-3">
                <Calendar size={18} className="text-yellow-400 shrink-0" />
                Seg–Sex, 6h às 22h · Sáb, 8h às 14h
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-md p-8 md:p-10 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Nome completo"
                  name="nome"
                  placeholder="Seu nome"
                  required
                />
                <FormInput
                  label="E-mail"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Telefone / WhatsApp"
                  name="telefone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  required
                />
                <FormSelect
                  label="Plano de interesse"
                  name="plano"
                  options={planOptions}
                />
              </div>

              <FormSelect
                label="Melhor horário para contato"
                name="horario"
                options={timeOptions}
                required
              />

              <div className="space-y-2">
                <label className="block text-neutral-300 text-xs font-semibold uppercase tracking-[0.1em]">
                  Mensagem (opcional)
                </label>
                <textarea
                  name="mensagem"
                  rows={4}
                  placeholder="Conte um pouco sobre seus objetivos ou dúvidas..."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-4 py-3.5 text-neutral-050 text-base placeholder:text-neutral-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all duration-300 hover:border-neutral-600 resize-none"
                />
              </div>

              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-yellow-400/10 border border-yellow-400/40 rounded-md px-4 py-3 text-yellow-400 text-sm font-medium"
                >
                  Mensagem enviada! Nossa equipe entrará em contato em breve.
                </motion.div>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-yellow-400 text-yellow-900 py-4 rounded font-bold uppercase text-sm tracking-wide hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
              >
                <User size={18} />
                Agendar minha visita gratuita
              </motion.button>

              <p className="text-neutral-500 text-xs text-center">
                Ao enviar, você concorda em ser contatado pela equipe GymX.
                Sem spam. Sem pressão.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
