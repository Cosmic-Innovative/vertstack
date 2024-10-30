import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import About from './About';
import { render, expectTranslated } from '../test-utils';

describe('About', () => {
  it('renders with proper document structure', async () => {
    await render(<About />, { route: '/en/about' });

    // Check main landmark
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('aria-labelledby', 'about-title');

    // Check content section styling
    const contentSection = screen
      .getByRole('main')
      .querySelector('.content-section');
    expect(contentSection).toBeInTheDocument();
    expect(contentSection).toHaveClass('content-section');
  });

  it('renders correct content in English', async () => {
    await render(<About />, { route: '/en/about' });

    const title = await expectTranslated('about.title', 'en');
    const description = await expectTranslated('about.description', 'en');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title);
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('renders correct content in Spanish', async () => {
    await render(<About />, { route: '/es/about' });

    const title = await expectTranslated('about.title', 'es');
    const description = await expectTranslated('about.description', 'es');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title);
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('changes language dynamically', async () => {
    const { changeLanguage } = await render(<About />, { route: '/en/about' });

    // Check English content
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('about.title', 'en'),
    );

    // Switch to Spanish
    await changeLanguage('es');

    // Check Spanish content
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('about.title', 'es'),
    );
  });

  it('preserves visual styling and layout', async () => {
    await render(<About />, { route: '/en/about' });

    // Check container classes
    const contentSection = screen
      .getByRole('main')
      .querySelector('.content-section');
    expect(contentSection).toHaveClass('content-section');

    const contentWrapper = contentSection?.querySelector('.content-wrapper');
    expect(contentWrapper).toHaveClass('content-wrapper');

    // Check title container styling
    const titleContainer = screen.getByRole('heading', {
      level: 1,
    }).parentElement;
    expect(titleContainer).toHaveClass('title-container', 'h-24', 'mb-8');
  });

  it('maintains consistent text alignment', async () => {
    await render(<About />, { route: '/en/about' });

    const titleContainer = screen.getByRole('heading', {
      level: 1,
    }).parentElement;
    expect(titleContainer).toHaveClass(
      'flex',
      'items-center',
      'justify-center',
    );

    const descriptionSection = screen.getByText(
      await expectTranslated('about.description', 'en'),
    ).parentElement;
    expect(descriptionSection).toHaveClass('text-left');
  });

  it('renders with proper heading structure', async () => {
    await render(<About />, { route: '/en/about' });

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
    expect(heading).toHaveAttribute('id', 'about-title');
  });
});
