import React from 'react';
import { screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation and home page', async () => {
    render(<App useRouter={false} />, { route: '/en' });

    // Use findBy instead of getBy for async elements
    const homeLink = await screen.findByText('Home');
    const aboutLink = await screen.findByText('About');
    const contactLink = await screen.findByText('Contact');
    const apiLink = await screen.findByText('API Example');
    const homePage = await screen.findByText('Home Page');

    expect(homeLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();
    expect(contactLink).toBeInTheDocument();
    expect(apiLink).toBeInTheDocument();
    expect(homePage).toBeInTheDocument();
  });

  it('renders the navbar', async () => {
    render(<App useRouter={false} />);

    // Be specific about which navigation we want
    const navElement = await screen.findByRole('navigation', {
      name: 'accessibility.mainNavigation',
    });
    expect(navElement).toBeInTheDocument();
  });

  it('renders the main container', async () => {
    render(<App useRouter={false} />, { route: '/en' });

    // Use findByRole for async elements and don't require the name match
    const mainContainer = await screen.findByRole('main');
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass('container');
  });
});
