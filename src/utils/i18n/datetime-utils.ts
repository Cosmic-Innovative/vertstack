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

  const getUnitAndValue = (
    seconds: number,
  ): [number, Intl.RelativeTimeFormatUnit] => {
    const abs = Math.abs(seconds);
    if (abs < 60) return [seconds, 'second'];
    if (abs < 3600) return [Math.floor(seconds / 60), 'minute'];
    if (abs < 86400) return [Math.floor(seconds / 3600), 'hour'];
    if (abs < 2592000) return [Math.floor(seconds / 86400), 'day'];
    if (abs < 31536000) return [Math.floor(seconds / 2592000), 'month'];
    return [Math.floor(seconds / 31536000), 'year'];
  };

  const [value, unit] = getUnitAndValue(diffInSeconds);
  return rtf.format(value, unit);
}
