import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserList from './UserList';
import * as api from '../utils/api';
import { render, expectTranslated } from '../test-utils';

vi.mock('../utils/api', () => ({
  fetchData: vi.fn(),
  sanitizeInput: vi.fn((input) => input),
}));

describe('UserList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state with proper accessibility attributes', async () => {
    const loadingPromise = new Promise(() => {});
    (api.fetchData as ReturnType<typeof vi.fn>).mockReturnValue(loadingPromise);

    await render(<UserList />, { route: '/en' });

    const loadingText = await expectTranslated('general.loading', 'en');
    const statusElement = screen.getByRole('status');

    expect(statusElement).toHaveTextContent(loadingText);
    expect(statusElement).toHaveClass('loading');
  });

  it('renders error state with proper accessibility attributes', async () => {
    const error = new Error('Failed to fetch');
    (api.fetchData as ReturnType<typeof vi.fn>).mockRejectedValue(error);

    await render(<UserList />, { route: '/en' });

    await waitFor(() => {
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toBeInTheDocument();
      expect(alertElement).toHaveTextContent(/Error fetching user data/);
    });
  });

  it('handles empty user list with proper accessibility', async () => {
    (api.fetchData as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    await render(<UserList />, { route: '/en' });

    await waitFor(async () => {
      const noUsersText = await expectTranslated('userList.noUsers', 'en');
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

  it('provides proper link labels for websites', async () => {
    const mockUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        company: { name: 'Company A', catchPhrase: 'Catch phrase' },
        website: 'example.com',
        phone: '123-456-7890',
      },
    ];

    (api.fetchData as ReturnType<typeof vi.fn>).mockResolvedValue(mockUsers);

    await render(<UserList />, { route: '/en' });

    await waitFor(() => {
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('aria-label');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
