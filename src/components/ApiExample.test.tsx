import React from 'react';
import { render, screen, expectTranslated, waitFor, act } from '../test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ApiExample from './ApiExample';
import * as api from '../utils/api';

vi.mock('../utils/api', () => ({
  fetchData: vi.fn(() => Promise.resolve([])),
  sanitizeInput: vi.fn((input) => input),
}));

describe('ApiExample', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (api.fetchData as ReturnType<typeof vi.fn>).mockImplementation(() =>
      Promise.resolve([]),
    );
  });

  it('renders in English by default', async () => {
    await act(async () => {
      render(<ApiExample />, { route: '/en/api-example' });
    });
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        expectTranslated('apiExample.title', 'en'),
      );
      expect(
        screen.getByText(expectTranslated('apiExample.description', 'en')),
      ).toBeInTheDocument();
    });
    expect(api.fetchData).toHaveBeenCalled();
  });

  it('renders in Spanish when specified', async () => {
    await act(async () => {
      render(<ApiExample />, { route: '/es/api-example' });
    });
    await screen.findByRole('heading', { level: 1 });
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        expectTranslated('apiExample.title', 'es'),
      );
    });
  });

  it('changes language dynamically', async () => {
    const { changeLanguage } = render(<ApiExample />, {
      route: '/en/api-example',
    });

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        expectTranslated('apiExample.title', 'en'),
      );
    });

    await act(async () => {
      await changeLanguage('es');
    });

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        expectTranslated('apiExample.title', 'es'),
      );
    });
    expect(api.fetchData).toHaveBeenCalled();
  });

  it('has proper heading structure', async () => {
    await act(async () => {
      render(<ApiExample />, { route: '/en/api-example' });
    });
    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H1');
    });
  });

  it('contains informative content', async () => {
    await act(async () => {
      render(<ApiExample />, { route: '/en/api-example' });
    });
    await waitFor(() => {
      expect(
        screen.getByText(expectTranslated('apiExample.description', 'en')),
      ).toBeInTheDocument();
    });
  });

  it('displays loading state and then user data', async () => {
    const mockUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        company: { name: 'Company A' },
      },
    ];

    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (api.fetchData as ReturnType<typeof vi.fn>).mockReturnValue(promise);

    await act(async () => {
      render(<ApiExample />, { route: '/en/api-example' });
    });

    expect(
      screen.getByText(expectTranslated('general.loading', 'en')),
    ).toBeInTheDocument();

    await act(async () => {
      resolvePromise(mockUsers);
    });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    expect(
      screen.queryByText(expectTranslated('general.loading', 'en')),
    ).not.toBeInTheDocument();
  });

  it('handles error state', async () => {
    (api.fetchData as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Failed to fetch'),
    );

    await act(async () => {
      render(<ApiExample />, { route: '/en/api-example' });
    });

    await waitFor(() => {
      expect(screen.getByText(/Error fetching user data/)).toBeInTheDocument();
    });
  });
});
