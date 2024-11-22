# Formatting Guide

## Overview

The VERT Stack provides locale-aware formatting utilities that ensure consistent number, date, and text formatting across languages and regions. These utilities leverage the native `Intl` API for reliable localization.

## Key Features

- Number and currency formatting
- Date and time localization
- List formatting with language rules
- Unit conversion and formatting
- Built-in pluralization

## Number Formatting

### Basic Numbers

```typescript
const price = formatNumber(1234.56, 'en-US'); // "1,234.56"
const price_es = formatNumber(1234.56, 'es-ES'); // "1.234,56"
```

### Currencies

```typescript
const usd = formatCurrency(42.99, 'en-US', 'USD'); // "$42.99"
const eur = formatCurrency(42.99, 'es-ES', 'EUR'); // "42,99 €"
```

### Percentages

```typescript
const percent = formatPercentage(0.156, 'en-US'); // "15.6%"
const percent_es = formatPercentage(0.156, 'es-ES'); // "15,6 %"
```

## Date Formatting

### Standard Dates

```typescript
const date = new Date('2024-11-16');
formatDate(date, 'en-US'); // "11/16/2024"
formatDate(date, 'es-ES'); // "16/11/2024"
```

### Relative Time

```typescript
const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 3);
formatRelativeTime(futureDate, 'en-US'); // "in 3 days"
```

## Best Practices

### 1. Number Formatting

DO:

- Always use locale-aware formatters
- Specify currency codes explicitly
- Handle decimal places consistently
- Consider negative numbers

DON'T:

- Use string concatenation for numbers
- Assume decimal/thousand separators
- Hardcode currency symbols
- Ignore number systems

### 2. Date Formatting

DO:

- Use consistent date formats per locale
- Consider time zones when relevant
- Handle invalid dates gracefully
- Test with various locales

DON'T:

- Manipulate date strings manually
- Assume date part order
- Ignore time zone implications
- Use hardcoded date formats

### 3. Performance

DO:

- Cache formatter instances when possible
- Format numbers only when displaying
- Handle large datasets efficiently
- Monitor formatting performance

DON'T:

- Create new formatters unnecessarily
- Format in loops without caching
- Ignore memory implications
- Format unnecessarily during calculations

## Component Integration

### Price Display Component

```typescript
const PriceDisplay: React.FC<{ amount: number }> = ({ amount }) => {
  const { i18n } = useTranslation();

  return (
    <span className="price">
      {formatCurrency(amount, i18n.language, 'USD')}
    </span>
  );
};
```

### Date Display Component

```typescript
const DateDisplay: React.FC<{ date: Date }> = ({ date }) => {
  const { i18n } = useTranslation();

  return (
    <time dateTime={date.toISOString()}>{formatDate(date, i18n.language)}</time>
  );
};
```

## Testing

### Format Testing

```typescript
describe('Formatting utilities', () => {
  it('formats numbers consistently', () => {
    const number = 1234.56;

    expect(formatNumber(number, 'en-US')).toBe('1,234.56');

    expect(formatNumber(number, 'es-ES')).toBe('1.234,56');
  });

  it('handles invalid inputs gracefully', () => {
    expect(() => formatNumber(NaN, 'en-US')).not.toThrow();
  });
});
```

### Component Testing

```typescript
describe('PriceDisplay', () => {
  it('adapts to locale changes', async () => {
    const { changeLanguage } = render(<PriceDisplay amount={42.99} />);

    expect(screen.getByText('$42.99')).toBeInTheDocument();

    await changeLanguage('es');

    expect(screen.getByText('42,99 $')).toBeInTheDocument();
  });
});
```

## Common Issues

### 1. Inconsistent Formatting

- **Problem**: Numbers appear differently across the app
- **Solution**: Use formatting utilities consistently
- **Prevention**: Add eslint rules for number formatting

### 2. Performance Issues

- **Problem**: Slow rendering with many formatted values
- **Solution**: Cache formatter instances
- **Prevention**: Monitor formatting performance

### 3. Timezone Issues

- **Problem**: Dates show incorrectly in different timezones
- **Solution**: Use consistent timezone handling
- **Prevention**: Store and handle dates in UTC

## Advanced Usage

### Custom Number Formats

```typescript
const formatCompact = (number: number, locale: string) => {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number);
};

formatCompact(1234567, 'en-US'); // "1.2M"
```

### Customized Date Formats

```typescript
const formatDetailedDate = (date: Date, locale: string) => {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};
```

## Related Documentation

- [Translation Management](./translation-management.md)
- [Language Switching](./language-switching.md)
- [Performance Monitoring](../core-features/performance-monitoring.md)
