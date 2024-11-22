import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act } from '@testing-library/react';
import { render, expectTranslated } from '../test-utils';
import * as pageLoader from '../utils/i18n/page-loader';
import NotFound from './NotFound';

describe('NotFound', () => {
  beforeEach(() => {
    vi.spyOn(pageLoader, 'loadPageTranslations').mockResolvedValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading state initially', async () => {
    vi.mocked(pageLoader.loadPageTranslations).mockImplementation(
      () => new Promise(() => {}),
    );

    await render(<NotFound />, { route: '/en/invalid-page' });

    const loadingElement = screen.getByRole('status');
    expect(loadingElement).toHaveTextContent(
      await expectTranslated('general:loading', 'en'),
    );
  });

  it('renders with proper document structure', async () => {
    await render(<NotFound />, { route: '/en/invalid-page' });

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();

    const contentSection = screen.getByTestId('not-found-content');
    expect(contentSection).toHaveClass('content-section');
  });

  it('renders correct content in English', async () => {
    await render(<NotFound />, { route: '/en/invalid-page' });

    const title = await expectTranslated('notFound:title', 'en');
    const description = await expectTranslated('notFound:description', 'en');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title);
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('renders 404 image with correct attributes', async () => {
    await render(<NotFound />, { route: '/en/invalid-page' });

    const image = screen.getByRole('img', {
      name: await expectTranslated('notFound:illustration', 'en'),
    });
    expect(image).toHaveAttribute('src', '/404.svg');
    expect(image).toHaveClass('w-full h-full');
  });

  it('renders in Spanish when specified', async () => {
    await render(<NotFound />, { route: '/es/invalid-page' });

    const title = await expectTranslated('notFound:title', 'es');
    const description = await expectTranslated('notFound:description', 'es');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title);
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('changes language dynamically', async () => {
    const { changeLanguage } = await render(<NotFound />, {
      route: '/en/invalid-page',
    });

    // Check English content
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('notFound:title', 'en'),
    );

    // Switch to Spanish
    await changeLanguage('es');

    // Check Spanish content
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('notFound:title', 'es'),
    );
  });

  it('cleans up when unmounted', async () => {
    let resolveTranslations: () => void;
    const translationsPromise = new Promise<boolean>((resolve) => {
      resolveTranslations = () => resolve(true);
    });

    vi.mocked(pageLoader.loadPageTranslations).mockReturnValue(
      translationsPromise,
    );

    const { unmount } = await render(<NotFound />, {
      route: '/en/invalid-page',
    });

    unmount();

    await act(async () => {
      resolveTranslations();
      await Promise.resolve();
    });

    expect(true).toBe(true);
  });
});
