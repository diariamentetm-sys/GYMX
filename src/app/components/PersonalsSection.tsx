import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { fetchListedPersonals } from "../services/personalDirectoryService";
import { personalPublicPath } from "../types/personal";
import { formatCurrency } from "../utils/subscriptionCalculations";
import type { PublicPersonalProfile } from "../types/personal";

function initialsFromName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function PersonalsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [personals, setPersonals] = useState<PublicPersonalProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListedPersonals().then((rows) => {
      setPersonals(rows);
      setLoading(false);
    });
  }, []);

  return (
    <section ref={ref} id="personais" className="relative py-24 md:py-32 bg-neutral-950">
      <div className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-12 md:mb-16 space-y-4"
        >
          <p className="text-orange-500 text-xs font-semibold uppercase tracking-widest">
            Personais
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white max-w-4xl">
            Escolha quem vai{" "}
            <span className="text-yellow-400">treinar você</span>
          </h2>
          <p className="text-neutral-300 text-base max-w-2xl">
            Cada profissional publica o próprio trabalho. Você entra na página,
            contrata pela plataforma e a mensalidade é cobrada todo mês.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : personals.length === 0 ? (
          <p className="text-neutral-500 text-sm">
            Nenhum personal listado no momento. Volte em breve.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {personals.map((personal, index) => (
              <motion.article
                key={personal.staffId}
                initial={{ opacity: 0, y: 28 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.08 * index }}
                className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 hover:border-yellow-400/50 rounded-md p-6 flex flex-col"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center overflow-hidden shrink-0">
                    {personal.photoUrl ? (
                      <img
                        src={personal.photoUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-yellow-400 font-bold">
                        {initialsFromName(personal.fullName)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-display font-black uppercase text-xl leading-tight">
                      {personal.fullName}
                    </h3>
                    {personal.cref ? (
                      <p className="text-neutral-500 text-xs mt-1">CREF {personal.cref}</p>
                    ) : null}
                  </div>
                </div>
                <p className="text-neutral-300 text-sm leading-relaxed flex-1 mb-4">
                  {personal.bio || personal.headline}
                </p>
                {personal.specialties.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {personal.specialties.slice(0, 4).map((item) => (
                      <span
                        key={item}
                        className="text-[10px] uppercase tracking-wider text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="flex items-end justify-between gap-3 mt-auto pt-4 border-t border-neutral-700">
                  <div>
                    <p className="text-neutral-500 text-[10px] uppercase tracking-widest">
                      Mensalidade
                    </p>
                    <p className="text-white font-display font-black text-2xl">
                      {formatCurrency(personal.studentMonthlyPrice)}
                      <span className="text-neutral-500 text-sm font-body font-medium">
                        /mês
                      </span>
                    </p>
                  </div>
                  <Link
                    to={personalPublicPath(personal.slug)}
                    className="bg-yellow-400 text-yellow-900 px-4 py-2.5 rounded font-bold uppercase text-xs tracking-wide hover:bg-yellow-300 transition-colors"
                  >
                    Ver trabalho
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
