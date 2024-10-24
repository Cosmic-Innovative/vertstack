import React from 'react';
import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from './Home';
import { render, expectTranslated } from '../test-utils';

// Mock LazyImage component
vi.mock('./LazyImage', () => ({
  default: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className: string;
  }) => (
    <img src={src} alt={alt} className={className} data-testid="lazy-image" />
  ),
}));

describe('Home', () => {
  it('renders in English by default', async () => {
    await render(<Home />, { route: '/en' });

    const title = await expectTranslated('home.title', 'en');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title);

    const description = await expectTranslated('home.description', 'en');
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('renders in Spanish when specified', async () => {
    await render(<Home />, { route: '/es' });

    const title = await expectTranslated('home.title', 'es');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title);
  });

  it('changes language dynamically', async () => {
    const { changeLanguage } = await render(<Home />, { route: '/en' });

    const enTitle = await expectTranslated('home.title', 'en');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      enTitle,
    );

    await changeLanguage('es');

    const esTitle = await expectTranslated('home.title', 'es');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      esTitle,
    );
  });

  it('has proper heading structure', async () => {
    await render(<Home />, { route: '/en' });

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('renders LazyImage component with correct props', async () => {
    await render(<Home />, { route: '/en' });

    const lazyImage = screen.getByTestId('lazy-image');
    expect(lazyImage).toBeInTheDocument();
    expect(lazyImage).toHaveAttribute('src', '/vertstack.svg');

    const altText = await expectTranslated('home.logoAlt', 'en');
    expect(lazyImage).toHaveAttribute('alt', altText);
    expect(lazyImage).toHaveClass('inline-logo');
  });

  it('has accessible links', async () => {
    await render(<Home />, { route: '/en' });

    const ctaText = await expectTranslated('home.cta', 'en');
    const link = screen.getByText(ctaText);
    expect(link).toHaveAttribute('href', '/en/api-example');
    expect(link).toHaveClass('button-link');
  });

  it('contains informative content', async () => {
    await render(<Home />, { route: '/en' });

    const description = await expectTranslated('home.description', 'en');
    expect(screen.getByText(description)).toBeInTheDocument();
  });
});
