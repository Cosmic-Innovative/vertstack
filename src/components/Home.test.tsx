import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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
    expect(screen.getAllByRole('listitem')).toHaveLength(4); // Loading skeleton items
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders content after loading', async () => {
    await render(<Home />, { route: '/en' });

    // Fast-forward past loading state
    await vi.runAllTimersAsync();

    // Verify main content is rendered
    const title = await expectTranslated('home.title', 'en');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title);

    const description = await expectTranslated('home.description', 'en');
    expect(screen.getByText(description)).toBeInTheDocument();

    // Verify hero image is rendered
    expect(screen.getByTestId('hero-image')).toBeInTheDocument();
  });

  it('renders VERT features correctly', async () => {
    await render(<Home />, { route: '/en' });
    await vi.runAllTimersAsync();

    const featuresList = screen.getByRole('list');
    expect(featuresList).toHaveAttribute(
      'aria-label',
      await expectTranslated('home.features.title', 'en'),
    );

    // Check all features are rendered
    const features = ['vite', 'eslint', 'react', 'typescript'];
    for (const feature of features) {
      const featureText = await expectTranslated(
        `home.features.${feature}`,
        'en',
      );
      expect(screen.getByText(featureText)).toBeInTheDocument();
    }
  });

  it('handles language switching correctly', async () => {
    const { changeLanguage } = await render(<Home />, { route: '/en' });
    await vi.runAllTimersAsync();

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

  it('has correct link to API example', async () => {
    await render(<Home />, { route: '/en' });
    await vi.runAllTimersAsync();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/en/api-example');
    expect(link).toHaveAccessibleName(await expectTranslated('home.cta', 'en'));
  });

  it('has proper document structure and landmarks', async () => {
    await render(<Home />, { route: '/en' });
    await vi.runAllTimersAsync();

    // Check main landmark
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('aria-labelledby', 'home-title');

    // Check hero section
    const heroSection = screen.getByLabelText(
      await expectTranslated('home.heroAlt', 'en'),
    );
    expect(heroSection).toHaveClass('hero-section');

    // Check content section styling
    const contentSection = screen
      .getByRole('main')
      .querySelector('.content-section');
    expect(contentSection).toBeInTheDocument();
    expect(contentSection).toHaveClass('content-section');
  });

  it('preserves visual styling and layout', async () => {
    await render(<Home />, { route: '/en' });
    await vi.runAllTimersAsync();

    // Check container classes are preserved
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

  it('maintains consistent loading state duration', async () => {
    const { container } = await render(<Home />, { route: '/en' });

    // Check loading state
    expect(container.querySelectorAll('.animate-pulse')).not.toHaveLength(0);

    // Fast-forward 400ms - should still be loading
    await vi.advanceTimersByTimeAsync(400);
    expect(container.querySelectorAll('.animate-pulse')).not.toHaveLength(0);

    // Fast-forward remaining time - should be loaded
    await vi.advanceTimersByTimeAsync(100);
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(0);
  });

  it('renders images with proper attributes', async () => {
    await render(<Home />, { route: '/en' });
    await vi.runAllTimersAsync();

    const heroImage = screen.getByTestId('hero-image');
    expect(heroImage).toHaveAttribute(
      'alt',
      await expectTranslated('home.heroAlt', 'en'),
    );
    expect(heroImage).toHaveClass('w-full', 'h-full');

    const logo = screen.getByTestId('lazy-image');
    expect(logo).toHaveAttribute(
      'alt',
      await expectTranslated('home.logoAlt', 'en'),
    );
    expect(logo).toHaveClass('inline-logo');
  });
});
