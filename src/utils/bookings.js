import {
  addDays,
  clampRange,
  differenceInDays,
  formatISODate,
  parseISODate,
  startOfDay,
} from './date';

function normalizeComparableDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return startOfDay(value);
  }

  if (typeof value === 'string') {
    return parseISODate(value);
  }

  return null;
}

function normalizeStatus(status) {
  return String(status ?? '').trim().toLowerCase();
}

function isCancelledStatus(status) {
  const normalizedStatus = normalizeStatus(status);
  return normalizedStatus === 'cancelled' || normalizedStatus === 'canceled';
}

function getBookingStayRange(booking) {
  const checkIn = normalizeComparableDate(booking.checkInDate) ?? normalizeComparableDate(booking.checkIn);
  const checkOut = normalizeComparableDate(booking.checkOutDate) ?? normalizeComparableDate(booking.checkOut);

  if (!checkIn || !checkOut || checkOut.getTime() <= checkIn.getTime()) {
    return null;
  }

  return { checkIn, checkOut };
}

function rangesOverlap(stayRange, selectedRange) {
  return (
    stayRange.checkIn.getTime() < selectedRange.endExclusive.getTime() &&
    stayRange.checkOut.getTime() > selectedRange.start.getTime()
  );
}

export function normalizeBooking(rawBooking, index) {
  const checkInDate = parseISODate(rawBooking.checkIn);
  const checkOutDate = parseISODate(rawBooking.checkOut);

  if (!checkInDate || !checkOutDate || checkOutDate <= checkInDate) {
    return null;
  }

  return {
    ...rawBooking,
    id: rawBooking.id ?? `booking-${index}`,
    guestName: rawBooking.guestName ?? 'Unknown Guest',
    roomNumber: rawBooking.roomNumber ?? 'N/A',
    roomType: rawBooking.roomType ?? 'Unknown',
    source: rawBooking.source ?? 'Unknown',
    status: rawBooking.status ?? 'confirmed',
    revenue: Number(rawBooking.revenue ?? 0),
    checkInDate,
    checkOutDate,
    nights: differenceInDays(checkOutDate, checkInDate),
  };
}

export function getFilterOptions(bookings, key) {
  return [...new Set(bookings.map((booking) => booking[key]).filter(Boolean))].sort();
}

export function filterBookings(bookings, filters) {
  return bookings.filter((booking) => {
    const roomTypeMatch = filters.roomType === 'all' || booking.roomType === filters.roomType;
    const sourceMatch = filters.source === 'all' || booking.source === filters.source;
    const statusMatch = filters.status === 'all' || booking.status === filters.status;
    return roomTypeMatch && sourceMatch && statusMatch;
  });
}

export function buildOccupancyMap(bookings) {
  const occupancy = new Map();

  for (const booking of bookings) {
    if (isCancelledStatus(booking.status)) {
      continue;
    }

    const stayRange = getBookingStayRange(booking);
    if (!stayRange) {
      continue;
    }

    for (
      let cursor = stayRange.checkIn;
      cursor.getTime() < stayRange.checkOut.getTime();
      cursor = addDays(cursor, 1)
    ) {
      const key = formatISODate(cursor);
      occupancy.set(key, (occupancy.get(key) ?? 0) + 1);
    }
  }

  return occupancy;
}

export function getRangeSelection(selectedRange) {
  if (!selectedRange?.start || !selectedRange?.end) {
    return null;
  }

  const normalized = clampRange(selectedRange.start, selectedRange.end);
  return {
    start: normalized.start,
    end: normalized.end,
    endExclusive: addDays(normalized.end, 1),
  };
}

export function getBookingsOverlappingRange(bookings, selectedRange) {
  const normalizedSelection = getRangeSelection(selectedRange);
  if (!normalizedSelection) {
    return [];
  }

  return bookings.filter((booking) => {
    const stayRange = getBookingStayRange(booking);
    return stayRange ? rangesOverlap(stayRange, normalizedSelection) : false;
  });
}

export function getMonthStats(bookings, occupancyMap, monthDate) {
  const monthStart = startOfDay(new Date(monthDate.getFullYear(), monthDate.getMonth(), 1));
  const monthEnd = startOfDay(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1));
  const daysInMonth = differenceInDays(monthEnd, monthStart);
  const monthRange = {
    start: monthStart,
    end: addDays(monthEnd, -1),
    endExclusive: monthEnd,
  };

  const overlapping = getBookingsOverlappingRange(bookings, monthRange);

  const occupancySum = Array.from({ length: daysInMonth }, (_, index) => {
    const dayKey = formatISODate(addDays(monthStart, index));
    return occupancyMap.get(dayKey) ?? 0;
  }).reduce((sum, value) => sum + value, 0);

  const roomTypeCounts = overlapping.reduce((counts, booking) => {
    counts.set(booking.roomType, (counts.get(booking.roomType) ?? 0) + 1);
    return counts;
  }, new Map());

  let mostCommonRoomType = 'N/A';
  let highestCount = 0;
  for (const [roomType, count] of roomTypeCounts.entries()) {
    if (count > highestCount) {
      highestCount = count;
      mostCommonRoomType = roomType;
    }
  }

  return {
    totalBookings: overlapping.length,
    totalRevenue: overlapping.reduce((sum, booking) => sum + booking.revenue, 0),
    averageOccupancy: daysInMonth === 0 ? 0 : occupancySum / daysInMonth,
    mostCommonRoomType,
  };
}
