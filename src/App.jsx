import { useEffect, useMemo, useRef, useState } from 'react';
import BookingPanel from './components/BookingPanel';
import CalendarGrid from './components/CalendarGrid';
import CalendarHeader from './components/CalendarHeader';
import FiltersBar from './components/FiltersBar';
import StatsHeader from './components/StatsHeader';
import {
  addDays,
  clampRange,
  formatISODate,
  generateDaysArray,
  getMonthRange,
  startOfDay,
} from './utils/date';
import {
  buildOccupancyMap,
  filterBookings,
  getBookingsOverlappingRange,
  getFilterOptions,
  getMonthStats,
  getRangeSelection,
  normalizeBooking,
} from './utils/bookings';

const INITIAL_FILTERS = {
  roomType: 'all',
  source: 'all',
  status: 'all',
};

export default function App() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentMonth, setCurrentMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedRange, setSelectedRange] = useState(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const dragAnchorRef = useRef(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function loadBookings() {
      try {
        setLoading(true);
        setError('');

        const response = await fetch('/bookings.json');
        if (!response.ok) {
          throw new Error(`Failed to load bookings (${response.status})`);
        }

        const payload = await response.json();
        const normalized = Array.isArray(payload)
          ? payload
              .map((booking, index) => normalizeBooking(booking, index))
              .filter(Boolean)
          : [];

        if (isMounted) {
          setBookings(normalized);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError instanceof Error ? fetchError.message : 'Unknown error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    function handleMouseUp() {
      isDraggingRef.current = false;
      dragAnchorRef.current = null;
    }

    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const filterOptions = useMemo(
    () => ({
      roomTypes: getFilterOptions(bookings, 'roomType'),
      sources: getFilterOptions(bookings, 'source'),
      statuses: getFilterOptions(bookings, 'status'),
    }),
    [bookings],
  );

  const filteredBookings = useMemo(() => filterBookings(bookings, filters), [bookings, filters]);
  const occupancyMap = useMemo(() => buildOccupancyMap(filteredBookings), [filteredBookings]);
  const visibleDays = useMemo(() => generateDaysArray(currentMonth), [currentMonth]);
  const normalizedSelection = useMemo(() => getRangeSelection(selectedRange), [selectedRange]);
  const overlappingBookings = useMemo(
    () => getBookingsOverlappingRange(filteredBookings, normalizedSelection),
    [filteredBookings, normalizedSelection],
  );
  const monthlyStats = useMemo(
    () => getMonthStats(filteredBookings, occupancyMap, currentMonth),
    [filteredBookings, occupancyMap, currentMonth],
  );

  function updateMonth(monthOffset) {
    setCurrentMonth((previous) => new Date(previous.getFullYear(), previous.getMonth() + monthOffset, 1));
  }

  function handleToday() {
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedRange({ start: today, end: today });
  }

  function handleFilterChange(key, value) {
    setFilters((currentFilters) => ({ ...currentFilters, [key]: value }));
  }

  function handleDayMouseDown(day) {
    const normalizedDay = startOfDay(day);
    isDraggingRef.current = true;
    dragAnchorRef.current = normalizedDay;
    setSelectedRange({ start: normalizedDay, end: normalizedDay });
  }

  function handleDayMouseEnter(day) {
    if (!isDraggingRef.current || !dragAnchorRef.current) {
      return;
    }

    setSelectedRange(clampRange(dragAnchorRef.current, day));
  }

  const monthContext = useMemo(() => {
    const { start, end } = getMonthRange(currentMonth);
    return {
      monthStart: formatISODate(start),
      monthEnd: formatISODate(addDays(end, -1)),
    };
  }, [currentMonth]);

  return (
    <main className="min-h-screen px-4 py-6 text-stone-100 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="rounded-[2rem] border border-white/10 bg-black/20 p-6 backdrop-blur-xl sm:p-8">
          <CalendarHeader
            currentMonth={currentMonth}
            onPreviousMonth={() => updateMonth(-1)}
            onNextMonth={() => updateMonth(1)}
            onToday={handleToday}
          />
          <div className="mt-6">
            <FiltersBar filters={filters} options={filterOptions} onFilterChange={handleFilterChange} />
          </div>
          <div className="mt-6">
            <StatsHeader stats={monthlyStats} />
          </div>
        </section>

        {loading ? (
          <section className="rounded-[2rem] border border-white/10 bg-black/20 p-8 text-center text-stone-200/85">
            Loading bookings...
          </section>
        ) : error ? (
          <section className="rounded-[2rem] border border-rose-300/20 bg-rose-500/8 p-8 text-center text-rose-100">
            {error}
          </section>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.8fr)]">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-stone-200/80">
                <span>
                  Visible month: {monthContext.monthStart} to {monthContext.monthEnd}
                </span>
                <span>
                  {filteredBookings.length} filtered booking{filteredBookings.length === 1 ? '' : 's'}
                </span>
              </div>
              <CalendarGrid
                currentMonth={currentMonth}
                visibleDays={visibleDays}
                occupancyMap={occupancyMap}
                selectedRange={normalizedSelection}
                today={today}
                onDayMouseDown={handleDayMouseDown}
                onDayMouseEnter={handleDayMouseEnter}
              />
            </div>
            <BookingPanel bookings={overlappingBookings} selectedRange={normalizedSelection} />
          </div>
        )}

        {!loading && !error && bookings.length === 0 ? (
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center text-stone-300/80">
            No valid bookings were found in <code>/public/bookings.json</code>.
          </section>
        ) : null}
      </div>
    </main>
  );
}
