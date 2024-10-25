import { DateTimeFormatOptions } from './types';

export function formatDate(
  date: Date,
  locale: string,
  options?: DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
    ...options,
  }).format(date);
}

export function formatTime(
  date: Date,
  locale: string,
  options?: DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(locale, {
    timeStyle: 'medium',
    ...options,
  }).format(date);
}

export function formatRelativeTime(date: Date, locale: string): string {
  const now = new Date();
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  // Helper to clean time component for day comparison
  const stripTime = (d: Date): Date => {
    const clean = new Date(d);
    clean.setHours(0, 0, 0, 0);
    return clean;
  };

  // Get clean dates for day comparison
  const cleanNow = stripTime(now);
  const cleanDate = stripTime(date);
  const dayDiff = Math.floor(
    (cleanDate.getTime() - cleanNow.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Handle yesterday/tomorrow cases first
  if (dayDiff === 1) {
    return rtf.format(1, 'day');
  }
  if (dayDiff === -1) {
    return rtf.format(-1, 'day');
  }

  // Handle other time differences
  const abs = Math.abs(diffInSeconds);
  if (abs < 60) {
    return rtf.format(Math.floor(diffInSeconds), 'second');
  }
  if (abs < 3600) {
    return rtf.format(Math.floor(diffInSeconds / 60), 'minute');
  }
  if (abs < 86400) {
    return rtf.format(Math.floor(diffInSeconds / 3600), 'hour');
  }
  if (abs < 2592000) {
    return rtf.format(Math.floor(diffInSeconds / 86400), 'day');
  }
  if (abs < 31536000) {
    return rtf.format(Math.floor(diffInSeconds / 2592000), 'month');
  }
  return rtf.format(Math.floor(diffInSeconds / 31536000), 'year');
}
