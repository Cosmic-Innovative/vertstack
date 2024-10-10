import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import About from './About';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n.mock';

const renderWithI18n = (component: React.ReactElement) => {
  return render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>);
};

describe('About', () => {
  it('renders without crashing', () => {
    renderWithI18n(<About />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('has proper heading structure', () => {
    renderWithI18n(<About />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('contains informative content', () => {
    renderWithI18n(<About />);
    expect(
      screen.getByText('This is the about page of our VERT stack application.'),
    ).toBeInTheDocument();
  });
});
