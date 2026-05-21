const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;

/**
 * Format a date string or Date object to a relative time string (Indonesian).
 * formatDate("2026-05-21T10:00:00Z") → "2 jam yang lalu"
 */
export function formatDate(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  const now = Date.now();
  const diff = now - date.getTime();

  if (diff < MINUTE) return 'Baru saja';
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} menit yang lalu`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)} jam yang lalu`;
  if (diff < WEEK) return `${Math.floor(diff / DAY)} hari yang lalu`;
  if (diff < MONTH) return `${Math.floor(diff / WEEK)} minggu yang lalu`;

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format date to full Indonesian date string.
 * formatDateFull("2026-05-21") → "21 Mei 2026"
 */
export function formatDateFull(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
