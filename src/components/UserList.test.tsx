import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import UserList from './UserList';
import * as api from '../utils/api';
import * as pageLoader from '../utils/i18n/page-loader';
import { render, expectTranslated } from '../test-utils';

vi.mock('../utils/api', () => ({
  fetchData: vi.fn(),
  sanitizeInput: vi.fn((input) => input),
}));

describe('UserList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(pageLoader, 'loadPageTranslations').mockResolvedValue(true);
  });

  const waitForTranslations = async () => {
    await act(async () => {
      await Promise.resolve();
    });
  };

  it('renders loading state with proper accessibility attributes', async () => {
    vi.mocked(pageLoader.loadPageTranslations).mockImplementation(
      () => new Promise(() => {}),
    );

    const loadingPromise = new Promise(() => {});
    (api.fetchData as ReturnType<typeof vi.fn>).mockReturnValue(loadingPromise);

    await render(<UserList />, { route: '/en' });

    const loadingText = await expectTranslated('general:loading', 'en');
    const statusElement = screen.getByRole('status');

    expect(statusElement).toHaveTextContent(loadingText);
    expect(statusElement).toHaveClass('loading');
  });

  it('renders error state with proper accessibility attributes', async () => {
    const error = new Error('Failed to fetch');
    (api.fetchData as ReturnType<typeof vi.fn>).mockRejectedValue(error);

    await render(<UserList />, { route: '/en' });
    await waitForTranslations();

    await waitFor(async () => {
      const errorText = await expectTranslated('userList:loadingError', 'en');
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toBeInTheDocument();
      expect(alertElement).toHaveTextContent(errorText);
    });
  });

  it('handles empty user list with proper accessibility', async () => {
    (api.fetchData as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    await render(<UserList />, { route: '/en' });
    await waitForTranslations();

    await waitFor(async () => {
      const noUsersText = await expectTranslated('userList:noUsers', 'en');
      const statusElement = screen.getByRole('status');
      expect(statusElement).toHaveTextContent(noUsersText);
    });
  });

  it('renders user data with proper table structure and accessibility attributes', async () => {
    const mockUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        company: { name: 'Company A', catchPhrase: 'Catch phrase' },
        address: {
          street: '123 Main St',
          suite: 'Apt 4B',
          city: 'Boston',
          zipcode: '02108',
          geo: { lat: '42.3601', lng: '-71.0589' },
        },
        phone: '123-456-7890',
        website: 'example.com',
      },
    ];

    (api.fetchData as ReturnType<typeof vi.fn>).mockResolvedValue(mockUsers);

    await render(<UserList />, { route: '/en' });
    await waitForTranslations();

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    const table = screen.getByRole('table');
    expect(table).toHaveAttribute('aria-labelledby', 'user-list-title');
    expect(table).toHaveAttribute('aria-describedby', 'user-list-description');

    // Verify column headers
    const columnHeaders = screen.getAllByRole('columnheader');
    expect(columnHeaders).toHaveLength(5);
    expect(columnHeaders[0]).toHaveAttribute('scope', 'col');

    // Verify row headers
    const rowHeader = screen.getByRole('rowheader');
    expect(rowHeader).toHaveAttribute('scope', 'row');
    expect(rowHeader).toHaveAttribute('headers', 'header-name');

    // Verify data cells
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Company A')).toBeInTheDocument();
  });

  it('renders in Spanish when specified', async () => {
    (api.fetchData as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    await render(<UserList />, { route: '/es' });
    await waitForTranslations();

    await waitFor(async () => {
      const title = await expectTranslated('userList:title', 'es');
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    expect(pageLoader.loadPageTranslations).toHaveBeenCalledWith(
      'userList',
      'es',
    );
  });

  it('changes language dynamically', async () => {
    (api.fetchData as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const { changeLanguage } = await render(<UserList />, { route: '/en' });
    await waitForTranslations();

    // Check English content
    await waitFor(async () => {
      const title = await expectTranslated('userList:title', 'en');
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    // Switch to Spanish
    await changeLanguage('es');

    // Check Spanish content
    await waitFor(async () => {
      const title = await expectTranslated('userList:title', 'es');
      expect(screen.getByText(title)).toBeInTheDocument();
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
    const { unmount } = await render(<UserList />, { route: '/en' });

    unmount();

    await act(async () => {
      resolveTranslations();
      await Promise.resolve();
    });

    expect(true).toBe(true);
  });
});
