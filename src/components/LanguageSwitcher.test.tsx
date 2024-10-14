import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n.mock';
import LanguageSwitcher from './LanguageSwitcher';

const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
    </MemoryRouter>,
  );
};

describe('LanguageSwitcher', () => {
  it('renders language buttons', () => {
    renderWithRouter(<LanguageSwitcher />);
    expect(screen.getByLabelText('Switch to English')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch to Spanish')).toBeInTheDocument();
  });

  it('disables current language button', () => {
    renderWithRouter(<LanguageSwitcher />);
    expect(screen.getByLabelText('Switch to English')).toBeDisabled();
    expect(screen.getByLabelText('Switch to Spanish')).not.toBeDisabled();
  });

  it('changes language when button is clicked', () => {
    renderWithRouter(<LanguageSwitcher />);
    fireEvent.click(screen.getByLabelText('Switch to Spanish'));
    expect(i18n.language).toBe('es');
  });
});
