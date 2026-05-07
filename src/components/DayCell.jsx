import { isSameDay } from '../utils/date';

function getHeatColor(occupiedRooms) {
  if (occupiedRooms <= 0) return 'bg-[#050807] text-stone-300/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]';
  if (occupiedRooms <= 2) return 'bg-emerald-950/90 text-emerald-50 shadow-[inset_0_1px_0_rgba(187,247,208,0.08)]';
  if (occupiedRooms <= 4) return 'bg-teal-700/85 text-white shadow-[0_0_18px_rgba(20,184,166,0.16),inset_0_1px_0_rgba(204,251,241,0.1)]';
  if (occupiedRooms <= 6) return 'bg-amber-500/85 text-stone-950 shadow-[0_0_22px_rgba(245,158,11,0.22),inset_0_1px_0_rgba(254,243,199,0.24)]';
  if (occupiedRooms <= 8) return 'bg-orange-600/90 text-white shadow-[0_0_30px_rgba(234,88,12,0.34),inset_0_1px_0_rgba(255,237,213,0.22)]';
  return 'bg-gradient-to-br from-red-600/95 via-orange-500/95 to-amber-400/95 text-white shadow-[0_0_38px_rgba(248,113,113,0.42),0_0_24px_rgba(251,191,36,0.26),inset_0_1px_0_rgba(255,255,255,0.28)]';
}

export default function DayCell({
  day,
  currentMonth,
  occupancy,
  selection,
  isToday,
  onMouseDown,
  onMouseEnter,
}) {
  const isCurrentMonth =
    day.getMonth() === currentMonth.getMonth() && day.getFullYear() === currentMonth.getFullYear();
  const isSelected = selection ? selection.isSelected : false;
  const isSelectionStart = selection ? isSameDay(day, selection.start) : false;
  const isSelectionEnd = selection ? isSameDay(day, selection.end) : false;
  const outsideMonthLabel = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(day);

  return (
    <button
      type="button"
      onMouseDown={() => onMouseDown(day)}
      onMouseEnter={() => onMouseEnter(day)}
      className={`group relative flex min-h-30 flex-col overflow-hidden rounded-3xl border p-3.5 text-left transition duration-200 ease-out hover:z-10 hover:-translate-y-0.5 hover:scale-[1.025] hover:shadow-[0_18px_42px_rgba(0,0,0,0.32),0_0_24px_rgba(251,191,36,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/75 sm:min-h-36 sm:p-4 ${
        isSelected
          ? 'border-amber-100/90 bg-blend-screen ring-2 ring-amber-200/50 shadow-[0_0_0_1px_rgba(255,247,237,0.24),0_0_34px_rgba(251,191,36,0.26),inset_0_0_28px_rgba(255,255,255,0.13)]'
          : 'border-white/10 hover:border-amber-200/55'
      } ${
        isCurrentMonth ? 'opacity-100' : 'opacity-45 hover:opacity-70'
      } ${getHeatColor(occupancy)} ${isSelectionStart || isSelectionEnd ? 'ring-2 ring-amber-100/80' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums sm:h-8 sm:w-8 sm:text-sm ${
            isToday ? 'bg-stone-950/75 text-amber-200 ring-1 ring-amber-300/70' : 'bg-black/24 text-current/85 ring-1 ring-white/8'
          }`}
        >
          {day.getDate()}
        </span>
        {!isCurrentMonth ? (
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-current/50">
            {outsideMonthLabel}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-3 text-center">
        <p className="text-4xl font-black leading-none tracking-normal tabular-nums sm:text-5xl">
          {occupancy}
        </p>
      </div>
      <div className="flex min-h-5 items-end justify-between gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-current/68">
        <span>{occupancy === 1 ? 'room' : 'rooms'}</span>
        <span className="translate-y-1 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
          select
        </span>
      </div>
    </button>
  );
}
