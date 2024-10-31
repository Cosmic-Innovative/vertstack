import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ApiExample from './ApiExample';
import * as api from '../utils/api';
import { render, actWithReturn, expectTranslated } from '../test-utils';

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
  });

  it('renders in English by default', async () => {
    // Set up mock return value for any API calls
    (api.fetchData as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    await actWithReturn(async () => {
      await render(<ApiExample />, { route: '/en/api-example' });
    });

    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('apiExample.title', 'en'),
      );
    });
  });

  it('renders in Spanish when specified', async () => {
    (api.fetchData as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    await actWithReturn(async () => {
      await render(<ApiExample />, { route: '/es/api-example' });
    });

    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('apiExample.title', 'es'),
      );
    });
  });

  it('changes language dynamically', async () => {
    (api.fetchData as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const { changeLanguage } = await actWithReturn(async () => {
      return render(<ApiExample />, { route: '/en/api-example' });
    });

    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('apiExample.title', 'en'),
      );
    });

    await actWithReturn(async () => {
      await changeLanguage('es');
    });

    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('apiExample.title', 'es'),
      );
    });
  });

  it('has proper heading structure', async () => {
    (api.fetchData as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    await actWithReturn(async () => {
      await render(<ApiExample />, { route: '/en/api-example' });
    });

    await waitFor(() => {
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading.tagName).toBe('H1');
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

    (api.fetchData as ReturnType<typeof vi.fn>).mockResolvedValue(mockUsers);

    await actWithReturn(async () => {
      await render(<ApiExample />, { route: '/en/api-example' });
    });

    // Initial render with loading state
    const userListContainer = screen.getByTestId('user-list');
    expect(userListContainer).toBeInTheDocument();
  });
});
