import { render, screen, expectTranslated, act } from '../test-utils';
import { describe, it, expect } from 'vitest';
import About from './About';

describe('About', () => {
  it('renders in English by default', () => {
    render(<About />, { route: '/en/about' });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      expectTranslated('about.title', 'en'),
    );
    expect(
      screen.getByText(expectTranslated('about.description', 'en')),
    ).toBeInTheDocument();
  });

  it('renders in Spanish when specified', async () => {
    await act(async () => {
      render(<About />, { route: '/es/about' });
    });
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      expectTranslated('about.title', 'es'),
    );
  });

  it('changes language dynamically', async () => {
    const { changeLanguage } = render(<About />, { route: '/en/about' });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      expectTranslated('about.title', 'en'),
    );

    await act(async () => {
      await changeLanguage('es');
    });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      expectTranslated('about.title', 'es'),
    );
  });

  it('has proper heading structure', () => {
    render(<About />, { route: '/en/about' });
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('contains informative content', () => {
    render(<About />, { route: '/en/about' });
    expect(
      screen.getByText(expectTranslated('about.description', 'en')),
    ).toBeInTheDocument();
  });
});
