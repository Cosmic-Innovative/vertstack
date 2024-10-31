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
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('renders loading state initially', async () => {
    await render(<Home />, { route: '/en' });

    expect(screen.queryByTestId('hero-image')).not.toBeInTheDocument();
    const loadingElements = screen
      .getAllByRole('generic')
      .filter((element) => element.classList.contains('animate-pulse'));
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('renders content after loading', async () => {
    await render(<Home />, { route: '/en' });

    // Fast-forward past loading state
    await act(async () => {
      vi.runAllTimers();
    });

    // Verify main content is rendered
    const title = await expectTranslated('home.title', 'en');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title);

    // Verify hero image is rendered
    expect(screen.getByTestId('hero-image')).toBeInTheDocument();
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
    await act(async () => {
      vi.runAllTimers();
    });

    const exploreButton = screen.getByRole('link', {
      name: await expectTranslated('home.cta.exploreAriaLabel', 'en'),
    });
    expect(exploreButton).toHaveAttribute('href', '/en/api-example');

    const githubButton = screen.getByRole('link', {
      name: await expectTranslated('home.cta.githubAriaLabel', 'en'),
    });
    expect(githubButton).toHaveAttribute(
      'href',
      'https://github.com/vertstack',
    );
    expect(githubButton).toHaveAttribute('target', '_blank');
    expect(githubButton).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders in Spanish when specified', async () => {
    await render(<Home />, { route: '/es' });
    await act(async () => {
      vi.runAllTimers();
    });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('home.title', 'es'),
    );
  });

  it('changes language dynamically', async () => {
    const { changeLanguage } = await render(<Home />, { route: '/en' });
    await act(async () => {
      vi.runAllTimers();
    });

    // Check English content
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('home.title', 'en'),
    );

    // Switch to Spanish
    await changeLanguage('es');

    // Check Spanish content
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('home.title', 'es'),
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
    await act(async () => {
      vi.runAllTimers();
    });

    // Check content section
    const contentSection = screen
      .getByRole('main')
      .querySelector('.content-section');
    expect(contentSection).toHaveClass('content-section');

    // Check content wrapper
    const contentWrapper = contentSection?.querySelector('.content-wrapper');
    expect(contentWrapper).toHaveClass(
      'content-wrapper',
      'max-w-2xl',
      'mx-auto',
    );

    // Check title container
    const titleContainer = screen.getByRole('heading', {
      level: 1,
    }).parentElement;
    expect(titleContainer).toHaveClass(
      'title-container',
      'text-center',
      'mb-12',
    );

    // Check features grid using a more reliable selector
    const features = contentSection?.querySelector('.grid');
    expect(features).toBeInTheDocument();
    expect(features).toHaveClass('grid', 'md:grid-cols-2', 'gap-8');

    // Check individual feature items
    const featureItems = screen
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.parentElement);
    featureItems.forEach((item) => {
      expect(item).toHaveClass('feature-item');
    });

    // Check CTA container
    const ctaSection = screen.getByRole('link', {
      name: await expectTranslated('home.cta.exploreAriaLabel', 'en'),
    }).parentElement;
    expect(ctaSection).toHaveClass('flex', 'justify-center', 'gap-4');
  });
});
