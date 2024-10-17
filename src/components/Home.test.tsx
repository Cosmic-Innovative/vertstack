import React from 'react';
import { render, screen, expectTranslated, act } from '../test-utils';
import { describe, it, expect } from 'vitest';
import Home from './Home';

describe('Home', () => {
  it('renders in English by default', () => {
    render(<Home />, { route: '/en' });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      expectTranslated('home.title', 'en'),
    );
    expect(
      screen.getByText(expectTranslated('home.description', 'en')),
    ).toBeInTheDocument();
  });

  it('renders in Spanish when specified', async () => {
    await act(async () => {
      render(<Home />, { route: '/es' });
    });
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      expectTranslated('home.title', 'es'),
    );
  });

  it('changes language dynamically', async () => {
    const { changeLanguage } = render(<Home />, { route: '/en' });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      expectTranslated('home.title', 'en'),
    );

    await act(async () => {
      await changeLanguage('es');
    });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      expectTranslated('home.title', 'es'),
    );
  });

  it('has proper heading structure', () => {
    render(<Home />, { route: '/en' });
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('has accessible images', () => {
    render(<Home />, { route: '/en' });
    const images = screen.getAllByRole('img');
    images.forEach((img) => {
      expect(img).toHaveAttribute('alt');
    });
  });

  it('has accessible links', () => {
    render(<Home />, { route: '/en' });
    const link = screen.getByText(expectTranslated('home.cta', 'en'));
    expect(link).toHaveAttribute('href', '/en/api-example');
    expect(link).toHaveClass('button-link');
  });

  it('contains informative content', () => {
    render(<Home />, { route: '/en' });
    expect(
      screen.getByText(expectTranslated('home.description', 'en')),
    ).toBeInTheDocument();
  });
});
