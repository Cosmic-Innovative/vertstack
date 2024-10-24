export * from './types';
export * from './number-utils';
export * from './datetime-utils';
export * from './list-utils';

// Additional i18n utilities that don't fit in other categories
export function getDirection(locale: string): 'ltr' | 'rtl' {
  const rtlLocales = ['ar', 'fa', 'he', 'ur'];
  return rtlLocales.includes(locale) ? 'rtl' : 'ltr';
}

export function getLocaleName(locale: string, displayLocale: string): string {
  return (
    new Intl.DisplayNames([displayLocale], {
      type: 'language',
    }).of(locale) || locale
  );
}

export function getCurrencySymbol(currency: string, locale: string): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  });
  return formatter.format(0).replace(/[\d.,\s]/g, '');
}
