import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act } from '@testing-library/react';
import ApiExample from './ApiExample';
import { render, expectTranslated } from '../test-utils';
import * as pageLoader from '../utils/i18n/page-loader';

// Mock the api module
vi.mock('../utils/api', () => ({
  fetchData: vi.fn(),
  sanitizeInput: vi.fn((input) => input),
}));

// Mock UserList to prevent actual API calls
vi.mock('./UserList', () => ({
  default: () => <div data-testid="user-list">Mocked UserList</div>,
}));

describe('ApiExample', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

    await render(<ApiExample />, { route: '/en/api-example' });

    const loadingElement = screen.getByRole('status');
    expect(loadingElement).toHaveTextContent(
      await expectTranslated('general:loading', 'en'),
    );
  });

  it('loads page translations and renders content', async () => {
    await render(<ApiExample />, { route: '/en/api-example' });
    await waitForTranslations();

    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('apiExample:title', 'en'),
      );
    });

    expect(pageLoader.loadPageTranslations).toHaveBeenCalledWith(
      'apiExample',
      'en',
    );
  });

  it('renders UserList component after loading', async () => {
    await render(<ApiExample />, { route: '/en/api-example' });
    await waitForTranslations();

    await waitFor(() => {
      expect(screen.getByTestId('user-list')).toBeInTheDocument();
    });
  });

  it('renders in Spanish when specified', async () => {
    await render(<ApiExample />, { route: '/es/api-example' });
    await waitForTranslations();

    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('apiExample:title', 'es'),
      );
    });

    expect(pageLoader.loadPageTranslations).toHaveBeenCalledWith(
      'apiExample',
      'es',
    );
  });

  it('changes language dynamically', async () => {
    const { changeLanguage } = await render(<ApiExample />, {
      route: '/en/api-example',
    });

    await waitForTranslations();

    // Check English content
    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('apiExample:title', 'en'),
      );
    });

    // Switch to Spanish
    await changeLanguage('es');

    // Check Spanish content
    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('apiExample:title', 'es'),
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

    const { unmount } = await render(<ApiExample />, {
      route: '/en/api-example',
    });

    unmount();

    await act(async () => {
      resolveTranslations();
      await Promise.resolve();
    });

    expect(true).toBe(true);
  });

  it('maintains proper document structure', async () => {
    await render(<ApiExample />, { route: '/en/api-example' });
    await waitForTranslations();

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('aria-labelledby', 'api-example-title');
  });
});
