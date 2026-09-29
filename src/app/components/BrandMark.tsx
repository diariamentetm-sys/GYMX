import { BRAND_CORE, BRAND_NAME, BRAND_PREFIX } from "../constants/brand";

interface BrandMarkProps {
  className?: string;
  stacked?: boolean;
}

export function BrandMark({ className = "", stacked = false }: BrandMarkProps) {
  if (stacked) {
    return (
      <span
        className={`inline-flex flex-col font-display font-black uppercase tracking-tight leading-[0.85] ${className}`}
        aria-label={BRAND_NAME}
      >
        <span className="text-[0.42em] tracking-[0.2em] text-yellow-400">{BRAND_PREFIX}</span>
        <span className="text-white group-hover:text-yellow-400 transition-colors">{BRAND_CORE}</span>
      </span>
    );
  }

  return (
    <span
      className={`font-display font-black tracking-tight uppercase ${className}`}
      aria-label={BRAND_NAME}
    >
      <span className="text-yellow-400">{BRAND_PREFIX}</span>{" "}
      <span className="text-white group-hover:text-yellow-400 transition-colors">{BRAND_CORE}</span>
    </span>
  );
}
