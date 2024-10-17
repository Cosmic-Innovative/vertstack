// i18n.test.tsx
import React from 'react';
import { render, screen, expectTranslated } from './test-utils';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

const TestComponent: React.FC = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();

  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{t('home.description')}</p>
      <span data-testid="current-lang">{lang}</span>
    </div>
  );
};

describe('Internationalization', () => {
  it('renders content in the initial language', () => {
    render(<TestComponent />, { route: '/en' });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      expectTranslated('home.title', 'en'),
    );
  });

  it('changes language correctly', () => {
    render(<TestComponent />, { route: '/es' });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      expectTranslated('home.title', 'es'),
    );
  });

  it('handles routing with language prefixes', () => {
    render(<TestComponent />, { route: '/es' });
    expect(screen.getByTestId('current-lang')).toHaveTextContent('es');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      expectTranslated('home.title', 'es'),
    );
  });
});
