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

  it('renders loading state initially', async () => {
    (api.fetchData as ReturnType<typeof vi.fn>).mockReturnValue(
      new Promise(() => {}),
    );
    render(<UserList />, { route: '/en' });
    expect(
      screen.getByText(expectTranslated('general.loading', 'en')),
    ).toBeInTheDocument();
  });

  it('renders user data after loading', async () => {
    const mockUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        company: { name: 'Company A' },
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        company: { name: 'Company B' },
      },
    ];

    (api.fetchData as ReturnType<typeof vi.fn>).mockResolvedValue(mockUsers);

    render(<UserList />, { route: '/en' });

    await waitFor(() => {
      expect(
        screen.queryByText(expectTranslated('general.loading', 'en')),
      ).not.toBeInTheDocument();
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Company B')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    (api.fetchData as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Failed to fetch'),
    );

    render(<UserList />, { route: '/en' });

    await waitFor(() => {
      expect(screen.getByText(/Error fetching user data/)).toBeInTheDocument();
    });
  });
});
