import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act } from '@testing-library/react';
import Home from './Home';
import { render, expectTranslated } from '../test-utils';
import * as pageLoader from '../utils/i18n/page-loader';

vi.mock('./OptimizedHeroImage', () => ({
  default: ({ alt, className }: { alt: string; className: string }) => (
    <img data-testid="hero-image" alt={alt} className={className} />
  ),
}));

describe('Home', () => {
  beforeEach(() => {
    vi.spyOn(pageLoader, 'loadPageTranslations').mockResolvedValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const waitForTranslations = async () => {
    await act(async () => {
      await Promise.resolve();
    });
  };

  it('renders loading state initially', async () => {
    vi.mocked(pageLoader.loadPageTranslations).mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    const { container } = await render(<Home />, { route: '/en' });
    expect(screen.queryByTestId('hero-image')).not.toBeInTheDocument();
    expect(container.querySelector('.hero-section')).toBeInTheDocument();
  });

  it('loads page translations and renders content', async () => {
    await render(<Home />, { route: '/en' });
    await waitForTranslations();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('home:foundation', 'en'),
    );
  });

  it('renders features section correctly', async () => {
    await render(<Home />, { route: '/en' });
    await waitForTranslations();

    const features = ['vite', 'eslint', 'react', 'typescript'];
    for (const feature of features) {
      expect(
        screen.getByText(
          await expectTranslated(`home:features.${feature}`, 'en'),
        ),
      ).toBeInTheDocument();
    }
  });

  it('renders call-to-action buttons with correct links', async () => {
    await render(<Home />, { route: '/en' });
    await waitForTranslations();

    const githubLink = screen.getByRole('link', {
      name: await expectTranslated('home:cta.githubAriaLabel', 'en'),
    });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/vertstack');
  });

  it('renders in Spanish when specified', async () => {
    await render(<Home />, { route: '/es' });
    await waitForTranslations();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('home:foundation', 'es'),
    );
  });

  it('changes language dynamically', async () => {
    const { changeLanguage } = await render(<Home />, { route: '/en' });

    // Check English content
    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('home:foundation', 'en'),
      );
    });

    // Switch to Spanish
    await changeLanguage('es');

    // Check Spanish content
    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('home:foundation', 'es'),
      );
    });
  });

  it('maintains proper document structure', async () => {
    await render(<Home />, { route: '/en' });
    await waitForTranslations();

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('aria-labelledby', 'home-title');
  });

  it('preserves visual styling and layout', async () => {
    await render(<Home />, { route: '/en' });
    await waitForTranslations();

    const contentSection = screen
      .getByRole('main')
      .querySelector('.content-section');
    expect(contentSection).toHaveClass('content-section');
  });
});
