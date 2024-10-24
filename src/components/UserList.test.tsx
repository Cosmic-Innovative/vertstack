import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserList from './UserList';
import * as api from '../utils/api';
import { render, actWithReturn, expectTranslated } from '../test-utils';

vi.mock('../utils/api', () => ({
  fetchData: vi.fn(),
  sanitizeInput: vi.fn((input) => input),
}));

describe('UserList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    const loadingPromise = new Promise(() => {});
    (api.fetchData as ReturnType<typeof vi.fn>).mockReturnValue(loadingPromise);

    await render(<UserList />, { route: '/en' });

    const loadingText = await expectTranslated('general.loading', 'en');
    expect(screen.getByText(loadingText)).toBeInTheDocument();
  });

  it('renders user data after loading', async () => {
    const mockUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        company: { name: 'Company A' },
        address: {
          street: '123 Main St',
          suite: 'Apt 4B',
          city: 'Boston',
          zipcode: '02108',
          geo: { lat: '42.3601', lng: '-71.0589' },
        },
      },
    ];

    const dataPromise = Promise.resolve(mockUsers);
    (api.fetchData as ReturnType<typeof vi.fn>).mockReturnValue(dataPromise);

    await render(<UserList />, { route: '/en' });
    await actWithReturn(async () => {
      await dataPromise;
    });

    const loadingText = await expectTranslated('general.loading', 'en');
    expect(screen.queryByText(loadingText)).not.toBeInTheDocument();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Company A')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    const error = new Error('Failed to fetch');
    (api.fetchData as ReturnType<typeof vi.fn>).mockRejectedValue(error);

    await render(<UserList />, { route: '/en' });

    await waitFor(() => {
      expect(screen.getByText(/Error fetching user data/)).toBeInTheDocument();
    });
  });
});
