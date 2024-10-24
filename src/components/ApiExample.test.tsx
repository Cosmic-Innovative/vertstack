import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ApiExample from './ApiExample';
import * as api from '../utils/api';
import { render, actWithReturn, expectTranslated } from '../test-utils';

vi.mock('../utils/api', () => ({
  fetchData: vi.fn(),
  sanitizeInput: vi.fn((input) => input),
}));

describe('ApiExample', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (api.fetchData as ReturnType<typeof vi.fn>).mockResolvedValue([]);
  });

  it('renders in English by default', async () => {
    await render(<ApiExample />, { route: '/en/api-example' });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('apiExample.title', 'en'),
    );
    expect(
      screen.getByText(await expectTranslated('apiExample.description', 'en')),
    ).toBeInTheDocument();
  });

  it('renders in Spanish when specified', async () => {
    await render(<ApiExample />, { route: '/es/api-example' });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('apiExample.title', 'es'),
    );
  });

  it('changes language dynamically', async () => {
    const { changeLanguage } = await render(<ApiExample />, {
      route: '/en/api-example',
    });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('apiExample.title', 'en'),
    );

    await changeLanguage('es');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('apiExample.title', 'es'),
    );
  });

  it('has proper heading structure', async () => {
    await render(<ApiExample />, { route: '/en/api-example' });

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('displays loading state and then user data', async () => {
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

    let resolvePromise: (value: unknown) => void;
    const dataPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (api.fetchData as ReturnType<typeof vi.fn>).mockReturnValue(dataPromise);

    await render(<ApiExample />, { route: '/en/api-example' });

    expect(
      screen.getByText(await expectTranslated('general.loading', 'en')),
    ).toBeInTheDocument();

    await actWithReturn(async () => {
      resolvePromise!(mockUsers);
      await dataPromise;
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(
      screen.queryByText(await expectTranslated('general.loading', 'en')),
    ).not.toBeInTheDocument();
  });

  it('contains informative content', async () => {
    await render(<ApiExample />, { route: '/en/api-example' });

    expect(
      screen.getByText(await expectTranslated('apiExample.description', 'en')),
    ).toBeInTheDocument();
  });
});
