function SelectField({ label, value, options, onChange }) {
  return (
    <label className="flex min-w-[180px] flex-1 flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-300/70">
        {label}
      </span>
      <select
        value={value}
        onChange={onChange}
        className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-stone-100 outline-none transition focus:border-amber-300/60"
      >
        <option value="all">All</option>
        {options.map((option) => (
          <option key={option} value={option} className="text-stone-950">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function FiltersBar({ filters, options, onFilterChange }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <SelectField
        label="Room Type"
        value={filters.roomType}
        options={options.roomTypes}
        onChange={(event) => onFilterChange('roomType', event.target.value)}
      />
      <SelectField
        label="Booking Source"
        value={filters.source}
        options={options.sources}
        onChange={(event) => onFilterChange('source', event.target.value)}
      />
      <SelectField
        label="Status"
        value={filters.status}
        options={options.statuses}
        onChange={(event) => onFilterChange('status', event.target.value)}
      />
    </div>
  );
}
