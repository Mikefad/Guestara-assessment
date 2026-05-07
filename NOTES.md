# Guestara Assessment Notes

## Design Decisions

The calendar uses `occupancyMap` as derived state instead of persisted state. Bookings and filters are the source of truth; occupancy can always be recomputed from them. This avoids synchronization bugs where the heatmap could drift from the visible booking list after filtering or data reloads.

`useMemo` is used for derived data that depends on bookings, filters, month, or selection. This keeps render logic predictable and avoids recomputing occupancy, visible calendar days, monthly stats, and selected booking overlaps on unrelated renders.

`checkOut` is exclusive because that matches hotel stay semantics: a guest checking out on a date no longer occupies the room that night. This also prevents off-by-one occupancy errors around checkout boundaries.

Overlap detection uses interval intersection:

```js
booking.checkIn < selectedEnd && booking.checkOut > selectedStart
```

This is the correct test for "any portion overlaps." It includes bookings that start before the selected range and end inside it, bookings that start inside the range and end after it, and bookings that fully span the range. It also excludes bookings that end exactly on the selected start or start exactly on the selected end.

## Open Scope Features Implemented

Filtering was added for room type, booking source, and booking status. These filters make the heatmap more operationally useful because a hotel team can isolate demand by room category, sales channel, or booking lifecycle.

The stats dashboard summarizes total bookings, total revenue, average occupancy, and most common room type for the visible month. These metrics give managers a quick month-level read before inspecting individual booking details.

## Edge Cases Handled

- Cancelled bookings are excluded from occupancy counts.
- Cross-month stays contribute occupancy to every occupied date, even outside the check-in month.
- Reverse drag selection is normalized before rendering and filtering.
- Invalid booking dates are ignored during data normalization.
- `checkIn` is inclusive and `checkOut` is exclusive.
- Bookings ending on the selected start boundary are excluded.
- Bookings starting on the selected end boundary are excluded.
- Single-day selections use a one-day exclusive end internally.
- Outside-month days remain visible and dimmed in the rectangular calendar grid.

## Tradeoffs

The implementation prioritizes correctness and explicit date handling over premature optimization. The dataset is small enough that deriving occupancy and stats in memory is simple, reliable, and easy to reason about.

The architecture is intentionally modest: component state tracks only user inputs and loaded data, while utilities handle booking normalization, date math, occupancy aggregation, and overlap checks. This keeps the app maintainable without introducing unnecessary state management libraries.

## Future Improvements

- Keyboard navigation for calendar cells
- Persisted filters and selected range
- Yearly or quarterly heatmap view
- Hover tooltips with compact daily booking summaries
- More complete accessibility improvements for drag selection and screen reader output
