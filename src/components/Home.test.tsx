import { screen, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Home from './Home';
import { render, expectTranslated } from '../test-utils';

// Mock the OptimizedHeroImage component
vi.mock('./OptimizedHeroImage', () => ({
  default: ({
    desktopSrc,
    alt,
    className,
    priority,
    'aria-labelledby': ariaLabelledby,
  }: {
    desktopSrc: string;
    alt: string;
    className: string;
    priority: boolean;
    'aria-labelledby': string;
  }) => (
    <img
      src={desktopSrc}
      alt={alt}
      className={className}
      data-testid="hero-image"
      data-priority={priority}
      aria-labelledby={ariaLabelledby}
    />
  ),
}));

// Mock LazyImage component
vi.mock('./LazyImage', () => ({
  default: ({
    src,
    alt,
    className,
    width,
    height,
  }: {
    src: string;
    alt: string;
    className: string;
    width: string;
    height: string;
  }) => (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      data-testid="lazy-image"
    />
  ),
}));

describe('Home Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Loading States', () => {
    it('shows loading state initially with proper ARIA attributes', async () => {
      const { container } = await render(<Home />, { route: '/en' });

      // Verify sections with loading states are properly marked
      const busySections = screen.getAllByRole('region', { busy: true });
      expect(busySections.length).toBeGreaterThan(0);

      // Verify loading skeletons
      const skeletonContainers =
        container.querySelectorAll('.loading-skeleton');
      expect(skeletonContainers.length).toBeGreaterThan(0);

      skeletonContainers.forEach((container) => {
        // Verify each skeleton container is hidden from screen readers
        expect(container).toHaveAttribute('aria-hidden', 'true');

        // Verify each container has pulse animations
        const pulseElements = container.querySelectorAll('.animate-pulse');
        expect(pulseElements.length).toBeGreaterThan(0);
      });
    });

    it('removes loading state after timeout', async () => {
      const { container } = await render(<Home />, { route: '/en' });

      // Fast-forward past loading state
      await vi.runAllTimersAsync();

      // Verify loading indicators are removed
      const loadingElements = container.querySelectorAll('.animate-pulse');
      expect(loadingElements).toHaveLength(0);
    });
  });

  describe('Accessibility', () => {
    it('has proper document structure with landmarks', async () => {
      await render(<Home />, { route: '/en' });
      await vi.runAllTimersAsync();

      // Verify main landmark
      const article = screen.getByRole('article');
      expect(article).toHaveAttribute('aria-labelledby', 'home-title');

      // Verify banner landmark
      const banner = screen.getByRole('banner');
      expect(banner).toBeInTheDocument();

      // Verify each section has proper labeling
      const sections = screen.getAllByRole('region');
      sections.forEach((section) => {
        expect(
          section.hasAttribute('aria-label') ||
            section.hasAttribute('aria-labelledby'),
        ).toBe(true);
      });
    });

    it('has proper heading structure', async () => {
      await render(<Home />, { route: '/en' });
      await vi.runAllTimersAsync();

      const headings = screen.getAllByRole('heading');
      expect(headings[0]).toHaveAttribute('id', 'home-title');

      // Verify heading levels
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent(await expectTranslated('home.title', 'en'));
    });

    it('provides proper image alternatives', async () => {
      await render(<Home />, { route: '/en' });
      await vi.runAllTimersAsync();

      const heroImage = screen.getByTestId('hero-image');
      expect(heroImage).toHaveAttribute(
        'alt',
        await expectTranslated('home.heroAlt', 'en'),
      );

      const logo = screen.getByTestId('lazy-image');
      expect(logo).toHaveAttribute(
        'alt',
        await expectTranslated('home.logoAlt', 'en'),
      );
    });

    it('has accessible link text', async () => {
      await render(<Home />, { route: '/en' });
      await vi.runAllTimersAsync();

      const ctaLink = screen.getByRole('link');
      expect(ctaLink).toHaveAttribute(
        'aria-label',
        await expectTranslated('home.ctaAriaLabel', 'en'),
      );
    });

    it('maintains proper focus management', async () => {
      await render(<Home />, { route: '/en' });
      await vi.runAllTimersAsync();

      const interactiveElements = screen.getAllByRole('link');
      interactiveElements.forEach((element) => {
        element.focus();
        expect(element).toHaveFocus();
      });
    });
  });

  describe('Features List', () => {
    it('renders features list with proper structure', async () => {
      await render(<Home />, { route: '/en' });
      await vi.runAllTimersAsync();

      const list = screen.getByRole('list');
      expect(list).toHaveAttribute(
        'aria-label',
        await expectTranslated('home.features.listLabel', 'en'),
      );

      const items = within(list).getAllByRole('listitem');
      expect(items).toHaveLength(4); // VERT has 4 features

      // Verify each feature is properly rendered
      const features = ['vite', 'eslint', 'react', 'typescript'];
      for (const feature of features) {
        const featureText = await expectTranslated(
          `home.features.${feature}`,
          'en',
        );
        expect(screen.getByText(featureText)).toBeInTheDocument();
      }
    });
  });

  describe('Internationalization', () => {
    it('renders in English by default', async () => {
      await render(<Home />, { route: '/en' });
      await vi.runAllTimersAsync();

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent(
        await expectTranslated('home.title', 'en'),
      );
    });

    it('renders in Spanish when specified', async () => {
      await render(<Home />, { route: '/es' });
      await vi.runAllTimersAsync();

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent(
        await expectTranslated('home.title', 'es'),
      );
    });

    it('updates content when language changes', async () => {
      const { changeLanguage } = await render(<Home />, { route: '/en' });
      await vi.runAllTimersAsync();

      // Verify initial English rendering
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('home.title', 'en'),
      );

      // Change language to Spanish
      await changeLanguage('es');

      // Verify Spanish rendering
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('home.title', 'es'),
      );
    });
  });

  describe('Performance', () => {
    it('lazy loads non-critical images', async () => {
      await render(<Home />, { route: '/en' });
      await vi.runAllTimersAsync();

      const lazyLoadedImage = screen.getByTestId('lazy-image');
      expect(lazyLoadedImage).toBeInTheDocument();
    });

    it('prioritizes hero image loading', async () => {
      await render(<Home />, { route: '/en' });
      await vi.runAllTimersAsync();

      const heroImage = screen.getByTestId('hero-image');
      expect(heroImage).toHaveAttribute('data-priority', 'true');
    });
  });
});
