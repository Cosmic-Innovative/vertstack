import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Contact from './Contact';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n.mock';

const renderWithI18n = (component: React.ReactElement) => {
  return render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>);
};

describe('Contact', () => {
  it('renders without crashing', () => {
    renderWithI18n(<Contact />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('has proper heading structure', () => {
    renderWithI18n(<Contact />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('contains informative content', () => {
    renderWithI18n(<Contact />);
    expect(
      screen.getByText(
        'This is the contact page of our VERT stack application.',
      ),
    ).toBeInTheDocument();
  });
});
