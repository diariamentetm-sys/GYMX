import type { ClassModality, DayPeriod } from "../../types/class";
import {
  CLASS_MODALITY_LABELS,
  DAY_PERIOD_LABELS,
} from "../../constants/classes";
import type { ClassInstructor } from "../../types/class";

interface ClassFiltersBarProps {
  modality: ClassModality | "all";
  instructorId: string;
  period: DayPeriod;
  instructors: ClassInstructor[];
  onModalityChange: (value: ClassModality | "all") => void;
  onInstructorChange: (value: string) => void;
  onPeriodChange: (value: DayPeriod) => void;
}

const selectClass =
  "bg-neutral-900 border border-neutral-700 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:border-yellow-400/50";

export function ClassFiltersBar({
  modality,
  instructorId,
  period,
  instructors,
  onModalityChange,
  onInstructorChange,
  onPeriodChange,
}: ClassFiltersBarProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <select
        value={modality}
        onChange={(e) => onModalityChange(e.target.value as ClassModality | "all")}
        className={selectClass}
        aria-label="Filtrar por modalidade"
      >
        <option value="all">Todas modalidades</option>
        {(Object.keys(CLASS_MODALITY_LABELS) as ClassModality[]).map((key) => (
          <option key={key} value={key}>
            {CLASS_MODALITY_LABELS[key]}
          </option>
        ))}
      </select>

      <select
        value={instructorId}
        onChange={(e) => onInstructorChange(e.target.value)}
        className={selectClass}
        aria-label="Filtrar por instrutor"
      >
        <option value="all">Todos instrutores</option>
        {instructors.map((instructor) => (
          <option key={instructor.id} value={instructor.id}>
            {instructor.fullName}
          </option>
        ))}
      </select>

      <select
        value={period}
        onChange={(e) => onPeriodChange(e.target.value as DayPeriod)}
        className={selectClass}
        aria-label="Filtrar por período"
      >
        {(Object.keys(DAY_PERIOD_LABELS) as DayPeriod[]).map((key) => (
          <option key={key} value={key}>
            {DAY_PERIOD_LABELS[key]}
          </option>
        ))}
      </select>
    </div>
  );
}
