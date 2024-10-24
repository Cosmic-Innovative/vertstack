import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import About from './About';
import { render, expectTranslated } from '../test-utils';

describe('About', () => {
  it('renders in English by default', async () => {
    await render(<About />, { route: '/en/about' });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('about.title', 'en'),
    );
    expect(
      screen.getByText(await expectTranslated('about.description', 'en')),
    ).toBeInTheDocument();
  });

  it('renders in Spanish when specified', async () => {
    await render(<About />, { route: '/es/about' });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('about.title', 'es'),
    );
  });

  it('changes language dynamically', async () => {
    const { changeLanguage } = await render(<About />, { route: '/en/about' });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('about.title', 'en'),
    );

    await changeLanguage('es');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('about.title', 'es'),
    );
  });

  it('has proper heading structure', async () => {
    await render(<About />, { route: '/en/about' });

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('contains informative content', async () => {
    await render(<About />, { route: '/en/about' });

    expect(
      screen.getByText(await expectTranslated('about.description', 'en')),
    ).toBeInTheDocument();
  });
});
