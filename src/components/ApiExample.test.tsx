import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ApiExample from './ApiExample';
import * as api from '../utils/api';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n.mock';

vi.mock('../utils/api', () => ({
  fetchData: vi.fn(() => new Promise(() => {})),
  sanitizeInput: vi.fn((input) => input),
}));

const renderWithI18n = (component: React.ReactElement) => {
  return render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>);
};

describe('ApiExample', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', async () => {
    await act(async () => {
      renderWithI18n(<ApiExample />);
    });
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('has proper heading structure', async () => {
    await act(async () => {
      renderWithI18n(<ApiExample />);
    });
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('contains informative content', async () => {
    await act(async () => {
      renderWithI18n(<ApiExample />);
    });
    expect(screen.getByText('API Integration Example')).toBeInTheDocument();
  });

  it('shows loading state initially', async () => {
    await act(async () => {
      renderWithI18n(<ApiExample />);
    });
    expect(screen.getByText('Loading user data...')).toBeInTheDocument();
  });

  it('renders user data after loading', async () => {
    const mockUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        company: { name: 'Company A' },
      },
    ];

    (api.fetchData as ReturnType<typeof vi.fn>).mockResolvedValue(mockUsers);

    renderWithI18n(<ApiExample />);

    await waitFor(() => {
      expect(
        screen.queryByText('Loading user data...'),
      ).not.toBeInTheDocument();
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    (api.fetchData as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Failed to fetch'),
    );

    renderWithI18n(<ApiExample />);

    await waitFor(() => {
      expect(screen.getByText(/Error fetching user data/)).toBeInTheDocument();
    });
  });
});
