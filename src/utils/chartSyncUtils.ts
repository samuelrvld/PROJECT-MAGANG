import type { Booking } from '../types';

export interface ChartDayPoint {
  x: number;
  y: number;
  val: number;
  count: number;
  label: string; // e.g. "8 Agu"
  fullDate: string; // e.g. "2025-08-08"
  bookingsCount: number;
}

export interface DynamicChartData {
  points: ChartDayPoint[];
  polylinePoints: string;
  polygonPoints: string;
  maxScale: number;
  yTicks: number[];
  averagePerDay: number;
  totalPeriod: number;
}

/**
 * Normalizes different date formats found in bookings (Indonesian text, ISO, etc.)
 */
export function parseBookingDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();

  // If YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    const [y, m, d] = trimmed.split('T')[0].split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  // Indonesian / English month mapping
  const months: Record<string, number> = {
    jan: 0, januari: 0, january: 0,
    feb: 1, februari: 1, february: 1,
    mar: 2, maret: 2, march: 2,
    apr: 3, april: 3,
    mei: 4, may: 4,
    jun: 5, juni: 5, june: 5,
    jul: 6, juli: 6, july: 6,
    agu: 7, agustus: 7, aug: 7, august: 7,
    sep: 8, september: 8,
    okt: 9, oktober: 9, oct: 9, october: 9,
    nov: 10, november: 10,
    des: 11, desember: 11, dec: 11, december: 11,
  };

  const parts = trimmed.split(/\s+/);
  if (parts.length >= 3) {
    const day = parseInt(parts[0], 10);
    const monKey = parts[1].toLowerCase().replace(/[^a-z]/g, '');
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && months[monKey] !== undefined && !isNaN(year)) {
      return new Date(year, months[monKey], day);
    }
  }

  const fallback = new Date(trimmed);
  return isNaN(fallback.getTime()) ? null : fallback;
}

export function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export function formatShortDay(d: Date): string {
  return `${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`;
}

/**
 * Computes 7-day visitor chart data dynamically from bookings.
 * Perfectly synchronizes with any new or modified bookings.
 */
export function getVisitorWeeklyChartData(
  bookings: Booking[],
  width = 500,
  height = 160,
  paddingX = 25,
  baselineY = 140,
  topY = 25
): DynamicChartData {
  // Find latest relevant date among bookings or current date
  const validDates: Date[] = [];
  bookings.forEach(b => {
    const d1 = parseBookingDate(b.tanggalKunjungan);
    if (d1) validDates.push(d1);
    const d2 = parseBookingDate(b.createdAt);
    if (d2) validDates.push(d2);
  });

  const now = new Date();
  validDates.push(now);

  // Reference date is the latest date among bookings or today
  let refDate = new Date(Math.max(...validDates.map(d => d.getTime())));
  if (isNaN(refDate.getTime())) {
    refDate = new Date();
  }

  // Generate 7 consecutive dates ending at refDate
  const days: { date: Date; key: string; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(refDate);
    d.setDate(refDate.getDate() - i);
    days.push({
      date: d,
      key: formatDateKey(d),
      label: formatShortDay(d),
    });
  }

  // Aggregate bookings per day
  const dayAggregates = days.map(d => {
    let visitorCount = 0;
    let bookingsCount = 0;

    bookings.forEach(b => {
      const bDate = parseBookingDate(b.tanggalKunjungan) || parseBookingDate(b.createdAt);
      if (bDate && formatDateKey(bDate) === d.key) {
        visitorCount += Number(b.jumlahOrang) || 1;
        bookingsCount += 1;
      }
    });

    return {
      ...d,
      val: visitorCount,
      bookingsCount,
    };
  });

  const totalPeriod = dayAggregates.reduce((acc, curr) => acc + curr.val, 0);
  const averagePerDay = Math.round(totalPeriod / 7);

  // Determine max scale for Y-axis (at least 10, with 20% headroom)
  const rawMax = Math.max(...dayAggregates.map(d => d.val), 5);
  // Round up to a pleasant multiple (e.g. 10, 20, 30...)
  const maxScale = Math.max(10, Math.ceil((rawMax * 1.25) / 5) * 5);

  const usableHeight = baselineY - topY;
  const usableWidth = width - (paddingX * 2);
  const stepX = usableWidth / (days.length - 1);

  const points: ChartDayPoint[] = dayAggregates.map((d, index) => {
    const x = Math.round(paddingX + (index * stepX));
    const ratio = Math.min(1, Math.max(0, d.val / maxScale));
    const y = Math.round(baselineY - (ratio * usableHeight));
    return {
      x,
      y,
      val: d.val,
      count: d.val,
      label: d.label,
      fullDate: d.key,
      bookingsCount: d.bookingsCount,
    };
  });

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');
  const polygonPoints = `${points[0].x},${baselineY} ${polylinePoints} ${points[points.length - 1].x},${baselineY}`;

  const yTicks = [
    maxScale,
    Math.round(maxScale * 0.75),
    Math.round(maxScale * 0.5),
    Math.round(maxScale * 0.25),
  ];

  return {
    points,
    polylinePoints,
    polygonPoints,
    maxScale,
    yTicks,
    averagePerDay,
    totalPeriod,
  };
}

