import DayCell from './DayCell';
import { formatISODate, isDateWithinRange } from '../utils/date';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function OccupancyLegend() {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-stone-300/80">
      <span>Low occupancy</span>
      <div className="flex min-w-44 flex-1 items-center gap-2 sm:max-w-sm">
        <span className="h-3 w-3 rounded-full bg-[#050807] ring-1 ring-white/10" />
        <span className="h-3 w-3 rounded-full bg-emerald-950 ring-1 ring-emerald-200/20" />
        <span className="h-3 w-3 rounded-full bg-teal-600 ring-1 ring-teal-100/25" />
        <span className="h-3 w-3 rounded-full bg-amber-500 ring-1 ring-amber-100/35" />
        <span className="h-3 w-3 rounded-full bg-orange-600 ring-1 ring-orange-100/35" />
        <span className="h-3 w-3 rounded-full bg-gradient-to-br from-red-600 via-orange-500 to-amber-400 shadow-[0_0_16px_rgba(248,113,113,0.5)] ring-1 ring-amber-100/45" />
        <span className="h-px flex-1 bg-gradient-to-r from-white/5 via-amber-200/35 to-amber-200/70" />
      </div>
      <span>High occupancy</span>
    </div>
  );
}

export default function CalendarGrid({
  currentMonth,
  visibleDays,
  occupancyMap,
  selectedRange,
  today,
  onDayMouseDown,
  onDayMouseEnter,
}) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#071110]/80 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-6">
      <OccupancyLegend />
      <div className="overflow-x-auto pb-1">
        <div className="min-w-[680px]">
          <div className="mb-4 grid grid-cols-7 gap-2.5 sm:gap-3">
            {WEEKDAY_LABELS.map((label) => (
              <div
                key={label}
                className="px-1 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-400 sm:px-2 sm:text-xs sm:tracking-[0.35em]"
              >
                {label}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2.5 sm:gap-3">
            {visibleDays.map((day) => {
              const key = formatISODate(day);
              const occupancy = occupancyMap.get(key) ?? 0;
              const selection =
                selectedRange?.start && selectedRange?.end
                  ? {
                      start: selectedRange.start,
                      end: selectedRange.end,
                      isSelected: isDateWithinRange(day, selectedRange.start, selectedRange.end),
                    }
                  : null;

              return (
                <DayCell
                  key={key}
                  day={day}
                  currentMonth={currentMonth}
                  occupancy={occupancy}
                  selection={selection}
                  isToday={formatISODate(day) === formatISODate(today)}
                  onMouseDown={onDayMouseDown}
                  onMouseEnter={onDayMouseEnter}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
