import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import { render } from './test-utils';

// Mock the components
vi.mock('./components/Home', () => ({
  default: () => <div>Home Page</div>,
}));
vi.mock('./components/About', () => ({
  default: () => <div>About Page</div>,
}));
vi.mock('./components/Contact', () => ({
  default: () => <div>Contact Page</div>,
}));
vi.mock('./components/ApiExample', () => ({
  default: () => <div>API Example Page</div>,
}));

// Mock ErrorBoundary
vi.mock('./components/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('App', () => {
  it('renders navigation and home page', async () => {
    render(<App useRouter={false} />, { route: '/en' });

    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
      expect(screen.getByText('API Example')).toBeInTheDocument();
    });

    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('renders the navbar', async () => {
    render(<App useRouter={false} />, { route: '/en' });

    await waitFor(() => {
      const navElement = screen.getByRole('navigation');
      expect(navElement).toBeInTheDocument();
    });
  });

  it('renders the main container', async () => {
    render(<App useRouter={false} />, { route: '/en' });

    await waitFor(() => {
      const mainContainer = screen.getByRole('main');
      expect(mainContainer).toBeInTheDocument();
      expect(mainContainer).toHaveClass('container');
    });
  });
});
