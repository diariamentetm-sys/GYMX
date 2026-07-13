import { motion } from "motion/react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  highlightWord?: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  eyebrow,
  title,
  highlightWord,
  description,
  align = "left",
}: SectionHeaderProps) {
  const alignmentClasses =
    align === "center" ? "text-center items-center" : "text-left items-start";

  const renderTitle = () => {
    if (!highlightWord) {
      return <h2 className="text-5xl md:text-6xl font-black uppercase">{title}</h2>;
    }

    const parts = title.split(highlightWord);
    return (
      <h2 className="text-5xl md:text-6xl font-black uppercase">
        {parts[0]}
        <span className="text-yellow-400">{highlightWord}</span>
        {parts[1]}
      </h2>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={`flex flex-col gap-4 mb-12 ${alignmentClasses}`}
    >
      {eyebrow && (
        <div className="flex items-center gap-3">
          {align === "center" && <span className="text-orange-500 text-lg">✦</span>}
          <span className="text-orange-500 text-xs font-semibold uppercase tracking-widest">
            {eyebrow}
          </span>
          {align === "center" && <span className="text-orange-500 text-lg">✦</span>}
        </div>
      )}

      {renderTitle()}

      {description && (
        <p className="text-neutral-050 text-base max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
