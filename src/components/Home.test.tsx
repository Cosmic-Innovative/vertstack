import { render, screen, expectTranslated, act } from '../test-utils';
import { describe, it, expect, vi } from 'vitest';
import Home from './Home';

// Mock the LazyImage component
vi.mock('./LazyImage', () => ({
  default: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className: string;
  }) => (
    <img src={src} alt={alt} className={className} data-testid="lazy-image" />
  ),
}));

describe('Home', () => {
  it('renders in English by default', () => {
    render(<Home />, { route: '/en' });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      expectTranslated('home.title', 'en'),
    );
    expect(
      screen.getByText(expectTranslated('home.description', 'en')),
    ).toBeInTheDocument();
  });

  it('renders in Spanish when specified', async () => {
    await act(async () => {
      render(<Home />, { route: '/es' });
    });
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      expectTranslated('home.title', 'es'),
    );
  });

  it('changes language dynamically', async () => {
    const { changeLanguage } = render(<Home />, { route: '/en' });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      expectTranslated('home.title', 'en'),
    );

    await act(async () => {
      await changeLanguage('es');
    });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      expectTranslated('home.title', 'es'),
    );
  });

  it('has proper heading structure', () => {
    render(<Home />, { route: '/en' });
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('renders LazyImage component with correct props', () => {
    render(<Home />, { route: '/en' });
    const lazyImage = screen.getByTestId('lazy-image');
    expect(lazyImage).toBeInTheDocument();
    expect(lazyImage).toHaveAttribute('src', '/vertstack.svg');
    expect(lazyImage).toHaveAttribute(
      'alt',
      expectTranslated('home.logoAlt', 'en'),
    );
    expect(lazyImage).toHaveClass('inline-logo');
  });

  it('has accessible links', () => {
    render(<Home />, { route: '/en' });
    const link = screen.getByText(expectTranslated('home.cta', 'en'));
    expect(link).toHaveAttribute('href', '/en/api-example');
    expect(link).toHaveClass('button-link');
  });

  it('contains informative content', () => {
    render(<Home />, { route: '/en' });
    expect(
      screen.getByText(expectTranslated('home.description', 'en')),
    ).toBeInTheDocument();
  });
});