/**
 * Computes financial / revenue chart data dynamically from bookings.
 */
export function getRevenueWeeklyChartData(
  bookings: Booking[],
  width = 500,
  height = 150,
  paddingX = 25,
  baselineY = 135,
  topY = 25
): DynamicChartData {
  const validDates: Date[] = [];
  bookings.forEach(b => {
    const d = parseBookingDate(b.tanggalPembayaran) || parseBookingDate(b.tanggalKunjungan) || parseBookingDate(b.createdAt);
    if (d) validDates.push(d);
  });
  validDates.push(new Date());

  let refDate = new Date(Math.max(...validDates.map(d => d.getTime())));
  if (isNaN(refDate.getTime())) refDate = new Date();

  const days: { date: Date; key: string; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(refDate);
    d.setDate(refDate.getDate() - i);
    days.push({
      date: d,
      key: formatDateKey(d),
      label: formatShortDay(d),
    });
  }

  const dayAggregates = days.map(d => {
    let revenue = 0;
    let count = 0;

    bookings.forEach(b => {
      // Count verified or non-rejected payments
      if (b.status !== 'Ditolak') {
        const bDate = parseBookingDate(b.tanggalPembayaran) || parseBookingDate(b.tanggalKunjungan) || parseBookingDate(b.createdAt);
        if (bDate && formatDateKey(bDate) === d.key) {
          revenue += Number(b.totalPembayaran) || 0;
          count += 1;
        }
      }
    });

    return {
      ...d,
      val: revenue,
      bookingsCount: count,
    };
  });

  const totalPeriod = dayAggregates.reduce((acc, curr) => acc + curr.val, 0);
  const averagePerDay = Math.round(totalPeriod / 7);

  const rawMax = Math.max(...dayAggregates.map(d => d.val), 20000);
  const maxScale = Math.max(50000, Math.ceil((rawMax * 1.2) / 10000) * 10000);

  const usableHeight = baselineY - topY;
  const usableWidth = width - (paddingX * 2);
  const stepX = usableWidth / (days.length - 1);

  const points: ChartDayPoint[] = dayAggregates.map((d, index) => {
    const x = Math.round(paddingX + (index * stepX));
    const ratio = Math.min(1, Math.max(0, d.val / maxScale));
    const y = Math.round(baselineY - (ratio * usableHeight));
    return {
      x,
      y,
      val: d.val,
      count: d.val,
      label: d.label,
      fullDate: d.key,
      bookingsCount: d.bookingsCount,
    };
  });

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');
  const polygonPoints = `${points[0].x},${baselineY} ${polylinePoints} ${points[points.length - 1].x},${baselineY}`;

  const yTicks = [
    maxScale,
    Math.round(maxScale * 0.75),
    Math.round(maxScale * 0.5),
    Math.round(maxScale * 0.25),
  ];

  return {
    points,
    polylinePoints,
    polygonPoints,
    maxScale,
    yTicks,
    averagePerDay,
    totalPeriod,
  };
}
