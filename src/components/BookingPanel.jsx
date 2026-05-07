import { formatDisplayDate } from '../utils/date';

function EmptyState({ message }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-white/4 p-6 text-sm text-stone-300/80">
      {message}
    </div>
  );
}

function getStatusPillClass(status) {
  const normalizedStatus = String(status ?? '').trim().toLowerCase();

  if (normalizedStatus === 'confirmed') {
    return 'border-emerald-200/35 bg-emerald-300/14 text-emerald-50 shadow-[0_0_18px_rgba(16,185,129,0.12)]';
  }

  if (normalizedStatus === 'checked-in' || normalizedStatus === 'checked in' || normalizedStatus === 'checked_in') {
    return 'border-amber-200/45 bg-amber-300/18 text-amber-50 shadow-[0_0_18px_rgba(251,191,36,0.14)]';
  }

  if (normalizedStatus === 'checked-out' || normalizedStatus === 'checked out' || normalizedStatus === 'checked_out') {
    return 'border-sky-200/35 bg-sky-300/14 text-sky-50 shadow-[0_0_18px_rgba(56,189,248,0.12)]';
  }

  if (normalizedStatus === 'pending') {
    return 'border-violet-200/35 bg-violet-300/14 text-violet-50 shadow-[0_0_18px_rgba(167,139,250,0.12)]';
  }

  if (normalizedStatus === 'cancelled' || normalizedStatus === 'canceled') {
    return 'border-rose-200/35 bg-rose-400/14 text-rose-50 shadow-[0_0_18px_rgba(244,63,94,0.12)]';
  }

  return 'border-white/14 bg-white/8 text-stone-100';
}

export default function BookingPanel({ bookings, selectedRange }) {
  if (!selectedRange) {
    return (
      <aside className="rounded-[2rem] border border-white/10 bg-[#0b1716]/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/70">
            Booking details
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-stone-50">No selection yet</h2>
        </div>
        <EmptyState message="Select a day or drag across the calendar to inspect overlapping bookings." />
      </aside>
    );
  }

  return (
    <aside className="rounded-[2rem] border border-white/10 bg-[#0b1716]/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/70">
          Booking details
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-stone-50">
          {formatDisplayDate(selectedRange.start)} to {formatDisplayDate(selectedRange.end)}
        </h2>
      </div>

      {bookings.length === 0 ? (
        <EmptyState message="No bookings overlap the selected dates with the active filters." />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <article
              key={booking.id}
              className="rounded-3xl border border-white/10 bg-white/6 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition duration-200 hover:border-white/18 hover:bg-white/8 hover:shadow-[0_16px_34px_rgba(0,0,0,0.18)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-stone-50">{booking.guestName}</h3>
                  <p className="mt-1 text-sm text-stone-300/80">
                    Room {booking.roomNumber} <span className="text-stone-500">·</span> {booking.roomType}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] ${getStatusPillClass(booking.status)}`}
                >
                  {booking.status}
                </span>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 text-sm text-stone-200/90">
                <div className="space-y-1">
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Check in</dt>
                  <dd className="font-medium">{booking.checkIn}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Check out</dt>
                  <dd className="font-medium">{booking.checkOut}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Nights</dt>
                  <dd className="font-medium">{booking.nights}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Source</dt>
                  <dd className="font-medium">{booking.source}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </aside>
  );
}
