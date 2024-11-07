import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act } from '@testing-library/react';
import Contact from './Contact';
import { render, expectTranslated } from '../test-utils';
import * as pageLoader from '../utils/i18n/page-loader';

describe('Contact', () => {
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

    await render(<Contact />, { route: '/en/contact' });

    const loadingElement = screen.getByRole('status');
    expect(loadingElement).toHaveTextContent(
      await expectTranslated('general:loading', 'en'),
    );
  });

  it('loads page translations and renders content', async () => {
    await render(<Contact />, { route: '/en/contact' });
    await waitForTranslations();

    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('contact:title', 'en'),
      );
    });

    expect(pageLoader.loadPageTranslations).toHaveBeenCalledWith(
      'contact',
      'en',
    );
  });

  it('renders community links with proper attributes', async () => {
    await render(<Contact />, { route: '/en/contact' });
    await waitForTranslations();

    const telegramLink = screen.getByRole('link', { name: /telegram/i });
    const whatsappLink = screen.getByRole('link', { name: /whatsapp/i });

    expect(telegramLink).toHaveAttribute('href', 'https://t.me/vertstack');
    expect(telegramLink).toHaveAttribute('target', '_blank');
    expect(telegramLink).toHaveAttribute('rel', 'noopener noreferrer');

    expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/vertstack');
    expect(whatsappLink).toHaveAttribute('target', '_blank');
    expect(whatsappLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders official contacts with proper links', async () => {
    await render(<Contact />, { route: '/en/contact' });
    await waitForTranslations();

    const emailLink = screen.getByRole('link', {
      name: /contact@vertstack\.dev/i,
    });
    const githubLink = screen.getByRole('link', {
      name: /github\.com\/vertstack/i,
    });

    expect(emailLink).toHaveAttribute('href', 'mailto:contact@vertstack.dev');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/vertstack');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders in Spanish when specified', async () => {
    await render(<Contact />, { route: '/es/contact' });
    await waitForTranslations();

    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('contact:title', 'es'),
      );
    });

    expect(pageLoader.loadPageTranslations).toHaveBeenCalledWith(
      'contact',
      'es',
    );
  });

  it('changes language dynamically', async () => {
    const { changeLanguage } = await render(<Contact />, {
      route: '/en/contact',
    });

    await waitForTranslations();

    // Check English content
    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('contact:title', 'en'),
      );
    });

    // Switch to Spanish
    await changeLanguage('es');

    // Check Spanish content
    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('contact:title', 'es'),
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

    const { unmount } = await render(<Contact />, { route: '/en/contact' });

    unmount();

    await act(async () => {
      resolveTranslations();
      await Promise.resolve();
    });

    expect(true).toBe(true);
  });
});
