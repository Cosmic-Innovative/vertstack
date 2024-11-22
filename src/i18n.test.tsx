import React from 'react';
import { screen } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { render, expectTranslated } from './test-utils';

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
  it('renders content in the initial language', async () => {
    await render(<TestComponent />, { route: '/en' });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('home.title', 'en'),
    );
  });

  it('changes language correctly', async () => {
    await render(<TestComponent />, { route: '/es' });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('home.title', 'es'),
    );
  });

  it('handles routing with language prefixes', async () => {
    await render(<TestComponent />, { route: '/es' });

    expect(screen.getByTestId('current-lang')).toHaveTextContent('es');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('home.title', 'es'),
    );
  });
});
