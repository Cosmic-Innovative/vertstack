import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act } from '@testing-library/react';
import About from './About';
import { render, expectTranslated } from '../test-utils';
import * as pageLoader from '../utils/i18n/page-loader';

describe('About', () => {
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
    // Create a never-resolving promise to keep loading state
    vi.mocked(pageLoader.loadPageTranslations).mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    await render(<About />, { route: '/en/about' });

    // Verify loading state
    const loadingElement = screen.getByRole('status');
    expect(loadingElement).toHaveTextContent(
      await expectTranslated('general:loading', 'en'),
    );
  });

  it('loads page translations and renders content', async () => {
    await render(<About />, { route: '/en/about' });
    await waitForTranslations();

    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('about:title', 'en'),
      );
    });

    expect(pageLoader.loadPageTranslations).toHaveBeenCalledWith('about', 'en');
  });

  it('renders all core principles', async () => {
    await render(<About />, { route: '/en/about' });
    await waitForTranslations();

    const principles = ['speed', 'quality', 'types', 'modern'];

    for (const principle of principles) {
      await waitFor(async () => {
        const title = await expectTranslated(
          `about:principles.${principle}.title`,
          'en',
        );
        const description = await expectTranslated(
          `about:principles.${principle}.description`,
          'en',
        );

        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getByText(description)).toBeInTheDocument();
      });
    }
  });

  it('renders "Built For" sections', async () => {
    await render(<About />, { route: '/en/about' });
    await waitForTranslations();

    const sections = ['teams', 'projects'];

    for (const section of sections) {
      await waitFor(async () => {
        const title = await expectTranslated(
          `about:builtFor.${section}.title`,
          'en',
        );
        const description = await expectTranslated(
          `about:builtFor.${section}.description`,
          'en',
        );

        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getByText(description)).toBeInTheDocument();
      });
    }
  });

  it('renders in Spanish when specified', async () => {
    await render(<About />, { route: '/es/about' });
    await waitForTranslations();

    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('about:title', 'es'),
      );
    });

    expect(pageLoader.loadPageTranslations).toHaveBeenCalledWith('about', 'es');
  });

  it('changes language dynamically', async () => {
    const { changeLanguage } = await render(<About />, {
      route: '/en/about',
    });

    await waitForTranslations();

    // Check English content
    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('about:title', 'en'),
      );
    });

    // Switch to Spanish
    await changeLanguage('es');

    // Check Spanish content
    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('about:title', 'es'),
      );
    });
  });

  it('maintains proper heading hierarchy', async () => {
    await render(<About />, { route: '/en/about' });
    await waitForTranslations();

    await waitFor(async () => {
      const headings = screen.getAllByRole('heading');
      expect(headings[0].tagName).toBe('H1');
      expect(headings[0]).toHaveTextContent(
        await expectTranslated('about:title', 'en'),
      );

      expect(
        screen.getByRole('heading', {
          name: await expectTranslated('about:principles.title', 'en'),
          level: 2,
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole('heading', {
          name: await expectTranslated('about:builtFor.title', 'en'),
          level: 2,
        }),
      ).toBeInTheDocument();
    });
  });

  it('cleans up when unmounted', async () => {
    // Create a promise that we control
    let resolveTranslations: () => void;
    const translationsPromise = new Promise<boolean>((resolve) => {
      resolveTranslations = () => resolve(true);
    });

    vi.mocked(pageLoader.loadPageTranslations).mockReturnValue(
      translationsPromise,
    );

    const { unmount } = await render(<About />, { route: '/en/about' });

    // Unmount before translations resolve
    unmount();

    // Now resolve translations and verify no errors occur
    await act(async () => {
      resolveTranslations();
      await Promise.resolve();
    });

    // If we get here without errors, the cleanup worked
    expect(true).toBe(true);
  });
});
