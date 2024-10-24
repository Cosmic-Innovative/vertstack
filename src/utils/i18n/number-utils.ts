import { UnitType, NumberFormatOptions } from './types';

export function formatNumber(
  value: number,
  locale: string,
  options?: NumberFormatOptions,
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatCurrency(
  value: number,
  locale: string,
  currency: string = 'USD',
): string {
  return formatNumber(value, locale, {
    style: 'currency',
    currency,
  });
}

export function formatPercentage(
  value: number,
  locale: string,
  minimumFractionDigits: number = 1,
): string {
  return formatNumber(value, locale, {
    style: 'percent',
    minimumFractionDigits,
  });
}

export function formatCompactNumber(value: number, locale: string): string {
  return formatNumber(value, locale, {
    notation: 'compact',
  });
}

export function formatUnit(
  value: number,
  unit: UnitType,
  locale: string,
): string {
  return formatNumber(value, locale, {
    style: 'unit',
    unit,
  });
}
