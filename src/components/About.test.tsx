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

  it('renders all core principles', async () => {
    await render(<About />, { route: '/en/about' });

    const principles = ['speed', 'quality', 'types', 'modern'];

    for (const principle of principles) {
      const title = await expectTranslated(
        `about.principles.${principle}.title`,
        'en',
      );
      const description = await expectTranslated(
        `about.principles.${principle}.description`,
        'en',
      );

      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(description)).toBeInTheDocument();
    }
  });

  it('renders "Built For" sections', async () => {
    await render(<About />, { route: '/en/about' });

    const sections = ['teams', 'projects'];

    for (const section of sections) {
      const title = await expectTranslated(
        `about.builtFor.${section}.title`,
        'en',
      );
      const description = await expectTranslated(
        `about.builtFor.${section}.description`,
        'en',
      );

      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(description)).toBeInTheDocument();
    }
  });

  it('renders in Spanish when specified', async () => {
    await render(<About />, { route: '/es/about' });

    const title = await expectTranslated('about.title', 'es');
    const description = await expectTranslated('about.description', 'es');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title);
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('changes language dynamically', async () => {
    const { changeLanguage } = await render(<About />, {
      route: '/en/about',
    });

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

  it('maintains proper heading hierarchy', async () => {
    await render(<About />, { route: '/en/about' });

    const headings = screen.getAllByRole('heading');

    // Check main title
    expect(headings[0].tagName).toBe('H1');
    expect(headings[0]).toHaveTextContent(
      await expectTranslated('about.title', 'en'),
    );

    // Check section headings
    expect(
      screen.getByRole('heading', {
        name: await expectTranslated('about.principles.title', 'en'),
      }).tagName,
    ).toBe('H2');

    expect(
      screen.getByRole('heading', {
        name: await expectTranslated('about.builtFor.title', 'en'),
      }).tagName,
    ).toBe('H2');
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
    expect(contentWrapper).toHaveClass('max-w-2xl');
    expect(contentWrapper).toHaveClass('mx-auto');

    // Check heading container
    const titleContainer = screen.getByRole('heading', {
      level: 1,
    }).parentElement;
    expect(titleContainer).toHaveClass('text-center', 'mb-12');

    // Check grid layout for "Built For" section
    const builtForTitle = await expectTranslated('about.builtFor.title', 'en');
    screen
      .getByRole('heading', {
        name: builtForTitle,
      })
      .closest('div');

    const gridContainer = contentSection?.querySelector(
      '.grid.md\\:grid-cols-2',
    );
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass('grid', 'md:grid-cols-2', 'gap-6');
  });
});
