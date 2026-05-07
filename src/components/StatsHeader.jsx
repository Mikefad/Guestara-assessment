function StatCard({ label, value, tone }) {
  const toneClasses = {
    amber: 'from-amber-300/18 to-orange-400/10',
    teal: 'from-teal-300/16 to-cyan-400/8',
    rose: 'from-rose-300/18 to-red-400/10',
    slate: 'from-white/12 to-white/5',
  };

  return (
    <div
      className={`rounded-3xl border border-white/10 bg-gradient-to-br ${toneClasses[tone]} p-5 shadow-[0_18px_45px_rgba(0,0,0,0.16)]`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-300/70">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold text-stone-50">{value}</p>
    </div>
  );
}

export default function StatsHeader({ stats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total Bookings" value={stats.totalBookings} tone="amber" />
      <StatCard
        label="Total Revenue"
        value={new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        }).format(stats.totalRevenue)}
        tone="teal"
      />
      <StatCard
        label="Average Occupancy"
        value={`${stats.averageOccupancy.toFixed(1)} / 10`}
        tone="rose"
      />
      <StatCard label="Most Common Room" value={stats.mostCommonRoomType} tone="slate" />
    </div>
  );
}
