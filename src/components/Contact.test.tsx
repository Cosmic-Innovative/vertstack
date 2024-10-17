import React from 'react';
import { render, screen, expectTranslated, act } from '../test-utils';
import { describe, it, expect } from 'vitest';
import Contact from './Contact';

describe('Contact', () => {
  it('renders in English by default', () => {
    render(<Contact />, { route: '/en/contact' });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      expectTranslated('contact.title', 'en'),
    );
    expect(
      screen.getByText(expectTranslated('contact.description', 'en')),
    ).toBeInTheDocument();
  });

  it('renders in Spanish when specified', async () => {
    await act(async () => {
      render(<Contact />, { route: '/es/contact' });
    });
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      expectTranslated('contact.title', 'es'),
    );
  });

  it('changes language dynamically', async () => {
    const { changeLanguage } = render(<Contact />, { route: '/en/contact' });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      expectTranslated('contact.title', 'en'),
    );

    await act(async () => {
      await changeLanguage('es');
    });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      expectTranslated('contact.title', 'es'),
    );
  });

  it('has proper heading structure', () => {
    render(<Contact />, { route: '/en/contact' });
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('contains informative content', () => {
    render(<Contact />, { route: '/en/contact' });
    expect(
      screen.getByText(expectTranslated('contact.description', 'en')),
    ).toBeInTheDocument();
  });
});
