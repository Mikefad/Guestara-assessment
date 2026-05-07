import { formatMonthLabel } from '../utils/date';

function ActionButton({ children, onClick, variant = 'ghost' }) {
  const variants = {
    ghost:
      'border border-white/12 bg-white/6 text-stone-100 hover:border-amber-300/40 hover:bg-white/10',
    accent:
      'border border-amber-400/40 bg-amber-300 text-stone-950 hover:bg-amber-200',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

export default function CalendarHeader({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
  onToday,
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200/70">
          Occupancy heatmap
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-50 md:text-5xl">
          {formatMonthLabel(currentMonth)}
        </h1>
      </div>
      <div className="flex flex-wrap gap-3">
        <ActionButton onClick={onPreviousMonth}>Previous</ActionButton>
        <ActionButton onClick={onToday} variant="accent">
          Today
        </ActionButton>
        <ActionButton onClick={onNextMonth}>Next</ActionButton>
      </div>
    </div>
  );
}
