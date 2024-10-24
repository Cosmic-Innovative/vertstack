import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Contact from './Contact';
import { render, expectTranslated } from '../test-utils';

describe('Contact', () => {
  it('renders in English by default', async () => {
    await render(<Contact />, { route: '/en/contact' });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('contact.title', 'en'),
    );
    expect(
      screen.getByText(await expectTranslated('contact.description', 'en')),
    ).toBeInTheDocument();
  });

  it('renders in Spanish when specified', async () => {
    await render(<Contact />, { route: '/es/contact' });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('contact.title', 'es'),
    );
  });

  it('changes language dynamically', async () => {
    const { changeLanguage } = await render(<Contact />, {
      route: '/en/contact',
    });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('contact.title', 'en'),
    );

    await changeLanguage('es');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('contact.title', 'es'),
    );
  });

  it('has proper heading structure', async () => {
    await render(<Contact />, { route: '/en/contact' });

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('contains informative content', async () => {
    await render(<Contact />, { route: '/en/contact' });

    expect(
      screen.getByText(await expectTranslated('contact.description', 'en')),
    ).toBeInTheDocument();
  });
});
