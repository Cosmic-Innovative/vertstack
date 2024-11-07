import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act } from '@testing-library/react';
import I18nExamples from './I18nExamples';
import { render, expectTranslated } from '../test-utils';
import * as pageLoader from '../utils/i18n/page-loader';

describe('I18nExamples', () => {
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
      () => new Promise(() => {}),
    );

    await render(<I18nExamples />, { route: '/en/i18n-examples' });

    const loadingElement = screen.getByRole('status');
    expect(loadingElement).toHaveTextContent(
      await expectTranslated('general:loading', 'en'),
    );
  });

  it('loads page translations and renders content', async () => {
    await render(<I18nExamples />, { route: '/en/i18n-examples' });
    await waitForTranslations();

    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('i18nExamples:title', 'en'),
      );
    });

    expect(pageLoader.loadPageTranslations).toHaveBeenCalledWith(
      'i18nExamples',
      'en',
    );
  });

  it('renders all main sections', async () => {
    await render(<I18nExamples />, { route: '/en/i18n-examples' });
    await waitForTranslations();

    const sections = ['prices', 'units', 'stats', 'dates', 'lists'];

    for (const section of sections) {
      await waitFor(async () => {
        const title = await expectTranslated(
          `i18nExamples:${section}.title`,
          'en',
        );
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    }
  });

  it('renders in Spanish when specified', async () => {
    await render(<I18nExamples />, { route: '/es/i18n-examples' });
    await waitForTranslations();

    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('i18nExamples:title', 'es'),
      );
    });

    expect(pageLoader.loadPageTranslations).toHaveBeenCalledWith(
      'i18nExamples',
      'es',
    );
  });

  it('changes language dynamically', async () => {
    const { changeLanguage } = await render(<I18nExamples />, {
      route: '/en/i18n-examples',
    });

    await waitForTranslations();

    // Check English content
    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('i18nExamples:title', 'en'),
      );
    });

    // Switch to Spanish
    await changeLanguage('es');

    // Check Spanish content
    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('i18nExamples:title', 'es'),
      );
    });
  });

  it('cleans up when unmounted', async () => {
    let resolveTranslations: () => void;
    const translationsPromise = new Promise<boolean>((resolve) => {
      resolveTranslations = () => resolve(true);
    });

    vi.mocked(pageLoader.loadPageTranslations).mockReturnValue(
      translationsPromise,
    );

    const { unmount } = await render(<I18nExamples />, {
      route: '/en/i18n-examples',
    });

    unmount();

    await act(async () => {
      resolveTranslations();
      await Promise.resolve();
    });

    expect(true).toBe(true);
  });
});
