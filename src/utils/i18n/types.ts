export interface I18nConfig {
  defaultLocale: string;
  supportedLocales: string[];
  fallbackLocale: string;
}

export type UnitType =
  | 'mile'
  | 'kilometer'
  | 'meter'
  | 'centimeter'
  | 'millimeter'
  | 'celsius'
  | 'fahrenheit'
  | 'kilogram'
  | 'gram'
  | 'pound'
  | 'ounce'
  | 'liter'
  | 'milliliter'
  | 'gallon'
  | 'hour'
  | 'minute'
  | 'second'
  | 'byte'
  | 'kilobyte'
  | 'megabyte'
  | 'gigabyte';

export interface NumberFormatOptions extends Intl.NumberFormatOptions {
  unit?: UnitType;
}

export interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions {
  calendar?: 'gregory' | 'chinese' | 'japanese' | 'buddhist';
}
