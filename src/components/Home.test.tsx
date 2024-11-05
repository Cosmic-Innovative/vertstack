import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import Home from './Home';
import { render, expectTranslated } from '../test-utils';

// Mock the OptimizedHeroImage and LazyImage components
vi.mock('./OptimizedHeroImage', () => ({
  default: ({ alt, className }: { alt: string; className: string }) => (
    <img data-testid="hero-image" alt={alt} className={className} />
  ),
}));

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
    <img data-testid="lazy-image" src={src} alt={alt} className={className} />
  ),
}));

describe('Home', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders loading state initially', async () => {
    const { container } = await render(<Home />, { route: '/en' });

    // Initially, hero image should not be present
    expect(
      screen.queryByRole('img', { name: /hero/i }),
    ).not.toBeInTheDocument();

    // Hero section should exist but be empty
    const heroSection = container.querySelector('.hero-section');
    expect(heroSection).toBeInTheDocument();
  });

  it('renders content after loading', async () => {
    const { container } = await render(<Home />, { route: '/en' });

    // Advance timers to complete loading
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    // Hero image should now be present
    const heroSection = container.querySelector('.hero-section');
    expect(heroSection).toBeInTheDocument();

    // Verify main content is rendered
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('home.foundation', 'en'),
    );
  });

  it('renders features section correctly', async () => {
    await render(<Home />, { route: '/en' });
    await act(async () => {
      vi.runAllTimers();
    });

    const features = ['vite', 'eslint', 'react', 'typescript'];

    for (const feature of features) {
      const title = await expectTranslated(`home.features.${feature}`, 'en');
      const description = await expectTranslated(
        `home.features.${feature}Desc`,
        'en',
      );

      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(description)).toBeInTheDocument();
    }
  });

  it('renders call-to-action buttons with correct links', async () => {
    await render(<Home />, { route: '/en' });

    // Advance timers to complete loading
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    const githubLink = screen.getByRole('link', {
      name: await expectTranslated('home.cta.githubAriaLabel', 'en'),
    });

    expect(githubLink).toHaveAttribute('href', 'https://github.com/vertstack');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders in Spanish when specified', async () => {
    await render(<Home />, { route: '/es' });

    // Advance timers to complete loading
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('home.foundation', 'es'),
    );
  });

  it('changes language dynamically', async () => {
    const { changeLanguage } = await render(<Home />, { route: '/en' });

    // Advance timers to complete loading
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    // Check English content
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('home.foundation', 'en'),
    );

    // Switch to Spanish
    await changeLanguage('es');

    // Check Spanish content
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('home.foundation', 'es'),
    );
  });

  it('maintains proper document structure', async () => {
    await render(<Home />, { route: '/en' });
    await act(async () => {
      vi.runAllTimers();
    });

    // Check main landmark
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('aria-labelledby', 'home-title');

    // Check hero section
    const heroSection = screen.getByLabelText(
      await expectTranslated('home.heroAlt', 'en'),
    );
    expect(heroSection).toHaveClass('hero-section');
  });

  it('preserves visual styling and layout', async () => {
    await render(<Home />, { route: '/en' });

    // Advance timers to complete loading
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    // Check container classes
    const contentSection = screen
      .getByRole('main')
      .querySelector('.content-section');
    expect(contentSection).toHaveClass('content-section');

    const contentWrapper = contentSection?.querySelector('.content-wrapper');
    expect(contentWrapper).toHaveClass(
      'content-wrapper',
      'max-w-2xl',
      'mx-auto',
    );

    // Check grid layout
    const grid = screen.getByRole('main').querySelector('.grid');
    expect(grid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-8');
  });
});
