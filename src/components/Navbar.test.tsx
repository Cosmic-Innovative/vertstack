import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n.mock';
import Navbar from './Navbar';

const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
    </MemoryRouter>,
  );
};

describe('Navbar', () => {
  it('renders navigation links', () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/about/i)).toBeInTheDocument();
    expect(screen.getByText(/contact/i)).toBeInTheDocument();
    expect(screen.getByText(/api example/i)).toBeInTheDocument();
  });

  it('toggles mobile menu when hamburger button is clicked', () => {
    renderWithRouter(<Navbar />);
    const button = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(button);
    expect(screen.getByTestId('navbar-menu')).toHaveClass('is-active');
  });

  it('applies correct alignment class', () => {
    renderWithRouter(<Navbar alignment="center" />);
    expect(screen.getByTestId('navbar-menu')).toHaveClass('align-center');
  });

  it('defaults to left alignment', () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByTestId('navbar-menu')).toHaveClass('align-left');
  });
});
