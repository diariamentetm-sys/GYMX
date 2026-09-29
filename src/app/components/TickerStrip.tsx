import { motion } from "motion/react";

export function TickerStrip() {
  const activities = [
    "FICHAS",
    "VIDEOAULAS",
    "ALUNOS",
    "PAR-Q",
    "PORTAL DO ALUNO",
    "CHECK-IN",
    "SEU MÉTODO",
    "SEU NOME",
  ];

  const tickerContent = [...activities, ...activities, ...activities];

  return (
    <div className="relative w-full overflow-hidden bg-orange-500 py-4">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {tickerContent.map((activity, index) => (
          <div key={`a-${index}`} className="flex items-center gap-8">
            <span className="font-display text-2xl md:text-3xl font-black text-neutral-950 uppercase tracking-tight">
              {activity}
            </span>
            <span className="text-neutral-950 text-xl">✦</span>
          </div>
        ))}
      </motion.div>

      <motion.div
        className="flex gap-8 whitespace-nowrap mt-2"
        animate={{ x: ["-33.333%", "0%"] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {tickerContent.map((activity, index) => (
          <div key={`b-${index}`} className="flex items-center gap-8">
            <span className="font-display text-2xl md:text-3xl font-black text-neutral-950 uppercase tracking-tight">
              {activity}
            </span>
            <span className="text-neutral-950 text-xl">✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
