import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { render, expectTranslated } from '../test-utils';
import NotFound from './NotFound';

describe('NotFound', () => {
  it('renders with proper document structure', async () => {
    await render(<NotFound />, { route: '/en/invalid-page' });

    // Check main landmark
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();

    // Check content section using data-testid
    const contentSection = screen.getByTestId('not-found-content');
    expect(contentSection).toHaveClass('content-section');
  });

  it('renders correct content in English', async () => {
    await render(<NotFound />, { route: '/en/invalid-page' });

    const title = await expectTranslated('notFound.title', 'en');
    const description = await expectTranslated('notFound.description', 'en');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title);
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('renders 404 image with correct attributes', async () => {
    await render(<NotFound />, { route: '/en/invalid-page' });

    const image = screen.getByRole('img', {
      name: await expectTranslated('notFound.illustration', 'en'),
    });
    expect(image).toHaveAttribute('src', '/404.svg');
    expect(image).toHaveClass('w-full h-full');
  });

  it('renders in Spanish when specified', async () => {
    await render(<NotFound />, { route: '/es/invalid-page' });

    const title = await expectTranslated('notFound.title', 'es');
    const description = await expectTranslated('notFound.description', 'es');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title);
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('changes language dynamically', async () => {
    const { changeLanguage } = await render(<NotFound />, {
      route: '/en/invalid-page',
    });

    // Check English content
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('notFound.title', 'en'),
    );

    // Switch to Spanish
    await changeLanguage('es');

    // Check Spanish content
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('notFound.title', 'es'),
    );
  });
});
