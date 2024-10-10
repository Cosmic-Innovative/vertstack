import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from './Home';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n.mock';

const renderWithI18n = (component: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <Router>{component}</Router>
    </I18nextProvider>,
  );
};

describe('Home', () => {
  it('renders without crashing', () => {
    renderWithI18n(<Home />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('has accessible images', () => {
    renderWithI18n(<Home />);
    const images = screen.getAllByRole('img');
    images.forEach((img) => {
      expect(img).toHaveAttribute('alt');
    });
  });

  it('has accessible links', () => {
    renderWithI18n(<Home />);
    const link = screen.getByText('View API Example');
    expect(link).toHaveAttribute('href', '/api-example');
    expect(link).toHaveClass('button-link');
  });

  it('has proper heading structure', () => {
    renderWithI18n(<Home />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });
});
