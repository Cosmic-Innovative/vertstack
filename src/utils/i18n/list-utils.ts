export function formatList(
  items: string[],
  locale: string,
  type: 'conjunction' | 'disjunction' = 'conjunction',
): string {
  return new Intl.ListFormat(locale, { type }).format(items);
}
