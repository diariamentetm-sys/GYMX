import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
}

export function InfoCard({ label, value, icon: Icon }: InfoCardProps) {
  return (
    <div className="bg-neutral-900/50 border border-neutral-700 rounded-md p-4">
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="text-neutral-500" size={14} />}
        <p className="text-neutral-500 text-xs uppercase tracking-wider font-semibold">
          {label}
        </p>
      </div>
      <p className="text-white font-semibold text-base">{value}</p>
    </div>
  );
}
