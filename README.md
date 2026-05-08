# Guestara Occupancy Heatmap

Guestara Occupancy Heatmap is a React frontend assessment project for visualizing hotel room occupancy across a month-view calendar. It helps hotel operators quickly understand demand patterns, inspect booking overlap for selected ranges, and filter operational views without losing calendar context.

## Features

- Month-view calendar with visible previous/next month days
- Occupancy heatmap with checkout-exclusive stay calculation
- Multi-day drag range selection, including reverse and cross-month ranges
- Overlap-aware booking details panel for selected dates
- Filtering by room type, booking source, and status
- Dynamic monthly stats for bookings, revenue, average occupancy, and most common room type
- Edge-case handling for cancelled bookings, invalid dates, cross-month stays, and date-boundary overlap

## Tech Stack

- React
- Vite
- Tailwind CSS
- Local YYYY-MM-DD date utilities for timezone-safe calendar logic

## Setup

```bash
npm install
npm run dev
```

The development server runs on the Vite-provided local URL, typically `http://localhost:5173`.

## Build

```bash
npm run build
```

## Architecture Notes

Booking data is loaded from `public/bookings.json` at runtime and normalized before use. The app keeps raw bookings and user-selected filters as source state, while derived values such as `filteredBookings`, `occupancyMap`, visible calendar days, selected range normalization, overlapping bookings, and monthly stats are memoized with `useMemo`.

The occupancy map is derived from filtered bookings and keyed by `YYYY-MM-DD`. Stay dates follow hotel booking semantics: `checkIn` is inclusive and `checkOut` is exclusive. For example, `2026-02-10` to `2026-02-13` occupies February 10, 11, and 12, but not February 13.

Booking overlap uses true interval intersection:

```js
booking.checkIn < selectedEnd && booking.checkOut > selectedStart
```

This includes bookings that start before the selected range, end after it, or fully span it, while correctly excluding bookings that only touch the range boundary.

## Screenshots / Demo

Deployment URL: (https://guestara-assessment.vercel.app/)

Screenshots: <img width="949" height="365" alt="image" src="https://github.com/user-attachments/assets/9bc5f4c6-223c-4883-86ef-02ccc1fe1232" />

